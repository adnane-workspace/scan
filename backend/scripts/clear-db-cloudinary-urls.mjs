import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const confirm = process.argv.includes('--confirm');
const localOnly = process.argv.includes('--local-only');

function databaseHost(url) {
  const match = String(url || '').match(/@([^/?]+)/);
  return match?.[1] || 'unknown';
}

function isCloudinaryAppUrl(value, folder) {
  const url = String(value || '').trim();
  return url.includes('res.cloudinary.com') && url.includes(`/${folder}/`);
}

function isLocalDatabase(url) {
  return /localhost|127\.0\.0\.1/i.test(String(url || ''));
}

async function clearUrls() {
  const databaseUrl = process.env.DATABASE_URL;
  const folder = String(process.env.CLOUDINARY_FOLDER || 'digital-menu').trim();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  if (localOnly && !isLocalDatabase(databaseUrl)) {
    throw new Error(
      `Refused: DATABASE_URL points to ${databaseHost(databaseUrl)}. Unset $env:DATABASE_URL or use --local-only without a remote shell override.`,
    );
  }

  const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

  const [cafes, categories, products] = await Promise.all([
    prisma.cafe.findMany({
      select: { id: true, name: true, slug: true, logo: true, cover: true, menuUi: true },
    }),
    prisma.category.findMany({ select: { id: true, image: true } }),
    prisma.product.findMany({ select: { id: true, image: true } }),
  ]);

  const cafeUpdates = new Map();
  const categoryUpdates = [];
  const productUpdates = [];

  for (const cafe of cafes) {
    const data = {};
    const menuUi = cafe.menuUi && typeof cafe.menuUi === 'object' ? { ...cafe.menuUi } : null;

    if (isCloudinaryAppUrl(cafe.logo, folder)) {
      data.logo = '';
    }

    if (isCloudinaryAppUrl(cafe.cover, folder)) {
      data.cover = '';
    }

    if (menuUi && isCloudinaryAppUrl(menuUi.backgroundImage, folder)) {
      data.menuUi = { ...menuUi, backgroundImage: '' };
    }

    if (Object.keys(data).length) {
      cafeUpdates.set(cafe.id, { slug: cafe.slug, data });
    }
  }

  for (const category of categories) {
    if (isCloudinaryAppUrl(category.image, folder)) {
      categoryUpdates.push(category.id);
    }
  }

  for (const product of products) {
    if (isCloudinaryAppUrl(product.image, folder)) {
      productUpdates.push(product.id);
    }
  }

  console.log(`Database host: ${databaseHost(databaseUrl)}`);
  console.log(`Database: ${isLocalDatabase(databaseUrl) ? 'local' : 'remote'}`);
  console.log(`Cafes to update: ${cafeUpdates.size}`);
  console.log(`Categories to clear: ${categoryUpdates.length}`);
  console.log(`Products to clear: ${productUpdates.length}`);

  for (const item of cafeUpdates.values()) {
    console.log(`Cafe: ${item.slug}`);
  }

  if (!confirm) {
    console.log('\nDry run only. To apply, run:');
    console.log('  npm run db:clear-images -- --confirm');
    await prisma.$disconnect();
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const [cafeId, item] of cafeUpdates.entries()) {
      await tx.cafe.update({
        where: { id: cafeId },
        data: item.data,
      });
    }

    if (categoryUpdates.length) {
      await tx.category.updateMany({
        where: { id: { in: categoryUpdates } },
        data: { image: '' },
      });
    }

    if (productUpdates.length) {
      await tx.product.updateMany({
        where: { id: { in: productUpdates } },
        data: { image: '' },
      });
    }
  });

  console.log('\nCloudinary URLs cleared from database.');
  await prisma.$disconnect();
}

clearUrls().catch(async (error) => {
  console.error('Clear failed:', error.message || error);
  process.exit(1);
});
