import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
  quiet: true,
  override: process.env.NODE_ENV !== 'production',
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().min(1).default('http://localhost:5173'),
  CLOUDINARY_CLOUD_NAME: z.string().trim().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().trim().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().trim().min(1, 'CLOUDINARY_API_SECRET is required'),
  CLOUDINARY_FOLDER: z.string().trim().min(1).default('digital-menu'),
  PRODUCTION_DATABASE_URL: z.string().optional().default(''),
  PRODUCTION_API_URL: z.string().trim().optional().default(''),
  PRODUCTION_CAFE_SLUGS: z.string().optional().default('cafe-central'),
  RESEND_API_KEY: z.string().trim().optional().default(''),
  SMTP_HOST: z.string().trim().optional().default(''),
  SMTP_PORT: z.preprocess(
    (value) => (value === undefined || value === '' ? 587 : value),
    z.coerce.number().int().min(1).max(65535),
  ),
  SMTP_SECURE: z.preprocess((value) => value === true || value === 'true' || value === '1', z.boolean()),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.preprocess(
    (value) => String(value || '').replace(/\s+/g, ''),
    z.string().optional().default(''),
  ),
  MAIL_FROM: z.string().trim().optional().default('Scanosh <noreply@qtable.app>'),
  ROOT_DOMAIN: z.string().trim().optional().default('scanosh.com'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export function normalizeOrigin(value) {
  return String(value || '')
    .trim()
    .replace(/\/+$/, '');
}

const extraDevOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

const productionSiteOrigins = [
  'https://www.scanosh.com',
  'https://scanosh.com',
  'https://app.scanosh.com',
  'https://platform.scanosh.com',
];

export const clientOrigins = [
  ...new Set(
    [
      ...env.CLIENT_URL.split(','),
      ...productionSiteOrigins,
      ...(env.NODE_ENV === 'development' ? extraDevOrigins : []),
    ]
      .map(normalizeOrigin)
      .filter(Boolean),
  ),
];
