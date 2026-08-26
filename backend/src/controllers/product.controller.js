import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../services/product.service.js';
import { uploadProductImage } from '../services/storage.service.js';

export const create = asyncHandler(async (req, res) => {
  const product = await createProduct(req.user, req.validated.body);

  res.status(201).json({
    success: true,
    message: 'Product created',
    data: { product },
  });
});

export const list = asyncHandler(async (req, res) => {
  const products = await listProducts(req.user);

  res.status(200).json({
    success: true,
    data: { products },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const product = await getProductById(req.user, req.validated.params.id);

  res.status(200).json({
    success: true,
    data: { product },
  });
});

export const update = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.user, req.validated.params.id, req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Product updated',
    data: { product },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteProduct(req.user, req.validated.params.id);

  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
});

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required', null, 'IMAGE_REQUIRED');
  }

  const url = await uploadProductImage(req.file, { folder: 'products' });

  res.status(201).json({
    success: true,
    message: 'Image uploaded',
    data: { url },
  });
});
