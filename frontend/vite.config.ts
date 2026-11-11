import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePrerender from 'vite-plugin-prerender';
import { resolve } from 'path';
import { articles } from './src/data/articles.ts';

const blogRoutes = articles.map((article: { slug: string }) => `/blog/${article.slug}`);

export default defineConfig({
  plugins: [
    react(),
    // @ts-ignore
    vitePrerender.default({
      staticDir: resolve(__dirname, 'dist'),
      routes: [
        '/',
        '/blog',
        '/outils/generateur-bon-de-commande-pdf-gratuit',
        '/outils/calculateur-stock-securite',
        '/solutions/gestion-achats-pme',
        '/solutions/gestion-stock-pme',
        '/solutions/alternative-excel-gestion-stock',
        '/solutions/logiciel-achat-pme-industrie',
        '/mentions-legales',
        '/cgu',
        '/confidentialite',
        ...blogRoutes,
      ],
    }),
  ],
});