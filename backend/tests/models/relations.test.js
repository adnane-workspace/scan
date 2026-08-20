import { Category } from '../../src/models/Category.js';
import { Product } from '../../src/models/Product.js';
import { User } from '../../src/models/User.js';
import { createCafe, createCategory, createUser } from '../helpers.js';

describe('relations', () => {
  it('associates an admin with a cafe', async () => {
    const cafe = await createCafe({ slug: 'cafe-central' });
    const user = await createUser({ cafeId: cafe._id, email: 'admin@example.com' });

    const populated = await User.findById(user._id).populate('cafeId');

    expect(populated.cafeId._id.toString()).toBe(cafe._id.toString());
    expect(populated.cafeId.slug).toBe('cafe-central');
  });

  it('scopes categories and products to the same cafe', async () => {
    const cafe = await createCafe();
    const category = await createCategory({ cafeId: cafe._id, name: 'Cafés' });

    const product = await Product.create({
      cafeId: cafe._id,
      categoryId: category._id,
      name: 'Espresso',
      price: 2.2,
    });

    const populatedCategory = await Category.findById(category._id).populate('cafeId');
    const populatedProduct = await Product.findById(product._id)
      .populate('cafeId')
      .populate('categoryId');

    expect(populatedCategory.cafeId._id.toString()).toBe(cafe._id.toString());
    expect(populatedProduct.cafeId._id.toString()).toBe(cafe._id.toString());
    expect(populatedProduct.categoryId._id.toString()).toBe(category._id.toString());
    expect(populatedProduct.cafeId._id.toString()).toBe(populatedProduct.categoryId.cafeId.toString());
  });
});
