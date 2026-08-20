import { asyncHandler } from '../middleware/asyncHandler.js';
import { getCurrentUser, login, logout } from '../services/auth.service.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const result = await login(req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const logoutAdmin = asyncHandler(async (_req, res) => {
  const result = logout();
  res.status(200).json(result);
});
