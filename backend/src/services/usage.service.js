import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { cloudinary } from './storage.service.js';

const CACHE_TTL_MS = 60_000;
let cachedReport = null;
let cachedAt = 0;

function extractPublicId(url, folder) {
  const value = String(url || '').trim();

  if (!value) {
    return null;
  }

  const marker = `/${folder}/`;
  const index = value.indexOf(marker);

  if (index >= 0) {
    return value
      .slice(index + 1)
      .split('?')[0]
      .replace(/\.[a-z0-9]+$/i, '');
  }

  if (!value.includes('res.cloudinary.com')) {
    return null;
  }

  const afterUpload = value.split('/upload/')[1];

  if (!afterUpload) {
    return null;
  }

  const parts = afterUpload.split('?')[0].split('/');
  let start = 0;

  while (start < parts.length && !/^v\d+$/.test(parts[start]) && parts[start].includes(',')) {
    start += 1;
  }

  if (start < parts.length && /^v\d+$/.test(parts[start])) {
    start += 1;
  }

  return parts.slice(start).join('/').replace(/\.[a-z0-9]+$/i, '') || null;
}

function isCloudinaryUrl(url) {
  return String(url || '').includes('res.cloudinary.com');
}

async function fetchFolderResources(folder) {
  const resources = [];
  let nextCursor;

  for (let page = 0; page < 10; page += 1) {
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: folder,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    resources.push(...(result.resources || []));
    nextCursor = result.next_cursor;

    if (!nextCursor) {
      break;
    }
  }

  return resources;
}

function emptyCafeBucket(cafe) {
  return {
    _id: cafe.id,
    name: cafe.name,
    slug: cafe.slug,
    isActive: cafe.isActive !== false,
    logos: 0,
    productImages: 0,
    categoryImages: 0,
    photoCount: 0,
    bytes: 0,
    unmatchedCount: 0,
  };
}

function uniqueSlugs(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function productionApiBase() {
  const configured = env.PRODUCTION_API_URL.replace(/\/$/, '');

  if (configured) {
    return configured.endsWith('/api') ? configured : `${configured}/api`;
  }

  if (env.NODE_ENV === 'development') {
    return 'https://scan-backend-tau.vercel.app/api';
  }

  return '';
}

async function loadFromDatabase(client) {
  const [cafes, products, categories] = await Promise.all([
    client.cafe.findMany({
      select: { id: true, name: true, slug: true, isActive: true, logo: true },
      orderBy: { name: 'asc' },
    }),
    client.product.findMany({
      select: { cafeId: true, image: true },
    }),
    client.category.findMany({
      select: { cafeId: true, image: true },
    }),
  ]);

  return { cafes, products, categories };
}

async function loadFromProductionMenus(apiBase, slugs) {
  const cafes = [];
  const products = [];
  const categories = [];

  await Promise.all(
    slugs.map(async (slug) => {
      try {
        const response = await fetch(`${apiBase}/menu/${encodeURIComponent(slug)}`);
        const payload = await response.json();

        if (!response.ok || !payload?.success || !payload.data?.cafe) {
          return;
        }

        const menu = payload.data;
        const cafeId = slug;

        cafes.push({
          id: cafeId,
          name: menu.cafe.name,
          slug,
          isActive: true,
          logo: menu.cafe.logo || '',
        });

        for (const category of menu.categories || []) {
          if (category.image) {
            categories.push({ cafeId, image: category.image });
          }

          for (const product of category.products || []) {
            if (product.image) {
              products.push({ cafeId, image: product.image });
            }
          }
        }
      } catch {
        // Skip slugs that are not on production.
      }
    }),
  );

  return { cafes, products, categories };
}

function buildCafeReport({ cafes, products, categories, folder, bytesByPublicId }) {
  const referencedPublicIds = new Set();
  const byCafe = new Map(cafes.map((cafe) => [cafe.id, emptyCafeBucket(cafe)]));

  function addImage(cafeId, url, kind) {
    const bucket = byCafe.get(cafeId);

    if (!bucket || !url) {
      return;
    }

    bucket[kind] += 1;

    if (!isCloudinaryUrl(url)) {
      bucket.unmatchedCount += 1;
      return;
    }

    const publicId = extractPublicId(url, folder);

    if (publicId) {
      referencedPublicIds.add(publicId);
      const size = bytesByPublicId.get(publicId);

      if (size) {
        bucket.bytes += size;
      } else {
        bucket.unmatchedCount += 1;
      }
    } else {
      bucket.unmatchedCount += 1;
    }
  }

  cafes.forEach((cafe) => addImage(cafe.id, cafe.logo, 'logos'));
  products.forEach((product) => addImage(product.cafeId, product.image, 'productImages'));
  categories.forEach((category) => addImage(category.cafeId, category.image, 'categoryImages'));

  const cafesReport = [...byCafe.values()]
    .map((item) => ({
      ...item,
      photoCount: item.logos + item.productImages + item.categoryImages,
    }))
    .sort((a, b) => b.bytes - a.bytes || b.photoCount - a.photoCount);

  return { cafesReport, referencedPublicIds };
}

export async function getStorageReport({ force = false } = {}) {
  if (!force && cachedReport && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedReport;
  }

  const folder = env.CLOUDINARY_FOLDER;
  let resources = [];
  let cloudinaryError = '';

  try {
    resources = await fetchFolderResources(folder);
  } catch (error) {
    cloudinaryError = error?.message || 'Cloudinary usage unavailable';
  }

  const bytesByPublicId = new Map(
    resources.map((item) => [item.public_id, Number(item.bytes || 0)]),
  );

  let source = 'local';
  let extraPrisma = null;
  let rows = { cafes: [], products: [], categories: [] };

  try {
    if (env.NODE_ENV === 'production') {
      source = 'production';
      rows = await loadFromDatabase(prisma);
    } else if (env.PRODUCTION_DATABASE_URL) {
      source = 'production';
      extraPrisma = new PrismaClient({
        datasources: { db: { url: env.PRODUCTION_DATABASE_URL } },
      });
      rows = await loadFromDatabase(extraPrisma);
    } else {
      source = 'production';
      const apiBase = productionApiBase();
      const slugs = uniqueSlugs([
        ...String(env.PRODUCTION_CAFE_SLUGS || '').split(','),
        'cafe-central',
      ]);
      rows = await loadFromProductionMenus(apiBase, slugs);
    }
  } catch (error) {
    cloudinaryError = cloudinaryError || error?.message || 'Production data unavailable';
  } finally {
    if (extraPrisma) {
      await extraPrisma.$disconnect();
    }
  }

  const { cafesReport, referencedPublicIds } = buildCafeReport({
    ...rows,
    folder,
    bytesByPublicId,
  });

  const orphans = resources.filter((item) => !referencedPublicIds.has(item.public_id));
  const linkedBytes = cafesReport.reduce((sum, item) => sum + item.bytes, 0);
  const cloudinaryBytes = resources.reduce((sum, item) => sum + Number(item.bytes || 0), 0);

  const report = {
    folder,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    cloudinaryError,
    source,
    totals: {
      cafeCount: cafesReport.length,
      photos: resources.length,
      logos: cafesReport.reduce((sum, item) => sum + item.logos, 0),
      productImages: cafesReport.reduce((sum, item) => sum + item.productImages, 0),
      categoryImages: cafesReport.reduce((sum, item) => sum + item.categoryImages, 0),
      bytes: cloudinaryBytes,
      linkedPhotos: cafesReport.reduce((sum, item) => sum + item.photoCount, 0),
      linkedBytes,
      unmatchedCount: cafesReport.reduce((sum, item) => sum + item.unmatchedCount, 0),
      orphanCount: orphans.length,
      orphanBytes: orphans.reduce((sum, item) => sum + Number(item.bytes || 0), 0),
    },
    cafes: cafesReport,
  };

  cachedReport = report;
  cachedAt = Date.now();

  return report;
}
