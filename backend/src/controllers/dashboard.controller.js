import { asyncHandler } from '../middleware/asyncHandler.js';
import { getDashboardStats } from '../services/dashboard.service.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user);

  res.status(200).json({
    success: true,
    data: stats,
  });
});
