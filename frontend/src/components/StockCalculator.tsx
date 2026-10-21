import { useState } from "react";
import { Calculator, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function StockCalculator() {
  // Réponses saisies par l'utilisateur (valeurs par défaut d'exemple)
  const [dailyConsump, setDailyConsump] = useState<number | "">(10);
  const [avgLeadTime, setAvgLeadTime] = useState<number | "">(5);
  const [maxLeadTime, setMaxLeadTime] = useState<number | "">(9);

  // Conversions sécurisées pour les calculs
  const consump = typeof dailyConsump === "number" ? dailyConsump : 0;
  const avgLT = typeof avgLeadTime === "number" ? avgLeadTime : 0;
  const maxLT = typeof maxLeadTime === "number" ? maxLeadTime : 0;

  // Calculs dynamiques
  // 1. Stock de Sécurité = (Délai Max - Délai Moyen) * Consommation Journalière
  const safetyStock = Math.max(0, (maxLT - avgLT) * consump);

  // 2. Point de Commande (Seuil de réassort) = (Consommation Journalière * Délai Moyen) + Stock de Sécurité
  const reorderPoint = consump * avgLT + safetyStock;

  return (
    <div className="my-10 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Titre du Widget */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 font-bold">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            Calculateur Interactif de Stock de Sécurité
          </h3>
          <p className="text-xs text-slate-400">
            Saisissez vos données ci-dessous pour obtenir instantanément vos seuils d'alerte.
          </p>
        </div>
      </div>

      {/* Formulaire Saisie Utilisateur */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {/* Champ 1 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            Consommation moyenne / jour :
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="Ex: 10"
              value={dailyConsump}
              onChange={(e) =>
                setDailyConsump(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">
              unités
            </span>
          </div>
        </div>

        {/* Champ 2 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            Délai moyen de livraison :
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="Ex: 5"
              value={avgLeadTime}
              onChange={(e) =>
                setAvgLeadTime(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">
              jours
            </span>
          </div>
        </div>

        {/* Champ 3 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            Délai maximum (en cas de retard) :
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="Ex: 9"
              value={maxLeadTime}
              onChange={(e) =>
                setMaxLeadTime(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-semibold">
              jours
            </span>
          </div>
        </div>
      </div>

      {/* Cartes de Résultats */}
      <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-xl bg-slate-950 border border-white/5">
        {/* Résultat 1 : Stock de Sécurité */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Stock de Sécurité Recommandé
            </span>
            <span className="text-xl font-black text-cyan-300">
              {safetyStock} <span className="text-xs font-normal text-slate-400">unités</span>
            </span>
          </div>
        </div>

        {/* Résultat 2 : Point de Commande */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Seuil de Réassort (Point de commande)
            </span>
            <span className="text-xl font-black text-amber-300">
              {reorderPoint} <span className="text-xs font-normal text-slate-400">unités</span>
            </span>
          </div>
        </div>
      </div>

      {/* CTA Réorientation vers le Bon de Commande / BuyLogic */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400 text-center sm:text-left">
          Dès que votre stock physique atteint <strong>{reorderPoint} unités</strong>, passez commande !
        </p>
        <Link
          to="/outils/generateur-bon-de-commande-pdf-gratuit"
          className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shrink-0"
        >
          Créer le Bon de Commande PDF
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}