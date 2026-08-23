import { asyncHandler } from '../middleware/asyncHandler.js';
import { changePassword, getCurrentUser, login, logout, register } from '../services/auth.service.js';

export const registerAdmin = asyncHandler(async (req, res) => {
  const result = await register(req.validated.body);

  res.status(201).json({
    success: true,
    message: 'Account created',
    data: result,
  });
});

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

export const updatePassword = asyncHandler(async (req, res) => {
  await changePassword(req.user._id, req.validated.body);

  res.status(200).json({
    success: true,
    message: 'Password updated',
  });
});

export const logoutAdmin = asyncHandler(async (_req, res) => {
  const result = logout();
  res.status(200).json(result);
});
