import { prisma } from '../../src/config/prisma.js';
import { createCafe, createCategory, createUser } from '../helpers.js';

describe('relations', () => {
  it('associates an admin with a cafe', async () => {
    const cafe = await createCafe({ slug: 'cafe-central' });
    const user = await createUser({ cafeId: cafe.id, email: 'admin@example.com' });

    const populated = await prisma.user.findUnique({
      where: { id: user.id },
      include: { cafe: true },
    });

    expect(populated.cafe.id).toBe(cafe.id);
    expect(populated.cafe.slug).toBe('cafe-central');
  });

  it('scopes categories and products to the same cafe', async () => {
    const cafe = await createCafe();
    const category = await createCategory({ cafeId: cafe.id, name: 'Cafés' });

    const product = await prisma.product.create({
      data: {
        cafeId: cafe.id,
        categoryId: category.id,
        name: 'Espresso',
        price: 2.2,
      },
    });

    const populatedCategory = await prisma.category.findUnique({
      where: { id: category.id },
      include: { cafe: true },
    });
    const populatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { cafe: true, category: true },
    });

    expect(populatedCategory.cafe.id).toBe(cafe.id);
    expect(populatedProduct.cafe.id).toBe(cafe.id);
    expect(populatedProduct.category.id).toBe(category.id);
    expect(populatedProduct.cafe.id).toBe(populatedProduct.category.cafeId);
  });
});
