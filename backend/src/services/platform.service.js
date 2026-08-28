import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { assertUsableSlug, slugify } from '../utils/slug.js';
import { recordActivity } from './activity.service.js';
import { findPendingQrRequest, toQrStatus } from './qr.service.js';
import { deleteCloudinaryImage } from './storage.service.js';

function ownerFromUsers(users = []) {
  const owner = users[0];

  return {
    ownerName: owner?.name ?? null,
    ownerEmail: owner?.email ?? null,
  };
}

function toPlatformCafe(cafe, counts) {
  return {
    _id: cafe.id,
    name: cafe.name,
    slug: cafe.slug,
    isActive: cafe.isActive,
    productCount: counts.productCount,
    categoryCount: counts.categoryCount,
    createdAt: cafe.createdAt,
    qrGeneratedAt: cafe.qrGeneratedAt || null,
    qrChangeAllowed: Boolean(cafe.qrChangeAllowed),
    pendingQrChange: Boolean(counts.pendingQrChange),
    ...ownerFromUsers(cafe.users),
  };
}

const ownerSelect = {
  users: {
    where: { role: 'admin' },
    select: { name: true, email: true },
    orderBy: { createdAt: 'asc' },
    take: 1,
  },
};

export async function createPlatformCafe({ ownerName, email, password, cafeName, slug }, actor) {
  const normalizedEmail = email.toLowerCase();
  const cafeSlug = slugify(slug || cafeName);
  assertUsableSlug(cafeSlug);

  const [existingEmail, existingSlug] = await Promise.all([
    prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
    prisma.cafe.findUnique({ where: { slug: cafeSlug }, select: { id: true } }),
  ]);

  if (existingEmail) {
    throw new ApiError(409, 'Email already in use', null, 'EMAIL_IN_USE');
  }

  if (existingSlug) {
    throw new ApiError(409, 'Cafe slug already in use', null, 'SLUG_IN_USE');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const cafe = await prisma.$transaction(async (tx) => {
    const createdCafe = await tx.cafe.create({
      data: {
        name: cafeName.trim(),
        slug: cafeSlug,
      },
    });

    await tx.user.create({
      data: {
        name: ownerName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
        cafeId: createdCafe.id,
        emailVerifiedAt: new Date(),
      },
    });

    return createdCafe;
  });

  await recordActivity({
    action: 'cafe_created',
    actorId: actor?.id,
    cafeId: cafe.id,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
      ownerName: ownerName.trim(),
      ownerEmail: normalizedEmail,
    },
  });

  return getPlatformCafe(cafe.id);
}

export async function listPlatformCafes() {
  const cafes = await prisma.cafe.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      createdAt: true,
      qrGeneratedAt: true,
      qrChangeAllowed: true,
      ...ownerSelect,
    },
  });

  const cafeIds = cafes.map((cafe) => cafe.id);

  if (cafeIds.length === 0) {
    return [];
  }

  const [productGroups, categoryGroups, pendingQrRequests] = await Promise.all([
    prisma.product.groupBy({
      by: ['cafeId'],
      where: { cafeId: { in: cafeIds } },
      _count: { _all: true },
    }),
    prisma.category.groupBy({
      by: ['cafeId'],
      where: { cafeId: { in: cafeIds } },
      _count: { _all: true },
    }),
    prisma.qrChangeRequest.findMany({
      where: { cafeId: { in: cafeIds }, status: 'pending' },
      select: { cafeId: true },
    }),
  ]);

  const productCountByCafe = new Map(productGroups.map((item) => [item.cafeId, item._count._all]));
  const categoryCountByCafe = new Map(categoryGroups.map((item) => [item.cafeId, item._count._all]));
  const pendingQrByCafe = new Set(pendingQrRequests.map((item) => item.cafeId));

  return cafes.map((cafe) =>
    toPlatformCafe(cafe, {
      productCount: productCountByCafe.get(cafe.id) || 0,
      categoryCount: categoryCountByCafe.get(cafe.id) || 0,
      pendingQrChange: pendingQrByCafe.has(cafe.id),
    }),
  );
}

export async function updatePlatformCafe(cafeId, payload, actor) {
  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: { id: true, name: true, slug: true },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found', null, 'CAFE_NOT_FOUND');
  }

  const updated = await prisma.cafe.update({
    where: { id: cafeId },
    data: { isActive: payload.isActive },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      createdAt: true,
      qrGeneratedAt: true,
      qrChangeAllowed: true,
      ...ownerSelect,
    },
  });

  const [productCount, categoryCount] = await Promise.all([
    prisma.product.count({ where: { cafeId } }),
    prisma.category.count({ where: { cafeId } }),
  ]);

  await recordActivity({
    action: payload.isActive ? 'cafe_activated' : 'cafe_deactivated',
    actorId: actor?.id,
    cafeId,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
    },
  });

  return toPlatformCafe(updated, { productCount, categoryCount });
}

export async function getPlatformCafe(cafeId) {
  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    include: {
      ...ownerSelect,
    },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found', null, 'CAFE_NOT_FOUND');
  }

  const [productCount, categoryCount, pendingQr] = await Promise.all([
    prisma.product.count({ where: { cafeId } }),
    prisma.category.count({ where: { cafeId } }),
    findPendingQrRequest(cafeId),
  ]);

  return {
    ...toPlatformCafe(cafe, { productCount, categoryCount, pendingQrChange: Boolean(pendingQr) }),
    description: cafe.description || '',
    logo: cafe.logo || '',
    cover: cafe.cover || '',
    address: cafe.address || '',
    phone: cafe.phone || '',
    latitude: cafe.latitude,
    longitude: cafe.longitude,
    updatedAt: cafe.updatedAt,
    qr: toQrStatus(cafe, pendingQr),
  };
}

export async function resetPlatformCafePassword(cafeId, password, actor) {
  const owner = await prisma.user.findFirst({
    where: { cafeId, role: 'admin' },
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true },
  });

  if (!owner) {
    throw new ApiError(404, 'No manager for this cafe', null, 'CAFE_OWNER_MISSING');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: owner.id },
    data: { passwordHash },
  });

  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: { name: true, slug: true },
  });

  await recordActivity({
    action: 'cafe_password_reset',
    actorId: actor?.id,
    cafeId,
    metadata: {
      cafeName: cafe?.name,
      slug: cafe?.slug,
      ownerEmail: owner.email,
    },
  });

  return { email: owner.email };
}

export async function deletePlatformCafe(cafeId, actor) {
  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      cover: true,
    },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found', null, 'CAFE_NOT_FOUND');
  }

  const [categories, products, owners] = await Promise.all([
    prisma.category.findMany({ where: { cafeId }, select: { image: true } }),
    prisma.product.findMany({ where: { cafeId }, select: { image: true } }),
    prisma.user.findMany({
      where: { cafeId, role: 'admin' },
      select: { email: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const imageUrls = [
    ...new Set([cafe.logo, cafe.cover, ...categories.map((item) => item.image), ...products.map((item) => item.image)].filter(Boolean)),
  ];

  await prisma.$transaction(async (tx) => {
    await tx.product.deleteMany({ where: { cafeId } });
    await tx.category.updateMany({ where: { cafeId }, data: { parentId: null } });
    await tx.category.deleteMany({ where: { cafeId } });
    await tx.qrChangeRequest.deleteMany({ where: { cafeId } });
    await tx.user.deleteMany({ where: { cafeId, role: 'admin' } });
    await tx.cafe.delete({ where: { id: cafeId } });
  });

  await recordActivity({
    action: 'cafe_deleted',
    actorId: actor?.id,
    metadata: {
      cafeName: cafe.name,
      slug: cafe.slug,
      ownerEmail: owners[0]?.email || null,
    },
  });

  await Promise.all(imageUrls.map((url) => deleteCloudinaryImage(url)));

  return { _id: cafe.id, name: cafe.name, slug: cafe.slug };
}
