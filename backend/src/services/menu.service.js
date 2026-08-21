import { Cafe } from '../models/Cafe.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

function toPublicProduct(product) {
  return {
    id: product._id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: product.image || '',
  };
}

export async function getPublicMenu(slug) {
  const cafe = await Cafe.findOne({ slug }).select('name description logo address phone isActive');

  if (!cafe) {
    throw new ApiError(404, 'Menu introuvable');
  }

  if (!cafe.isActive) {
    throw new ApiError(403, 'Menu indisponible');
  }

  const [categories, products] = await Promise.all([
    Category.find({ cafeId: cafe._id }).sort({ order: 1, name: 1 }).select('name order'),
    Product.find({ cafeId: cafe._id, available: true })
      .sort({ order: 1, name: 1 })
      .select('name description price image categoryId order'),
  ]);

  const productsByCategory = new Map();

  for (const product of products) {
    const key = String(product.categoryId);

    if (!productsByCategory.has(key)) {
      productsByCategory.set(key, []);
    }

    productsByCategory.get(key).push(toPublicProduct(product));
  }

  return {
    cafe: {
      name: cafe.name,
      description: cafe.description || '',
      logo: cafe.logo || '',
      address: cafe.address || '',
      phone: cafe.phone || '',
    },
    categories: categories
      .map((category) => ({
        id: category._id,
        name: category.name,
        products: productsByCategory.get(String(category._id)) || [],
      }))
      .filter((category) => category.products.length > 0),
  };
}
