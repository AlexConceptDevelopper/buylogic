import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950 text-slate-300 print:hidden text-xs w-full">
      {/* Conteneur principal en w-full avec un padding horizontal généreux */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-12">
        
        {/* GRILLE 4 COLONNES PLEINE LARGEUR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* COLONNE 1 : BRAND & ÉDITEUR */}
          <div className="space-y-3">
            <p className="text-white font-bold text-lg tracking-tight">BuyLogic</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plateforme SaaS d'optimisation des achats et de la gestion de stock pour PME & TPE.
            </p>
            <p className="text-slate-400 text-xs pt-1">
              Une solution éditée par{" "}
              <a 
                href="https://www.cubtaik.fr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-200 hover:text-cyan-400 font-semibold underline transition-colors"
              >
                CubTaik
              </a>
            </p>
          </div>

          {/* COLONNE 2 : SOLUTIONS (SEO) */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-xs uppercase tracking-wider">Solutions</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/solutions/gestion-achats-pme" className="hover:text-cyan-400 transition-colors">
                  Gestion des Achats PME
                </Link>
              </li>
              <li>
                <Link to="/solutions/gestion-stock-pme" className="hover:text-cyan-400 transition-colors">
                  Gestion des Stocks PME
                </Link>
              </li>
              <li>
                <Link to="/solutions/alternative-excel-gestion-stock" className="hover:text-cyan-400 transition-colors">
                  Alternative Excel Stock
                </Link>
              </li>
              <li>
                <Link to="/solutions/logiciel-achat-pme-industrie" className="hover:text-cyan-400 transition-colors">
                  PME Industrielles & Ateliers
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE 3 : RESSOURCES & OUTILS */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-xs uppercase tracking-wider">Ressources & Outils</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/blog" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Blog & Guides Achats</span>
                </Link>
              </li>
              <li>
                <Link to="/outils/generateur-bon-de-commande-pdf-gratuit" className="hover:text-cyan-400 transition-colors">
                  Générateur Bon de Commande PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* COLONNE 4 : LÉGAL & RÉSEAUX SOCIAUX */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-xs uppercase tracking-wider">Informations Légales</p>
            <ul className="space-y-2 text-slate-400 mb-4">
              <li>
                <Link to="/mentions-legales" className="hover:text-slate-200 transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link to="/cgu" className="hover:text-slate-200 transition-colors">
                  Conditions Générales d'Utilisation
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="hover:text-slate-200 transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
            </ul>

            {/* Réseaux Sociaux */}
            <div className="pt-2">
              <p className="text-white font-semibold text-[11px] mb-2">Suivez-nous</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/alexandre-cubizolle-41325a436/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-400 text-slate-300 transition-all"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61593994304213&locale=fr_FR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-400 text-slate-300 transition-all"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.04c-5.5 0-10 4.5-10 10 0 5 3.66 9.15 8.44 9.9v-7.01H7.9v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v7.01c4.78-.75 8.44-4.9 8.44-9.9 0-5.5-4.5-10-10-10z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/buylogic.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-400 text-slate-300 transition-all"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* BARRE DU BAS : COPYRIGHT PLEINE LARGEUR */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 BuyLogic. Tous droits réservés.</p>
          <p>Logiciel de gestion de stock & d'achats PME</p>
        </div>
      </div>
    </footer>
  );
}