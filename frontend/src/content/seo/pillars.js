import { loc, page } from './helpers.js';

const CTA = {
  ctaTitle: loc('Créer mon menu avec Scanosh', 'Create my menu with Scanosh', 'أنشئ قائمتك مع Scanosh'),
  ctaBody: loc(
    'Ouvrez votre espace, ajoutez vos plats et générez un QR prêt à poser sur les tables.',
    'Open your workspace, add your dishes and generate a QR ready for your tables.',
    'افتح فضاءك، أضف أطباقك وأنشئ رمز QR جاهزاً للطاولات.',
  ),
};

export const pillarPages = [
  page({
    path: '/menu-digital',
    cluster: 'menu-digital',
    children: ['/menu-digital-restaurant', '/menu-digital-cafe', '/menu-digital-snack', '/menu-qr-code', '/dashboard-restaurant'],
    related: ['/tarifs', '/blog/quest-ce-quun-menu-digital', '/maroc/menu-digital'],
    title: loc(
      'Menu digital pour cafés et restaurants | Scanosh',
      'Digital menu for cafes and restaurants | Scanosh',
      'قائمة رقمية للمقاهي والمطاعم | Scanosh',
    ),
    description: loc(
      'Un menu digital est une carte numérique accessible par smartphone, souvent via un QR code. Avec Scanosh, vous modifiez plats, prix et photos sans réimprimer.',
      'A digital menu is a numeric card guests open on their phone, usually via QR code. With Scanosh you update dishes, prices and photos without reprinting.',
      'القائمة الرقمية نسخة إلكترونية من البطاقة تُفتح من الهاتف، غالباً عبر رمز QR. مع Scanosh تعدّل الأطباق والأسعار والصور دون إعادة طباعة.',
    ),
    h1: loc('Menu digital pour cafés, restaurants et snacks', 'Digital menu for cafes, restaurants and snacks', 'قائمة رقمية للمقاهي والمطاعم والوجبات السريعة'),
    answer: loc(
      'Un menu digital est une version numérique de la carte d’un établissement, ouverte depuis un smartphone — généralement grâce à un QR code. Avec Scanosh, le gérant met à jour plats, catégories, photos et prix depuis un tableau de bord, sans réimprimer le menu.',
      'A digital menu is the numeric version of a venue’s card, opened on a smartphone — usually via QR code. With Scanosh, managers update dishes, categories, photos and prices from a dashboard, without reprinting.',
      'القائمة الرقمية نسخة إلكترونية من بطاقة المطعم تُفتح على الهاتف — عادة عبر رمز QR. مع Scanosh يحدّث المدير الأطباق والتصنيفات والصور والأسعار من لوحة التحكم دون إعادة طباعة.',
    ),
    sections: [
      {
        h2: loc('Comment fonctionne un menu digital Scanosh', 'How a Scanosh digital menu works', 'كيف تعمل قائمة Scanosh الرقمية'),
        body: loc(
          'Le client scanne le QR posé sur la table. Il arrive sur le menu public de l’établissement : photo de couverture, catégories, plats, prix et disponibilités. Aucune application à installer. Le lien reste le même quand vous changez un prix ou retirez un plat du jour.',
          'Guests scan the QR on the table and land on the public menu: cover, categories, dishes, prices and availability. No app to install. The URL stays the same when you change a price or take a dish off the board.',
          'يمسح الضيف رمز QR على الطاولة فيصل إلى القائمة العامة: غلاف، تصنيفات، أطباق، أسعار وتوفر. لا حاجة لتطبيق. يبقى الرابط نفسه عند تغيير سعر أو سحب طبق.',
        ),
      },
      {
        h2: loc('Dashboard : gérer la carte sans réimprimer', 'Dashboard: run the card without reprinting', 'لوحة التحكم: أدِر البطاقة دون طباعة'),
        body: loc(
          'Scanosh n’est pas un simple générateur de QR. C’est un logiciel de gestion de menu : arbre de catégories, fiches produits avec photos, prix et interrupteur de disponibilité. Le QR déjà imprimé continue de pointer vers la carte à jour.',
          'Scanosh is not just a QR generator. It is menu software: a category tree, product sheets with photos, prices and an availability toggle. The QR you already printed keeps pointing at the live card.',
          'Scanosh ليس مولّد QR فقط. هو برنامج لإدارة القائمة: شجرة تصنيفات، بطاقات منتجات بصور وأسعار ومفتاح توفر. رمز QR المطبوع يبقى يشير إلى البطاقة المحدّثة.',
        ),
      },
      {
        h2: loc('Pour qui', 'Who it is for', 'لمن'),
        items: [
          loc('Restaurants qui changent souvent la carte ou les prix', 'Restaurants that change the card or prices often', 'مطاعم تغيّر البطاقة أو الأسعار كثيراً'),
          loc('Cafés et snacks qui veulent une carte claire sur mobile', 'Cafes and snacks that want a clear mobile card', 'مقاهٍ ووجبات سريعة تريد بطاقة واضحة على الجوال'),
          loc('Établissements au Maroc qui cherchent un menu QR simple', 'Venues in Morocco looking for a simple QR menu', 'مؤسسات في المغرب تبحث عن قائمة QR بسيطة'),
        ],
      },
    ],
    faq: [
      {
        q: loc('Faut-il installer une application ?', 'Do guests need an app?', 'هل يحتاج الضيوف تطبيقاً؟'),
        a: loc('Non. Le menu s’ouvre dans le navigateur du téléphone après le scan.', 'No. The menu opens in the phone browser after the scan.', 'لا. تُفتح القائمة في متصفح الهاتف بعد المسح.'),
      },
      {
        q: loc('Peut-on modifier le menu après avoir imprimé le QR ?', 'Can we edit the menu after printing the QR?', 'هل يمكن تعديل القائمة بعد طباعة QR؟'),
        a: loc('Oui. Le QR pointe vers l’URL du café. Les mises à jour sont immédiates.', 'Yes. The QR points at the cafe URL. Updates are instant.', 'نعم. الرمز يشير إلى رابط المقهى. التحديث فوري.'),
      },
      {
        q: loc('Scanosh convient-il aux cafés et aux snacks ?', 'Does Scanosh fit cafes and snacks?', 'هل يناسب Scanosh المقاهي والوجبات السريعة؟'),
        a: loc('Oui. Le même outil sert restaurants, cafés et snacks, avec des pages dédiées pour chaque usage.', 'Yes. The same tool serves restaurants, cafes and snacks, with dedicated pages for each use.', 'نعم. الأداة نفسها للمطاعم والمقاهي والوجبات السريعة، مع صفحات مخصصة لكل استخدام.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/menu-qr-code',
    cluster: 'qr',
    parent: '/menu-digital',
    children: ['/qr-code-restaurant', '/qr-code-cafe', '/qr-code-snack', '/qr-code-table'],
    related: ['/comment-creer-menu-qr-code', '/blog/menu-papier-vs-menu-digital', '/dashboard-restaurant'],
    title: loc('Menu QR code restaurant et café | Scanosh', 'QR code menu for restaurants and cafes | Scanosh', 'قائمة QR كود للمطاعم والمقاهي | Scanosh'),
    description: loc(
      'Un menu QR code ouvre la carte du restaurant sur le téléphone du client. Scanosh génère le QR et relie le dashboard : plat, prix, photo, disponibilité.',
      'A QR code menu opens the restaurant card on the guest’s phone. Scanosh generates the QR and ties it to the dashboard: dish, price, photo, availability.',
      'قائمة رمز QR تفتح بطاقة المطعم على هاتف الضيف. Scanosh ينشئ الرمز ويربطه بلوحة التحكم: طبق، سعر، صورة، توفر.',
    ),
    h1: loc('Menu QR code pour restaurants, cafés et snacks', 'QR code menu for restaurants, cafes and snacks', 'قائمة رمز QR للمطاعم والمقاهي والوجبات السريعة'),
    answer: loc(
      'Un menu QR code est un menu digital accessible en scannant un code imprimé (table, comptoir, vitrine). Le client n’installe rien. Avec Scanosh, le QR reste valable tant que l’URL du café ne change pas : vous mettez à jour la carte depuis le dashboard.',
      'A QR code menu is a digital menu opened by scanning a printed code (table, counter, window). Guests install nothing. With Scanosh the QR stays valid as long as the cafe URL does not change: you update the card from the dashboard.',
      'قائمة رمز QR قائمة رقمية تُفتح بمسح رمز مطبوع (طاولة، منضدة، واجهة). لا يثبّت الضيف شيئاً. مع Scanosh يبقى الرمز صالحاً ما دام رابط المقهى ثابتاً: تحدّث البطاقة من لوحة التحكم.',
    ),
    sections: [
      {
        h2: loc('Comment ça marche en salle', 'How it works on the floor', 'كيف يعمل في القاعة'),
        body: loc(
          'Vous générez le QR dans Scanosh, vous l’imprimez, vous le posez sur les tables. Chaque scan ouvre le menu public : catégories, photos, prix. Si un plat est en rupture, vous le masquez dans le dashboard ; le QR n’a pas besoin d’être réimprimé.',
          'You generate the QR in Scanosh, print it and place it on tables. Each scan opens the public menu: categories, photos, prices. If a dish is out, you hide it in the dashboard; the QR does not need reprinting.',
          'تنشئ الرمز في Scanosh، تطبعه وتضعه على الطاولات. كل مسح يفتح القائمة: تصنيفات، صور، أسعار. إذا نفذ طبق تخفيه من اللوحة؛ لا حاجة لإعادة طباعة الرمز.',
        ),
      },
      {
        h2: loc('QR code vs menu papier', 'QR code vs paper menu', 'رمز QR مقابل القائمة الورقية'),
        body: loc(
          'Le papier se salit, se perd et fige les prix. Le QR affiche toujours la carte actuelle. Le papier reste utile en secours ; le digital devient la source de vérité pour les prix et les photos.',
          'Paper gets dirty, goes missing and freezes prices. The QR always shows the current card. Paper can stay as backup; digital becomes the source of truth for prices and photos.',
          'الورق يتّسخ ويُفقد ويُثبّت الأسعار. الرمز يعرض البطاقة الحالية دائماً. يمكن إبقاء الورق احتياطاً؛ الرقمي يصبح المرجع للأسعار والصور.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Le QR change-t-il à chaque modification ?', 'Does the QR change on every edit?', 'هل يتغيّر الرمز مع كل تعديل؟'),
        a: loc('Non. Il encode l’adresse du menu. Les contenus changent derrière cette adresse.', 'No. It encodes the menu URL. Content changes behind that URL.', 'لا. يرمّز عنوان القائمة. المحتوى يتغيّر خلف هذا العنوان.'),
      },
      {
        q: loc('Faut-il du wifi pour le client ?', 'Do guests need Wi‑Fi?', 'هل يحتاج الضيف واي فاي؟'),
        a: loc('Une connexion internet sur le téléphone suffit (4G ou wifi du local).', 'Any internet on the phone is enough (4G or venue Wi‑Fi).', 'يكفي اتصال إنترنت على الهاتف (4G أو واي فاي المكان).'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/menu-digital-restaurant',
    cluster: 'menu-digital',
    parent: '/menu-digital',
    related: ['/qr-code-restaurant', '/dashboard-restaurant', '/blog/digitaliser-restaurant'],
    title: loc('Menu digital restaurant | Scanosh', 'Digital restaurant menu | Scanosh', 'قائمة مطعم رقمية | Scanosh'),
    description: loc(
      'Menu digital pour restaurant : catégories, photos de plats, prix et QR sur table. Mettez à jour la carte depuis le dashboard Scanosh.',
      'Digital menu for restaurants: categories, dish photos, prices and table QR. Update the card from the Scanosh dashboard.',
      'قائمة رقمية للمطعم: تصنيفات، صور أطباق، أسعار وQR على الطاولة. حدّث البطاقة من لوحة Scanosh.',
    ),
    h1: loc('Menu digital pour restaurant', 'Digital menu for restaurants', 'قائمة رقمية للمطاعم'),
    answer: loc(
      'Un menu digital restaurant est la carte du service, lisible sur téléphone : entrées, plats, desserts, formules. Scanosh sert les salles qui veulent des photos soignées, des catégories claires et un QR unique par établissement.',
      'A digital restaurant menu is the service card on a phone: starters, mains, desserts, set menus. Scanosh fits rooms that want careful photos, clear categories and one QR per venue.',
      'قائمة المطعم الرقمية هي بطاقة الخدمة على الهاتف: مقبلات، أطباق، حلويات، قوائم. Scanosh يناسب القاعات التي تريد صوراً متقنة وتصنيفات واضحة ورمزاً واحداً لكل مؤسسة.',
    ),
    sections: [
      {
        h2: loc('En salle', 'On the floor', 'في القاعة'),
        body: loc(
          'Le QR sur table évite les cartes usées et les ruptures non signalées. Le serveur n’a plus à mémoriser chaque 86. Le client voit le plat, le prix et s’il est encore servi.',
          'A table QR avoids worn cards and silent 86s. Staff no longer memorize every stop. Guests see the dish, the price and whether it is still served.',
          'رمز الطاولة يتجنّب البطاقات البالية والنفاذ غير المعلن. لا يحفظ النادل كل طبق متوقف. يرى الضيف الطبق والسعر وهل ما زال يُقدَّم.',
        ),
      },
      {
        h2: loc('Côté cuisine et gérance', 'Kitchen and management', 'المطبخ والإدارة'),
        body: loc(
          'Prix du jour, suggestion du chef, retrait d’un poisson : une bascule dans le dashboard. Pas de file d’attente à l’imprimerie. Les photos restent liées à chaque fiche plat.',
          'Daily price, chef special, pulling a fish: one toggle in the dashboard. No print queue. Photos stay tied to each dish sheet.',
          'سعر اليوم، اقتراح الشيف، سحب سمكة: مفتاح في اللوحة. بلا طباعة. الصور تبقى مربوطة بكل طبق.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Peut-on avoir plusieurs niveaux de catégories ?', 'Can we nest categories?', 'هل يمكن تداخل التصنيفات؟'),
        a: loc('Oui. Scanosh gère un arbre parent / enfant (ex. Plats → Viandes).', 'Yes. Scanosh supports a parent/child tree (e.g. Mains → Grills).', 'نعم. يدعم Scanosh شجرة أب/ابن (مثلاً أطباق ← مشاوي).'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/menu-digital-cafe',
    cluster: 'menu-digital',
    parent: '/menu-digital',
    related: ['/qr-code-cafe', '/blog/menu-digital-cafe', '/fonctionnalites/photos'],
    title: loc('Menu digital café | Scanosh', 'Digital cafe menu | Scanosh', 'قائمة مقهى رقمية | Scanosh'),
    description: loc(
      'Menu digital pour café : boissons, pâtisseries, formules. QR au comptoir ou sur table, photos et prix à jour depuis Scanosh.',
      'Digital cafe menu: drinks, pastry, combos. QR at the counter or table, photos and prices kept current in Scanosh.',
      'قائمة مقهى رقمية: مشروبات، حلويات، عروض. QR على المنضدة أو الطاولة، صور وأسعار محدّثة في Scanosh.',
    ),
    h1: loc('Menu digital pour café', 'Digital menu for cafes', 'قائمة رقمية للمقاهي'),
    answer: loc(
      'Un menu digital café met en avant cafés, thés, smoothies et pâtisseries sur mobile. Idéal quand la carte est courte mais change (saison, extra). Scanosh affiche photos et prix sans réimprimer de chevalets.',
      'A digital cafe menu puts coffee, tea, smoothies and pastry on mobile. Ideal when the card is short but changes (season, extras). Scanosh shows photos and prices without reprinting table tents.',
      'قائمة المقهى الرقمية تعرض القهوة والشاي والعصائر والحلويات على الجوال. مناسبة عندما تكون البطاقة قصيرة لكنها تتغيّر. Scanosh يعرض صوراً وأسعاراً دون إعادة طباعة.',
    ),
    sections: [
      {
        h2: loc('Comptoir et terrasse', 'Counter and terrace', 'المنضدة والتراس'),
        body: loc(
          'Un QR au comptoir désengorge la file : le client lit pendant l’attente. En terrasse, le même lien évite les menus plastifiés. Les extras (sirop, lait végétal) se gèrent comme des fiches ou des notes dans la description.',
          'A counter QR shortens the line: guests read while they wait. On the terrace the same link replaces plastic menus. Extras (syrup, plant milk) live as items or notes in the description.',
          'رمز المنضدة يخفّف الطابور: يقرأ الضيف أثناء الانتظار. في التراس نفس الرابط يغني عن القوائم البلاستيكية.',
        ),
      },
      {
        h2: loc('Rythme d’un café', 'Cafe rhythm', 'إيقاع المقهى'),
        body: loc(
          'Le stock d’un gâteau du jour se vide à 16 h : vous le masquez. Un latte saisonnier arrive : vous l’ajoutez avec une photo. Le QR du matin reste le bon.',
          'The day’s cake sells out at 4 pm: you hide it. A seasonal latte arrives: you add it with a photo. The morning QR is still the right one.',
          'تنفد كعكة اليوم الساعة 16: تخفيها. يصل لاتيه موسمي: تضيفه بصورة. رمز الصباح يبقى صالحاً.',
        ),
      },
    ],
    faq: [
      {
        q: loc('La carte peut-elle rester courte ?', 'Can the card stay short?', 'هل يمكن أن تبقى البطاقة قصيرة؟'),
        a: loc('Oui. Un café gagne souvent avec 15–40 fiches bien photographiées plutôt qu’un catalogue trop long.', 'Yes. Cafes often win with 15–40 well-shot items rather than a long catalogue.', 'نعم. المقاهي تربح غالباً بـ 15–40 صنفاً مصوَّراً جيداً لا بكتالوج طويل.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/menu-digital-snack',
    cluster: 'menu-digital',
    parent: '/menu-digital',
    related: ['/qr-code-snack', '/blog/menu-digital-snack', '/fonctionnalites/gestion-menu'],
    title: loc('Menu digital snack | Scanosh', 'Digital snack menu | Scanosh', 'قائمة وجبات سريعة رقمية | Scanosh'),
    description: loc(
      'Menu digital pour snack et fast-casual : sandwiches, tacos, menus combo, prix clairs sur mobile et QR au comptoir.',
      'Digital menu for snacks and fast-casual: sandwiches, tacos, combos, clear mobile prices and a counter QR.',
      'قائمة رقمية للوجبات السريعة: سندويشات، تاكوس، قوائم، أسعار واضحة على الجوال وQR على المنضدة.',
    ),
    h1: loc('Menu digital pour snack', 'Digital menu for snacks', 'قائمة رقمية للوجبات السريعة'),
    answer: loc(
      'Un menu digital snack affiche une carte rapide : sandwichs, tacos, burgers, menus. Les prix doivent être lisibles en quelques secondes. Scanosh privilégie photos, catégories simples et mise à jour des ruptures pendant le rush.',
      'A digital snack menu shows a fast card: sandwiches, tacos, burgers, combos. Prices must be readable in seconds. Scanosh favours photos, simple categories and 86 updates during rush.',
      'قائمة الوجبات السريعة الرقمية تعرض بطاقة سريعة: سندويشات، تاكوس، برغر. يجب قراءة الأسعار في ثوان. Scanosh يركّز على الصور والتصنيفات البسيطة وتحديث النفاد وقت الذروة.',
    ),
    sections: [
      {
        h2: loc('File d’attente', 'The queue', 'الطابور'),
        body: loc(
          'Le client scanne avant d’arriver au caisse. Il a déjà choisi. Moins de hésitation au comptoir, moins d’erreurs de formule. Les combos se créent comme des fiches dédiées.',
          'Guests scan before they reach the till. They already chose. Less hesitation at the counter, fewer combo mistakes. Combos are their own product sheets.',
          'يمسح الضيف قبل الصندوق. يكون قد اختار. أقل تردد على المنضدة. القوائم تُنشأ كبطاقات مستقلة.',
        ),
      },
      {
        h2: loc('Prix et rush', 'Prices and rush', 'الأسعار والذروة'),
        body: loc(
          'Un changement de prix fournisseur le lundi matin se répercute avant le service du midi. Pas d’autocollant sur le plexiglas.',
          'A Monday supplier price change is live before lunch. No stickers on the plexiglass.',
          'تغيير سعر المورّد صباح الاثنين يظهر قبل غداء الخدمة. بلا ملصقات على الزجاج.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Utile même sans salle ?', 'Useful without a dining room?', 'مفيد حتى بلا قاعة؟'),
        a: loc('Oui. Un QR vitrine ou comptoir suffit pour le take-away.', 'Yes. A window or counter QR is enough for take-away.', 'نعم. رمز واجهة أو منضدة يكفي للسفري.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/dashboard-restaurant',
    cluster: 'dashboard',
    parent: '/menu-digital',
    children: ['/gestion-menu', '/gestion-plats', '/gestion-categories', '/gestion-prix', '/gestion-photos', '/statistiques-menu', '/menu-multilingue'],
    related: ['/fonctionnalites', '/tarifs', '/menu-qr-code'],
    title: loc('Dashboard restaurant et logiciel de menu | Scanosh', 'Restaurant dashboard and menu software | Scanosh', 'لوحة مطعم وبرنامج قائمة | Scanosh'),
    description: loc(
      'Scanosh est un logiciel de gestion de menu digital : dashboard pour plats, catégories, photos, prix et QR. Pas seulement un générateur de code.',
      'Scanosh is digital menu software: a dashboard for dishes, categories, photos, prices and QR. Not just a code generator.',
      'Scanosh برنامج لإدارة القائمة الرقمية: لوحة للأطباق والتصنيفات والصور والأسعار وQR. ليس مولّد رموز فقط.',
    ),
    h1: loc('Dashboard restaurant : gérer le menu digital', 'Restaurant dashboard: run the digital menu', 'لوحة المطعم: أدِر القائمة الرقمية'),
    answer: loc(
      'Le dashboard Scanosh est l’espace gérant : créer des catégories, ajouter des plats, uploader des photos, fixer les prix, masquer une rupture, générer le QR. C’est un logiciel de menu, pas un fichier PDF figé derrière un code.',
      'The Scanosh dashboard is the manager space: create categories, add dishes, upload photos, set prices, hide an 86, generate the QR. It is menu software, not a frozen PDF behind a code.',
      'لوحة Scanosh فضاء المدير: إنشاء تصنيفات، إضافة أطباق، رفع صور، تحديد أسعار، إخفاء نفاد، إنشاء QR. هو برنامج قائمة لا ملف PDF جامد خلف رمز.',
    ),
    sections: [
      {
        h2: loc('Ce que vous pilotez', 'What you run', 'ما تديره'),
        items: [
          loc('Arbre de catégories (parent / enfant)', 'Category tree (parent / child)', 'شجرة تصنيفات (أب / ابن)'),
          loc('Fiches plats : nom, description, prix, photo, disponibilité', 'Dish sheets: name, description, price, photo, availability', 'بطاقات أطباق: اسم، وصف، سعر، صورة، توفر'),
          loc('Identité du café : logo, couverture, adresse, téléphone', 'Cafe identity: logo, cover, address, phone', 'هوية المقهى: شعار، غلاف، عنوان، هاتف'),
          loc('QR code du menu public', 'QR code for the public menu', 'رمز QR للقائمة العامة'),
        ],
      },
      {
        h2: loc('Pourquoi ce n’est pas « juste un QR »', 'Why this is not “just a QR”', 'لماذا ليس «مجرد QR»'),
        body: loc(
          'Un QR sans dashboard oblige à régénérer un visuel à chaque changement. Scanosh sépare le support imprimé (stable) et le contenu (vivant). C’est ce qui en fait une solution SaaS de digitalisation de menu.',
          'A QR without a dashboard forces a new graphic on every change. Scanosh splits the printed support (stable) from the content (live). That is what makes it menu-digitisation SaaS.',
          'رمز بلا لوحة يفرض رسماً جديداً مع كل تغيير. Scanosh يفصل الحامل المطبوع (ثابت) عن المحتوى (حي). هذا ما يجعله SaaS لرقمنة القائمة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Qui voit le dashboard ?', 'Who sees the dashboard?', 'من يرى اللوحة؟'),
        a: loc('Le compte gérant de l’établissement. Les clients ne voient que le menu public.', 'The venue manager account. Guests only see the public menu.', 'حساب مدير المؤسسة. الضيوف يرون القائمة العامة فقط.'),
      },
    ],
    ...CTA,
  }),
];
