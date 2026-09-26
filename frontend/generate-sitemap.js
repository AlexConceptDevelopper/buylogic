import fs from 'fs';
import path from 'path';
import { articles } from './src/data/articles.ts';

const DOMAIN = 'https://buylogic.fr';
const today = new Date().toISOString().split('T')[0]; // Date du jour (ex: 2026-09-26)

// Liste exacte de tes pages statiques avec leurs priorités et fréquences d'origine
const staticPages = [
  { route: '', changefreq: 'weekly', priority: '1.0' },
  { route: '/login', changefreq: 'monthly', priority: '0.5' },
  { route: '/register', changefreq: 'monthly', priority: '0.6' },
  { route: '/forgot-password', changefreq: 'yearly', priority: '0.2' },
  { route: '/mentions-legales', changefreq: 'yearly', priority: '0.3' },
  { route: '/cgu', changefreq: 'yearly', priority: '0.3' },
  { route: '/confidentialite', changefreq: 'yearly', priority: '0.3' },
  { route: '/solutions/gestion-achats-pme', changefreq: 'weekly', priority: '0.9' },
  { route: '/solutions/gestion-stock-pme', changefreq: 'weekly', priority: '0.9' },
  { route: '/solutions/alternative-excel-gestion-stock', changefreq: 'weekly', priority: '0.9' },
  { route: '/docs', changefreq: 'weekly', priority: '0.8' },
  { route: '/blog', changefreq: 'weekly', priority: '0.8' },
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Pages statiques -->
  ${staticPages
    .map(
      (p) => `
  <url>
    <loc>${DOMAIN}${p.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('')}

  <!-- Articles de blog générés automatiquement -->
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${DOMAIN}/blog/${article.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}

</urlset>`;

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(`✅ Sitemap généré avec succès (${staticPages.length} pages statiques + ${articles.length} articles) !`);
}

generateSitemap();