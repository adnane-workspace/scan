import { asyncHandler } from '../middleware/asyncHandler.js';
import { getPublicMenu } from '../services/menu.service.js';
import { readPublicMenuCache } from '../services/menuCache.service.js';

export const getMenu = asyncHandler(async (req, res) => {
  const slug = req.validated.params.slug;
  const cached = readPublicMenuCache(slug);
  const menu = cached?.data || (await getPublicMenu(slug));

  res.setHeader('Cache-Control', 'public, max-age=15, s-maxage=45, stale-while-revalidate=120');
  res.setHeader('X-Menu-Cache', cached ? 'hit' : 'miss');
  res.status(200).json({
    success: true,
    data: menu,
  });
});
