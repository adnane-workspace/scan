import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toRecentProduct(product) {
  return {
    _id: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image,
    available: product.available,
    categoryName: product.category?.name ?? null,
    createdAt: product.createdAt,
  };
}

export async function getDashboardStats(user) {
  const cafeId = requireCafeId(user);

  const [totalProducts, totalCategories, availableProducts, recentProducts, categoryDocs, productCounts, cafe] =
    await Promise.all([
      prisma.product.count({ where: { cafeId } }),
      prisma.category.count({ where: { cafeId } }),
      prisma.product.count({ where: { cafeId, available: true } }),
      prisma.product.findMany({
        where: { cafeId },
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.category.findMany({
        where: { cafeId },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        select: { id: true, name: true },
      }),
      prisma.product.groupBy({
        by: ['categoryId'],
        where: { cafeId },
        _count: { _all: true },
      }),
      prisma.cafe.findUnique({
        where: { id: cafeId },
        select: { name: true, slug: true },
      }),
    ]);

  const countByCategory = new Map(productCounts.map((item) => [item.categoryId, item._count._all]));

  return {
    totalProducts,
    totalCategories,
    availableProducts,
    unavailableProducts: totalProducts - availableProducts,
    recentProducts: recentProducts.map(toRecentProduct),
    categories: categoryDocs.map((category) => ({
      _id: category.id,
      name: category.name,
      productCount: countByCategory.get(category.id) || 0,
    })),
    cafe: cafe
      ? {
          name: cafe.name,
          slug: cafe.slug,
        }
      : null,
  };
}
