import bcrypt from 'bcrypt';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { prisma } from './config/prisma.js';
import { uploadProductImage } from './services/storage.service.js';

const DEMO_PASSWORD = 'adnane2004';

const PHOTO = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=900&q=80`;

const catalog = [
  {
    name: 'Cafés',
    description: 'Expressos et boissons chaudes à base de café.',
    order: 1,
    photo: PHOTO('photo-1514432324607-a09d9b4aefdd'),
    file: 'seed-category-cafes.jpg',
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
    photo: PHOTO('photo-1600271886742-f049cd451bba'),
    file: 'seed-category-boissons.jpg',
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
    photo: PHOTO('photo-1555507036-ab1f4038808a'),
    file: 'seed-category-viennoiseries.jpg',
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
    photo: PHOTO('photo-1565958011703-44f9829ba187'),
    file: 'seed-category-desserts.jpg',
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

function publicIdFromFile(file) {
  return file.replace(/\.[^.]+$/, '');
}

async function resolveImage(product) {
  try {
    const response = await fetch(product.photo);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const url = await uploadProductImage(
      { buffer: Buffer.from(await response.arrayBuffer()), mimetype: 'image/jpeg' },
      { publicId: publicIdFromFile(product.file), folder: product.folder },
    );
    console.log(`Photo: ${product.name} → ${url}`);
    return url;
  } catch (error) {
    console.warn(`Photo Cloudinary pour ${product.name}: ${error.message}`);
    return product.photo;
  }
}

async function seed() {
  await connectDatabase();

  const cafe = await prisma.cafe.upsert({
    where: { slug: 'cafe-central' },
    update: {
      name: 'Café Central',
      description: 'Café de démonstration pour le menu digital.',
      address: '12 Rue de la Paix, 75002 Paris',
      phone: '+33 1 23 45 67 89',
      latitude: 48.8689,
      longitude: 2.3312,
      isActive: true,
    },
    create: {
      name: 'Café Central',
      description: 'Café de démonstration pour le menu digital.',
      logo: '',
      address: '12 Rue de la Paix, 75002 Paris',
      phone: '+33 1 23 45 67 89',
      latitude: 48.8689,
      longitude: 2.3312,
      slug: 'cafe-central',
      isActive: true,
    },
  });

  await prisma.product.deleteMany({ where: { cafeId: cafe.id } });
  await prisma.category.deleteMany({ where: { cafeId: cafe.id } });

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      passwordHash,
      role: 'admin',
      cafeId: cafe.id,
      emailVerifiedAt: new Date(),
    },
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
      cafeId: cafe.id,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {
      name: 'Super Admin',
      passwordHash,
      role: 'superadmin',
      cafeId: null,
      emailVerifiedAt: new Date(),
    },
    create: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      passwordHash,
      role: 'superadmin',
      emailVerifiedAt: new Date(),
    },
  });

  for (const categoryData of catalog) {
    const category = await prisma.category.create({
      data: {
        cafeId: cafe.id,
        name: categoryData.name,
        description: categoryData.description,
        image: await resolveImage({
          photo: categoryData.photo,
          file: categoryData.file,
          name: categoryData.name,
          folder: 'categories',
        }),
        order: categoryData.order,
      },
    });

    for (const product of categoryData.products) {
      await prisma.product.create({
        data: {
          cafeId: cafe.id,
          categoryId: category.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: await resolveImage({ ...product, folder: 'products' }),
          available: product.available !== false,
          order: product.order,
        },
      });
    }
  }

  console.log('Seed completed.');
  console.log(`Admin: ${admin.email}`);
  console.log('Superadmin: superadmin@example.com');
  console.log(`Cafe: ${cafe.name} (${cafe.slug})`);
  console.log(`Public menu URL: /menu/${cafe.slug}`);

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
