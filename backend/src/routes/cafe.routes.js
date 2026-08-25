import { Router } from 'express';
import { getCafe, updateCafe, uploadLogo } from '../controllers/cafe.controller.js';
import { createQrChangeRequest, generateQr } from '../controllers/qr.controller.js';
import { authenticate, requireCafeAdmin } from '../middleware/authMiddleware.js';
import { handleUploadError, productImageUpload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { updateCafeSchema } from '../validators/cafe.validator.js';
import { createQrChangeRequestSchema } from '../validators/qr.validator.js';

const cafeRouter = Router();

cafeRouter.use(authenticate, requireCafeAdmin);

cafeRouter.get('/', getCafe);
cafeRouter.put('/', validate(updateCafeSchema), updateCafe);
cafeRouter.post('/upload', productImageUpload.single('image'), handleUploadError, uploadLogo);
cafeRouter.post('/qr/generate', generateQr);
cafeRouter.post('/qr/change-requests', validate(createQrChangeRequestSchema), createQrChangeRequest);

export { cafeRouter };
