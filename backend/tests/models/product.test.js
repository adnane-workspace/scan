import { Product } from '../../src/models/Product.js';
import { createCafe, createCategory } from '../helpers.js';

describe('Product', () => {
  it('creates a valid product', async () => {
    const cafe = await createCafe();
    const category = await createCategory({ cafeId: cafe._id });

    const product = await Product.create({
      cafeId: cafe._id,
      categoryId: category._id,
      name: 'Espresso',
      description: 'Café serré',
      price: 2.2,
      available: true,
      order: 1,
    });

    expect(product.name).toBe('Espresso');
    expect(product.price).toBe(2.2);
    expect(product.available).toBe(true);
    expect(product.cafeId.toString()).toBe(cafe._id.toString());
    expect(product.categoryId.toString()).toBe(category._id.toString());
  });

  it('rejects a negative price', async () => {
    const cafe = await createCafe();
    const category = await createCategory({ cafeId: cafe._id });

    await expect(
      Product.create({
        cafeId: cafe._id,
        categoryId: category._id,
        name: 'Espresso',
        price: -1,
      }),
    ).rejects.toThrow(/Price cannot be negative/);
  });

  it('requires cafeId', async () => {
    const category = await createCategory();

    await expect(
      Product.create({
        categoryId: category._id,
        name: 'Espresso',
        price: 2.2,
      }),
    ).rejects.toThrow(/cafeId is required/);
  });

  it('requires categoryId', async () => {
    const cafe = await createCafe();

    await expect(
      Product.create({
        cafeId: cafe._id,
        name: 'Espresso',
        price: 2.2,
      }),
    ).rejects.toThrow(/categoryId is required/);
  });
});
