import { prisma } from '../src/config/prisma.js';

beforeAll(async () => {
  await prisma.$connect();
}, 30000);

afterEach(async () => {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cafe.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
