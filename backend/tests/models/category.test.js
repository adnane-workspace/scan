import { Category } from '../../src/models/Category.js';
import { createCafe } from '../helpers.js';

describe('Category', () => {
  it('creates a valid category', async () => {
    const cafe = await createCafe();

    const category = await Category.create({
      cafeId: cafe._id,
      name: 'Cafés',
      description: 'Boissons chaudes',
      order: 1,
    });

    expect(category.name).toBe('Cafés');
    expect(category.cafeId.toString()).toBe(cafe._id.toString());
    expect(category.order).toBe(1);
  });

  it('requires cafeId', async () => {
    await expect(
      Category.create({
        name: 'Cafés',
      }),
    ).rejects.toThrow(/cafeId is required/);
  });
});
