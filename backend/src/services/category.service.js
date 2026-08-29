import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { recordActivity } from './activity.service.js';
import { invalidatePublicMenu } from './menuCache.service.js';
import { deleteCloudinaryImage, deleteReplacedImage, normalizeImageUrl } from './storage.service.js';
import {
  MAX_CATEGORY_DEPTH,
  collectDescendantIds,
  nodeDepth,
  subtreeHeight,
  subtreeProductCounts,
} from '../utils/categoryTree.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account', null, 'NO_CAFE');
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
    throw new ApiError(404, 'Category not found', null, 'CATEGORY_NOT_FOUND');
  }

  return category;
}

async function assertParentRules(cafeId, categoryId, parentId) {
  if (!parentId) {
    return;
  }

  if (categoryId && parentId === categoryId) {
    throw new ApiError(400, 'A category cannot be its own parent', null, 'CATEGORY_SELF_PARENT');
  }

  const categories = await loadCafeCategories(cafeId);
  const parent = categories.find((item) => item.id === parentId);

  if (!parent) {
    throw new ApiError(400, 'Parent category not found', null, 'CATEGORY_PARENT_NOT_FOUND');
  }

  if (parent._count.products > 0) {
    throw new ApiError(400, 'Move products first before adding a subcategory', null, 'CATEGORY_HAS_PRODUCTS');
  }

  if (categoryId) {
    const descendantIds = collectDescendantIds(categories, categoryId);

    if (descendantIds.includes(parentId)) {
      throw new ApiError(400, 'Cannot move a category under one of its subcategories', null, 'CATEGORY_CYCLE');
    }
  }

  const parentDepth = nodeDepth(categories, parentId);
  const movingHeight = categoryId ? subtreeHeight(categories, categoryId) : 1;
  const resultingDepth = parentDepth + movingHeight;

  if (resultingDepth > MAX_CATEGORY_DEPTH) {
    throw new ApiError(400, `Maximum ${MAX_CATEGORY_DEPTH} category levels`, { max: MAX_CATEGORY_DEPTH }, 'CATEGORY_MAX_DEPTH');
  }
}

export async function assertLeafCategory(cafeId, categoryId) {
  const category = await findOwnedCategory(cafeId, categoryId);

  if (category._count.children > 0) {
    throw new ApiError(400, 'Products can only be placed in a category without subcategories', null, 'PRODUCTS_LEAF_ONLY');
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
      image: normalizeImageUrl(payload.image),
      order: payload.order ?? 0,
    },
    include: {
      _count: { select: { products: true, children: true } },
    },
  });

  invalidatePublicMenu(cafeId);
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
  const current = await findOwnedCategory(cafeId, categoryId);

  const data = {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.order !== undefined && { order: payload.order }),
  };

  if (payload.image !== undefined) {
    data.image = normalizeImageUrl(payload.image);
  }

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

  if (payload.image !== undefined) {
    await deleteReplacedImage(current.image, category.image);
  }

  invalidatePublicMenu(cafeId);
  return toCategoryResponse(category);
}

export async function deleteCategory(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  if (category._count.children > 0) {
    throw new ApiError(409, 'Delete subcategories first', null, 'CATEGORY_HAS_CHILDREN');
  }

  const products = await prisma.product.findMany({
    where: { categoryId, cafeId },
    select: { image: true },
  });

  const urls = [...new Set([category.image, ...products.map((item) => item.image)].filter(Boolean))];

  await prisma.category.delete({ where: { id: categoryId } });
  await Promise.all(urls.map((url) => deleteCloudinaryImage(url)));
  invalidatePublicMenu(cafeId);

  await recordActivity({
    action: 'category_deleted',
    actorId: user.id,
    cafeId,
    metadata: { categoryName: category.name },
  });
}
