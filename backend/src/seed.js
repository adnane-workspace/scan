import bcrypt from 'bcrypt';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Cafe } from './models/Cafe.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';

const DEMO_PASSWORD = 'DemoAdmin123!';

async function seed() {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Cafe.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);

  const cafe = await Cafe.create({
    name: 'Café Central',
    description: 'Café de démonstration pour le menu digital.',
    logo: '',
    address: '12 Rue de la Paix, 75002 Paris',
    phone: '+33 1 23 45 67 89',
    slug: 'cafe-central',
    isActive: true,
  });

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash,
    role: 'admin',
    cafeId: cafe._id,
  });

  const [cafesCategory, drinksCategory, dessertsCategory] = await Category.insertMany([
    {
      cafeId: cafe._id,
      name: 'Cafés',
      description: 'Expressos et boissons chaudes à base de café.',
      order: 1,
    },
    {
      cafeId: cafe._id,
      name: 'Boissons',
      description: 'Boissons froides et rafraîchissements.',
      order: 2,
    },
    {
      cafeId: cafe._id,
      name: 'Desserts',
      description: 'Douceurs et pâtisseries.',
      order: 3,
    },
  ]);

  await Product.insertMany([
    {
      cafeId: cafe._id,
      categoryId: cafesCategory._id,
      name: 'Espresso',
      description: 'Café serré, 30 ml.',
      price: 2.2,
      available: true,
      order: 1,
    },
    {
      cafeId: cafe._id,
      categoryId: cafesCategory._id,
      name: 'Cappuccino',
      description: 'Espresso, lait chauffé et mousse de lait.',
      price: 3.5,
      available: true,
      order: 2,
    },
    {
      cafeId: cafe._id,
      categoryId: drinksCategory._id,
      name: 'Coca-Cola',
      description: 'Canette 33 cl.',
      price: 2.8,
      available: true,
      order: 1,
    },
    {
      cafeId: cafe._id,
      categoryId: drinksCategory._id,
      name: "Jus d'orange",
      description: 'Jus d\'orange pressé, 25 cl.',
      price: 3.2,
      available: true,
      order: 2,
    },
    {
      cafeId: cafe._id,
      categoryId: dessertsCategory._id,
      name: 'Cheesecake',
      description: 'Part de cheesecake nature.',
      price: 4.9,
      available: true,
      order: 1,
    },
  ]);

  console.log('Seed completed.');
  console.log(`Admin: ${admin.email}`);
  console.log(`Cafe: ${cafe.name} (${cafe.slug})`);
  console.log(`Public menu URL: /menu/${cafe.slug}`);

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
