import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/token.js';

function toPublicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    cafeId: user.cafeId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }

  const token = generateToken({
    sub: user._id.toString(),
    role: user.role,
    cafeId: user.cafeId ? user.cafeId.toString() : null,
  });

  return {
    token,
    user: toPublicUser(user),
  };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }

  return toPublicUser(user);
}

export function logout() {
  return {
    success: true,
    message: 'Logged out successfully',
  };
}
