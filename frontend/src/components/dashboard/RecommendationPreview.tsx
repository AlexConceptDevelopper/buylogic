import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPurchaseRecommendations } from "../../api/purchaseRecommendation.api";
import { getProductionRecommendations } from "../../api/productionRecommendationService.api";
import useAsync from "../../hooks/useAsync";
import type { PurchaseRecommendation } from "../../types/purchaseRecommendation";
import type { ProductionRecommendation } from "../../types/productionRecommendation";

type PreviewTab = "PURCHASES" | "PRODUCTION";

export default function RecommendationsPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("PURCHASES");
  const [purchaseRecs, setPurchaseRecs] = useState<PurchaseRecommendation[]>([]);
  const [productionRecs, setProductionRecs] = useState<ProductionRecommendation[]>([]);

  const { execute: executePurchase } = useAsync<PurchaseRecommendation[]>();
  const { execute: executeProduction } = useAsync<ProductionRecommendation[]>();

  useEffect(() => {
    const loadData = async () => {
      const [purchases, productions] = await Promise.all([
        executePurchase(() => getPurchaseRecommendations()),
        executeProduction(() => getProductionRecommendations()),
      ]);

      if (purchases) {
        setPurchaseRecs(purchases.filter((r) => r.status !== "APPROVED" && r.status !== "CANCELLED"));
      }
      if (productions) {
        setProductionRecs(productions.filter((r) => r.status !== "APPROVED" && r.status !== "CANCELLED"));
      }
    };
    void loadData();
  }, [executePurchase, executeProduction]);

  const urgentPurchases = purchaseRecs.slice(0, 5);
  const urgentProductions = productionRecs.slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Aperçu rapide</span>
          <h2 className="text-xl font-bold text-white mt-1">Recommandations en attente</h2>
        </div>
        <Link
          to="/recommendations"
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
        >
          Voir tout →
        </Link>
      </div>

      {/* Mini onglets de prévisualisation */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("PURCHASES")}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
            activeTab === "PURCHASES"
              ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
              : "text-slate-400 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          Achats ({purchaseRecs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("PRODUCTION")}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
            activeTab === "PRODUCTION"
              ? "bg-indigo-400/10 text-indigo-300 border border-indigo-400/20"
              : "text-slate-400 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          Fabrication ({productionRecs.length})
        </button>
      </div>

      <div className="mt-4 divide-y divide-white/5">
        {activeTab === "PURCHASES" && (
          <>
            {urgentPurchases.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">Aucune recommandation d'achat en attente.</p>
            ) : (
              urgentPurchases.map((rec) => (
                <div key={rec.idRecommendation} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white">{rec.productName}</p>
                    <p className="text-[11px] text-slate-400">
                      Rupture : {new Date(rec.estimatedStockoutDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-300">+{rec.recommendedQuantity}</span>
                    <p className="text-[10px] text-slate-500">{rec.supplierName || "Sans fournisseur"}</p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "PRODUCTION" && (
          <>
            {urgentProductions.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">Aucune recommandation de production en attente.</p>
            ) : (
              urgentProductions.map((rec) => (
                <div key={rec.idProductionRecommendation} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white">{rec.productName}</p>
                    <p className="text-[11px] text-slate-400">
                      Rupture : {new Date(rec.estimatedStockoutDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-300">+{rec.recommendedQuantity}</span>
                    <p className="text-[10px] text-slate-500">À fabriquer</p>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}