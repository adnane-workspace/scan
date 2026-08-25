import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '../services/category.service.js';
import { uploadProductImage } from '../services/storage.service.js';

export const create = asyncHandler(async (req, res) => {
  const category = await createCategory(req.user, req.validated.body);

  res.status(201).json({
    success: true,
    message: 'Category created',
    data: { category },
  });
});

export const list = asyncHandler(async (req, res) => {
  const categories = await listCategories(req.user);

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.user, req.validated.params.id);

  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const update = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.user, req.validated.params.id, req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Category updated',
    data: { category },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteCategory(req.user, req.validated.params.id);

  res.status(200).json({
    success: true,
    message: 'Category deleted',
  });
});

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const url = await uploadProductImage(req.file, { folder: 'categories' });

  res.status(201).json({
    success: true,
    message: 'Image uploaded',
    data: { url },
  });
});
