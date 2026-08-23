import { prisma } from '../src/config/prisma.js';

async function resetDatabase() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cafe.deleteMany();
}

beforeAll(async () => {
  await prisma.$connect();
  await resetDatabase();
}, 30000);

afterEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
