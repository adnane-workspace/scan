import { Router } from 'express';
import { getMe, loginAdmin, logoutAdmin, registerAdmin, updatePassword } from '../controllers/auth.controller.js';
import { authenticate, requireStaff } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { changePasswordSchema, loginSchema, registerSchema } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), registerAdmin);
authRouter.post('/login', validate(loginSchema), loginAdmin);
authRouter.get('/me', authenticate, requireStaff, getMe);
authRouter.post('/password', authenticate, requireStaff, validate(changePasswordSchema), updatePassword);
authRouter.post('/logout', authenticate, logoutAdmin);

export { authRouter };
