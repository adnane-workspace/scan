import { Router } from 'express';
import { create, getById, list, remove, update, uploadImage } from '../controllers/product.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { handleUploadError, productImageUpload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from '../validators/product.validator.js';

const productRouter = Router();

productRouter.use(authenticate, requireAdmin);

productRouter.post('/', validate(createProductSchema), create);
productRouter.get('/', list);
productRouter.post('/upload', productImageUpload.single('image'), handleUploadError, uploadImage);
productRouter.get('/:id', validate(productIdSchema), getById);
productRouter.put('/:id', validate(updateProductSchema), update);
productRouter.delete('/:id', validate(productIdSchema), remove);

export { productRouter };
