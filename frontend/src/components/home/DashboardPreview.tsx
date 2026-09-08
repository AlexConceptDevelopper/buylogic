import ProductAlertList from "./ProductAlertList";
import RecommendationCard from "./RecommendationCard";
import StatCard from "../StatCard";

export default function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      {/* Conteneur avec effet de lueur externe subtil */}
      <div className="relative rounded-3xl p-px bg-linear-to-b from-white/20 via-white/5 to-transparent shadow-2xl shadow-cyan-950/50">
        <div className="overflow-hidden rounded-[23px] bg-slate-900/90 backdrop-blur-2xl">
          
          {/* Barre de titre façon application */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-slate-950/40">
            <div className="flex items-center gap-3">
              {/* Les 3 points macOS */}
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <p className="text-xs font-medium text-slate-400">
                Atelier Dupont Industrie — <span className="text-slate-200">Espace Global</span>
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Système opérationnel
            </div>
          </div>

          {/* Grille de stats */}
          <div className="grid gap-px bg-white/5 md:grid-cols-4">
            <StatCard label="Produits suivis" value="15" detail="+3 ce mois" icon="▣" />
            <StatCard label="Stock total" value="1 248" detail="unités" icon="▤" />
            <StatCard label="Commandes en cours" value="5" detail="2 à surveiller" icon="◫" warning />
            <StatCard label="Recommandations" value="5" detail="3 prioritaires" icon="✦" danger />
          </div>

          {/* Contenu principal du dashboard */}
          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_0.8fr] bg-slate-950/20">
            <ProductAlertList />
            <RecommendationCard />
          </div>

        </div>
      </div>
    </section>
  );
}