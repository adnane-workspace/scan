import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

function toPublicProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: Number(product.price),
    image: product.image || '',
  };
}

export async function getPublicMenu(slug) {
  const cafe = await prisma.cafe.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      logo: true,
      address: true,
      phone: true,
      latitude: true,
      longitude: true,
      isActive: true,
    },
  });

  if (!cafe) {
    throw new ApiError(404, 'Menu introuvable');
  }

  if (!cafe.isActive) {
    throw new ApiError(403, 'Menu indisponible');
  }

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { cafeId: cafe.id },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, image: true, order: true },
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

    productsByCategory.get(key).push(toPublicProduct(product));
  }

  return {
    cafe: {
      name: cafe.name,
      description: cafe.description || '',
      logo: cafe.logo || '',
      address: cafe.address || '',
      phone: cafe.phone || '',
      latitude: cafe.latitude,
      longitude: cafe.longitude,
    },
    categories: categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        image: category.image || '',
        products: productsByCategory.get(category.id) || [],
      }))
      .filter((category) => category.products.length > 0),
  };
}
