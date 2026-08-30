import { Router } from 'express';
import { getShare } from '../controllers/share.controller.js';
import { validate } from '../middleware/validate.js';
import { sharePreviewSchema } from '../validators/share.validator.js';

const shareRouter = Router();

shareRouter.get('/:slug', validate(sharePreviewSchema), getShare);

export { shareRouter };
