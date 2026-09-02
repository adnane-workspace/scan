import { getPrismaForUrl, prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { buildPaginationMeta, parsePaginationQuery } from '../utils/pagination.js';
import { cloudinary, extractPublicId, isCloudinaryUrl } from './storage.service.js';

const CACHE_TTL_MS = 60_000;
let cachedReport = null;
let cachedAt = 0;

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
    covers: 0,
    menuBackgrounds: 0,
    productImages: 0,
    categoryImages: 0,
    photoCount: 0,
    bytes: 0,
    unmatchedCount: 0,
  };
}

function cafeMenuBackground(menuUi) {
  if (!menuUi || typeof menuUi !== 'object') {
    return '';
  }

  const value = menuUi.backgroundImage;
  return typeof value === 'string' ? value.trim() : '';
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
      select: { id: true, name: true, slug: true, isActive: true, logo: true, cover: true, menuUi: true },
      orderBy: { name: 'asc' },
    }),
    client.product.findMany({
      select: { cafeId: true, image: true },
    }),
    client.category.findMany({
      select: { cafeId: true, image: true },
    }),
  ]);

  return {
    cafes: cafes.map((cafe) => ({
      ...cafe,
      menuBackground: cafeMenuBackground(cafe.menuUi),
    })),
    products,
    categories,
  };
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
        const categoryImages = [];
        const productImages = [];

        for (const category of menu.categories || []) {
          if (category.image) {
            categoryImages.push({ cafeId, image: category.image });
          }

          for (const product of category.products || []) {
            if (product.image) {
              productImages.push({ cafeId, image: product.image });
            }
          }
        }

        // Public menu may fall back cover → category image; only count a distinct cover.
        const rawCover = menu.cafe.cover || '';
        const coverIsCategoryFallback = Boolean(
          rawCover && categoryImages.some((item) => item.image === rawCover),
        );

        cafes.push({
          id: cafeId,
          name: menu.cafe.name,
          slug,
          isActive: true,
          logo: menu.cafe.logo || '',
          cover: coverIsCategoryFallback ? '' : rawCover,
          menuBackground: cafeMenuBackground(menu.cafe.menuUi),
        });

        categories.push(...categoryImages);
        products.push(...productImages);
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
        // Attribute bytes once per public id per café.
        if (!bucket._seenPublicIds) {
          bucket._seenPublicIds = new Set();
        }

        if (!bucket._seenPublicIds.has(publicId)) {
          bucket._seenPublicIds.add(publicId);
          bucket.bytes += size;
        }
      } else {
        bucket.unmatchedCount += 1;
      }
    } else {
      bucket.unmatchedCount += 1;
    }
  }

  cafes.forEach((cafe) => {
    addImage(cafe.id, cafe.logo, 'logos');
    addImage(cafe.id, cafe.cover, 'covers');
    addImage(cafe.id, cafe.menuBackground, 'menuBackgrounds');
  });
  products.forEach((product) => addImage(product.cafeId, product.image, 'productImages'));
  categories.forEach((category) => addImage(category.cafeId, category.image, 'categoryImages'));

  const cafesReport = [...byCafe.values()]
    .map((item) => {
      const { _seenPublicIds, ...rest } = item;
      return {
        ...rest,
        photoCount:
          item.logos + item.covers + item.menuBackgrounds + item.productImages + item.categoryImages,
      };
    })
    .sort((a, b) => b.bytes - a.bytes || b.photoCount - a.photoCount);

  return { cafesReport, referencedPublicIds };
}

export async function getStorageReport({ force = false, page, limit } = {}) {
  const pagination = parsePaginationQuery({ page, limit }, { defaultLimit: 20, maxLimit: 100 });

  if (!force && cachedReport && Date.now() - cachedAt < CACHE_TTL_MS && !page) {
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
  let rows = { cafes: [], products: [], categories: [] };

  try {
    if (env.NODE_ENV === 'production') {
      source = 'production';
      rows = await loadFromDatabase(prisma);
    } else if (env.PRODUCTION_DATABASE_URL) {
      source = 'production';
      rows = await loadFromDatabase(getPrismaForUrl(env.PRODUCTION_DATABASE_URL));
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
  }

  const { cafesReport, referencedPublicIds } = buildCafeReport({
    ...rows,
    folder,
    bytesByPublicId,
  });

  const orphans = resources.filter((item) => !referencedPublicIds.has(item.public_id));
  const linkedBytes = cafesReport.reduce((sum, item) => sum + item.bytes, 0);
  const cloudinaryBytes = resources.reduce((sum, item) => sum + Number(item.bytes || 0), 0);

  const pagedCafes = cafesReport.slice(pagination.skip, pagination.skip + pagination.limit);

  const report = {
    folder,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    cloudinaryError,
    source,
    totals: {
      cafeCount: cafesReport.length,
      photos: resources.length,
      logos: cafesReport.reduce((sum, item) => sum + item.logos, 0),
      covers: cafesReport.reduce((sum, item) => sum + item.covers, 0),
      menuBackgrounds: cafesReport.reduce((sum, item) => sum + item.menuBackgrounds, 0),
      productImages: cafesReport.reduce((sum, item) => sum + item.productImages, 0),
      categoryImages: cafesReport.reduce((sum, item) => sum + item.categoryImages, 0),
      bytes: cloudinaryBytes,
      linkedPhotos: cafesReport.reduce((sum, item) => sum + item.photoCount, 0),
      linkedBytes,
      unmatchedCount: cafesReport.reduce((sum, item) => sum + item.unmatchedCount, 0),
      orphanCount: orphans.length,
      orphanBytes: orphans.reduce((sum, item) => sum + Number(item.bytes || 0), 0),
    },
    cafes: pagedCafes,
    pagination: buildPaginationMeta({ page: pagination.page, limit: pagination.limit, total: cafesReport.length }),
  };

  if (!page) {
    cachedReport = report;
    cachedAt = Date.now();
  }

  return report;
}
