import { loc, page } from './helpers.js';

const CTA = {
  ctaTitle: loc('Passer au menu Scanosh', 'Switch to a Scanosh menu', 'انتقل إلى قائمة Scanosh'),
  ctaBody: loc(
    'Après la lecture : créez votre espace et publiez la carte.',
    'After reading: create your workspace and publish the card.',
    'بعد القراءة: أنشئ فضاءك وانشر البطاقة.',
  ),
};

function article(config) {
  return page({
    type: 'article',
    cluster: 'blog',
    parent: '/blog',
    ...config,
    ...CTA,
  });
}

export const blogPages = [
  article({
    path: '/blog/quest-ce-quun-menu-digital',
    related: ['/menu-digital', '/blog/avantages-menu-digital'],
    title: loc('Qu’est-ce qu’un menu digital ? | Scanosh', 'What is a digital menu? | Scanosh', 'ما هي القائمة الرقمية؟ | Scanosh'),
    description: loc(
      'Définition simple d’un menu digital : carte numérique ouverte sur smartphone, souvent via QR code, modifiable sans réimpression.',
      'A simple definition of a digital menu: a numeric card opened on a smartphone, often via QR, editable without reprinting.',
      'تعريف بسيط للقائمة الرقمية: بطاقة إلكترونية على الهاتف، غالباً عبر QR، قابلة للتعديل دون إعادة طباعة.',
    ),
    h1: loc('Qu’est-ce qu’un menu digital ?', 'What is a digital menu?', 'ما هي القائمة الرقمية؟'),
    answer: loc(
      'Un menu digital est la carte d’un café ou restaurant publiée en ligne et ouverte sur le téléphone du client. Le support le plus courant est un QR code sur table. Contrairement à un PDF scanné, un vrai menu digital se met à jour depuis un dashboard.',
      'A digital menu is a cafe or restaurant card published online and opened on the guest’s phone. The most common support is a table QR. Unlike a scanned PDF, a real digital menu updates from a dashboard.',
      'القائمة الرقمية بطاقة مقهى أو مطعم منشورة على الإنترنت وتُفتح على هاتف الضيف. الأشيع رمز QR على الطاولة. بخلاف PDF ممسوح، قائمة رقمية حقيقية تُحدَّث من لوحة تحكم.',
    ),
    sections: [
      {
        h2: loc('Ce que ce n’est pas', 'What it is not', 'ما ليست عليه'),
        body: loc(
          'Un photo du menu papier n’est pas un menu digital. Un lien Instagram non plus. L’intérêt, c’est la structure (catégories, prix, disponibilité) et la mise à jour.',
          'A photo of the paper menu is not a digital menu. An Instagram link is not either. The value is structure (categories, prices, availability) and updates.',
          'صورة القائمة الورقية ليست قائمة رقمية. ولا رابط إنستغرام. القيمة في الهيكل (تصنيفات، أسعار، توفر) والتحديث.',
        ),
      },
      {
        h2: loc('Lien avec Scanosh', 'Link with Scanosh', 'الربط مع Scanosh'),
        body: loc(
          'Scanosh publie un menu public par établissement et donne au gérant les outils pour le tenir à jour. Voir la page menu digital.',
          'Scanosh publishes one public menu per venue and gives managers tools to keep it current. See the digital menu page.',
          'ينشر Scanosh قائمة عامة لكل مؤسسة ويعطي المدير أدوات تحديثها. انظر صفحة القائمة الرقمية.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Le client a-t-il besoin d’un compte ?', 'Does the guest need an account?', 'هل يحتاج الضيف حساباً؟'),
        a: loc('Non.', 'No.', 'لا.'),
      },
    ],
  }),
  article({
    path: '/blog/comment-creer-menu-qr-code',
    related: ['/menu-qr-code', '/comment-creer-menu-qr-code'],
    title: loc('Comment créer un menu QR code | Scanosh', 'How to create a QR code menu | Scanosh', 'كيف تنشئ قائمة رمز QR | Scanosh'),
    description: loc(
      'Étapes pour créer un menu QR : compte, catégories, plats, photos, génération du QR, impression, test du scan.',
      'Steps to create a QR menu: account, categories, dishes, photos, QR generation, print, scan test.',
      'خطوات إنشاء قائمة QR: حساب، تصنيفات، أطباق، صور، إنشاء الرمز، طباعة، اختبار المسح.',
    ),
    h1: loc('Comment créer un menu QR code', 'How to create a QR code menu', 'كيف تنشئ قائمة رمز QR'),
    answer: loc(
      'Créer un menu QR, ce n’est pas seulement dessiner un carré noir. Il faut une URL de menu, un contenu (plats, prix) et un dashboard pour le modifier. Scanosh enchaîne ces étapes dans le même produit.',
      'Creating a QR menu is not just drawing a black square. You need a menu URL, content (dishes, prices) and a dashboard to edit it. Scanosh chains those steps in one product.',
      'إنشاء قائمة QR ليس رسم مربع أسود فقط. تحتاج رابط قائمة ومحتوى (أطباق، أسعار) ولوحة للتعديل. Scanosh يربط هذه الخطوات في منتج واحد.',
    ),
    sections: [
      {
        h2: loc('Les étapes', 'The steps', 'الخطوات'),
        items: [
          loc('Créer un compte et votre café', 'Create an account and your cafe', 'أنشئ حساباً ومقهاك'),
          loc('Ajouter les catégories', 'Add categories', 'أضف التصنيفات'),
          loc('Saisir les plats (prix, photo, disponibilité)', 'Enter dishes (price, photo, availability)', 'أدخل الأطباق (سعر، صورة، توفر)'),
          loc('Générer le QR et l’imprimer', 'Generate the QR and print it', 'أنشئ الرمز واطبعه'),
          loc('Scanner comme un client pour vérifier', 'Scan as a guest to verify', 'امسح كضيف للتحقق'),
        ],
      },
      {
        h2: loc('Erreur fréquente', 'Common mistake', 'خطأ شائع'),
        body: loc(
          'Générer un QR vers un PDF Drive. Au premier changement de prix, le QR ment. Reliez toujours le code à une page à jour.',
          'Generating a QR to a Drive PDF. On the first price change, the QR lies. Always bind the code to a live page.',
          'إنشاء رمز نحو PDF على درايف. عند أول تغيير سعر يكذب الرمز. اربطه دائماً بصفحة حيّة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Combien de temps ?', 'How long?', 'كم من الوقت؟'),
        a: loc('Une carte simple (20 plats) se pose en une séance si les photos sont prêtes.', 'A simple card (20 dishes) can go live in one sitting if photos are ready.', 'بطاقة بسيطة (20 طبقاً) تُنشر في جلسة إن كانت الصور جاهزة.'),
      },
    ],
  }),
  article({
    path: '/comment-creer-menu-qr-code',
    type: 'commercial',
    parent: '/menu-qr-code',
    related: ['/blog/comment-creer-menu-qr-code', '/register'],
    title: loc('Créer un menu QR code avec Scanosh', 'Create a QR code menu with Scanosh', 'أنشئ قائمة رمز QR مع Scanosh'),
    description: loc(
      'Parcours Scanosh pour créer un menu QR code : inscription, carte, génération du QR, impression pour les tables.',
      'Scanosh path to a QR menu: signup, card, QR generation, print for tables.',
      'مسار Scanosh لقائمة QR: تسجيل، بطاقة، إنشاء الرمز، طباعة للطاولات.',
    ),
    h1: loc('Créer un menu QR code', 'Create a QR code menu', 'أنشئ قائمة رمز QR'),
    answer: loc(
      'Sur Scanosh : inscrivez-vous, créez le café, construisez catégories et plats, ouvrez le QR dans le dashboard, imprimez. Le même lien sert toutes les tables.',
      'On Scanosh: sign up, create the cafe, build categories and dishes, open the QR in the dashboard, print. The same link serves every table.',
      'على Scanosh: سجّل، أنشئ المقهى، ابنِ التصنيفات والأطباق، افتح الرمز في اللوحة، اطبع. نفس الرابط لكل الطاولات.',
    ),
    sections: [
      {
        h2: loc('Après le go-live', 'After go-live', 'بعد الإطلاق'),
        body: loc(
          'Testez avec plusieurs téléphones. Vérifiez le contraste du print. Formez un équipier à masquer un plat.',
          'Test on several phones. Check print contrast. Train a teammate to hide a dish.',
          'اختبر على عدة هواتف. تحقق من تباين الطباعة. درّب زميلاً على إخفاء طبق.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Compte payant obligatoire ?', 'Paid account required?', 'حساب مدفوع إلزامي؟'),
        a: loc('Vous pouvez commencer gratuitement : créer le menu et le QR depuis l’inscription.', 'You can start free: create the menu and QR from signup.', 'يمكن البدء مجاناً: أنشئ القائمة والرمز من التسجيل.'),
      },
    ],
    ...CTA,
  }),
  article({
    path: '/blog/menu-papier-vs-menu-digital',
    related: ['/qr-code-vs-menu-papier', '/menu-digital'],
    title: loc('Menu papier vs menu digital | Scanosh', 'Paper menu vs digital menu | Scanosh', 'قائمة ورقية مقابل رقمية | Scanosh'),
    description: loc(
      'Comparer menu papier et menu digital : coût de réimpression, hygiène, photos, mise à jour des prix, rôle du QR.',
      'Compare paper and digital menus: reprint cost, hygiene, photos, price updates, role of the QR.',
      'مقارنة الورقي والرقمي: تكلفة إعادة الطباعة، النظافة، الصور، تحديث الأسعار، دور QR.',
    ),
    h1: loc('Menu papier ou menu digital ?', 'Paper menu or digital menu?', 'قائمة ورقية أم رقمية؟'),
    answer: loc(
      'Le papier rassure et ne dépend pas du réseau. Le digital affiche le vrai prix, des photos, et se corrige en une minute. La plupart des salles gagnent à garder un papier secours et un QR comme source de vérité — c’est le modèle Scanosh.',
      'Paper reassures and does not depend on the network. Digital shows the real price, photos, and fixes in a minute. Most rooms win with a backup paper and a QR as source of truth — the Scanosh model.',
      'الورق يطمئن ولا يعتمد على الشبكة. الرقمي يعرض السعر الحقيقي والصور ويُصحَّح في دقيقة. معظم القاعات تربح بورق احتياطي وQR كمرجع — نموذج Scanosh.',
    ),
    sections: [
      {
        h2: loc('Quand le papier suffit', 'When paper is enough', 'متى يكفي الورق'),
        body: loc(
          'Carte figée, peu de références, clientèle qui refuse le téléphone. Même là, un QR vitrine reste utile hors salle.',
          'Frozen card, few items, guests who refuse the phone. Even then a window QR helps outside the room.',
          'بطاقة ثابتة، أصناف قليلة، ضيوف يرفضون الهاتف. حتى حينها رمز واجهة يفيد خارج القاعة.',
        ),
      },
      {
        h2: loc('Quand le digital s’impose', 'When digital wins', 'متى يفرض الرقمي نفسه'),
        body: loc(
          'Prix volatils, beaucoup de photos, ruptures fréquentes, plusieurs langues d’interface pour l’équipe.',
          'Volatile prices, many photos, frequent 86s, several UI languages for the team.',
          'أسعار متقلبة، صور كثيرة، نفاد متكرر، عدة لغات واجهة للفريق.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Faut-il jeter tout le papier ?', 'Should we throw all paper away?', 'هل نرمي كل الورق؟'),
        a: loc('Non. Gardez un secours. Le QR devient le canal principal.', 'No. Keep a backup. The QR becomes the main channel.', 'لا. أبقِ احتياطاً. يصبح QR القناة الرئيسية.'),
      },
    ],
  }),
  article({
    path: '/qr-code-vs-menu-papier',
    type: 'commercial',
    parent: '/menu-qr-code',
    related: ['/blog/menu-papier-vs-menu-digital', '/menu-qr-code'],
    title: loc('QR code vs menu papier | Scanosh', 'QR code vs paper menu | Scanosh', 'رمز QR مقابل القائمة الورقية | Scanosh'),
    description: loc(
      'QR code ou menu papier : hygiène, coût, fraîcheur des prix. Scanosh fait du QR la carte à jour, le papier un secours.',
      'QR code or paper menu: hygiene, cost, price freshness. Scanosh makes the QR the live card, paper a backup.',
      'رمز QR أو قائمة ورقية: نظافة، تكلفة، حداثة الأسعار. Scanosh يجعل الرمز البطاقة الحيّة والورق احتياطاً.',
    ),
    h1: loc('QR code vs menu papier', 'QR code vs paper menu', 'رمز QR مقابل القائمة الورقية'),
    answer: loc(
      'Le QR code ouvre une carte vivante. Le papier est un cliché. Les deux peuvent coexister : Scanosh ne force pas à interdire le papier, il évite d’en dépendre pour les prix.',
      'The QR opens a live card. Paper is a snapshot. Both can coexist: Scanosh does not ban paper; it stops you depending on it for prices.',
      'رمز QR يفتح بطاقة حيّة. الورق لقطة. يمكن أن يتعايشا: Scanosh لا يمنع الورق، يمنع الاعتماد عليه للأسعار.',
    ),
    sections: [
      {
        h2: loc('Coût caché du papier', 'Hidden cost of paper', 'تكلفة الورق الخفية'),
        body: loc(
          'Design, impression, plastification, réassort, temps serveur à expliquer les 86. Le QR amortit ça dès les premières mises à jour.',
          'Design, print, lamination, restock, staff time explaining 86s. The QR pays back from the first updates.',
          'تصميم، طباعة، تغليف، تجديد، وقت النادل لشرح النفاد. الرمز يُسترد من أول التحديثات.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Et si le réseau tombe ?', 'What if the network drops?', 'ماذا إن سقطت الشبكة؟'),
        a: loc('Gardez un papier secours. Le digital n’élimine pas tout risque réseau.', 'Keep backup paper. Digital does not remove all network risk.', 'أبقِ ورقاً احتياطاً. الرقمي لا يلغي كل خطر شبكة.'),
      },
    ],
  }),
  article({
    path: '/blog/digitaliser-restaurant',
    related: ['/menu-digital-restaurant', '/dashboard-restaurant'],
    title: loc('Comment digitaliser un restaurant | Scanosh', 'How to digitise a restaurant | Scanosh', 'كيف ترقمن مطعماً | Scanosh'),
    description: loc(
      'Digitaliser un restaurant sans tout chambouler : menu QR, dashboard, photos, formation courte de l’équipe.',
      'Digitise a restaurant without upheaval: QR menu, dashboard, photos, short staff training.',
      'رقمنة مطعم دون قلب كل شيء: قائمة QR، لوحة، صور، تدريب قصير للفريق.',
    ),
    h1: loc('Comment digitaliser un restaurant', 'How to digitise a restaurant', 'كيف ترقمن مطعماً'),
    answer: loc(
      'Digitaliser le menu est le levier le plus simple : pas de caisse à changer, pas d’app client. Scanosh se greffe sur le service existant. On commence par la carte, pas par un écosystème POS complet.',
      'Digitising the menu is the simplest lever: no till swap, no guest app. Scanosh grafts onto existing service. Start with the card, not a full POS ecosystem.',
      'رقمنة القائمة أبسط رافعة: بلا تغيير صندوق ولا تطبيق ضيف. Scanosh يُزرع على الخدمة القائمة. ابدأ بالبطاقة لا بمنظومة POS كاملة.',
    ),
    sections: [
      {
        h2: loc('Plan en une semaine', 'One-week plan', 'خطة أسبوع'),
        items: [
          loc('J1 : compte + identité (logo, adresse)', 'D1: account + identity (logo, address)', 'ي1: حساب + هوية'),
          loc('J2–J3 : catégories et plats', 'D2–D3: categories and dishes', 'ي2–ي3: تصنيفات وأطباق'),
          loc('J4 : photos essentielles', 'D4: essential photos', 'ي4: صور أساسية'),
          loc('J5 : QR test en salle', 'D5: QR test on the floor', 'ي5: اختبار QR في القاعة'),
          loc('J6–J7 : former deux personnes à masquer un plat', 'D6–D7: train two people to hide a dish', 'ي6–ي7: تدريب شخصين على إخفاء طبق'),
        ],
      },
    ],
    faq: [
      {
        q: loc('Faut-il changer de caisse ?', 'Do we need a new till?', 'هل نغيّر الصندوق؟'),
        a: loc('Non pour le menu QR Scanosh. La caisse reste la vôtre.', 'Not for the Scanosh QR menu. The till stays yours.', 'لا لقائمة Scanosh. الصندوق يبقى لكم.'),
      },
    ],
  }),
  article({
    path: '/blog/menu-qr-code-restaurant',
    related: ['/qr-code-restaurant', '/menu-digital-restaurant'],
    title: loc('Menu QR code pour restaurant | Scanosh', 'QR code menu for restaurants | Scanosh', 'قائمة رمز QR للمطعم | Scanosh'),
    description: loc(
      'Mettre un menu QR en restaurant : attentes des clients, placement, lien avec le dashboard Scanosh.',
      'Putting a QR menu in a restaurant: guest expectations, placement, link to the Scanosh dashboard.',
      'وضع قائمة QR في مطعم: توقعات الضيوف، الموضع، الربط بلوحة Scanosh.',
    ),
    h1: loc('Menu QR code pour restaurant', 'QR code menu for restaurants', 'قائمة رمز QR للمطعم'),
    answer: loc(
      'Les clients savent scanner. Le frein, c’est un QR vers une image floue. Un menu restaurant Scanosh structure catégories et photos comme une vraie carte.',
      'Guests know how to scan. The blocker is a QR to a blurry image. A Scanosh restaurant menu structures categories and photos like a real card.',
      'الضيوف يعرفون المسح. العائق رمز نحو صورة ضبابية. قائمة مطعم Scanosh تنظّم التصنيفات والصور كبطاقة حقيقية.',
    ),
    sections: [
      {
        h2: loc('Service', 'Service', 'الخدمة'),
        body: loc(
          'Le serveur reste là pour conseiller. Le QR enlève la tâche mécanique (lire les prix) pas l’hospitalité.',
          'Staff still advise. The QR removes the mechanical task (reading prices), not hospitality.',
          'النادل ما زال ينصح. الرمز يزيل المهمة الآلية (قراءة الأسعار) لا الضيافة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Et les seniors ?', 'What about seniors?', 'ماذا عن كبار السن؟'),
        a: loc('Proposez le papier au moment de l’accueil. Le QR n’est pas une obligation morale.', 'Offer paper at greeting. The QR is not a moral duty.', 'اعرض الورق عند الاستقبال. الرمز ليس واجباً أخلاقياً.'),
      },
    ],
  }),
  article({
    path: '/blog/menu-digital-cafe',
    related: ['/menu-digital-cafe', '/qr-code-cafe'],
    title: loc('Menu digital pour café | Scanosh', 'Digital menu for cafes | Scanosh', 'قائمة رقمية للمقهى | Scanosh'),
    description: loc(
      'Pourquoi un café gagne à passer au menu digital : file, extras, gâteau du jour, QR comptoir.',
      'Why a cafe wins with a digital menu: queue, extras, cake of the day, counter QR.',
      'لماذا يربح المقهى بالقائمة الرقمية: طابور، إضافات، كعكة اليوم، QR المنضدة.',
    ),
    h1: loc('Menu digital pour café', 'Digital menu for cafes', 'قائمة رقمية للمقهى'),
    answer: loc(
      'La carte d’un café est courte et change. C’est exactement le cas où réimprimer est absurde. Scanosh permet un QR stable et une vitrine sucrée à jour.',
      'A cafe card is short and changes. That is exactly when reprinting is absurd. Scanosh gives a stable QR and a current pastry window.',
      'بطاقة المقهى قصيرة وتتغيّر. هنا إعادة الطباعة عبث. Scanosh يعطي رمزاً ثابتاً وواجهة حلويات محدّثة.',
    ),
    sections: [
      {
        h2: loc('Extras', 'Extras', 'إضافات'),
        body: loc(
          'Sirop, oat milk, extra shot : décrivez-les. Le client choisit avant de parler, la file respire.',
          'Syrup, oat milk, extra shot: describe them. Guests choose before they speak; the line breathes.',
          'شراب، حليب شوفان، شوت إضافي: صِفها. يختار الضيف قبل الكلام؛ يتنفس الطابور.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Assez pour un coffee shop ?', 'Enough for a coffee shop?', 'يكفي لكوفي شوب؟'),
        a: loc('Oui, surtout si vous avez 30+ SKU boissons + food.', 'Yes, especially with 30+ drink and food SKUs.', 'نعم، خصوصاً مع أكثر من 30 صنفاً مشروبات وطعام.'),
      },
    ],
  }),
  article({
    path: '/blog/menu-digital-snack',
    related: ['/menu-digital-snack', '/qr-code-snack'],
    title: loc('Menu digital pour snack | Scanosh', 'Digital menu for snacks | Scanosh', 'قائمة رقمية للوجبات السريعة | Scanosh'),
    description: loc(
      'Menu digital snack : combos, rush, prix lisibles. Comment Scanosh accélère la file sans application client.',
      'Snack digital menu: combos, rush, readable prices. How Scanosh speeds the line with no guest app.',
      'قائمة وجبات سريعة رقمية: قوائم، ذروة، أسعار واضحة. كيف يسرّع Scanosh الطابور بلا تطبيق ضيف.',
    ),
    h1: loc('Menu digital pour snack', 'Digital menu for snacks', 'قائمة رقمية للوجبات السريعة'),
    answer: loc(
      'Le snack vit au chronomètre. Un menu digital Scanosh affiche combos et prix pendant l’attente. Moins de « c’est combien le mixte ? » au comptoir.',
      'A snack bar lives on the clock. A Scanosh digital menu shows combos and prices while guests wait. Fewer “how much is the mixte?” at the counter.',
      'الوجبات السريعة تعيش على الساعة. قائمة Scanosh تعرض القوائم والأسعار أثناء الانتظار. أقل «بكم الميكس؟» على المنضدة.',
    ),
    sections: [
      {
        h2: loc('Combos', 'Combos', 'القوائم'),
        body: loc(
          'Créez une fiche « Menu midi » avec le prix pack, plutôt qu’obliger le client à additionner.',
          'Create a “Lunch menu” sheet with the pack price, instead of forcing guests to add it up.',
          'أنشئ بطاقة «منيو الغداء» بسعر الحزمة بدل إجبار الضيف على الجمع.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Sans tables ?', 'No tables?', 'بلا طاولات؟'),
        a: loc('QR vitrine + comptoir. Suffisant pour le take-away.', 'Window + counter QR. Enough for take-away.', 'QR واجهة + منضدة. يكفي للسفري.'),
      },
    ],
  }),
  article({
    path: '/blog/prix-menu-digital',
    related: ['/tarifs', '/gestion-prix'],
    title: loc('Prix d’un menu digital | Scanosh', 'Cost of a digital menu | Scanosh', 'سعر القائمة الرقمية | Scanosh'),
    description: loc(
      'Combien coûte un menu digital ? Imprimerie évitée, temps gérant, essai gratuit Scanosh pour démarrer.',
      'What does a digital menu cost? Avoided print, manager time, free Scanosh start.',
      'كم تكلف القائمة الرقمية؟ طباعة مُتجنَّبة، وقت المدير، بداية مجانية مع Scanosh.',
    ),
    h1: loc('Combien coûte un menu digital ?', 'How much does a digital menu cost?', 'كم تكلف القائمة الرقمية؟'),
    answer: loc(
      'Le vrai coût d’un menu papier, c’est la réimpression. Un menu digital Scanosh se crée depuis l’inscription, sans frais de plaque à chaque changement de prix. Comparez à vos factures imprimeur sur 12 mois.',
      'The real cost of paper is reprinting. A Scanosh digital menu is created from signup, with no plate fee on every price change. Compare to a year of printer invoices.',
      'التكلفة الحقيقية للورق هي إعادة الطباعة. قائمة Scanosh تُنشأ من التسجيل بلا تكلفة لوحة عند كل تغيير سعر. قارن بفواتير المطبعة لـ 12 شهراً.',
    ),
    sections: [
      {
        h2: loc('Démarrer', 'Getting started', 'البدء'),
        body: loc(
          'Créez le menu gratuitement, générez le QR, mesurez le temps gagné. La page tarifs Scanosh décrit l’offre actuelle.',
          'Create the menu free, generate the QR, measure time saved. The Scanosh pricing page describes the current offer.',
          'أنشئ القائمة مجاناً، ولّد الرمز، قِس الوقت الموفَّر. صفحة أسعار Scanosh تصف العرض الحالي.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Y a-t-il un engagement ?', 'Is there a lock-in?', 'هل هناك التزام؟'),
        a: loc('Vous commencez sans carte bancaire obligatoire pour tester le flux complet.', 'You start without a mandatory card to test the full flow.', 'تبدأ بلا بطاقة إلزامية لاختبار المسار كاملاً.'),
      },
    ],
  }),
  article({
    path: '/blog/comment-fonctionne-qr-code-restaurant',
    related: ['/menu-qr-code', '/qr-code-table'],
    title: loc('Comment fonctionne un QR code restaurant | Scanosh', 'How a restaurant QR code works | Scanosh', 'كيف يعمل رمز QR في المطعم | Scanosh'),
    description: loc(
      'Principe d’un QR restaurant : URL encodée, appareil photo, navigateur, menu. Pourquoi le code ne change pas à chaque plat.',
      'How a restaurant QR works: encoded URL, camera, browser, menu. Why the code does not change with every dish.',
      'مبدأ رمز المطعم: رابط مرمّز، كاميرا، متصفح، قائمة. لماذا لا يتغيّر الرمز مع كل طبق.',
    ),
    h1: loc('Comment fonctionne un QR code restaurant', 'How a restaurant QR code works', 'كيف يعمل رمز QR في المطعم'),
    answer: loc(
      'Un QR code stocke une adresse web. L’appareil photo l’ouvre dans le navigateur. Si l’adresse est celle du menu Scanosh, le client voit la carte actuelle. Le dessin du QR ne contient pas les prix : il contient le lien.',
      'A QR code stores a web address. The camera opens it in the browser. If the address is the Scanosh menu, guests see the current card. The QR artwork does not hold prices: it holds the link.',
      'رمز QR يخزّن عنوان ويب. الكاميرا تفتحه في المتصفح. إن كان العنوان قائمة Scanosh يرى الضيف البطاقة الحالية. رسم الرمز لا يحمل الأسعار: يحمل الرابط.',
    ),
    sections: [
      {
        h2: loc('Pas d’application', 'No app', 'بلا تطبيق'),
        body: loc(
          'iOS et Android décodent le QR nativement. Demander une app réduit le taux de scan.',
          'iOS and Android decode QR natively. Asking for an app lowers scan rate.',
          'iOS وأندرويد يفكّان الرمز أصلاً. طلب تطبيق يقلّل نسبة المسح.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Le QR « expire »-t-il ?', 'Does the QR “expire”?', 'هل «تنتهي» صلاحية الرمز؟'),
        a: loc('Non, tant que l’URL du café Scanosh existe. Un changement de slug est un choix volontaire.', 'No, as long as the Scanosh cafe URL exists. A slug change is a deliberate choice.', 'لا، ما دام رابط مقهى Scanosh موجوداً. تغيير المعرّف قرار واعٍ.'),
      },
    ],
  }),
  article({
    path: '/blog/avantages-menu-digital',
    related: ['/menu-digital', '/blog/menu-papier-vs-menu-digital'],
    title: loc('Avantages du menu digital | Scanosh', 'Benefits of a digital menu | Scanosh', 'مزايا القائمة الرقمية | Scanosh'),
    description: loc(
      'Avantages d’un menu digital : mise à jour, photos, hygiène, moins de réimpressions, dashboard gérant. Limites à connaître.',
      'Benefits of a digital menu: updates, photos, hygiene, fewer reprints, manager dashboard. Limits to know.',
      'مزايا القائمة الرقمية: تحديث، صور، نظافة، أقل إعادة طباعة، لوحة مدير. حدود يجب معرفتها.',
    ),
    h1: loc('Avantages du menu digital', 'Benefits of a digital menu', 'مزايا القائمة الرقمية'),
    answer: loc(
      'Les avantages concrets : prix justes, photos, ruptures visibles, moins de papier, même QR. Les limites : réseau, certains clients. Scanosh assume les deux en laissant le papier en secours.',
      'Concrete benefits: fair prices, photos, visible 86s, less paper, same QR. Limits: network, some guests. Scanosh accepts both by leaving paper as backup.',
      'مزايا ملموسة: أسعار عادلة، صور، نفاد ظاهر، أقل ورق، نفس QR. حدود: شبكة، بعض الضيوف. Scanosh يقبل الاثنين بإبقاء الورق احتياطاً.',
    ),
    sections: [
      {
        h2: loc('Liste', 'List', 'قائمة'),
        items: [
          loc('Moins de réimpressions', 'Fewer reprints', 'أقل إعادة طباعة'),
          loc('Carte toujours alignée sur le stock', 'Card always aligned with stock', 'بطاقة دائماً موازية للمخزون'),
          loc('Mise en avant visuelle des plats', 'Visual highlighting of dishes', 'إبراز بصري للأطباق'),
          loc('Moins de contact sur des cartes usées', 'Less contact on worn cards', 'أقل لمس لبطاقات بالية'),
        ],
      },
    ],
    faq: [
      {
        q: loc('Inconvénient principal ?', 'Main drawback?', 'العيب الرئيسي؟'),
        a: loc('Dépendance au réseau du client. Mitigez avec wifi salle et papier secours.', 'Dependence on guest network. Mitigate with room Wi‑Fi and backup paper.', 'الاعتماد على شبكة الضيف. خفّف بواي فاي القاعة وورق احتياطي.'),
      },
    ],
  }),
];
