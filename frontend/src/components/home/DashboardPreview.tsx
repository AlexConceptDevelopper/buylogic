import ProductAlertList from "./ProductAlertList";
import RecommendationCard from "./RecommendationCard";
import StatCard from "../StatCard";

export default function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Vue d'ensemble
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Atelier Dupont Industrie
              </p>
            </div>

            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-medium text-emerald-300">
              Système opérationnel
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/5 md:grid-cols-4">
          <StatCard
            label="Produits suivis"
            value="15"
            detail="+3 ce mois"
            icon="▣"
          />

          <StatCard
            label="Stock total"
            value="1 248"
            detail="unités"
            icon="▤"
          />

          <StatCard
            label="Commandes en cours"
            value="5"
            detail="2 à surveiller"
            icon="◫"
            warning
          />

          <StatCard
            label="Recommandations"
            value="5"
            detail="3 prioritaires"
            icon="✦"
            danger
          />
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr]">
          <ProductAlertList />
          <RecommendationCard />
        </div>
      </div>
    </section>
  );
}