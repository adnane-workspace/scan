import { Router } from 'express';
import {
  createCafe,
  getCafe,
  getStorage,
  listCafes,
  listLogs,
  resetCafePassword,
  updateCafeStatus,
} from '../controllers/platform.controller.js';
import { authenticate, requireSuperAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createPlatformCafeSchema,
  listActivityLogsSchema,
  platformCafeIdSchema,
  resetPlatformCafePasswordSchema,
  updatePlatformCafeSchema,
} from '../validators/cafe.validator.js';

const platformRouter = Router();

platformRouter.use(authenticate, requireSuperAdmin);

platformRouter.get('/storage', getStorage);
platformRouter.get('/logs', validate(listActivityLogsSchema), listLogs);
platformRouter.get('/cafes', listCafes);
platformRouter.post('/cafes', validate(createPlatformCafeSchema), createCafe);
platformRouter.get('/cafes/:id', validate(platformCafeIdSchema), getCafe);
platformRouter.patch('/cafes/:id', validate(updatePlatformCafeSchema), updateCafeStatus);
platformRouter.post('/cafes/:id/password', validate(resetPlatformCafePasswordSchema), resetCafePassword);

export { platformRouter };
