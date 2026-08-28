import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSeoPaths } from '../frontend/src/content/seo/index.js';

const extra = ['/', '/blog', '/register'];
const urls = [...new Set([...extra, ...getSeoPaths()])].sort();
const outFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/public/sitemap.xml');

function priority(path) {
  if (path === '/') {
    return '1.0';
  }

  if (path === '/menu-digital' || path === '/menu-qr-code') {
    return '0.9';
  }

  if (path.startsWith('/blog')) {
    return '0.6';
  }

  return '0.8';
}

const body = urls
  .map((path) => {
    const loc = `https://www.scanosh.com${path === '/' ? '/' : path}`;
    const freq = path.startsWith('/blog') ? 'monthly' : 'weekly';
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority(path)}</priority>\n  </url>`;
  })
  .join('\n');

writeFileSync(
  outFile,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
);

console.log('wrote', urls.length);
