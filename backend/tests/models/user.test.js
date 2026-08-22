import bcrypt from 'bcrypt';
import { prisma } from '../../src/config/prisma.js';
import { createCafe } from '../helpers.js';

describe('User', () => {
  it('creates a valid user', async () => {
    const cafe = await createCafe();
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash,
        role: 'admin',
        cafeId: cafe.id,
      },
    });

    expect(user.name).toBe('Admin');
    expect(user.email).toBe('admin@example.com');
    expect(user.role).toBe('admin');
    expect(user.cafeId).toBe(cafe.id);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('requires an email', async () => {
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    await expect(
      prisma.user.create({
        data: {
          name: 'Admin',
          passwordHash,
        },
      }),
    ).rejects.toThrow(/email/i);
  });

  it('enforces a unique email', async () => {
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash,
      },
    });

    await expect(
      prisma.user.create({
        data: {
          name: 'Other Admin',
          email: 'admin@example.com',
          passwordHash,
        },
      }),
    ).rejects.toMatchObject({ code: 'P2002' });
  });

  it('requires passwordHash', async () => {
    await expect(
      prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@example.com',
        },
      }),
    ).rejects.toThrow(/passwordHash/i);
  });

  it('can omit passwordHash when reading', async () => {
    const passwordHash = await bcrypt.hash('DemoAdmin123!', 10);

    const created = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        passwordHash,
      },
    });

    const found = await prisma.user.findUnique({
      where: { id: created.id },
      select: {
        id: true,
        email: true,
      },
    });

    expect(found.passwordHash).toBeUndefined();
  });
});
