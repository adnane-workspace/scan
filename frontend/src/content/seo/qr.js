import { loc, page } from './helpers.js';

const CTA = {
  ctaTitle: loc('Générer mon QR Scanosh', 'Generate my Scanosh QR', 'أنشئ رمز Scanosh'),
  ctaBody: loc(
    'Un QR, un menu vivant. Créez votre espace et imprimez le code.',
    'One QR, a live menu. Create your workspace and print the code.',
    'رمز واحد، قائمة حية. أنشئ فضاءك واطبع الرمز.',
  ),
};

export const qrPages = [
  page({
    path: '/qr-code-restaurant',
    cluster: 'qr',
    parent: '/menu-qr-code',
    related: ['/menu-digital-restaurant', '/qr-code-table'],
    title: loc('QR code restaurant | Scanosh', 'Restaurant QR code | Scanosh', 'رمز QR للمطعم | Scanosh'),
    description: loc(
      'QR code restaurant pour ouvrir le menu digital sur table. Scanosh relie le code au dashboard : plats, prix, photos.',
      'Restaurant QR code to open the digital menu at the table. Scanosh ties the code to the dashboard: dishes, prices, photos.',
      'رمز QR للمطعم لفتح القائمة الرقمية على الطاولة. Scanosh يربط الرمز باللوحة: أطباق، أسعار، صور.',
    ),
    h1: loc('QR code restaurant', 'Restaurant QR code', 'رمز QR للمطعم'),
    answer: loc(
      'Un QR code restaurant est imprimé pour la salle. Le client scanne, lit la carte, voit les photos. Avec Scanosh, ce n’est pas un PDF : c’est le menu géré dans le dashboard.',
      'A restaurant QR code is printed for the room. Guests scan, read the card, see photos. With Scanosh it is not a PDF: it is the menu run from the dashboard.',
      'رمز QR للمطعم يُطبع للقاعة. يمسح الضيف ويقرأ البطاقة ويرى الصور. مع Scanosh ليس PDF: هي القائمة من اللوحة.',
    ),
    sections: [
      {
        h2: loc('Salle', 'Dining room', 'القاعة'),
        body: loc(
          'Un support par table, propre, à hauteur de regard. Évitez un seul QR perdu au fond de la salle.',
          'One support per table, clean, at eye height. Avoid a single lost QR at the back of the room.',
          'حامل لكل طاولة، نظيف، بارتفاع النظر. تجنّب رمزاً واحداً ضائعاً في آخر القاعة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Application à télécharger ?', 'App to download?', 'تطبيق للتحميل؟'),
        a: loc('Non. Appareil photo → navigateur.', 'No. Camera → browser.', 'لا. الكاميرا ← المتصفح.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/qr-code-cafe',
    cluster: 'qr',
    parent: '/menu-qr-code',
    related: ['/menu-digital-cafe', '/qr-code-table'],
    title: loc('QR code café | Scanosh', 'Cafe QR code | Scanosh', 'رمز QR للمقهى | Scanosh'),
    description: loc(
      'QR code pour café : comptoir, terrasse, vitrine. Le client ouvre boissons et pâtisseries sans application.',
      'Cafe QR code: counter, terrace, window. Guests open drinks and pastry with no app.',
      'رمز QR للمقهى: منضدة، تراس، واجهة. يفتح الضيف المشروبات والحلويات بلا تطبيق.',
    ),
    h1: loc('QR code café', 'Cafe QR code', 'رمز QR للمقهى'),
    answer: loc(
      'Au café, le QR sert surtout la file et la terrasse. Scanosh affiche une carte courte, visuelle, que vous changez quand le gâteau du jour est épuisé.',
      'In a cafe the QR mainly serves the queue and the terrace. Scanosh shows a short visual card you change when the day’s cake is gone.',
      'في المقهى يخدم الرمز الطابور والتراس. Scanosh يعرض بطاقة قصيرة بصرية تغيّرها عندما تنفد كعكة اليوم.',
    ),
    sections: [
      {
        h2: loc('Où le coller', 'Where to stick it', 'أين تلصقه'),
        body: loc(
          'Comptoir (file), tables terrasse, vitrine pour le take-away. Un seul URL, plusieurs supports.',
          'Counter (queue), terrace tables, window for take-away. One URL, several supports.',
          'المنضدة (الطابور)، طاولات التراس، الواجهة للسفري. رابط واحد، حوامل عدة.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Utile si on commande à la caisse ?', 'Useful if we order at the till?', 'مفيد إن طُلب عند الصندوق؟'),
        a: loc('Oui : le client arrive déjà décidé. La caisse va plus vite.', 'Yes: guests arrive decided. The till moves faster.', 'نعم: يصل الضيف وقد قرر. الصندوق أسرع.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/qr-code-snack',
    cluster: 'qr',
    parent: '/menu-qr-code',
    related: ['/menu-digital-snack'],
    title: loc('QR code snack | Scanosh', 'Snack QR code | Scanosh', 'رمز QR للوجبات السريعة | Scanosh'),
    description: loc(
      'QR code snack et fast-casual : menus combo, sandwiches, prix lisibles avant le comptoir.',
      'Snack and fast-casual QR: combos, sandwiches, readable prices before the counter.',
      'رمز QR للوجبات السريعة: قوائم، سندويشات، أسعار واضحة قبل المنضدة.',
    ),
    h1: loc('QR code snack', 'Snack QR code', 'رمز QR للوجبات السريعة'),
    answer: loc(
      'Dans un snack, le QR raccourcit la décision. Scanosh met prix et photos sous les yeux pendant que la file avance.',
      'In a snack bar the QR shortens the decision. Scanosh puts prices and photos in front of guests while the line moves.',
      'في الوجبات السريعة يقصّر الرمز القرار. Scanosh يضع الأسعار والصور أمام الضيف بينما يتحرك الطابور.',
    ),
    sections: [
      {
        h2: loc('Rush', 'Rush', 'الذروة'),
        body: loc(
          'Masquez un sandwich en rupture en 10 secondes. Le QR vitrine n’a pas à être réimprimé à 13 h.',
          'Hide a sold-out sandwich in 10 seconds. The window QR does not need reprinting at 1 pm.',
          'أخفِ سندويشاً نافداً في 10 ثوان. رمز الواجهة لا يُعاد طبعه الساعة 13.',
        ),
      },
    ],
    faq: [
      {
        q: loc('Un QR par formule ?', 'One QR per combo?', 'رمز لكل قائمة؟'),
        a: loc('Non. Un QR pour tout le menu ; les formules sont des fiches dans Scanosh.', 'No. One QR for the whole menu; combos are sheets in Scanosh.', 'لا. رمز واحد لكل القائمة؛ القوائم بطاقات في Scanosh.'),
      },
    ],
    ...CTA,
  }),
  page({
    path: '/qr-code-table',
    cluster: 'qr',
    parent: '/menu-qr-code',
    related: ['/qr-code-restaurant', '/fonctionnalites/qr-code'],
    title: loc('QR code sur table | Scanosh', 'Table QR code | Scanosh', 'رمز QR على الطاولة | Scanosh'),
    description: loc(
      'Guide du QR code sur table : placement, hygiène, un code par table, menu toujours à jour avec Scanosh.',
      'Table QR code guide: placement, hygiene, one code per table, menu always current with Scanosh.',
      'دليل رمز QR على الطاولة: موضع، نظافة، رمز لكل طاولة، قائمة دائماً محدّثة مع Scanosh.',
    ),
    h1: loc('QR code sur table', 'QR code on the table', 'رمز QR على الطاولة'),
    answer: loc(
      'Le QR sur table est le geste le plus clair pour le client. Chez Scanosh, chaque table peut afficher le même code (même menu) : l’important est qu’il soit lisible, éclairé, propre.',
      'A table QR is the clearest guest gesture. In Scanosh every table can show the same code (same menu): it must be readable, lit and clean.',
      'رمز الطاولة أوضح إشارة للضيف. في Scanosh يمكن لكل طاولة نفس الرمز (نفس القائمة): يجب أن يكون مقروءاً ومضاءً ونظيفاً.',
    ),
    sections: [
      {
        h2: loc('Bonnes pratiques', 'Good practices', 'ممارسات جيدة'),
        items: [
          loc('Support stable, pas un papier froissé', 'Stable support, not crumpled paper', 'حامل ثابت لا ورق مجعّد'),
          loc('Taille suffisante pour l’appareil photo', 'Large enough for the camera', 'حجم كاف للكاميرا'),
          loc('Contraste fort (foncé sur clair)', 'Strong contrast (dark on light)', 'تباين قوي (غامق على فاتح)'),
          loc('Nettoyage avec le reste du couvert', 'Cleaned with the rest of the place setting', 'تنظيف مع بقية الطاولة'),
        ],
      },
    ],
    faq: [
      {
        q: loc('Un QR différent par table ?', 'A different QR per table?', 'رمز مختلف لكل طاولة؟'),
        a: loc('Pour un menu unique, non. Un même QR suffit. Des QR par table servent surtout si vous liez table et commande (hors scope actuel).', 'For one menu, no. The same QR is enough. Per-table QRs matter mostly if you bind table and order (out of current scope).', 'لقائمة واحدة، لا. نفس الرمز يكفي. رموز لكل طاولة تفيد إن رُبطت الطاولة بالطلب (خارج النطاق الحالي).'),
      },
    ],
    ...CTA,
  }),
];
