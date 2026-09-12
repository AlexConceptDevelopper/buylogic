import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IntroDoc from "../components/docs/IntroDoc";
import CsvImportDoc from "../components/docs/CsvImportDoc";
import ProductManagementDoc from "../components/docs/ProductManagementDoc";
import SupplierManagementDoc from "../components/docs/SupplierManagementDoc";
import StockManagementDoc from "../components/docs/StockManagementDoc";
import PredictiveEngineDoc from "../components/docs/PredictiveEngineDoc";
import CommandesDoc from "../components/docs/CommandesDoc";

interface Article {
  id: string;
  title: string;
  keywords?: string[];
}

interface Section {
  id: string;
  title: string;
  articles: Article[];
}

const docSections: Section[] = [
  {
    id: "getting-started",
    title: "Premiers pas",
    articles: [
      {
        id: "introduction",
        title: "Qu'est-ce que BuyLogic ?",
        keywords: [
          "buylogic",
          "saas",
          "gestion",
          "stocks",
          "approvisionnements",
          "achats",
          "moteur prédictif",
          "paramètres",
          "entreprise",
          "catalogue",
          "fournisseurs",
        ],
      },
    ],
  },
  {
    id: "inventory-purchasing",
    title: "Achats & Stocks",
    articles: [
      {
        id: "suppliers",
        title: "1. Gérer les fournisseurs",
        keywords: [
          "fournisseur",
          "fournisseurs",
          "prestataires",
          "coordonnées",
          "approvisionnement",
          "achat",
        ],
      },
      {
        id: "products",
        title: "2. Créer et gérer un produit",
        keywords: [
          "produit",
          "produits",
          "catalogue",
          "sku",
          "seuil",
          "critique",
          "prix d'achat",
          "article",
        ],
      },
      {
        id: "stock",
        title: "3. Suivi et ajustement des stocks",
        keywords: [
          "suivi",
          "stocks",
          "ajustement",
          "inventaire",
          "rupture",
          "réserves",
          "quantités",
        ],
      },
      {
        id: "commandes",
        title: "4. Gestion des commandes",
        keywords: [
          "commandes",
          "achats",
          "bon de commande",
          "pdf",
          "réception",
          "statuts",
          "fournisseurs",
        ],
      },
    ],
  },
  {
    id: "advanced",
    title: "Fonctionnalités avancées",
    articles: [
      {
        id: "import",
        title: "Importer un fichier CSV",
        keywords: [
          "csv",
          "import",
          "masse",
          "ventes",
          "historique",
          "aaaa-mm-jj",
          "sku",
          "quantité",
          "mapping",
        ],
      },
      {
        id: "predictive",
        title: "Comment fonctionne le moteur prédictif ?",
        keywords: [
          "prédictif",
          "moteur",
          "tendances",
          "consommation",
          "ventes",
          "rupture",
          "volumes",
          "optimisation",
        ],
      },
    ],
  },
];

// Distance de Levenshtein (tolérance de 2 fautes, insensible à la casse)
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function approximateMatch(query: string, text: string): boolean {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return false;
  const cleanText = text.toLowerCase();

  if (cleanText.includes(cleanQuery)) return true;

  const words = cleanText.split(/\s+/);
  const queryWords = cleanQuery.split(/\s+/);

  for (const qw of queryWords) {
    if (qw.length < 2) continue;
    let found = false;
    for (const tw of words) {
      const threshold = qw.length <= 4 ? 1 : 2;
      if (levenshteinDistance(qw, tw) <= threshold) {
        found = true;
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}

export default function DocsPage() {
  const [activeArticle, setActiveArticle] = useState("introduction");
  const [searchQuery, setSearchQuery] = useState("");

  // Recherche globale sur les titres et les mots-clés du contenu de chaque article
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return docSections;

    return docSections
      .map((section) => ({
        ...section,
        articles: section.articles.filter(
          (art) =>
            approximateMatch(searchQuery, art.title) ||
            (art.keywords &&
              art.keywords.some((kw) => approximateMatch(searchQuery, kw))),
        ),
      }))
      .filter((section) => section.articles.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-1/3 h-125 w-125 rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold text-cyan-300">
              Centre d'aide & Documentation
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Tout savoir sur <span className="text-cyan-400">BuyLogic</span>.
            </h1>
            <p className="mt-4 text-slate-400 text-lg">
              Guides d'installation, gestion des produits, fournisseurs,
              commandes et moteur de prédiction.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher (ex: fournisseur, stock...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none backdrop-blur-xl shadow-lg"
            />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {filteredSections.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Aucun résultat trouvé.
              </p>
            ) : (
              filteredSections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1.5 border-l border-white/10 pl-3">
                    {section.articles.map((article) => {
                      const isActive = activeArticle === article.id;
                      return (
                        <li key={article.id}>
                          <button
                            onClick={() => setActiveArticle(article.id)}
                            className={`w-full text-left text-sm transition py-1.5 px-3 rounded-lg cursor-pointer ${
                              isActive
                                ? "font-semibold text-cyan-400 bg-cyan-400/10 border-l-2 border-cyan-400"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {article.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}

            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold text-white">
                Besoin d'aide en plus ?
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Une question technique ou un besoin spécifique ? Écrivez-nous.
              </p>
              <a
                href="mailto:contact@buylogic.fr"
                className="mt-3 block w-full text-center rounded-xl bg-white/5 border border-white/10 py-2 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
              >
                Contacter le support
              </a>
            </div>
          </aside>

          <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 md:p-12 backdrop-blur-xl shadow-2xl">
            {activeArticle === "introduction" && <IntroDoc />}
            {activeArticle === "import" && <CsvImportDoc />}
            {activeArticle === "suppliers" && <SupplierManagementDoc />}
            {activeArticle === "products" && <ProductManagementDoc />}
            {activeArticle === "stock" && <StockManagementDoc />}
            {activeArticle === "commandes" && <CommandesDoc />}
            {activeArticle === "predictive" && <PredictiveEngineDoc />}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
