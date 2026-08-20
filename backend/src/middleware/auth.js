import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';
import { asyncHandler } from './asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = header.split(' ')[1];
  const decoded = verifyToken(token);

  req.user = decoded;
  next();
});

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }

    return next();
  };
}
