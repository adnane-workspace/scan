import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      details: err.flatten(),
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      code: expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
      message: expired ? 'Token expired' : 'Invalid token',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: err.message,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    statusCode === 500 && env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';
  const code =
    err instanceof ApiError
      ? err.code
      : statusCode === 500
        ? 'INTERNAL_ERROR'
        : null;

  return res.status(statusCode).json({
    success: false,
    ...(code && { code }),
    message,
    ...(err instanceof ApiError && err.details && { details: err.details }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, null, 'ROUTE_NOT_FOUND'));
}
