import { loc, page } from './helpers.js';

const CTA = {
  ctaTitle: loc('Essayer Scanosh', 'Try Scanosh', 'جرّب Scanosh'),
  ctaBody: loc(
    'Créez votre menu et générez le QR depuis le même espace.',
    'Create your menu and generate the QR from the same workspace.',
    'أنشئ قائمتك ورمز QR من نفس الفضاء.',
  ),
};

export const featurePages = [
  page({
    path: '/fonctionnalites',
    cluster: 'features',
    children: [
      '/fonctionnalites/qr-code',
      '/fonctionnalites/gestion-menu',
      '/fonctionnalites/photos',
      '/fonctionnalites/categories',
      '/fonctionnalites/multilingue',
      '/fonctionnalites/statistiques',
    ],
    related: ['/dashboard-restaurant', '/tarifs', '/menu-digital'],
    title: loc('Fonctionnalités du menu digital Scanosh', 'Scanosh digital menu features', 'ميزات قائمة Scanosh الرقمية'),
    description: loc(
      'QR code, gestion de menu, photos, catégories, multilingue et statistiques : le détail de la solution Scanosh pour cafés et restaurants.',
      'QR code, menu management, photos, categories, multilingual UI and stats: Scanosh for cafes and restaurants.',
      'رمز QR، إدارة القائمة، صور، تصنيفات، تعدد لغات وإحصاءات: حل Scanosh للمقاهي والمطاعم.',
    ),
    h1: loc('Fonctionnalités Scanosh', 'Scanosh features', 'ميزات Scanosh'),
    answer: loc(
      'Scanosh réunit un menu public pour les clients et un dashboard pour le gérant : QR, catégories, plats, photos, prix, langues de l’interface et suivi d’activité. Chaque fonction a une page dédiée.',
      'Scanosh pairs a public guest menu with a manager dashboard: QR, categories, dishes, photos, prices, UI languages and activity tracking. Each feature has its own page.',
      'يجمع Scanosh قائمة عامة للضيوف ولوحة للمدير: QR، تصنيفات، أطباق، صور، أسعار، لغات الواجهة وتتبع النشاط.',
    ),
    sections: [
      {
        h2: loc('Les briques', 'The building blocks', 'اللبنات'),
        items: [
          loc('QR code du menu public', 'Public menu QR code', 'رمز QR للقائمة العامة'),
          loc('Gestion du menu (ajouter, modifier, masquer)', 'Menu management (add, edit, hide)', 'إدارة القائمة (إضافة، تعديل، إخفاء)'),
          loc('Photos plats, catégories, logo et couverture', 'Photos for dishes, categories, logo and cover', 'صور الأطباق والتصنيفات والشعار والغلاف'),
          loc('Catégories en arbre', 'Category tree', 'شجرة تصنيفات'),
          loc('Interface gérant en français, anglais et arabe', 'Manager UI in French, English and Arabic', 'واجهة المدير بالفرنسية والإنجليزية والعربية'),
          loc('Activité et indicateurs du dashboard', 'Dashboard activity and indicators', 'نشاط ومؤشرات اللوحة'),
        ],
      },
      {
        h2: loc('Mobile-first', 'Mobile-first', 'الجوال أولاً'),
        body: loc(
          'Le menu client est pensé pour le téléphone. Le dashboard gérant reste utilisable sur mobile pour un changement de prix en salle.',
          'The guest menu is built for the phone. The manager dashboard still works on mobile for a price change on the floor.',
          'قائمة الضيف مصممة للهاتف. لوحة المدير تعمل على الجوال لتغيير سعر في القاعة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Faut-il tout activer ?', 'Do we need every feature?', 'هل يجب تفعيل كل شيء؟'),
        a: loc('Non. Un café peut commencer par catégories + plats + QR, puis ajouter les photos.', 'No. A cafe can start with categories + dishes + QR, then add photos.', 'لا. يمكن البدء بتصنيفات + أطباق + QR ثم إضافة الصور.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/fonctionnalites/qr-code',
    parent: '/fonctionnalites',
    related: ['/menu-qr-code', '/qr-code-table'],
    title: loc('QR code menu Scanosh', 'Scanosh menu QR code', 'رمز QR لقائمة Scanosh'),
    description: loc(
      'Générez le QR du menu public Scanosh et posez-le sur les tables. L’URL reste stable quand vous modifiez la carte.',
      'Generate the Scanosh public-menu QR and place it on tables. The URL stays stable when you edit the card.',
      'أنشئ رمز QR للقائمة العامة وضعه على الطاولات. يبقى الرابط ثابتاً عند تعديل البطاقة.',
    ),
    h1: loc('QR code du menu', 'Menu QR code', 'رمز QR للقائمة'),
    answer: loc(
      'Dans Scanosh, le QR encode l’adresse publique du café (`/menu/votre-slug`). Imprimez-le une fois. Les changements de carte se font dans le dashboard, pas sur le visuel.',
      'In Scanosh the QR encodes the cafe public URL (`/menu/your-slug`). Print it once. Card changes happen in the dashboard, not on the artwork.',
      'في Scanosh يرمّز QR عنوان المقهى العام. اطبعه مرة. تغييرات البطاقة تتم في اللوحة لا على الرسم.',
    ),
    sections: [
      {
        h2: loc('Impression et changement', 'Print and change requests', 'الطباعة وطلب التغيير'),
        body: loc(
          'Le QR est un identifiant. Un changement d’URL (slug) est volontaire et peut passer par une demande, pour éviter de casser les supports déjà imprimés.',
          'The QR is an identifier. A URL (slug) change is deliberate and may go through a request, so printed supports do not break.',
          'الرمز معرّف. تغيير الرابط قرار واعٍ وقد يمر بطلب حتى لا تُكسر الحوامل المطبوعة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Où poser le QR ?', 'Where should we put the QR?', 'أين نضع الرمز؟'),
        a: loc('Tables, comptoir, vitrine, ticket. Le plus efficace : une table = un scan.', 'Tables, counter, window, ticket. Best: one table, one scan.', 'طاولات، منضدة، واجهة، تذكرة. الأفضل: طاولة = مسح.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/fonctionnalites/gestion-menu',
    parent: '/fonctionnalites',
    related: ['/gestion-menu', '/dashboard-restaurant'],
    title: loc('Gestion de menu digital | Scanosh', 'Digital menu management | Scanosh', 'إدارة القائمة الرقمية | Scanosh'),
    description: loc(
      'Ajoutez, modifiez ou masquez des plats en temps réel. La gestion de menu Scanosh alimente le QR déjà imprimé.',
      'Add, edit or hide dishes in real time. Scanosh menu management feeds the QR you already printed.',
      'أضف أو عدّل أو أخفِ أطباقاً فوراً. إدارة Scanosh تغذي رمز QR المطبوع.',
    ),
    h1: loc('Gestion du menu', 'Menu management', 'إدارة القائمة'),
    answer: loc(
      'La gestion de menu dans Scanosh, c’est créer et tenir à jour catégories et produits. Chaque fiche peut être disponible ou non : le client ne voit que ce qui est servi.',
      'Menu management in Scanosh means creating and maintaining categories and products. Each sheet can be on or off: guests only see what is served.',
      'إدارة القائمة في Scanosh هي إنشاء وتحديث التصنيفات والمنتجات. كل بطاقة يمكن أن تكون متاحة أو لا: الضيف يرى ما يُقدَّم فقط.',
    ),
    sections: [
      {
        h2: loc('Temps réel', 'Real time', 'وقت حقيقي'),
        body: loc(
          'Pas de fichier à renvoyer à un imprimeur. Une bascule de disponibilité suffit pendant le service.',
          'No file to send back to a printer. An availability toggle is enough during service.',
          'لا ملف يُرسل للطباعة. مفتاح التوفر يكفي أثناء الخدمة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Les clients voient-ils les plats masqués ?', 'Do guests see hidden dishes?', 'هل يرى الضيوف الأطباق المخفية؟'),
        a: loc('Non. Seuls les produits disponibles apparaissent sur le menu public.', 'No. Only available products appear on the public menu.', 'لا. المنتجات المتاحة فقط تظهر في القائمة العامة.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/fonctionnalites/photos',
    parent: '/fonctionnalites',
    related: ['/gestion-photos', '/menu-digital-cafe'],
    title: loc('Photos du menu digital | Scanosh', 'Digital menu photos | Scanosh', 'صور القائمة الرقمية | Scanosh'),
    description: loc(
      'Photos de plats, catégories, logo et couverture : le menu Scanosh met en valeur la carte comme un catalogue visuel.',
      'Dish, category, logo and cover photos: the Scanosh menu presents the card as a visual catalogue.',
      'صور أطباق وتصنيفات وشعار وغلاف: قائمة Scanosh تعرض البطاقة ككتالوج بصري.',
    ),
    h1: loc('Photos du menu', 'Menu photos', 'صور القائمة'),
    answer: loc(
      'Chaque plat et chaque catégorie peut avoir une image. Logo et couverture identifient l’établissement sur la page d’accueil du menu. Les visuels se gèrent dans le dashboard, pas dans un PDF.',
      'Each dish and category can have an image. Logo and cover identify the venue on the menu landing. Visuals live in the dashboard, not in a PDF.',
      'لكل طبق وتصنيف صورة. الشعار والغلاف يعرّفان المؤسسة في صفحة القائمة. الصور تُدار في اللوحة لا في PDF.',
    ),
    sections: [
      {
        h2: loc('Pourquoi les photos comptent', 'Why photos matter', 'لماذا تهم الصور'),
        body: loc(
          'Sur téléphone, une photo nette vend mieux qu’un pavé de texte. Commencez par les best-sellers, puis complétez.',
          'On a phone, a sharp photo sells better than a text wall. Start with bestsellers, then fill in.',
          'على الهاتف صورة واضحة تبيع أفضل من نص طويل. ابدأ بالأفضل مبيعاً ثم أكمل.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Les photos sont-elles obligatoires ?', 'Are photos required?', 'هل الصور إلزامية؟'),
        a: loc('Non, mais un menu avec visuels convertit mieux. Vous pouvez publier d’abord, illustrer ensuite.', 'No, but a visual menu converts better. You can publish first and illustrate later.', 'لا، لكن قائمة بصور تحوّل أفضل. يمكن النشر أولاً ثم التوضيح.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/fonctionnalites/categories',
    parent: '/fonctionnalites',
    related: ['/gestion-categories', '/dashboard-restaurant'],
    title: loc('Catégories du menu | Scanosh', 'Menu categories | Scanosh', 'تصنيفات القائمة | Scanosh'),
    description: loc(
      'Organisez la carte en catégories parent / enfant : boissons, plats, desserts. Le client navigue plus vite sur mobile.',
      'Organise the card in parent/child categories: drinks, mains, desserts. Guests browse faster on mobile.',
      'نظّم البطاقة بتصنيفات أب/ابن: مشروبات، أطباق، حلويات. يتصفّح الضيف أسرع على الجوال.',
    ),
    h1: loc('Catégories de menu', 'Menu categories', 'تصنيفات القائمة'),
    answer: loc(
      'Scanosh structure le menu en arbre. Une catégorie parente (Plats) peut contenir des enfants (Viandes, Poissons) et des produits. L’ordre se règle dans le dashboard.',
      'Scanosh structures the menu as a tree. A parent (Mains) can hold children (Grill, Fish) and products. Order is set in the dashboard.',
      'ينظّم Scanosh القائمة كشجرة. تصنيف أب (أطباق) قد يحتوي أبناء (لحوم، أسماك) ومنتجات. الترتيب من اللوحة.',
    ),
    sections: [
      {
        h2: loc('Lecture mobile', 'Mobile reading', 'القراءة على الجوال'),
        body: loc(
          'Trop de plats sur une seule page fatigue. Des catégories courtes (8–20 fiches) se parcourent mieux du pouce.',
          'Too many dishes on one page tire guests. Short categories (8–20 items) scroll better with a thumb.',
          'كثرة الأطباق في صفحة واحدة تُتعب. تصنيفات قصيرة (8–20) أسهل بالإبهام.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Combien de catégories ?', 'How many categories?', 'كم تصنيفاً؟'),
        a: loc('Assez pour que le client trouve en deux taps, pas assez pour se perdre. Souvent 6 à 12 racines.', 'Enough that guests find in two taps, not enough to get lost. Often 6 to 12 roots.', 'بما يكفي ليجد الضيف بنقرتين، لا ليضيع. غالباً 6 إلى 12 جذراً.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/fonctionnalites/multilingue',
    parent: '/fonctionnalites',
    related: ['/menu-multilingue', '/maroc/menu-digital'],
    title: loc('Menu et interface multilingue | Scanosh', 'Multilingual menu and UI | Scanosh', 'قائمة وواجهة متعددة اللغات | Scanosh'),
    description: loc(
      'L’espace gérant Scanosh est en français, anglais et arabe (RTL). Utile au Maroc et pour une clientèle internationale.',
      'The Scanosh manager space is French, English and Arabic (RTL). Useful in Morocco and for international guests.',
      'فضاء مدير Scanosh بالفرنسية والإنجليزية والعربية (RTL). مفيد في المغرب ولضيوف دوليين.',
    ),
    h1: loc('Multilingue', 'Multilingual', 'تعدد اللغات'),
    answer: loc(
      'L’interface Scanosh (dashboard et pages marketing) passe en français, anglais ou arabe, y compris le sens de lecture RTL. Le contenu des plats (noms, descriptions) est celui que vous saisissez — vous pouvez rédiger dans la langue de vos clients.',
      'The Scanosh UI (dashboard and marketing) switches between French, English and Arabic, including RTL. Dish names and descriptions are what you type — write in your guests’ language.',
      'واجهة Scanosh (اللوحة والتسويق) بين الفرنسية والإنجليزية والعربية مع RTL. أسماء الأطباق وأوصافها كما تكتبها — بلغة ضيوفك.',
    ),
    sections: [
      {
        h2: loc('Maroc', 'Morocco', 'المغرب'),
        body: loc(
          'Un gérant peut travailler en darija/français dans les fiches, et laisser un collaborateur en anglais. L’arabe de l’interface aide les équipes plus à l’aise en RTL.',
          'A manager can write sheets in Darija/French and leave a colleague in English. Arabic UI helps teams more comfortable with RTL.',
          'يمكن للمدير كتابة البطاقات بالدارجة/الفرنسية ويترك زميلاً بالإنجليزية. العربية في الواجهة تساعد الفرق المرتاحة بـ RTL.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Le menu public se traduit-il tout seul ?', 'Does the public menu auto-translate?', 'هل تُترجم القائمة العامة تلقائياً؟'),
        a: loc('Non. Vous rédigez les textes des plats. L’interface du site, elle, suit la langue choisie.', 'No. You write dish copy. The site chrome follows the selected language.', 'لا. أنت تكتب نصوص الأطباق. واجهة الموقع تتبع اللغة المختارة.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/fonctionnalites/statistiques',
    parent: '/fonctionnalites',
    related: ['/statistiques-menu', '/dashboard-restaurant'],
    title: loc('Statistiques menu | Scanosh', 'Menu statistics | Scanosh', 'إحصاءات القائمة | Scanosh'),
    description: loc(
      'Le dashboard Scanosh donne une vue sur l’activité de l’établissement : volume de plats, catégories, indicateurs de gestion.',
      'The Scanosh dashboard shows venue activity: dish volume, categories, management indicators.',
      'لوحة Scanosh تعرض نشاط المؤسسة: حجم الأطباق، التصنيفات، مؤشرات الإدارة.',
    ),
    h1: loc('Statistiques et activité', 'Stats and activity', 'إحصاءات ونشاط'),
    answer: loc(
      'Scanosh affiche des indicateurs dans l’espace gérant (nombre de produits, catégories, activité récente). L’objectif n’est pas un outil d’analytics publicitaire, c’est de piloter la carte au quotidien.',
      'Scanosh shows manager-space indicators (product count, categories, recent activity). The goal is not ad analytics; it is running the card day to day.',
      'يعرض Scanosh مؤشرات في فضاء المدير (عدد المنتجات، التصنيفات، نشاط حديث). الهدف ليس إعلانات بل قيادة البطاقة يومياً.',
    ),
    sections: [
      {
        h2: loc('À quoi ça sert', 'What it is for', 'لأي غرض'),
        body: loc(
          'Vérifier qu’un menu n’est pas vide, suivre ce qui a été ajouté, garder une vue d’ensemble avant le service.',
          'Check the menu is not empty, see what was added, keep an overview before service.',
          'التأكد أن القائمة ليست فارغة، متابعة ما أُضيف، نظرة عامة قبل الخدمة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Voyez-vous les scans individuels des clients ?', 'Do you see each guest scan?', 'هل ترون كل مسح للضيوف؟'),
        a: loc('Le produit se concentre sur la gestion de carte, pas sur le pistage nominatif des clients.', 'The product focuses on card management, not named guest tracking.', 'المنتج يركّز على إدارة البطاقة لا تتبّع الضيوف بالاسم.'),
      },
    ],
    ...CTA,
  }),
];

export const dashboardChildPages = [
  page({
    path: '/gestion-menu',
    parent: '/dashboard-restaurant',
    related: ['/fonctionnalites/gestion-menu', '/gestion-plats'],
    title: loc('Gestion de menu restaurant | Scanosh', 'Restaurant menu management | Scanosh', 'إدارة قائمة المطعم | Scanosh'),
    description: loc(
      'Gérez la carte complète depuis le dashboard Scanosh : structure, plats, ruptures. Le QR public reste le même.',
      'Run the full card from the Scanosh dashboard: structure, dishes, 86s. The public QR stays the same.',
      'أدِر البطاقة كاملة من لوحة Scanosh: هيكل، أطباق، نفاد. رمز QR العام يبقى نفسه.',
    ),
    h1: loc('Gestion de menu', 'Menu management', 'إدارة القائمة'),
    answer: loc(
      'La page de gestion de menu, dans Scanosh, c’est le quotidien du gérant : tenir la carte cohérente, à jour, photographiée, sans passer par un imprimeur.',
      'Menu management in Scanosh is the manager’s daily work: keep the card coherent, current, photographed, with no printer in the loop.',
      'إدارة القائمة في Scanosh هي يوم المدير: بطاقة متماسكة ومحدّثة ومصوَّرة بلا مطبعة.',
    ),
    sections: [
      {
        h2: loc('Routine', 'Routine', 'روتين'),
        body: loc(
          'Matin : vérifier les ruptures. Midi : ajuster un prix. Soir : préparer le plat du lendemain. Tout passe par le même écran.',
          'Morning: check 86s. Lunch: tweak a price. Evening: prep tomorrow’s dish. Same screen.',
          'صباحاً: النفاد. ظهراً: سعر. مساءً: طبق الغد. نفس الشاشة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Qui peut modifier ?', 'Who can edit?', 'من يعدّل؟'),
        a: loc('Le compte administrateur du café connecté à Scanosh.', 'The cafe admin account signed into Scanosh.', 'حساب مدير المقهى المتصل بـ Scanosh.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/gestion-plats',
    parent: '/dashboard-restaurant',
    related: ['/gestion-prix', '/gestion-photos'],
    title: loc('Gestion des plats | Scanosh', 'Dish management | Scanosh', 'إدارة الأطباق | Scanosh'),
    description: loc(
      'Fiches plats Scanosh : nom, description, prix, photo, disponibilité. Ajoutez ou retirez un plat sans toucher au QR.',
      'Scanosh dish sheets: name, description, price, photo, availability. Add or remove a dish without touching the QR.',
      'بطاقات أطباق Scanosh: اسم، وصف، سعر، صورة، توفر. أضف أو احذف طبقاً دون لمس QR.',
    ),
    h1: loc('Gestion des plats', 'Dish management', 'إدارة الأطباق'),
    answer: loc(
      'Chaque plat est une fiche. Vous la créez une fois, vous la mettez à jour quand la recette, le prix ou le stock change. Le menu public se met à jour tout seul.',
      'Each dish is a sheet. Create it once, update it when recipe, price or stock changes. The public menu updates itself.',
      'كل طبق بطاقة. تنشئها مرة وتحدّثها عند تغيّر الوصفة أو السعر أو المخزون. القائمة العامة تتحدّث وحدها.',
    ),
    sections: [
      {
        h2: loc('Contenu d’une fiche', 'What a sheet holds', 'محتوى البطاقة'),
        items: [
          loc('Nom et description', 'Name and description', 'الاسم والوصف'),
          loc('Prix', 'Price', 'السعر'),
          loc('Photo optionnelle', 'Optional photo', 'صورة اختيارية'),
          loc('Catégorie parente', 'Parent category', 'التصنيف الأب'),
          loc('Disponible / masqué', 'Available / hidden', 'متاح / مخفي'),
        ],
      },
    ],
    faq: [
      {
        q: loc('Peut-on réordonner les plats ?', 'Can we reorder dishes?', 'هل يمكن إعادة ترتيب الأطباق؟'),
        a: loc('Oui, l’ordre se règle dans le dashboard.', 'Yes, order is set in the dashboard.', 'نعم، الترتيب من اللوحة.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/gestion-categories',
    parent: '/dashboard-restaurant',
    related: ['/fonctionnalites/categories', '/gestion-menu'],
    title: loc('Gestion des catégories | Scanosh', 'Category management | Scanosh', 'إدارة التصنيفات | Scanosh'),
    description: loc(
      'Créez l’arbre de catégories de votre carte : parents, enfants, images, ordre d’affichage.',
      'Build the category tree for your card: parents, children, images, display order.',
      'ابنِ شجرة تصنيفات بطاقتك: آباء، أبناء، صور، ترتيب العرض.',
    ),
    h1: loc('Gestion des catégories', 'Category management', 'إدارة التصنيفات'),
    answer: loc(
      'Les catégories Scanosh regroupent les plats. Un parent peut avoir des enfants. C’est la navigation du client sur le menu public.',
      'Scanosh categories group dishes. A parent can have children. That is guest navigation on the public menu.',
      'تصنيفات Scanosh تجمع الأطباق. للأب أبناء. هذه ملاحة الضيف في القائمة العامة.',
    ),
    sections: [
      {
        h2: loc('Bon réflexe', 'Good practice', 'ممارسة جيدة'),
        body: loc(
          'Nommez comme vos clients parlent (Petit-déj, Tajines) plutôt qu’avec un jargon interne.',
          'Name things the way guests speak (Breakfast, Tajines) rather than internal jargon.',
          'سمِّ كما يتكلم الضيوف (فطور، طاجين) لا بمصطلحات داخلية.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Catégorie vide ?', 'Empty category?', 'تصنيف فارغ؟'),
        a: loc('Une catégorie sans plat ni enfant n’apparaît pas sur le menu public.', 'A category with no dish and no child does not appear on the public menu.', 'تصنيف بلا طبق ولا ابن لا يظهر في القائمة العامة.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/gestion-prix',
    parent: '/dashboard-restaurant',
    related: ['/gestion-plats', '/blog/prix-menu-digital'],
    title: loc('Gestion des prix du menu | Scanosh', 'Menu price management | Scanosh', 'إدارة أسعار القائمة | Scanosh'),
    description: loc(
      'Changez un prix en quelques secondes. Le menu QR affiche le tarif actuel, sans sticker ni réimpression.',
      'Change a price in seconds. The QR menu shows the current tariff — no sticker, no reprint.',
      'غيّر سعراً في ثوان. قائمة QR تعرض التعريفة الحالية بلا ملصق ولا إعادة طباعة.',
    ),
    h1: loc('Gestion des prix', 'Price management', 'إدارة الأسعار'),
    answer: loc(
      'Le prix vit sur la fiche plat. Vous le modifiez dans le dashboard ; le téléphone du client affiche la nouvelle valeur au prochain scan (ou au rafraîchissement).',
      'Price lives on the dish sheet. Edit it in the dashboard; the guest phone shows the new value on the next scan (or refresh).',
      'السعر على بطاقة الطبق. تعدّله في اللوحة؛ هاتف الضيف يعرض القيمة الجديدة عند المسح التالي.',
    ),
    sections: [
      {
        h2: loc('Inflation et carte du jour', 'Inflation and daily card', 'التضخم وبطاقة اليوم'),
        body: loc(
          'Un ingrédient qui flambe le lundi n’oblige plus à jeter 200 menus. Vous corrigez trois fiches avant le service.',
          'An ingredient that spikes on Monday no longer means binning 200 menus. You fix three sheets before service.',
          'مكوّن يقفز الاثنين لم يعد يعني رمي 200 قائمة. تصحّح ثلاث بطاقات قبل الخدمة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Devise ?', 'Currency?', 'العملة؟'),
        a: loc('Vous saisissez le montant tel que vos clients le lisent (MAD, etc.).', 'You enter the amount as guests should read it (MAD, etc.).', 'تُدخل المبلغ كما يقرأه الضيوف (درهم، إلخ).'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/gestion-photos',
    parent: '/dashboard-restaurant',
    related: ['/fonctionnalites/photos', '/gestion-plats'],
    title: loc('Gestion des photos menu | Scanosh', 'Menu photo management | Scanosh', 'إدارة صور القائمة | Scanosh'),
    description: loc(
      'Uploadez logo, couverture, images de catégories et de plats. Le menu public Scanosh les affiche sur mobile.',
      'Upload logo, cover, category and dish images. The Scanosh public menu shows them on mobile.',
      'ارفع الشعار والغلاف وصور التصنيفات والأطباق. القائمة العامة تعرضها على الجوال.',
    ),
    h1: loc('Gestion des photos', 'Photo management', 'إدارة الصور'),
    answer: loc(
      'Les visuels se chargent depuis le dashboard (identité du café et fiches). Ils apparaissent sur le menu public dès qu’ils sont enregistrés.',
      'Visuals upload from the dashboard (cafe identity and sheets). They appear on the public menu as soon as they are saved.',
      'تُرفع الصور من اللوحة (هوية المقهى والبطاقات). تظهر في القائمة العامة بعد الحفظ.',
    ),
    sections: [
      {
        h2: loc('Priorité', 'Priority', 'أولوية'),
        body: loc(
          'Couverture + logo d’abord (reconnaissance), puis les 10 plats les plus vendus, puis le reste.',
          'Cover + logo first (recognition), then the 10 bestsellers, then the rest.',
          'الغلاف والشعار أولاً (تعرّف)، ثم أفضل 10 مبيعاً، ثم الباقي.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Faut-il un photographe ?', 'Do we need a photographer?', 'هل نحتاج مصوراً؟'),
        a: loc('Un smartphone en lumière naturelle suffit pour démarrer. Un shooting pro aide ensuite.', 'A smartphone in natural light is enough to start. A pro shoot helps later.', 'هاتف بضوء طبيعي يكفي للبدء. تصوير محترف يساعد لاحقاً.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/statistiques-menu',
    parent: '/dashboard-restaurant',
    related: ['/fonctionnalites/statistiques'],
    title: loc('Statistiques de menu | Scanosh', 'Menu statistics | Scanosh', 'إحصاءات القائمة | Scanosh'),
    description: loc(
      'Suivez l’activité de votre carte dans le dashboard Scanosh : volume, catégories, aperçu de gestion.',
      'Follow card activity in the Scanosh dashboard: volume, categories, management overview.',
      'تابع نشاط بطاقتك في لوحة Scanosh: حجم، تصنيفات، نظرة إدارة.',
    ),
    h1: loc('Statistiques de menu', 'Menu statistics', 'إحصاءات القائمة'),
    answer: loc(
      'Les statistiques Scanosh aident à voir si la carte est complète et récente. Ce n’est pas un outil de publicité : c’est un cockpit de gérant.',
      'Scanosh stats help you see if the card is complete and fresh. This is not an ads tool: it is a manager cockpit.',
      'إحصاءات Scanosh تساعد على معرفة اكتمال البطاقة وحداثتها. ليست أداة إعلان: هي مقصورة مدير.',
    ),
    sections: [
      {
        h2: loc('Lecture', 'How to read them', 'كيف تُقرأ'),
        body: loc(
          'Un menu avec peu de plats et sans photo se voit tout de suite. Complétez avant d’imprimer trop de QR.',
          'A menu with few dishes and no photo shows immediately. Fill it before you print too many QRs.',
          'قائمة بقليل من الأطباق وبلا صورة تظهر فوراً. أكملها قبل طباعة الكثير من QR.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Export Excel ?', 'Excel export?', 'تصدير Excel؟'),
        a: loc('Le cœur du produit est la carte live. Les exports avancés ne sont pas le premier usage.', 'The core product is the live card. Advanced exports are not the first use.', 'جوهر المنتج البطاقة الحية. التصدير المتقدم ليس الاستخدام الأول.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/menu-multilingue',
    parent: '/dashboard-restaurant',
    related: ['/fonctionnalites/multilingue', '/maroc/menu-digital'],
    title: loc('Menu multilingue | Scanosh', 'Multilingual menu | Scanosh', 'قائمة متعددة اللغات | Scanosh'),
    description: loc(
      'Interface Scanosh en FR / EN / AR. Rédigez vos plats dans la langue de vos clients, y compris en arabe.',
      'Scanosh UI in FR / EN / AR. Write dishes in your guests’ language, including Arabic.',
      'واجهة Scanosh بالفرنسية والإنجليزية والعربية. اكتب الأطباق بلغة ضيوفك بما فيها العربية.',
    ),
    h1: loc('Menu et espace multilingue', 'Multilingual menu and workspace', 'قائمة وفضاء متعدد اللغات'),
    answer: loc(
      'Vous choisissez la langue de l’interface. Les textes des plats sont libres : français, arabe, anglais, mélange. Utile pour un café touristique ou une équipe bilingue.',
      'You pick the UI language. Dish copy is freeform: French, Arabic, English, mixed. Useful for a tourist cafe or a bilingual team.',
      'تختار لغة الواجهة. نصوص الأطباق حرّة: فرنسية، عربية، إنجليزية، مزيج. مفيد لمقهى سياحي أو فريق ثنائي اللغة.',
    ),
    sections: [
      {
        h2: loc('RTL', 'RTL', 'RTL'),
        body: loc(
          'L’arabe inverse le sens de lecture de l’app gérant. Le menu public suit aussi la langue choisie pour les libellés de l’interface.',
          'Arabic flips reading direction in the manager app. The public menu also follows the selected language for chrome labels.',
          'العربية تعكس اتجاه القراءة في تطبيق المدير. القائمة العامة تتبع لغة الواجهة للتسميات.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Trois menus séparés ?', 'Three separate menus?', 'ثلاث قوائم منفصلة؟'),
        a: loc('Un menu, des textes que vous contrôlez. Pas trois bases à synchroniser.', 'One menu, copy you control. Not three databases to sync.', 'قائمة واحدة، نصوص تتحكم بها. ليست ثلاث قواعد للمزامنة.'),
      },
    ],
    ...CTA,
  }),
];
