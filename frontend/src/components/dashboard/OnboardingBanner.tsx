import { Building, Truck, PackagePlus, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface OnboardingBannerProps {
  onComplete: () => void;
}

export default function OnboardingBanner({ onComplete }: OnboardingBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-linear-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-6 shadow-xl">
      {/* Effet lumineux décoratif en arrière-plan */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20">
            <Building className="h-3.5 w-3.5" />
            Premiers pas sur BuyLogic
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Configurez votre espace de gestion
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Finalisez ces étapes pour personnaliser vos bons de commande PDF et paramétrer votre chaîne d'approvisionnement.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={onComplete}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 cursor-pointer"
          >
            Passer le guide
          </button>
        </div>
      </div>

      {/* Grille des 3 étapes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
        
        {/* Étape 1 : Infos entreprise & Logo */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">1. Infos & Logo</h3>
              <p className="text-xs text-slate-400 mt-0.5">SIRET et adresse pour vos PDF.</p>
            </div>
          </div>
          <Link
            to="/params" 
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-3 py-1.5 text-xs font-medium transition-colors border border-indigo-500/30 w-full"
          >
            Remplir <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Étape 2 : Fournisseurs */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">2. Fournisseurs</h3>
              <p className="text-xs text-slate-400 mt-0.5">Référencez vos sources d'achat.</p>
            </div>
          </div>
          <Link
            to="/suppliers" // Ajuste vers ta route fournisseurs si besoin
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-3 py-1.5 text-xs font-medium transition-colors border border-amber-500/30 w-full"
          >
            Ajouter <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Étape 3 : Produits */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">3. Produits</h3>
              <p className="text-xs text-slate-400 mt-0.5">Alimentez votre catalogue.</p>
            </div>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-3 py-1.5 text-xs font-medium transition-colors border border-emerald-500/30 w-full"
          >
            Créer <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>

      {/* Bouton de validation globale de l'onboarding */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
          J'ai terminé la configuration
        </button>
      </div>
    </div>
  );
}