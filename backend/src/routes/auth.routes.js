import { Router } from 'express';
import { startTrialSession } from '../controllers/trial.controller.js';
import { startTrialSchema } from '../validators/trial.validator.js';
import {
  forgotPassword,
  getMe,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  resendVerification,
  resetPassword,
  updatePassword,
  verifyEmailCode,
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
  resendVerificationSchema,
  resetPasswordSchema,
  verifyResetCodeSchema,
} from '../validators/auth.validator.js';

const authRouter = Router();

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Try again later.',
  code: 'TOO_MANY_LOGIN_ATTEMPTS',
});

const registerLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts. Try again later.',
  code: 'TOO_MANY_REGISTER_ATTEMPTS',
});

const trialLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many trial attempts. Try again later.',
  code: 'TOO_MANY_TRIAL_ATTEMPTS',
});

const resetRequestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset requests. Try again later.',
  code: 'TOO_MANY_RESET_REQUESTS',
});

const resetVerifyLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many verification attempts. Try again later.',
  code: 'TOO_MANY_VERIFY_ATTEMPTS',
});

const resetCompleteLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset attempts. Try again later.',
  code: 'TOO_MANY_RESET_ATTEMPTS',
});

authRouter.post('/register', registerLimit, validate(registerSchema), registerAdmin);
authRouter.post('/trial', trialLimit, validate(startTrialSchema), startTrialSession);
authRouter.post('/verify-email', resetVerifyLimit, validate(verifyResetCodeSchema), verifyEmailCode);
authRouter.post('/resend-verification', resetRequestLimit, validate(resendVerificationSchema), resendVerification);
authRouter.post('/login', loginLimit, validate(loginSchema), loginAdmin);
authRouter.post('/forgot-password', resetRequestLimit, validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/verify-reset-code', resetVerifyLimit, validate(verifyResetCodeSchema), verifyResetCode);
authRouter.post('/reset-password', resetCompleteLimit, validate(resetPasswordSchema), resetPassword);
authRouter.get('/me', authenticate, requireStaff, getMe);
authRouter.post('/password', authenticate, requireStaff, validate(changePasswordSchema), updatePassword);
authRouter.post('/logout', authenticate, logoutAdmin);

export { authRouter };
