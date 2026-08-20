import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { normalizeImageUrl } from './storage.service.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toProductResponse(product) {
  const category = product.categoryId;
  const categoryId = category?._id ?? category;

  return {
    _id: product._id,
    cafeId: product.cafeId,
    categoryId,
    categoryName: category?.name ?? null,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    available: product.available,
    order: product.order,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

async function assertOwnedCategory(cafeId, categoryId) {
  const category = await Category.findOne({ _id: categoryId, cafeId });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
}

async function findOwnedProduct(cafeId, productId) {
  const product = await Product.findOne({ _id: productId, cafeId }).populate('categoryId', 'name');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return product;
}

export async function createProduct(user, payload) {
  const cafeId = requireCafeId(user);
  await assertOwnedCategory(cafeId, payload.categoryId);

  const product = await Product.create({
    cafeId,
    categoryId: payload.categoryId,
    name: payload.name,
    description: payload.description ?? '',
    price: payload.price,
    image: normalizeImageUrl(payload.image),
    available: payload.available ?? true,
    order: payload.order ?? 0,
  });

  await product.populate('categoryId', 'name');

  return toProductResponse(product);
}

export async function listProducts(user) {
  const cafeId = requireCafeId(user);

  const products = await Product.find({ cafeId })
    .populate('categoryId', 'name')
    .sort({ order: 1, name: 1 });

  return products.map(toProductResponse);
}

export async function getProductById(user, productId) {
  const cafeId = requireCafeId(user);
  const product = await findOwnedProduct(cafeId, productId);

  return toProductResponse(product);
}

export async function updateProduct(user, productId, payload) {
  const cafeId = requireCafeId(user);
  const product = await findOwnedProduct(cafeId, productId);

  if (payload.categoryId !== undefined) {
    await assertOwnedCategory(cafeId, payload.categoryId);
    product.categoryId = payload.categoryId;
  }

  if (payload.name !== undefined) {
    product.name = payload.name;
  }

  if (payload.description !== undefined) {
    product.description = payload.description;
  }

  if (payload.price !== undefined) {
    product.price = payload.price;
  }

  if (payload.image !== undefined) {
    product.image = normalizeImageUrl(payload.image);
  }

  if (payload.available !== undefined) {
    product.available = payload.available;
  }

  if (payload.order !== undefined) {
    product.order = payload.order;
  }

  await product.save();
  await product.populate('categoryId', 'name');

  return toProductResponse(product);
}

export async function deleteProduct(user, productId) {
  const cafeId = requireCafeId(user);
  const product = await findOwnedProduct(cafeId, productId);

  await product.deleteOne();
}
