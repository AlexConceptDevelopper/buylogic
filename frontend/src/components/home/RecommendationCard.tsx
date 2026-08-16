export default function RecommendationCard() {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            Recommandation
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Priorité actuelle
          </p>
        </div>

        <div className="rounded-full bg-rose-400/10 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
          URGENT
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Filtre hydraulique
        </p>

        <p className="mt-2 text-2xl font-bold">
          Commander 100 unités
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          La consommation augmente et le stock actuel risque de
          passer sous le seuil recommandé avant le prochain délai
          fournisseur.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/60 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Fournisseur recommandé
          </span>

          <span className="font-semibold text-slate-200">
            Alpha
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Prix unitaire
          </span>

          <span className="font-semibold text-cyan-300">
            18,50 €
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Délai
          </span>

          <span className="font-semibold text-slate-200">
            5 jours
          </span>
        </div>
      </div>
    </div>
  );
}