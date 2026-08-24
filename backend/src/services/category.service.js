import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { recordActivity } from './activity.service.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toCategoryResponse(category) {
  return {
    _id: category.id,
    cafeId: category.cafeId,
    name: category.name,
    description: category.description,
    image: category.image || '',
    order: category.order,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    productCount: category._count?.products ?? 0,
  };
}

async function findOwnedCategory(cafeId, categoryId) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, cafeId },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
}

export async function createCategory(user, payload) {
  const cafeId = requireCafeId(user);

  const category = await prisma.category.create({
    data: {
      cafeId,
      name: payload.name,
      description: payload.description ?? '',
      image: payload.image ?? '',
      order: payload.order ?? 0,
    },
  });

  return toCategoryResponse(category);
}

export async function listCategories(user) {
  const cafeId = requireCafeId(user);

  const categories = await prisma.category.findMany({
    where: { cafeId },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return categories.map(toCategoryResponse);
}

export async function getCategoryById(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  return toCategoryResponse(category);
}

export async function updateCategory(user, categoryId, payload) {
  const cafeId = requireCafeId(user);
  await findOwnedCategory(cafeId, categoryId);

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.image !== undefined && { image: payload.image }),
      ...(payload.order !== undefined && { order: payload.order }),
    },
  });

  return toCategoryResponse(category);
}

export async function deleteCategory(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  await prisma.category.delete({ where: { id: categoryId } });

  await recordActivity({
    action: 'category_deleted',
    actorId: user.id,
    cafeId,
    metadata: { categoryName: category.name },
  });
}
