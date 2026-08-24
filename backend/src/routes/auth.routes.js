import { Router } from 'express';
import {
  forgotPassword,
  getMe,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  resetPassword,
  updatePassword,
  verifyResetCode,
} from '../controllers/auth.controller.js';
import { authenticate, requireStaff } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyResetCodeSchema,
} from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), registerAdmin);
authRouter.post('/login', validate(loginSchema), loginAdmin);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/verify-reset-code', validate(verifyResetCodeSchema), verifyResetCode);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPassword);
authRouter.get('/me', authenticate, requireStaff, getMe);
authRouter.post('/password', authenticate, requireStaff, validate(changePasswordSchema), updatePassword);
authRouter.post('/logout', authenticate, logoutAdmin);

export { authRouter };
