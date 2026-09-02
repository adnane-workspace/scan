/**
 * Create or update the platform superadmin account.
 *
 * Local:
 *   npm run db:superadmin -- you@example.com your-password "Your Name"
 *
 * Production (one-shot from your machine, against the prod Neon DB):
 *   set DATABASE_URL=postgresql://...   (prod pooled URL from Vercel / Neon)
 *   set DIRECT_URL=postgresql://...    (prod direct URL)
 *   npm run db:superadmin -- you@example.com your-password "Your Name"
 *
 * Or set SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD / SUPERADMIN_NAME in backend/.env
 * Do not keep SUPERADMIN_PASSWORD in Vercel env vars after bootstrap.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
  quiet: true,
  override: false,
});

function readArg(index) {
  const value = process.argv[index];
  return typeof value === 'string' ? value.trim() : '';
}

const databaseUrl = process.env.DATABASE_URL?.trim();
const directUrl = process.env.DIRECT_URL?.trim() || databaseUrl;

if (!databaseUrl) {
  console.error('DATABASE_URL is required (local .env or shell env var).');
  process.exit(1);
}

process.env.DATABASE_URL = databaseUrl;
process.env.DIRECT_URL = directUrl;

const email = (process.env.SUPERADMIN_EMAIL || readArg(2)).toLowerCase().trim();
const password = process.env.SUPERADMIN_PASSWORD || readArg(3);
const name = (process.env.SUPERADMIN_NAME || readArg(4) || 'Super Admin').trim();

if (!email || !password) {
  console.error('Missing email or password.');
  console.error('');
  console.error('Usage:');
  console.error('  npm run db:superadmin -- <email> <password> [name]');
  console.error('');
  console.error('Production: point DATABASE_URL (+ DIRECT_URL) at the prod Neon DB, run once, then remove the password from your shell history.');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash(password, 10);

const user = await prisma.user.upsert({
  where: { email },
  update: {
    name,
    passwordHash,
    role: 'superadmin',
    cafeId: null,
    emailVerifiedAt: new Date(),
  },
  create: {
    name,
    email,
    passwordHash,
    role: 'superadmin',
    emailVerifiedAt: new Date(),
  },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  },
});

const target = databaseUrl.includes('neon.tech') ? 'Neon' : 'database';

console.info('Superadmin ready.');
console.info(`  Target: ${target}`);
console.info(`  Email : ${user.email}`);
console.info(`  Name  : ${user.name}`);
console.info(`  Role  : ${user.role}`);
console.info('');
console.info('Sign in at https://app.scanosh.com/login (or your prod URL).');

await prisma.$disconnect();
