import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcrypt';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { Cafe } from './models/Cafe.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';
import { uploadsDir } from './services/storage.service.js';

const DEMO_PASSWORD = 'DemoAdmin123!';

const PHOTO = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=900&q=80`;

const catalog = [
  {
    name: 'Cafés',
    description: 'Expressos et boissons chaudes à base de café.',
    order: 1,
    products: [
      {
        name: 'Espresso',
        description: 'Café serré, 30 ml, torréfaction maison.',
        price: 2.2,
        order: 1,
        photo: PHOTO('photo-1514432324607-a09d9b4aefdd'),
        file: 'seed-espresso.jpg',
      },
      {
        name: 'Cappuccino',
        description: 'Espresso, lait chauffé et mousse de lait onctueuse.',
        price: 3.5,
        order: 2,
        photo: PHOTO('photo-1572442388796-11668a67e53d'),
        file: 'seed-cappuccino.jpg',
      },
      {
        name: 'Latte',
        description: 'Espresso allongé au lait, touche de vanille.',
        price: 3.8,
        order: 3,
        photo: PHOTO('photo-1461023058943-07fcbe16d735'),
        file: 'seed-latte.jpg',
      },
      {
        name: 'Flat White',
        description: 'Double espresso et micro-mousse de lait.',
        price: 3.9,
        order: 4,
        photo: PHOTO('photo-1495474472287-4d71bcdd2085'),
        file: 'seed-flat-white.jpg',
      },
    ],
  },
  {
    name: 'Boissons',
    description: 'Boissons froides et rafraîchissements.',
    order: 2,
    products: [
      {
        name: "Jus d'orange",
        description: "Jus d'orange pressé, 25 cl.",
        price: 3.2,
        order: 1,
        photo: PHOTO('photo-1600271886742-f049cd451bba'),
        file: 'seed-orange-juice.jpg',
      },
      {
        name: 'Citronnade',
        description: 'Citron frais, menthe et eau pétillante.',
        price: 3.0,
        order: 2,
        photo: PHOTO('photo-1556679343-c7306c1976bc'),
        file: 'seed-lemonade.jpg',
      },
      {
        name: 'Café glacé',
        description: 'Espresso, lait froid et glaçons.',
        price: 3.6,
        order: 3,
        photo: PHOTO('photo-1517701604599-bb29b565090c'),
        file: 'seed-iced-coffee.jpg',
      },
      {
        name: 'Smoothie fruits rouges',
        description: 'Fraise, framboise et yaourt.',
        price: 4.5,
        order: 4,
        photo: PHOTO('photo-1505252585461-04db1eb84625'),
        file: 'seed-smoothie.jpg',
      },
    ],
  },
  {
    name: 'Viennoiseries',
    description: 'Pains et pâtisseries du matin.',
    order: 3,
    products: [
      {
        name: 'Croissant',
        description: 'Croissant au beurre, feuilletage croustillant.',
        price: 2.4,
        order: 1,
        photo: PHOTO('photo-1555507036-ab1f4038808a'),
        file: 'seed-croissant.jpg',
      },
      {
        name: 'Pain au chocolat',
        description: 'Viennoiserie aux deux barres de chocolat.',
        price: 2.6,
        order: 2,
        photo: PHOTO('photo-1509440159596-0249088772ff'),
        file: 'seed-pain-chocolat.jpg',
      },
      {
        name: 'Avocado toast',
        description: 'Pain de campagne, avocat, graines et citron.',
        price: 6.5,
        order: 3,
        photo: PHOTO('photo-1482049016688-2d3e1b311543'),
        file: 'seed-avocado-toast.jpg',
      },
    ],
  },
  {
    name: 'Desserts',
    description: 'Douceurs et pâtisseries.',
    order: 4,
    products: [
      {
        name: 'Cheesecake',
        description: 'Part de cheesecake nature, coulis de fruits rouges.',
        price: 4.9,
        order: 1,
        photo: PHOTO('photo-1533134486753-c833f0ed4866'),
        file: 'seed-cheesecake.jpg',
      },
      {
        name: 'Fondant au chocolat',
        description: 'Cœur coulant, cacao 70 %.',
        price: 5.2,
        order: 2,
        available: false,
        photo: PHOTO('photo-1578985545062-69928b1d9587'),
        file: 'seed-chocolate-cake.jpg',
      },
      {
        name: 'Tiramisu',
        description: 'Mascarpone, café et cacao.',
        price: 5.0,
        order: 3,
        photo: PHOTO('photo-1571877227200-a0d98ea607e9'),
        file: 'seed-tiramisu.jpg',
      },
      {
        name: 'Macarons',
        description: 'Assortiment de 4 macarons.',
        price: 4.8,
        order: 4,
        photo: PHOTO('photo-1569864358642-9d1684040f43'),
        file: 'seed-macarons.jpg',
      },
    ],
  },
];

async function downloadPhoto(file, url) {
  await fs.mkdir(uploadsDir, { recursive: true });
  const dest = path.join(uploadsDir, file);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  await fs.writeFile(dest, Buffer.from(await response.arrayBuffer()));
  return `${env.PUBLIC_BASE_URL}/uploads/products/${file}`;
}

async function resolveImage(product) {
  try {
    const localUrl = await downloadPhoto(product.file, product.photo);
    console.log(`Photo: ${product.name} → ${product.file}`);
    return localUrl;
  } catch (error) {
    console.warn(`Photo distante pour ${product.name}: ${error.message}`);
    return product.photo;
  }
}

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

  for (const categoryData of catalog) {
    const category = await Category.create({
      cafeId: cafe._id,
      name: categoryData.name,
      description: categoryData.description,
      order: categoryData.order,
    });

    for (const product of categoryData.products) {
      await Product.create({
        cafeId: cafe._id,
        categoryId: category._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: await resolveImage(product),
        available: product.available !== false,
        order: product.order,
      });
    }
  }

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
