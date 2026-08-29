import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { groupByParent } from '../utils/categoryTree.js';
import { normalizeMenuUi } from '../utils/menuUi.js';

function toPublicProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    image: product.image || '',
  };
}

function buildPublicTree(categories, productsByCategory) {
  const byParent = groupByParent(categories);

  function buildNode(category) {
    const children = (byParent.get(category.id) || []).map(buildNode).filter(Boolean);
    const products = (productsByCategory.get(category.id) || []).map(toPublicProduct);

    if (children.length === 0 && products.length === 0) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
      image: category.image || '',
      parentId: category.parentId || null,
      children,
      products,
    };
  }

  return (byParent.get('') || []).map(buildNode).filter(Boolean);
}

export async function getPublicMenu(slug) {
  const cafe = await prisma.cafe.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      logo: true,
      cover: true,
      address: true,
      phone: true,
      latitude: true,
      longitude: true,
      menuUi: true,
      isActive: true,
    },
  });

  if (!cafe) {
    throw new ApiError(404, 'Menu not found', null, 'MENU_NOT_FOUND');
  }

  if (!cafe.isActive) {
    throw new ApiError(403, 'Menu unavailable', null, 'MENU_UNAVAILABLE');
  }

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { cafeId: cafe.id },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, image: true, order: true, parentId: true },
    }),
    prisma.product.findMany({
      where: { cafeId: cafe.id, available: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        categoryId: true,
        order: true,
      },
    }),
  ]);

  const productsByCategory = new Map();

  for (const product of products) {
    const key = product.categoryId;

    if (!productsByCategory.has(key)) {
      productsByCategory.set(key, []);
    }

    productsByCategory.get(key).push(product);
  }

  return {
    cafe: {
      name: cafe.name,
      description: cafe.description || '',
      logo: cafe.logo || '',
      cover: cafe.cover || categories.find((category) => category.image)?.image || '',
      address: cafe.address || '',
      phone: cafe.phone || '',
      latitude: cafe.latitude,
      longitude: cafe.longitude,
      menuUi: normalizeMenuUi(cafe.menuUi),
    },
    categories: buildPublicTree(categories, productsByCategory),
  };
}
