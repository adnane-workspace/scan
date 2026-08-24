import './env.js';
import { PrismaClient } from '../../generated/prisma/index.js';

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

let extraPrisma = null;

export function getPrismaForUrl(url) {
  if (!url) {
    return null;
  }

  if (!extraPrisma) {
    extraPrisma = new PrismaClient({
      datasources: { db: { url } },
    });
  }

  return extraPrisma;
}

export async function disconnectExtraPrisma() {
  if (!extraPrisma) {
    return;
  }

  await extraPrisma.$disconnect();
  extraPrisma = null;
}
