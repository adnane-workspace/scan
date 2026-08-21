import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toCategoryResponse(category) {
  return {
    _id: category._id,
    cafeId: category.cafeId,
    name: category.name,
    description: category.description,
    image: category.image || '',
    order: category.order,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

async function findOwnedCategory(cafeId, categoryId) {
  const category = await Category.findOne({ _id: categoryId, cafeId });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
}

export async function createCategory(user, payload) {
  const cafeId = requireCafeId(user);

  const category = await Category.create({
    cafeId,
    name: payload.name,
    description: payload.description ?? '',
    image: payload.image ?? '',
    order: payload.order ?? 0,
  });

  return toCategoryResponse(category);
}

export async function listCategories(user) {
  const cafeId = requireCafeId(user);

  const categories = await Category.find({ cafeId }).sort({ order: 1, name: 1 });

  return categories.map(toCategoryResponse);
}

export async function getCategoryById(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  return toCategoryResponse(category);
}

export async function updateCategory(user, categoryId, payload) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  if (payload.name !== undefined) {
    category.name = payload.name;
  }

  if (payload.description !== undefined) {
    category.description = payload.description;
  }

  if (payload.image !== undefined) {
    category.image = payload.image;
  }

  if (payload.order !== undefined) {
    category.order = payload.order;
  }

  await category.save();

  return toCategoryResponse(category);
}

export async function deleteCategory(user, categoryId) {
  const cafeId = requireCafeId(user);
  const category = await findOwnedCategory(cafeId, categoryId);

  await category.deleteOne();
}
