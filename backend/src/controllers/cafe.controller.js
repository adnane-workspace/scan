import { asyncHandler } from '../middleware/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { getMyCafe, updateMyCafe } from '../services/cafe.service.js';
import { uploadProductImage } from '../services/storage.service.js';

export const getCafe = asyncHandler(async (req, res) => {
  const cafe = await getMyCafe(req.user);

  res.status(200).json({
    success: true,
    data: { cafe },
  });
});

export const updateCafe = asyncHandler(async (req, res) => {
  const cafe = await updateMyCafe(req.user, req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Cafe updated',
    data: { cafe },
  });
});

export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required', null, 'IMAGE_REQUIRED');
  }

  const kind = Array.isArray(req.query.kind) ? req.query.kind[0] : req.query.kind;
  const folder = kind === 'cover' ? 'banners' : 'logos';
  const url = await uploadProductImage(req.file, { folder });

  res.status(201).json({
    success: true,
    message: 'Image uploaded',
    data: { url },
  });
});
