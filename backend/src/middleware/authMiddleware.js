import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';
import { asyncHandler } from './asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = header.slice(7).trim();

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      cafeId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(401, 'Authentication required');
  }

  req.user = { ...user, _id: user.id };
  next();
});

export function requireAdmin(req, _res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }

  return next();
}
