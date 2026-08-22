import { prisma } from './prisma.js';

export async function connectDatabase() {
  await prisma.$connect();
  console.log('PostgreSQL connected');
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
