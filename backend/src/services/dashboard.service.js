import mongoose from 'mongoose';
import { Cafe } from '../models/Cafe.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

function requireCafeId(user) {
  if (!user.cafeId) {
    throw new ApiError(403, 'No cafe associated with this account');
  }

  return user.cafeId;
}

function toRecentProduct(product) {
  const category = product.categoryId;

  return {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    available: product.available,
    categoryName: category?.name ?? null,
    createdAt: product.createdAt,
  };
}

export async function getDashboardStats(user) {
  const cafeId = requireCafeId(user);
  const cafeObjectId = new mongoose.Types.ObjectId(String(cafeId));

  const [totalProducts, totalCategories, availableProducts, recentProducts, categoryDocs, productCounts, cafe] =
    await Promise.all([
      Product.countDocuments({ cafeId }),
      Category.countDocuments({ cafeId }),
      Product.countDocuments({ cafeId, available: true }),
      Product.find({ cafeId }).populate('categoryId', 'name').sort({ createdAt: -1 }).limit(5),
      Category.find({ cafeId }).sort({ order: 1, name: 1 }).select('name'),
      Product.aggregate([{ $match: { cafeId: cafeObjectId } }, { $group: { _id: '$categoryId', count: { $sum: 1 } } }]),
      Cafe.findById(cafeId).select('name slug'),
    ]);

  const countByCategory = new Map(productCounts.map((item) => [String(item._id), item.count]));

  return {
    totalProducts,
    totalCategories,
    availableProducts,
    unavailableProducts: totalProducts - availableProducts,
    recentProducts: recentProducts.map(toRecentProduct),
    categories: categoryDocs.map((category) => ({
      _id: category._id,
      name: category.name,
      productCount: countByCategory.get(String(category._id)) || 0,
    })),
    cafe: cafe
      ? {
          name: cafe.name,
          slug: cafe.slug,
        }
      : null,
  };
}
