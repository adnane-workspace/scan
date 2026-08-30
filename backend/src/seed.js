import bcrypt from 'bcrypt';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { prisma } from './config/prisma.js';
import { uploadProductImage } from './services/storage.service.js';

const DEMO_PASSWORD = 'adnane2004';

const PHOTO = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=900&q=80`;

/**
 * Menu démo café + restaurant (prix en DH).
 * Sert de modèle pour l’essai et le bouton « Remplir avec le menu démo ».
 */
const catalog = [
  {
    name: 'Boissons chaudes',
    description: 'Cafés, thés et chocolats.',
    order: 1,
    photo: PHOTO('photo-1495474472287-4d71bcdd2085'),
    file: 'seed-cat-boissons-chaudes.jpg',
    products: [
      {
        name: 'Espresso',
        description: 'Café serré, torréfaction maison.',
        price: 18,
        order: 1,
        photo: PHOTO('photo-1514432324607-a09d9b4aefdd'),
        file: 'seed-espresso.jpg',
      },
      {
        name: 'Americano',
        description: 'Espresso allongé à l’eau chaude.',
        price: 22,
        order: 2,
        photo: PHOTO('photo-1511920170033-f8396924c348'),
        file: 'seed-americano.jpg',
      },
      {
        name: 'Cappuccino',
        description: 'Espresso, lait chauffé et mousse onctueuse.',
        price: 28,
        order: 3,
        photo: PHOTO('photo-1572442388796-11668a67e53d'),
        file: 'seed-cappuccino.jpg',
      },
      {
        name: 'Latte',
        description: 'Espresso, lait velouté, touche de vanille.',
        price: 32,
        order: 4,
        photo: PHOTO('photo-1461023058943-07fcbe16d735'),
        file: 'seed-latte.jpg',
      },
      {
        name: 'Flat White',
        description: 'Double espresso et micro-mousse de lait.',
        price: 34,
        order: 5,
        photo: PHOTO('photo-1495474472287-4d71bcdd2085'),
        file: 'seed-flat-white.jpg',
      },
      {
        name: 'Thé à la menthe',
        description: 'Thé vert, menthe fraîche, service traditionnel.',
        price: 20,
        order: 6,
        photo: PHOTO('photo-1576092768241-dec231879fc3'),
        file: 'seed-the-menthe.jpg',
      },
      {
        name: 'Chocolat chaud',
        description: 'Cacao belge, lait chaud, chantilly optionnelle.',
        price: 30,
        order: 7,
        photo: PHOTO('photo-1542990253-0d0f5be5f0ed'),
        file: 'seed-chocolat.jpg',
      },
    ],
  },
  {
    name: 'Boissons froides',
    description: 'Jus, smoothies et rafraîchissements.',
    order: 2,
    photo: PHOTO('photo-1600271886742-f049cd451bba'),
    file: 'seed-cat-boissons-froides.jpg',
    products: [
      {
        name: 'Jus d’orange pressé',
        description: 'Orange fraîche, 25 cl.',
        price: 28,
        order: 1,
        photo: PHOTO('photo-1600271886742-f049cd451bba'),
        file: 'seed-jus-orange.jpg',
      },
      {
        name: 'Citronnade maison',
        description: 'Citron, menthe, eau pétillante.',
        price: 25,
        order: 2,
        photo: PHOTO('photo-1556679343-c7306c1976bc'),
        file: 'seed-citronnade.jpg',
      },
      {
        name: 'Café glacé',
        description: 'Espresso, lait froid, glaçons.',
        price: 32,
        order: 3,
        photo: PHOTO('photo-1517701604599-bb29b565090c'),
        file: 'seed-iced-coffee.jpg',
      },
      {
        name: 'Smoothie fruits rouges',
        description: 'Fraise, framboise, yaourt.',
        price: 38,
        order: 4,
        photo: PHOTO('photo-1505252585461-04db1eb84625'),
        file: 'seed-smoothie.jpg',
      },
      {
        name: 'Virgin Mojito',
        description: 'Menthe, citron vert, eau gazeuse, sucre de canne.',
        price: 35,
        order: 5,
        photo: PHOTO('photo-1513558161293-cdaf765ed2fd'),
        file: 'seed-mojito.jpg',
      },
      {
        name: 'Eau minérale',
        description: '50 cl, plate ou gazeuse.',
        price: 12,
        order: 6,
        photo: PHOTO('photo-1548839140-29a749e1cf4d'),
        file: 'seed-eau.jpg',
      },
    ],
  },
  {
    name: 'Petit-déjeuner & Brunch',
    description: 'Du matin jusqu’à 14h.',
    order: 3,
    photo: PHOTO('photo-1533089860892-a7c6f0a88666'),
    file: 'seed-cat-brunch.jpg',
    products: [
      {
        name: 'Petit-déj beldi',
        description: 'Œufs à l’huile d’olive, amlou, miel, olives, pain tafarnout.',
        price: 55,
        order: 1,
        photo: PHOTO('photo-1525351484163-7529414344d8'),
        file: 'seed-dej-beldi.jpg',
      },
      {
        name: 'Avocado toast',
        description: 'Pain de campagne, avocat, œuf poché, graines.',
        price: 58,
        order: 2,
        photo: PHOTO('photo-1482049016688-2d3e1b311543'),
        file: 'seed-avocado-toast.jpg',
      },
      {
        name: 'Omelette fromage',
        description: '3 œufs, fromage, salade et frites.',
        price: 45,
        order: 3,
        photo: PHOTO('photo-1525351484163-7529414344d8'),
        file: 'seed-omelette.jpg',
      },
      {
        name: 'Pancakes fruits',
        description: '3 pancakes, fruits de saison, sirop d’érable.',
        price: 48,
        order: 4,
        photo: PHOTO('photo-1567620905732-2d1ec7ab7445'),
        file: 'seed-pancakes.jpg',
      },
      {
        name: 'Formule café + croissant',
        description: 'Café au choix (espresso / allongé) et croissant beurre.',
        price: 35,
        order: 5,
        photo: PHOTO('photo-1555507036-ab1f4038808a'),
        file: 'seed-formule-cafe.jpg',
      },
    ],
  },
  {
    name: 'Viennoiseries & Snacks',
    description: 'À emporter ou sur place.',
    order: 4,
    photo: PHOTO('photo-1555507036-ab1f4038808a'),
    file: 'seed-cat-viennoiseries.jpg',
    products: [
      {
        name: 'Croissant beurre',
        description: 'Feuilletage croustillant.',
        price: 12,
        order: 1,
        photo: PHOTO('photo-1555507036-ab1f4038808a'),
        file: 'seed-croissant.jpg',
      },
      {
        name: 'Pain au chocolat',
        description: 'Deux barres de chocolat.',
        price: 14,
        order: 2,
        photo: PHOTO('photo-1509440159596-0249088772ff'),
        file: 'seed-pain-chocolat.jpg',
      },
      {
        name: 'Muffin myrtille',
        description: 'Fait maison, myrtilles fraîches.',
        price: 18,
        order: 3,
        photo: PHOTO('photo-1607958996333-41aef7caefaa'),
        file: 'seed-muffin.jpg',
      },
      {
        name: 'Cookies chocolat',
        description: '2 pièces, chocolat noir.',
        price: 16,
        order: 4,
        photo: PHOTO('photo-1558961363-fa8fdf82db35'),
        file: 'seed-cookies.jpg',
      },
      {
        name: 'Club sandwich',
        description: 'Poulet, tomate, salade, œuf, frites.',
        price: 55,
        order: 5,
        photo: PHOTO('photo-1528735602780-2552fd46c7af'),
        file: 'seed-club.jpg',
      },
    ],
  },
  {
    name: 'Entrées & Salades',
    description: 'Pour démarrer le repas.',
    order: 5,
    photo: PHOTO('photo-1512621776951-a57141f2eefd'),
    file: 'seed-cat-entrees.jpg',
    products: [
      {
        name: 'Salade César',
        description: 'Poulet grillé, croûtons, parmesan, sauce César.',
        price: 65,
        order: 1,
        photo: PHOTO('photo-1546793665-c74683f339c1'),
        file: 'seed-cesar.jpg',
      },
      {
        name: 'Salade niçoise',
        description: 'Thon, œuf, olives, tomates, haricots verts.',
        price: 68,
        order: 2,
        photo: PHOTO('photo-1512621776951-a57141f2eefd'),
        file: 'seed-nicoise.jpg',
      },
      {
        name: 'Briouates au fromage',
        description: '6 pièces, miel et sésame.',
        price: 42,
        order: 3,
        photo: PHOTO('photo-1601050690597-df0568f70950'),
        file: 'seed-briouates.jpg',
      },
      {
        name: 'Soupe du jour',
        description: 'Selon le marché, servie avec pain.',
        price: 35,
        order: 4,
        photo: PHOTO('photo-1547592166-23ac45744acd'),
        file: 'seed-soupe.jpg',
      },
    ],
  },
  {
    name: 'Burgers & Sandwichs',
    description: 'Pain brioché, frites maison.',
    order: 6,
    photo: PHOTO('photo-1568901346375-23c9450c58cd'),
    file: 'seed-cat-burgers.jpg',
    products: [
      {
        name: 'Cheese burger',
        description: 'Steak 150 g, cheddar, oignons, sauce maison, frites.',
        price: 75,
        order: 1,
        photo: PHOTO('photo-1568901346375-23c9450c58cd'),
        file: 'seed-cheese-burger.jpg',
      },
      {
        name: 'Chicken crispy',
        description: 'Poulet pané, coleslaw, sauce spicy, frites.',
        price: 72,
        order: 2,
        photo: PHOTO('photo-1606755962773-d324e0a13086'),
        file: 'seed-chicken-burger.jpg',
      },
      {
        name: 'Burger végétarien',
        description: 'Galette de légumes, avocat, tomate, sauce yaourt.',
        price: 68,
        order: 3,
        photo: PHOTO('photo-1520072959219-c595dc870360'),
        file: 'seed-veggie-burger.jpg',
      },
      {
        name: 'Panini poulet',
        description: 'Poulet, mozzarella, pesto, grillé.',
        price: 48,
        order: 4,
        photo: PHOTO('photo-1509722747041-616f39b57569'),
        file: 'seed-panini.jpg',
      },
    ],
  },
  {
    name: 'Pizzas',
    description: 'Pâte maison, four à haute température.',
    order: 7,
    photo: PHOTO('photo-1513104890138-7c749659a591'),
    file: 'seed-cat-pizzas.jpg',
    products: [
      {
        name: 'Margherita',
        description: 'Tomate, mozzarella, basilic, huile d’olive.',
        price: 65,
        order: 1,
        photo: PHOTO('photo-1604382354936-07c5d9983bd3'),
        file: 'seed-margherita.jpg',
      },
      {
        name: 'Reine',
        description: 'Jambon de dinde, champignons, mozzarella.',
        price: 78,
        order: 2,
        photo: PHOTO('photo-1565299624946-b28f40a0ae38'),
        file: 'seed-reine.jpg',
      },
      {
        name: 'Quatre fromages',
        description: 'Mozzarella, chèvre, emmental, bleu.',
        price: 85,
        order: 3,
        photo: PHOTO('photo-1513104890138-7c749659a591'),
        file: 'seed-4fromages.jpg',
      },
      {
        name: 'Pizza végétarienne',
        description: 'Légumes grillés, olives, mozzarella.',
        price: 72,
        order: 4,
        photo: PHOTO('photo-1594007654729-407eedc4be65'),
        file: 'seed-pizza-veggie.jpg',
      },
    ],
  },
  {
    name: 'Plats du restaurant',
    description: 'Cuisine du jour et classiques.',
    order: 8,
    photo: PHOTO('photo-1546069901-ba9599a7e63c'),
    file: 'seed-cat-plats.jpg',
    products: [
      {
        name: 'Tagine poulet citron',
        description: 'Poulet, olives, citrons confits, semoule.',
        price: 95,
        order: 1,
        photo: PHOTO('photo-1585937421612-70a008356fbe'),
        file: 'seed-tagine.jpg',
      },
      {
        name: 'Couscous royal',
        description: 'Vendredi. Sept légumes, bœuf et merguez.',
        price: 110,
        order: 2,
        photo: PHOTO('photo-1512621776951-a57141f2eefd'),
        file: 'seed-couscous.jpg',
      },
      {
        name: 'Pavé de saumon',
        description: 'Saumon grillé, riz, légumes de saison.',
        price: 120,
        order: 3,
        photo: PHOTO('photo-1467003909585-2f8a72700288'),
        file: 'seed-saumon.jpg',
      },
      {
        name: 'Entrecôte grillée',
        description: '300 g, frites, sauce au poivre.',
        price: 145,
        order: 4,
        photo: PHOTO('photo-1544025162-d76694265947'),
        file: 'seed-entrecote.jpg',
      },
      {
        name: 'Pâtes carbonara',
        description: 'Crème, lardons de dinde, parmesan.',
        price: 72,
        order: 5,
        photo: PHOTO('photo-1621996346565-e3dbc646d9a9'),
        file: 'seed-carbonara.jpg',
      },
      {
        name: 'Risotto champignons',
        description: 'Riz arborio, champignons, parmesan.',
        price: 78,
        order: 6,
        available: false,
        photo: PHOTO('photo-1476124369491-e7addf5db371'),
        file: 'seed-risotto.jpg',
      },
    ],
  },
  {
    name: 'Desserts',
    description: 'Douceurs maison.',
    order: 9,
    photo: PHOTO('photo-1565958011703-44f9829ba187'),
    file: 'seed-cat-desserts.jpg',
    products: [
      {
        name: 'Cheesecake fruits rouges',
        description: 'Base biscuit, coulis de framboise.',
        price: 42,
        order: 1,
        photo: PHOTO('photo-1533134486753-c833f0ed4866'),
        file: 'seed-cheesecake.jpg',
      },
      {
        name: 'Tiramisu',
        description: 'Mascarpone, café, cacao.',
        price: 40,
        order: 2,
        photo: PHOTO('photo-1571877227200-a0d98ea607e9'),
        file: 'seed-tiramisu.jpg',
      },
      {
        name: 'Fondant au chocolat',
        description: 'Cœur coulant, glace vanille.',
        price: 45,
        order: 3,
        photo: PHOTO('photo-1578985545062-69928b1d9587'),
        file: 'seed-fondant.jpg',
      },
      {
        name: 'Mousse au chocolat',
        description: 'Chocolat 70 %, croquant cacao.',
        price: 35,
        order: 4,
        photo: PHOTO('photo-1606313564200-e75d5e30476c'),
        file: 'seed-mousse.jpg',
      },
      {
        name: 'Assortiment macarons',
        description: '4 pièces, parfums du jour.',
        price: 38,
        order: 5,
        photo: PHOTO('photo-1569864358642-9d1684040f43'),
        file: 'seed-macarons.jpg',
      },
    ],
  },
];

function publicIdFromFile(file) {
  return file.replace(/\.[^.]+$/, '');
}

async function resolveImage(item) {
  try {
    const response = await fetch(item.photo);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const url = await uploadProductImage(
      { buffer: Buffer.from(await response.arrayBuffer()), mimetype: 'image/jpeg' },
      { publicId: publicIdFromFile(item.file), folder: item.folder },
    );
    console.log(`Photo: ${item.name} → ${url}`);
    return url;
  } catch (error) {
    console.warn(`Photo ${item.name}: ${error.message} (URL directe)`);
    return item.photo;
  }
}

async function seed() {
  await connectDatabase();

  const cafe = await prisma.cafe.upsert({
    where: { slug: 'restaurant-modele' },
    update: {
      name: 'Café & Restaurant Modèle',
      description:
        'Menu démo Scanosh : café, brunch, burgers, pizzas, plats marocains et desserts. Idéal pour présenter le produit.',
      address: 'Boulevard Anfa, Casablanca',
      phone: '+212 522 00 00 00',
      latitude: 33.5883,
      longitude: -7.6324,
      menuUi: {
        theme: 'light',
        showPhone: true,
        showAddress: true,
        bgMode: 'default',
      },
      trialRole: 'template',
      isActive: true,
    },
    create: {
      name: 'Café & Restaurant Modèle',
      description:
        'Menu démo Scanosh : café, brunch, burgers, pizzas, plats marocains et desserts. Idéal pour présenter le produit.',
      logo: '',
      address: 'Boulevard Anfa, Casablanca',
      phone: '+212 522 00 00 00',
      latitude: 33.5883,
      longitude: -7.6324,
      slug: 'restaurant-modele',
      menuUi: {
        theme: 'light',
        showPhone: true,
        showAddress: true,
        bgMode: 'default',
      },
      trialRole: 'template',
      isActive: true,
    },
  });

  await prisma.product.deleteMany({ where: { cafeId: cafe.id } });
  await prisma.category.updateMany({ where: { cafeId: cafe.id }, data: { parentId: null } });
  await prisma.category.deleteMany({ where: { cafeId: cafe.id } });

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Gérant Démo',
      passwordHash,
      role: 'admin',
      cafeId: cafe.id,
      emailVerifiedAt: new Date(),
    },
    create: {
      name: 'Gérant Démo',
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

  let productCount = 0;

  for (const cat of catalog) {
    const category = await prisma.category.create({
      data: {
        cafeId: cafe.id,
        name: cat.name,
        description: cat.description,
        image: await resolveImage({
          photo: cat.photo,
          file: cat.file,
          name: cat.name,
          folder: 'categories',
        }),
        order: cat.order,
      },
    });

    for (const prod of cat.products) {
      await prisma.product.create({
        data: {
          cafeId: cafe.id,
          categoryId: category.id,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          image: await resolveImage({ ...prod, folder: 'products' }),
          available: prod.available !== false,
          order: prod.order,
        },
      });
      productCount += 1;
    }
  }

  console.log('\nSeed terminé.');
  console.log(`Café modèle : ${cafe.name} (/${cafe.slug}) · rôle template`);
  console.log(`${catalog.length} catégories · ${productCount} produits`);
  console.log(`Admin : admin@example.com / ${DEMO_PASSWORD}`);
  console.log(`Superadmin : superadmin@example.com / ${DEMO_PASSWORD}`);
  console.log(`Menu public : http://localhost:5173/menu/${cafe.slug}`);

  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
