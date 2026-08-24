import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductionRecommendations } from "../../api/productionRecommendationService.api";
import useAsync from "../../hooks/useAsync";
import type { ProductionRecommendation } from "../../types/productionRecommendation";

export default function ProductionRecommendationPreview() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<ProductionRecommendation[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  const { loading, error, execute } = useAsync<ProductionRecommendation[]>();

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await execute(() => getProductionRecommendations());
      if (data) {
        setRecommendations(data);
      }
    };
    loadRecommendations();
  }, [execute]);

  const recommendation = useMemo(() => {
    if (recommendations.length === 0) return null;
    return [...recommendations].sort(
      (a, b) => new Date(a.estimatedStockoutDate).getTime() - new Date(b.estimatedStockoutDate).getTime(),
    )[0];
  }, [recommendations]);

  const handleLaunchProduction = async () => {
    if (!recommendation) return;

    try {
      setLoadingAction(true);
      // Ici tu rediriges vers ton module de fabrication / ordre de fabrication (OF)
      navigate(`/manufacturing/orders/new?product=${recommendation.idProduct}&qty=${recommendation.recommendedQuantity}`);
    } catch (err) {
      console.error("Erreur lors du lancement de la production :", err);
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-indigo-400/10 bg-indigo-400/3 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Ordre de fabrication prioritaire</p>
            <p className="mt-1 text-xs text-slate-500">Analyse des besoins de production...</p>
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/5" />
        </div>
      </section>
    );
  }

  if (error || !recommendation) {
    return (
      <section className="rounded-2xl border border-indigo-400/10 bg-indigo-400/3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Ordre de fabrication prioritaire</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Aucun assemblage requis pour le moment.</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
            À jour
          </span>
        </div>
      </section>
    );
  }

  const formattedStockoutDate = new Date(recommendation.estimatedStockoutDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className="rounded-2xl border border-indigo-400/10 bg-indigo-400/3 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Ordre de fabrication prioritaire</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Assemblage conseillé le plus urgent.</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-300">
          Production
        </span>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {recommendation.productReference}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Fabriquer {recommendation.recommendedQuantity.toLocaleString("fr-FR")} unités
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{recommendation.reason}</p>
      </div>

      <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">Produit fini</span>
          <span className="text-right text-sm font-semibold text-slate-200">{recommendation.productName}</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">Rupture estimée</span>
          <span className="text-sm font-semibold text-rose-300">{formattedStockoutDate}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLaunchProduction}
        disabled={loadingAction}
        className="mt-5 flex w-full cursor-pointer items-center justify-center rounded-xl bg-indigo-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-indigo-300 disabled:opacity-50"
      >
        {loadingAction ? "Préparation..." : "Lancer la fabrication"}
      </button>
    </section>
  );
}