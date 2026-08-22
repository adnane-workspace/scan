import { prisma } from '../../src/config/prisma.js';

describe('Cafe', () => {
  it('creates a valid cafe', async () => {
    const cafe = await prisma.cafe.create({
      data: {
        name: 'Café Central',
        slug: 'cafe-central',
        description: 'Cafe de demonstration',
        address: '12 Rue de la Paix',
        phone: '+33 1 23 45 67 89',
      },
    });

    expect(cafe.name).toBe('Café Central');
    expect(cafe.slug).toBe('cafe-central');
    expect(cafe.isActive).toBe(true);
    expect(cafe.createdAt).toBeInstanceOf(Date);
  });

  it('requires a slug', async () => {
    await expect(
      prisma.cafe.create({
        data: {
          name: 'Café Central',
        },
      }),
    ).rejects.toThrow(/slug/i);
  });

  it('enforces a unique slug', async () => {
    await prisma.cafe.create({
      data: {
        name: 'Café Central',
        slug: 'cafe-central',
      },
    });

    await expect(
      prisma.cafe.create({
        data: {
          name: 'Autre Café',
          slug: 'cafe-central',
        },
      }),
    ).rejects.toMatchObject({ code: 'P2002' });
  });
});
