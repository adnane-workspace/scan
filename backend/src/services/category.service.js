import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import {
  DEFAULT_SECTION_DEFS,
  isMenuSectionKey,
  MAX_MENU_SECTIONS,
  SECTIONS_MAX_DEPTH,
  slugifySectionKey,
} from '../utils/menuSections.js';
import { normalizeMenuUi } from '../utils/menuUi.js';
import { recordActivity } from './activity.service.js';
import { invalidatePublicMenu } from './menuCache.service.js';
import { deleteCloudinaryImage, deleteReplacedImage, normalizeImageUrl } from './storage.service.js';
import {
  collectDescendantIds,
  nodeDepth,
  subtreeHeight,
  subtreeProductCounts,
  walkPreOrder,
} from '../utils/categoryTree.js';
import { buildPaginationMeta, paginatedResult, parsePaginationQuery } from '../utils/pagination.js';

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

function normalizeSectionKey(sectionKey) {
  if (sectionKey === undefined) {
    return undefined;
  }

  if (sectionKey === null || sectionKey === '') {
    return null;
  }

  const key = slugifySectionKey(sectionKey);
  return key || null;
}

function toCategoryResponse(category, extras = {}) {
  return {
    _id: category.id,
    cafeId: category.cafeId,
    parentId: category.parentId || null,
    sectionKey: category.sectionKey || null,
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
      sectionKey: true,
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

/**
 * Ensure Restaurant + Café section roots exist; attach any flat root categories under restaurant.
 */
export async function ensureDefaultSections(cafeId, client = prisma) {
  const existing = await client.category.findMany({
    where: { cafeId },
    select: { id: true, parentId: true, sectionKey: true, order: true },
  });

  const byKey = new Map(
    existing.filter((item) => item.sectionKey).map((item) => [item.sectionKey, item]),
  );
  const rootIds = {};

  for (const [index, def] of DEFAULT_SECTION_DEFS.entries()) {
    if (byKey.has(def.key)) {
      rootIds[def.key] = byKey.get(def.key).id;
      continue;
    }

    const created = await client.category.create({
      data: {
        cafeId,
        name: def.name,
        sectionKey: def.key,
        order: index + 1,
      },
      select: { id: true },
    });

    rootIds[def.key] = created.id;
  }

  const flatRoots = existing.filter((item) => !item.parentId && !item.sectionKey);

  if (flatRoots.length > 0 && rootIds.restaurant) {
    await client.category.updateMany({
      where: { id: { in: flatRoots.map((item) => item.id) } },
      data: { parentId: rootIds.restaurant },
    });
  }

  const cafe = await client.cafe.findUnique({
    where: { id: cafeId },
    select: { menuUi: true },
  });
  const menuUi = normalizeMenuUi(cafe?.menuUi);
  const raw = cafe?.menuUi && typeof cafe.menuUi === 'object' ? cafe.menuUi : {};

  if (raw.sectionsEnabled !== true) {
    await client.cafe.update({
      where: { id: cafeId },
      data: { menuUi: { ...raw, ...menuUi, sectionsEnabled: true } },
    });
  }

  return rootIds;
}

async function assertSectionRules(cafeId, { categoryId, parentId, sectionKey }) {
  const categories = await loadCafeCategories(cafeId);
  const sectionRoots = categories.filter((item) => item.sectionKey);

  if (sectionKey) {
    if (!isMenuSectionKey(sectionKey)) {
      throw new ApiError(400, 'Invalid menu section key', null, 'SECTION_KEY_INVALID');
    }

    if (parentId) {
      throw new ApiError(400, 'Section categories cannot have a parent', null, 'SECTION_PARENT_FORBIDDEN');
    }

    const duplicate = sectionRoots.find(
      (item) => item.sectionKey === sectionKey && item.id !== categoryId,
    );

    if (duplicate) {
      throw new ApiError(409, 'This menu section already exists', null, 'SECTION_KEY_DUPLICATE');
    }

    if (!categoryId && sectionRoots.length >= MAX_MENU_SECTIONS) {
      throw new ApiError(
        400,
        `Maximum ${MAX_MENU_SECTIONS} menu sections allowed`,
        { max: MAX_MENU_SECTIONS },
        'SECTION_MAX_ROOTS',
      );
    }

    return;
  }

  if (!parentId) {
    throw new ApiError(400, 'Choose a menu section as the parent', null, 'SECTION_PARENT_REQUIRED');
  }

  const parent = categories.find((item) => item.id === parentId);

  if (!parent?.sectionKey) {
    throw new ApiError(400, 'Categories must belong to a menu section', null, 'SECTION_PARENT_REQUIRED');
  }
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

  if (!parent.sectionKey) {
    throw new ApiError(400, 'Categories must belong to a menu section', null, 'SECTION_PARENT_REQUIRED');
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

  if (resultingDepth > SECTIONS_MAX_DEPTH) {
    throw new ApiError(
      400,
      `Maximum ${SECTIONS_MAX_DEPTH} category levels`,
      { max: SECTIONS_MAX_DEPTH },
      'CATEGORY_MAX_DEPTH',
    );
  }
}

export async function assertLeafCategory(cafeId, categoryId) {
  const category = await findOwnedCategory(cafeId, categoryId);

  if (category.sectionKey) {
    throw new ApiError(400, 'Products cannot be placed in a menu section', null, 'PRODUCTS_LEAF_ONLY');
  }

  if (category._count.children > 0) {
    throw new ApiError(400, 'Products can only be placed in a category without subcategories', null, 'PRODUCTS_LEAF_ONLY');
  }

  return category;
}

export async function createCategory(user, payload) {
  const cafeId = requireCafeId(user);
  await ensureDefaultSections(cafeId);

  const parentId = normalizeParentId(payload.parentId) ?? null;
  const sectionKey = normalizeSectionKey(payload.sectionKey) ?? null;

  await assertSectionRules(cafeId, {
    categoryId: null,
    parentId,
    sectionKey,
  });

  if (parentId) {
    await assertParentRules(cafeId, null, parentId);
  }

  const category = await prisma.category.create({
    data: {
      cafeId,
      parentId,
      sectionKey,
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

export async function listCategoryOptions(user) {
  return loadMappedCategories(user);
}

export async function listCategories(user, query = {}) {
  const pagination = parsePaginationQuery(query, { defaultLimit: 30, maxLimit: 100 });
  const categories = await loadMappedCategories(user);
  const rows = walkPreOrder(categories);
  const items = rows.slice(pagination.skip, pagination.skip + pagination.limit);

  return paginatedResult(
    items,
    buildPaginationMeta({ page: pagination.page, limit: pagination.limit, total: rows.length }),
  );
}

async function loadMappedCategories(user) {
  const cafeId = requireCafeId(user);
  await ensureDefaultSections(cafeId);

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
  await ensureDefaultSections(cafeId);
  const current = await findOwnedCategory(cafeId, categoryId);

  const data = {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.order !== undefined && { order: payload.order }),
  };

  if (payload.image !== undefined) {
    data.image = normalizeImageUrl(payload.image);
  }

  if (payload.sectionKey !== undefined) {
    const sectionKey = normalizeSectionKey(payload.sectionKey);

    await assertSectionRules(cafeId, {
      categoryId,
      parentId: current.parentId,
      sectionKey,
    });

    data.sectionKey = sectionKey;
  }

  if (payload.parentId !== undefined) {
    const parentId = normalizeParentId(payload.parentId);

    await assertSectionRules(cafeId, {
      categoryId,
      parentId,
      sectionKey: current.sectionKey,
    });
    await assertParentRules(cafeId, categoryId, parentId);
    data.parentId = parentId;

    if (parentId) {
      data.sectionKey = null;
    }
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

  if (category.sectionKey) {
    const sectionCount = await prisma.category.count({
      where: { cafeId, sectionKey: { not: null } },
    });

    if (sectionCount <= 1) {
      throw new ApiError(400, 'At least one menu section is required', null, 'SECTION_MIN_ROOTS');
    }
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
