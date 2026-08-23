import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slug.js';

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

export async function createPlatformCafe({ ownerName, email, password, cafeName, slug }) {
  const normalizedEmail = email.toLowerCase();
  const cafeSlug = slugify(slug || cafeName);

  if (!cafeSlug) {
    throw new ApiError(400, 'A valid cafe slug is required');
  }

  const [existingEmail, existingSlug] = await Promise.all([
    prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
    prisma.cafe.findUnique({ where: { slug: cafeSlug }, select: { id: true } }),
  ]);

  if (existingEmail) {
    throw new ApiError(409, 'Email already in use');
  }

  if (existingSlug) {
    throw new ApiError(409, 'Cafe slug already in use');
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
      },
    });

    return createdCafe;
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
      ...ownerSelect,
    },
  });

  const cafeIds = cafes.map((cafe) => cafe.id);

  if (cafeIds.length === 0) {
    return [];
  }

  const [productGroups, categoryGroups] = await Promise.all([
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
  ]);

  const productCountByCafe = new Map(productGroups.map((item) => [item.cafeId, item._count._all]));
  const categoryCountByCafe = new Map(categoryGroups.map((item) => [item.cafeId, item._count._all]));

  return cafes.map((cafe) =>
    toPlatformCafe(cafe, {
      productCount: productCountByCafe.get(cafe.id) || 0,
      categoryCount: categoryCountByCafe.get(cafe.id) || 0,
    }),
  );
}

export async function updatePlatformCafe(cafeId, payload) {
  const cafe = await prisma.cafe.findUnique({
    where: { id: cafeId },
    select: { id: true },
  });

  if (!cafe) {
    throw new ApiError(404, 'Cafe not found');
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
      ...ownerSelect,
    },
  });

  const [productCount, categoryCount] = await Promise.all([
    prisma.product.count({ where: { cafeId } }),
    prisma.category.count({ where: { cafeId } }),
  ]);

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
    throw new ApiError(404, 'Cafe not found');
  }

  const [productCount, categoryCount] = await Promise.all([
    prisma.product.count({ where: { cafeId } }),
    prisma.category.count({ where: { cafeId } }),
  ]);

  return {
    ...toPlatformCafe(cafe, { productCount, categoryCount }),
    description: cafe.description || '',
    logo: cafe.logo || '',
    address: cafe.address || '',
    phone: cafe.phone || '',
    latitude: cafe.latitude,
    longitude: cafe.longitude,
    updatedAt: cafe.updatedAt,
  };
}

export async function resetPlatformCafePassword(cafeId, password) {
  const owner = await prisma.user.findFirst({
    where: { cafeId, role: 'admin' },
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true },
  });

  if (!owner) {
    throw new ApiError(404, 'Aucun gérant pour ce café');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: owner.id },
    data: { passwordHash },
  });

  return { email: owner.email };
}
