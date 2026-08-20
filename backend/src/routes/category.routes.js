import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/category.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validator.js';

const categoryRouter = Router();

categoryRouter.use(authenticate, requireAdmin);

categoryRouter.post('/', validate(createCategorySchema), create);
categoryRouter.get('/', list);
categoryRouter.get('/:id', validate(categoryIdSchema), getById);
categoryRouter.put('/:id', validate(updateCategorySchema), update);
categoryRouter.delete('/:id', validate(categoryIdSchema), remove);

export { categoryRouter };
