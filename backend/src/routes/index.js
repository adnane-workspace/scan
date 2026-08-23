import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { cafeRouter } from './cafe.routes.js';
import { categoryRouter } from './category.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { healthRouter } from './health.routes.js';
import { menuRouter } from './menu.routes.js';
import { platformRouter } from './platform.routes.js';
import { productRouter } from './product.routes.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/cafe', cafeRouter);
router.use('/platform', platformRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/dashboard', dashboardRouter);
router.use('/menu', menuRouter);

export { router };
