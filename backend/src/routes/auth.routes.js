import { Router } from 'express';
import { getMe, loginAdmin, logoutAdmin } from '../controllers/auth.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), loginAdmin);
authRouter.get('/me', authenticate, requireAdmin, getMe);
authRouter.post('/logout', authenticate, logoutAdmin);

export { authRouter };
