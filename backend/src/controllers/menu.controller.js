import { asyncHandler } from '../middleware/asyncHandler.js';
import { getPublicMenu } from '../services/menu.service.js';

export const getMenu = asyncHandler(async (req, res) => {
  const menu = await getPublicMenu(req.validated.params.slug);

  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json({
    success: true,
    data: menu,
  });
});
