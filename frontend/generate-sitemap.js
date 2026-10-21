import fs from 'fs';
import path from 'path';
import { articles } from './src/data/articles';

const DOMAIN = 'https://www.buylogic.fr';
const today = new Date().toISOString().split('T')[0];

// Liste exhaustive de toutes tes pages statiques & landing pages SEO
const staticPages = [
  // Page d'accueil principal
  { route: '', changefreq: 'daily', priority: '1.0' },

  // Outils métiers gratuits (Aspirateurs SEO & Backlinks)
  { route: '/outils/generateur-bon-de-commande-pdf-gratuit', changefreq: 'weekly', priority: '0.9' },
  { route: '/outils/calculateur-stock-securite', changefreq: 'weekly', priority: '0.9' },

  // Landing pages Solutions
  { route: '/solutions/gestion-achats-pme', changefreq: 'weekly', priority: '0.9' },
  { route: '/solutions/gestion-stock-pme', changefreq: 'weekly', priority: '0.9' },
  { route: '/solutions/alternative-excel-gestion-stock', changefreq: 'weekly', priority: '0.9' },
  { route: '/solutions/logiciel-achat-pme-industrie', changefreq: 'weekly', priority: '0.9' },

  // Hub Content / Blog
  { route: '/blog', changefreq: 'daily', priority: '0.8' },
  { route: '/docs', changefreq: 'weekly', priority: '0.7' },

  // Pages Conversion / Auth
  { route: '/register', changefreq: 'monthly', priority: '0.6' },
  { route: '/login', changefreq: 'monthly', priority: '0.5' },

  // Pages Légales
  { route: '/mentions-legales', changefreq: 'yearly', priority: '0.2' },
  { route: '/cgu', changefreq: 'yearly', priority: '0.2' },
  { route: '/confidentialite', changefreq: 'yearly', priority: '0.2' },
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Pages statiques, landing pages & outils -->
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

  <!-- Articles de blog (générés dynamiquement) -->
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${DOMAIN}/blog/${article.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}

</urlset>`;

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const targetPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(targetPath, sitemap);
  console.log(`✅ Sitemap.xml généré avec succès dans ${targetPath}`);
}

generateSitemap();