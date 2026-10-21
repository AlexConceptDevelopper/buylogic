import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  FileText,
  BookOpen,
  HelpCircle,
  Factory,
  FileSpreadsheet,
  ShoppingCart,
  Package,
  Calculator,
} from "lucide-react";

export default function Navbar() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-cyan-400/20">
              B
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-tight block leading-none">
                BuyLogic
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mt-0.5">
                LOGICIEL D'ACHAT & STOCKS PME
              </span>
            </div>
          </Link>

          {/* Navigation Centrale (Aérée) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {/* Dropdown Solutions */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-white py-2 cursor-pointer transition">
                <span>Solutions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${solutionsOpen ? "rotate-180 text-cyan-400" : ""}`}
                />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full left-0 w-64 bg-slate-900 border border-white/10 rounded-xl p-2 shadow-2xl space-y-1 backdrop-blur-xl">
                  <Link
                    to="/solutions/gestion-achats-pme"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Gestion des Achats</div>
                      <div className="text-[10px] text-slate-400">
                        Commandes & Fournisseurs
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/gestion-stock-pme"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white"
                  >
                    <Package className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Gestion des Stocks</div>
                      <div className="text-[10px] text-slate-400">
                        Suivi temps réel & alertes
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/logiciel-achat-pme-industrie"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white"
                  >
                    <Factory className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">
                        PME Industrielle & Ateliers
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Pour pièces détachées & MRO
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/solutions/alternative-excel-gestion-stock"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Alternative Excel</div>
                      <div className="text-[10px] text-slate-400">
                        Remplacer vos tableurs
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Dropdown Ressources */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-white py-2 cursor-pointer transition">
                <span>Ressources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${resourcesOpen ? "rotate-180 text-cyan-400" : ""}`}
                />
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 w-72 bg-slate-900 border border-white/10 rounded-xl p-2 shadow-2xl space-y-1 backdrop-blur-xl">
                  <Link
                    to="/docs"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white"
                  >
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Documentation</div>
                      <div className="text-[10px] text-slate-400">
                        Guides d'utilisation & API
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/blog"
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold">Blog Logistique</div>
                      <div className="text-[10px] text-slate-400">
                        Conseils & méthodes PME
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/outils/calculateur-stock-securite"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white border border-cyan-500/20 bg-cyan-500/5 mt-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calculator className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-bold text-cyan-300">
                          Calculateur Stock de Sécurité
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Outil de calcul interactif
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950">
                      Gratuit
                    </span>
                  </Link>
                  <Link
                    to="/outils/generateur-bon-de-commande-pdf-gratuit"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition text-xs text-slate-300 hover:text-white border border-cyan-500/20 bg-cyan-500/5 mt-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-bold text-cyan-300">
                          Générateur Bon de Commande
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Création PDF gratuite
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950">
                      Gratuit
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/#comment-ca-marche"
              className="hover:text-white transition"
            >
              Comment ça marche
            </Link>
          </nav>

          {/* Boutons Connexion / Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-200 border border-white/10 hover:border-white/20 rounded-xl transition hover:bg-slate-900"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition shadow-md shadow-cyan-400/20"
            >
              Essai Gratuit
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
