import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrdersFromRecommendations } from "../../api/purchaseOrder.api";
import { getPurchaseRecommendations } from "../../api/purchaseRecommendation.api";
import { getProductionRecommendations } from "../../api/productionRecommendationService.api";
import useAsync from "../../hooks/useAsync";

import type { PurchaseRecommendation } from "../../types/purchaseRecommendation";
import type { ProductionRecommendation } from "../../types/productionRecommendation";

type UnifiedRecommendation = 
  | (PurchaseRecommendation & { type: "PURCHASE" })
  | (ProductionRecommendation & { type: "PRODUCTION" });

export default function RecommendationPreview() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseRecommendation[]>([]);
  const [productions, setProductions] = useState<ProductionRecommendation[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  const {
    loading: loadingPurchase,
    error: errorPurchase,
    execute: executePurchase,
  } = useAsync<PurchaseRecommendation[]>();

  const {
    loading: loadingProduction,
    error: errorProduction,
    execute: executeProduction,
  } = useAsync<ProductionRecommendation[]>();

  useEffect(() => {
    const loadData = async () => {
      const pData = await executePurchase(() => getPurchaseRecommendations());
      if (pData) setPurchases(pData);

      const prodData = await executeProduction(() => getProductionRecommendations());
      if (prodData) setProductions(prodData);
    };

    void loadData();
  }, [executePurchase, executeProduction]);

  // On fusionne et on trie pour trouver la plus urgente (date de rupture la plus proche)
  const mostUrgent = useMemo<UnifiedRecommendation | null>(() => {
    const unified: UnifiedRecommendation[] = [
      ...purchases.map(r => ({ ...r, type: "PURCHASE" as const })),
      ...productions.map(r => ({ ...r, type: "PRODUCTION" as const })),
    ];

    if (unified.length === 0) return null;

    return unified.sort(
      (a, b) =>
        new Date(a.estimatedStockoutDate).getTime() -
        new Date(b.estimatedStockoutDate).getTime(),
    )[0];
  }, [purchases, productions]);

  const handleAction = async () => {
    if (!mostUrgent) return;

    try {
      setLoadingAction(true);
      if (mostUrgent.type === "PURCHASE") {
        const newOrders = await createOrdersFromRecommendations([
          mostUrgent.idRecommendation,
        ]);
        if (newOrders && newOrders.length > 0) {
          navigate(`/purchase-orders/${newOrders[0].idPurchaseOrder}/edit`);
        }
      } else {
        navigate(`/manufacturing/orders/new?product=${mostUrgent.idProduct}&qty=${mostUrgent.recommendedQuantity}`);
      }
    } catch (err) {
      console.error("Erreur lors du traitement de la recommandation :", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const isLoading = loadingPurchase || loadingProduction;
  const hasError = errorPurchase || errorProduction;

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Recommandation prioritaire</p>
            <p className="mt-1 text-xs text-slate-500">Analyse des flux en cours...</p>
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/5" />
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="rounded-2xl border border-red-400/10 bg-red-400/3 p-6">
        <p className="text-sm font-semibold text-white">Recommandation prioritaire</p>
        <p className="mt-2 text-sm leading-6 text-red-300">Impossible de charger les recommandations.</p>
      </section>
    );
  }

  if (!mostUrgent) {
    return (
      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Recommandation prioritaire</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">L'action actuellement jugée la plus importante.</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
            À jour
          </span>
        </div>
        <div className="mt-8">
          <p className="text-sm text-slate-500">Aucune recommandation pour le moment.</p>
        </div>
        <Link
          to="/recommendations"
          className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Voir les recommandations
        </Link>
      </section>
    );
  }

  const isPurchase = mostUrgent.type === "PURCHASE";
  const borderColor = isPurchase ? "border-cyan-400/10" : "border-indigo-400/10";
  const bgColor = isPurchase ? "bg-cyan-400/3" : "bg-indigo-400/3";
  const accentColor = isPurchase ? "text-cyan-300" : "text-indigo-300";
  const badgeColor = isPurchase ? "bg-rose-400/10 text-rose-300" : "bg-indigo-400/10 text-indigo-300";
  const btnColor = isPurchase ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950" : "bg-indigo-400 hover:bg-indigo-300 text-slate-950";

  const formattedStockoutDate = new Date(mostUrgent.estimatedStockoutDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className={`rounded-2xl border ${borderColor} ${bgColor} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">Recommandation prioritaire</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {isPurchase ? "Achat de composants requis." : "Assemblage de produits finis requis."}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeColor}`}>
          {isPurchase ? "Urgent (Achat)" : "Production"}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {mostUrgent.productReference}
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          {isPurchase ? "Commander" : "Fabriquer"} {mostUrgent.recommendedQuantity.toLocaleString("fr-FR")} unités
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">{mostUrgent.reason}</p>
      </div>

      <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">Produit</span>
          <span className="text-right text-sm font-semibold text-slate-200">{mostUrgent.productName}</span>
        </div>

        {isPurchase && (
          <>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Fournisseur recommandé</span>
              <span className="text-right text-sm font-semibold text-slate-200">
                {(mostUrgent as PurchaseRecommendation).supplierName}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Montant estimé</span>
              <span className={`text-sm font-semibold ${accentColor}`}>
                {(mostUrgent as PurchaseRecommendation).estimatedPurchaseAmount.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">Rupture estimée</span>
          <span className="text-sm font-semibold text-rose-300">{formattedStockoutDate}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAction}
        disabled={loadingAction}
        className={`mt-5 flex w-full cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition disabled:opacity-50 ${btnColor}`}
      >
        {loadingAction ? "Traitement..." : isPurchase ? "Préparer la commande" : "Lancer la fabrication"}
      </button>
    </section>
  );
}