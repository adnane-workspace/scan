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
import { rateLimit } from '../middleware/rateLimit.js';
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

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Try again later.',
});

const resetRequestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset requests. Try again later.',
});

const resetVerifyLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many verification attempts. Try again later.',
});

const resetCompleteLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset attempts. Try again later.',
});

authRouter.post('/register', validate(registerSchema), registerAdmin);
authRouter.post('/login', loginLimit, validate(loginSchema), loginAdmin);
authRouter.post('/forgot-password', resetRequestLimit, validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/verify-reset-code', resetVerifyLimit, validate(verifyResetCodeSchema), verifyResetCode);
authRouter.post('/reset-password', resetCompleteLimit, validate(resetPasswordSchema), resetPassword);
authRouter.get('/me', authenticate, requireStaff, getMe);
authRouter.post('/password', authenticate, requireStaff, validate(changePasswordSchema), updatePassword);
authRouter.post('/logout', authenticate, logoutAdmin);

export { authRouter };
