import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export async function getHealthStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    throw new ApiError(503, 'Database unavailable');
  }

  return {
    success: true,
    message: 'API is running',
  };
}
