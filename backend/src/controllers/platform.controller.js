import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createPlatformCafe,
  getPlatformCafe,
  listPlatformCafes,
  resetPlatformCafePassword,
  updatePlatformCafe,
} from '../services/platform.service.js';

export const createCafe = asyncHandler(async (req, res) => {
  const cafe = await createPlatformCafe(req.validated.body);

  res.status(201).json({
    success: true,
    message: 'Cafe created',
    data: { cafe },
  });
});

export const listCafes = asyncHandler(async (_req, res) => {
  const cafes = await listPlatformCafes();

  res.status(200).json({
    success: true,
    data: { cafes },
  });
});

export const getCafe = asyncHandler(async (req, res) => {
  const cafe = await getPlatformCafe(req.validated.params.id);

  res.status(200).json({
    success: true,
    data: { cafe },
  });
});

export const resetCafePassword = asyncHandler(async (req, res) => {
  const result = await resetPlatformCafePassword(req.validated.params.id, req.validated.body.password);

  res.status(200).json({
    success: true,
    message: 'Password updated',
    data: result,
  });
});

export const updateCafeStatus = asyncHandler(async (req, res) => {
  const cafe = await updatePlatformCafe(req.validated.params.id, req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Cafe updated',
    data: { cafe },
  });
});
