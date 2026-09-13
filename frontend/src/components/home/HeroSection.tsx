import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ZoomIn } from "lucide-react";

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Colonne Texte (7 colonnes sur grand écran) */}
        <div className="lg:col-span-7">
          {/* Badge "Pill" ultra-net */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            La gestion des achats devient prédictive
          </div>

          {/* Titre avec gradient pour le punch */}
          <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Achetez moins.{" "}
            <span className="bg-linear-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Achetez mieux.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl font-light">
            BuyLogic analyse vos stocks, votre consommation, vos commandes et vos
            fournisseurs pour vous dire instantanément{" "}
            <span className="font-semibold text-white underline decoration-cyan-500/50 decoration-2 underline-offset-4">
              quoi acheter, quand acheter et chez qui acheter.
            </span>
          </p>

          {/* Liens SEO discrets pour les PME */}
          <div className="mt-4 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1 text-sm text-slate-400">
            <p>
              Besoin d'un <Link to="/solutions/gestion-achats-pme" className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 hover:text-cyan-300">logiciel de gestion des achats pour PME</Link> ?
            </p>
            <p>
              D'une <Link to="/solutions/gestion-stock-pme" className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 hover:text-cyan-300">gestion de stock pour PME</Link> ?
            </p>
            <p>
              Ou d'une <Link to="/solutions/alternative-excel-gestion-stock" className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 hover:text-cyan-300">alternative moderne à Excel</Link> ?
            </p>
          </div>

          {/* Boutons d'action rehaussés */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center justify-center rounded-xl bg-cyan-400 px-7 py-4 text-center text-sm font-bold text-slate-950 shadow-xl shadow-cyan-400/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/40"
            >
              <span>Découvrir le dashboard</span>
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-7 py-4 text-center text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              Voir comment ça fonctionne
            </a>
          </div>
        </div>

        {/* Colonne Image / Mockup cliquable (5 colonnes sur grand écran) */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 opacity-30 blur-xl"></div>
          <div 
            onClick={() => setIsOpen(true)}
            className="relative rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl cursor-pointer group overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
          >
            <img 
              src="/dashboard-paysage.jpg" 
              alt="Dashboard BuyLogic - Gestion des stocks et achats PME" 
              className="rounded-xl w-full h-auto object-cover shadow-inner"
            />
            {/* Overlay au survol pour indiquer le zoom */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-medium text-sm rounded-xl backdrop-blur-xs">
              <ZoomIn className="w-5 h-5 text-cyan-400" />
              <span>Voir en taille réelle</span>
            </div>
          </div>
        </div>

      </div>

      {/* Modale de zoom (Lightbox) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-7xl w-full bg-slate-900 border border-white/10 rounded-2xl p-2 sm:p-4 shadow-2xl"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="cursor-pointer absolute -top-3 -right-3 sm:top-2 sm:right-2 z-10 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-full border border-white/10 transition shadow-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src="/dashboard-paysage.jpg" 
              alt="Dashboard BuyLogic en taille réelle" 
              className="rounded-xl w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}