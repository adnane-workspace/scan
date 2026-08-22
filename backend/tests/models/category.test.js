import { prisma } from '../../src/config/prisma.js';
import { createCafe } from '../helpers.js';

describe('Category', () => {
  it('creates a valid category', async () => {
    const cafe = await createCafe();

    const category = await prisma.category.create({
      data: {
        cafeId: cafe.id,
        name: 'Cafés',
        description: 'Boissons chaudes',
        order: 1,
      },
    });

    expect(category.name).toBe('Cafés');
    expect(category.cafeId).toBe(cafe.id);
    expect(category.order).toBe(1);
  });

  it('requires cafeId', async () => {
    await expect(
      prisma.category.create({
        data: {
          name: 'Cafés',
        },
      }),
    ).rejects.toThrow(/cafeId/i);
  });
});
