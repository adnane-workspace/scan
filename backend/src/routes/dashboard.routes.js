import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const dashboardRouter = Router();

dashboardRouter.use(authenticate, requireAdmin);
dashboardRouter.get('/stats', getStats);

export { dashboardRouter };
