import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export async function getHealthStatus() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    throw new ApiError(503, 'Database unavailable', null, 'DATABASE_UNAVAILABLE');
  }

  return {
    success: true,
    message: 'API is running',
    mail: {
      provider: env.RESEND_API_KEY ? 'resend' : env.SMTP_HOST ? 'smtp' : 'none',
      from: env.MAIL_FROM,
    },
  };
}
