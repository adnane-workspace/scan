import { Router } from 'express';
import { create, getById, list, listOptions, remove, update, uploadImage } from '../controllers/category.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { handleUploadError, productImageUpload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  categoryIdSchema,
  createCategorySchema,
  listCategoriesSchema,
  updateCategorySchema,
} from '../validators/category.validator.js';

const categoryRouter = Router();

categoryRouter.use(authenticate, requireAdmin);

categoryRouter.post('/', validate(createCategorySchema), create);
categoryRouter.get('/options', listOptions);
categoryRouter.get('/', validate(listCategoriesSchema), list);
categoryRouter.post('/upload', productImageUpload.single('image'), handleUploadError, uploadImage);
categoryRouter.get('/:id', validate(categoryIdSchema), getById);
categoryRouter.put('/:id', validate(updateCategorySchema), update);
categoryRouter.delete('/:id', validate(categoryIdSchema), remove);

export { categoryRouter };
