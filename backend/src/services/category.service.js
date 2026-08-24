import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { recordActivity } from './activity.service.js';
import {
  MAX_CATEGORY_DEPTH,
  collectDescendantIds,
  nodeDepth,
  subtreeHeight,
  subtreeProductCounts,
} from '../utils/categoryTree.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function normalizeParentId(parentId) {
  if (parentId === undefined) {
    return undefined;
  }

  if (parentId === null || parentId === '') {
    return null;
  }

  return parentId;
}

function toCategoryResponse(category, extras = {}) {
  return {
    _id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId || null,
    name: category.name,
    description: category.description,
    image: category.image || '',
    order: category.order,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    productCount: extras.productCount ?? category._count?.products ?? 0,
    childCount: extras.childCount ?? category._count?.children ?? 0,
  };
}

async function loadCafeCategories(cafeId) {
  return prisma.category.findMany({
    where: { cafeId },
    select: {
      id: true,
      parentId: true,
      _count: { select: { products: true, children: true } },
    },
  });
}

async function findOwnedCategory(cafeId, categoryId) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, cafeId },
    include: {
      _count: { select: { products: true, children: true } },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
}

async function assertParentRules(cafeId, categoryId, parentId) {
  if (!parentId) {
    return;
  }

  if (categoryId && parentId === categoryId) {
    throw new ApiError(400, 'Une catégorie ne peut pas être son propre parent');
  }

  const categories = await loadCafeCategories(cafeId);
  const parent = categories.find((item) => item.id === parentId);

  if (!parent) {
    throw new ApiError(400, 'Catégorie parente introuvable');
  }

  if (parent._count.products > 0) {
    throw new ApiError(400, 'Déplace d’abord les produits avant d’ajouter une sous-catégorie');
  }

  if (categoryId) {
    const descendantIds = collectDescendantIds(categories, categoryId);

    if (descendantIds.includes(parentId)) {
      throw new ApiError(400, 'Impossible de déplacer une catégorie sous l’une de ses sous-catégories');
    }
  }

  const parentDepth = nodeDepth(categories, parentId);
  const movingHeight = categoryId ? subtreeHeight(categories, categoryId) : 1;
  const resultingDepth = parentDepth + movingHeight;

  if (resultingDepth > MAX_CATEGORY_DEPTH) {
    throw new ApiError(400, `Maximum ${MAX_CATEGORY_DEPTH} niveaux de catégories`);
  }
}

export async function assertLeafCategory(cafeId, categoryId) {
  const category = await findOwnedCategory(cafeId, categoryId);

  if (category._count.children > 0) {
    throw new ApiError(400, 'Les produits se placent uniquement dans une catégorie sans sous-catégorie');
  }

  return category;
}

export async function createCategory(user, payload) {
  const cafeId = requireCafeId(user);
  const parentId = normalizeParentId(payload.parentId) ?? null;

  if (parentId) {
    await assertParentRules(cafeId, null, parentId);
  }

  const category = await prisma.category.create({
    data: {
      cafeId,
      parentId,
      name: payload.name,
      description: payload.description ?? '',
      image: payload.image ?? '',
      order: payload.order ?? 0,
    },
    include: {
      _count: { select: { products: true, children: true } },
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
        select: { products: true, children: true },
      },
    },
  });

  const directCounts = new Map(categories.map((item) => [item.id, item._count.products]));
  const productCounts = subtreeProductCounts(categories, directCounts);

  return categories.map((category) =>
    toCategoryResponse(category, {
      productCount: productCounts.get(category.id) || 0,
      childCount: category._count.children,
    }),
  );
}

export async function getCategoryById(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  return toCategoryResponse(category);
}

export async function updateCategory(user, categoryId, payload) {
  const cafeId = requireCafeId(user);
  await findOwnedCategory(cafeId, categoryId);

  const data = {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.image !== undefined && { image: payload.image }),
    ...(payload.order !== undefined && { order: payload.order }),
  };

  if (payload.parentId !== undefined) {
    const parentId = normalizeParentId(payload.parentId);
    await assertParentRules(cafeId, categoryId, parentId);
    data.parentId = parentId;
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data,
    include: {
      _count: { select: { products: true, children: true } },
    },
  });

  return toCategoryResponse(category);
}

export async function deleteCategory(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  if (category._count.children > 0) {
    throw new ApiError(409, 'Supprime d’abord les sous-catégories');
  }

  await prisma.category.delete({ where: { id: categoryId } });

  await recordActivity({
    action: 'category_deleted',
    actorId: user.id,
    cafeId,
    metadata: { categoryName: category.name },
  });
}
