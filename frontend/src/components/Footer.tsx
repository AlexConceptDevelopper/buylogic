import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>© 2026 BuyLogic. Tous droits réservés.</p>
          <p className="text-xs text-slate-600">Une solution éditée par CubTaik.</p>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <Link to="/mentions-legales" className="transition hover:text-slate-300">Mentions légales</Link>
          <Link to="/cgu" className="transition hover:text-slate-300">CGU</Link>
          <Link to="/confidentialite" className="transition hover:text-slate-300">Politique de confidentialité</Link>
        </div>

        <p className="text-xs">Acheter au bon moment.</p>
      </div>
    </footer>
  );
}