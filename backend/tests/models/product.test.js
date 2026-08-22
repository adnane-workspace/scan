import { prisma } from '../../src/config/prisma.js';
import { createCafe, createCategory } from '../helpers.js';

describe('Product', () => {
  it('creates a valid product', async () => {
    const cafe = await createCafe();
    const category = await createCategory({ cafeId: cafe.id });

    const product = await prisma.product.create({
      data: {
        cafeId: cafe.id,
        categoryId: category.id,
        name: 'Espresso',
        description: 'Café serré',
        price: 2.2,
        available: true,
        order: 1,
      },
    });

    expect(product.name).toBe('Espresso');
    expect(Number(product.price)).toBe(2.2);
    expect(product.available).toBe(true);
    expect(product.cafeId).toBe(cafe.id);
    expect(product.categoryId).toBe(category.id);
  });

  it('rejects a negative price', async () => {
    const cafe = await createCafe();
    const category = await createCategory({ cafeId: cafe.id });

    await expect(
      prisma.product.create({
        data: {
          cafeId: cafe.id,
          categoryId: category.id,
          name: 'Espresso',
          price: -1,
        },
      }),
    ).rejects.toThrow();
  });

  it('requires cafeId', async () => {
    const category = await createCategory();

    await expect(
      prisma.product.create({
        data: {
          categoryId: category.id,
          name: 'Espresso',
          price: 2.2,
        },
      }),
    ).rejects.toThrow(/cafe/i);
  });

  it('requires categoryId', async () => {
    const cafe = await createCafe();

    await expect(
      prisma.product.create({
        data: {
          cafeId: cafe.id,
          name: 'Espresso',
          price: 2.2,
        },
      }),
    ).rejects.toThrow();
  });
});
