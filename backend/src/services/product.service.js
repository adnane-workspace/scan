import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { recordActivity } from './activity.service.js';
import { invalidatePublicMenu } from './menuCache.service.js';
import { deleteCloudinaryImage, deleteReplacedImage, normalizeImageUrl } from './storage.service.js';
import { assertLeafCategory } from './category.service.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account', null, 'NO_CAFE');
  }

  return user.cafeId;
}

function toProductResponse(product) {
  const category = product.category;

  return {
    _id: product.id,
    cafeId: product.cafeId,
    categoryId: product.categoryId,
    categoryName: category?.name ?? null,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image,
    available: product.available,
    order: product.order,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

async function assertOwnedCategory(cafeId, categoryId) {
  return assertLeafCategory(cafeId, categoryId);
}

async function findOwnedProduct(cafeId, productId) {
  const product = await prisma.product.findFirst({
    where: { id: productId, cafeId },
    include: { category: { select: { name: true } } },
  });

  if (!product) {
    throw new ApiError(404, 'Product not found', null, 'PRODUCT_NOT_FOUND');
  }

  return product;
}

export async function createProduct(user, payload) {
  const cafeId = requireCafeId(user);
  await assertOwnedCategory(cafeId, payload.categoryId);

  const product = await prisma.product.create({
    data: {
      cafeId,
      categoryId: payload.categoryId,
      name: payload.name,
      description: payload.description ?? '',
      price: payload.price,
      image: normalizeImageUrl(payload.image),
      available: payload.available ?? true,
      order: payload.order ?? 0,
    },
    include: { category: { select: { name: true } } },
  });

  invalidatePublicMenu(cafeId);
  return toProductResponse(product);
}

export async function listProducts(user) {
  const cafeId = requireCafeId(user);

  const products = await prisma.product.findMany({
    where: { cafeId },
    include: { category: { select: { name: true } } },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  return products.map(toProductResponse);
}

export async function getProductById(user, productId) {
  const cafeId = requireCafeId(user);
  const product = await findOwnedProduct(cafeId, productId);

  return toProductResponse(product);
}

export async function updateProduct(user, productId, payload) {
  const cafeId = requireCafeId(user);
  const current = await findOwnedProduct(cafeId, productId);

  if (payload.categoryId !== undefined) {
    await assertOwnedCategory(cafeId, payload.categoryId);
  }

  const data = {
    ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.price !== undefined && { price: payload.price }),
    ...(payload.available !== undefined && { available: payload.available }),
    ...(payload.order !== undefined && { order: payload.order }),
  };

  if (payload.image !== undefined) {
    data.image = normalizeImageUrl(payload.image);
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data,
    include: { category: { select: { name: true } } },
  });

  if (payload.image !== undefined) {
    await deleteReplacedImage(current.image, product.image);
  }

  invalidatePublicMenu(cafeId);
  return toProductResponse(product);
}

export async function deleteProduct(user, productId) {
  const cafeId = requireCafeId(user);
  const product = await findOwnedProduct(cafeId, productId);

  await prisma.product.delete({ where: { id: productId } });
  await deleteCloudinaryImage(product.image);
  invalidatePublicMenu(cafeId);

  await recordActivity({
    action: 'product_deleted',
    actorId: user.id,
    cafeId,
    metadata: {
      productName: product.name,
      categoryName: product.category?.name,
    },
  });
}
