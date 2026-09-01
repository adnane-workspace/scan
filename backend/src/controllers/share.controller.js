import { asyncHandler } from '../middleware/asyncHandler.js';
import { getSharePreview } from '../services/share.service.js';
import { escapeHtml } from '../utils/escapeHtml.js';

function shareHtml(preview) {
  const title = escapeHtml(preview.title);
  const description = escapeHtml(preview.description);
  const image = escapeHtml(preview.image);
  const target = escapeHtml(preview.target);

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Scanosh" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${target}" />
    ${image ? `<meta property="og:image" content="${image}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${image ? `<meta name="twitter:image" content="${image}" />` : ''}
    <link rel="canonical" href="${target}" />
    <meta http-equiv="refresh" content="0;url=${target}" />
  </head>
  <body>
    <p><a href="${target}">Ouvrir le menu</a></p>
  </body>
</html>`;
}

export const getShare = asyncHandler(async (req, res) => {
  const preview = await getSharePreview(req.validated.params.slug, {
    sectionKey: req.validated.query.section,
    categoryId: req.validated.query.category,
    productId: req.validated.query.product,
  });

  if (!preview) {
    res.status(404).type('html').send('<!doctype html><title>Introuvable</title><p>Lien introuvable.</p>');
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  res.status(200).type('html').send(shareHtml(preview));
});
