import { asyncHandler } from '../middleware/asyncHandler.js';
import { getHealthStatus } from '../services/health.service.js';

export const getHealth = asyncHandler(async (_req, res) => {
  const payload = await getHealthStatus();
  res.status(200).json(payload);
});
