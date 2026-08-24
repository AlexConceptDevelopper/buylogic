import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrdersFromRecommendations } from "../api/purchaseOrder.api";
import { getPurchaseRecommendations } from "../api/purchaseRecommendation.api";
import { getProductionRecommendations } from "../api/productionRecommendationService.api";
import useAsync from "../hooks/useAsync";
import type { PurchaseRecommendation } from "../types/purchaseRecommendation";
import type { ProductionRecommendation } from "../types/productionRecommendation";
import ProduceModal from "../components/product/modals/ProduceModal"; 
import { produceProduct } from "../api/product.api";

type MainTab = "PURCHASES" | "PRODUCTION";
type RecommendationFilter = "ALL" | "URGENT" | "HIGH" | "MEDIUM" | "APPROVED";

function getPurchasePriority(recommendation: PurchaseRecommendation) {
  const today = new Date();
  const stockoutDate = new Date(
    `${recommendation.estimatedStockoutDate}T00:00:00`,
  );
  const leadTimeDays = Math.max(
    0,
    Math.ceil(recommendation.estimatedLeadTimeDays),
  );
  const reorderDeadline = new Date(today);
  reorderDeadline.setHours(0, 0, 0, 0);
  reorderDeadline.setDate(reorderDeadline.getDate() + leadTimeDays);

  if (recommendation.currentStock <= 0 || stockoutDate <= today) {
    return {
      key: "URGENT" as const,
      label: "Urgent",
      className: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    };
  }
  if (stockoutDate <= reorderDeadline) {
    return {
      key: "HIGH" as const,
      label: "Prioritaire",
      className: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    };
  }
  return {
    key: "MEDIUM" as const,
    label: "À surveiller",
    className: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  };
}

function getProductionPriority(recommendation: ProductionRecommendation) {
  const today = new Date();
  const stockoutDate = new Date(
    `${recommendation.estimatedStockoutDate}T00:00:00`,
  );
  const leadTimeDays = 2; // Délai de fabrication par défaut
  const reorderDeadline = new Date(today);
  reorderDeadline.setHours(0, 0, 0, 0);
  reorderDeadline.setDate(reorderDeadline.getDate() + leadTimeDays);

  if (recommendation.currentStock <= 0 || stockoutDate <= today) {
    return {
      key: "URGENT" as const,
      label: "Urgent",
      className: "border-rose-400/25 bg-rose-400/10 text-rose-300",
    };
  }
  if (stockoutDate <= reorderDeadline) {
    return {
      key: "HIGH" as const,
      label: "Prioritaire",
      className: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    };
  }
  return {
    key: "MEDIUM" as const,
    label: "À surveiller",
    className: "border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
  };
}

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MainTab>("PURCHASES");

  // États Achats
  const [purchaseRecs, setPurchaseRecs] = useState<PurchaseRecommendation[]>([]);
  const [purchaseFilter, setPurchaseFilter] = useState<RecommendationFilter>("ALL");
  const [selectedPurchaseIds, setSelectedPurchaseIds] = useState<number[]>([]);
  const [creatingSupplier, setCreatingSupplier] = useState<string | null>(null);

  // États Production
  const [productionRecs, setProductionRecs] = useState<ProductionRecommendation[]>([]);
  const [productionFilter, setProductionFilter] = useState<RecommendationFilter>("ALL");
  //ESLINT
  const [_selectedProductionIds, setSelectedProductionIds] = useState<number[]>([]);
  
  // États de la Modale de Production
  const [isProduceModalOpen, setIsProduceModalOpen] = useState(false);
  const [selectedProdRec, setSelectedProdRec] = useState<ProductionRecommendation | null>(null);
  const [productionQuantity, setProductionQuantity] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const { loading: loadingPurchase, error: errorPurchase, execute: executePurchase } = useAsync<PurchaseRecommendation[]>();
  const { loading: loadingProduction, error: errorProduction, execute: executeProduction } = useAsync<ProductionRecommendation[]>();

  // Charger les achats
  useEffect(() => {
    const loadPurchases = async () => {
      const data = await executePurchase(() => getPurchaseRecommendations());
      if (data) {
        setPurchaseRecs(data);
        const activeIds = data
          .filter((r) => r.status !== "APPROVED" && r.status !== "CANCELLED")
          .map((r) => r.idRecommendation);
        setSelectedPurchaseIds(activeIds);
      }
    };
    void loadPurchases();
  }, [executePurchase]);

  // Charger la production
  useEffect(() => {
    const loadProduction = async () => {
      const data = await executeProduction(() => getProductionRecommendations());
      if (data) {
        setProductionRecs(data);
        const activeIds = data
          .filter((r) => r.status !== "APPROVED" && r.status !== "CANCELLED")
          .map((r) => r.idProductionRecommendation);
        setSelectedProductionIds(activeIds);
      }
    };
    void loadProduction();
  }, [executeProduction]);

  // --- FILTRAGE ACHATS ---
  const filteredPurchases = useMemo(() => {
    return purchaseRecs.filter((rec) => {
      const isApproved = rec.status === "APPROVED";
      const isCancelled = rec.status === "CANCELLED";
      switch (purchaseFilter) {
        case "URGENT":
          return !isApproved && !isCancelled && getPurchasePriority(rec).key === "URGENT";
        case "HIGH":
          return !isApproved && !isCancelled && getPurchasePriority(rec).key === "HIGH";
        case "MEDIUM":
          return !isApproved && !isCancelled && getPurchasePriority(rec).key === "MEDIUM";
        case "APPROVED":
          return isApproved;
        default:
          return !isApproved && !isCancelled;
      }
    });
  }, [purchaseRecs, purchaseFilter]);

  const groupedBySupplier = useMemo(() => {
    const map: Record<string, PurchaseRecommendation[]> = {};
    for (const rec of filteredPurchases) {
      const supplier = rec.supplierName && rec.supplierName.trim() !== "" ? rec.supplierName : "Sans fournisseur assigné";
      if (!map[supplier]) map[supplier] = [];
      map[supplier].push(rec);
    }
    return map;
  }, [filteredPurchases]);

  // --- FILTRAGE PRODUCTION ---
  const filteredProduction = useMemo(() => {
    return productionRecs.filter((rec) => {
      const isApproved = rec.status === "APPROVED";
      const isCancelled = rec.status === "CANCELLED";
      switch (productionFilter) {
        case "URGENT":
          return !isApproved && !isCancelled && getProductionPriority(rec).key === "URGENT";
        case "HIGH":
          return !isApproved && !isCancelled && getProductionPriority(rec).key === "HIGH";
        case "MEDIUM":
          return !isApproved && !isCancelled && getProductionPriority(rec).key === "MEDIUM";
        case "APPROVED":
          return isApproved;
        default:
          return !isApproved && !isCancelled;
      }
    });
  }, [productionRecs, productionFilter]);

  // Handlers Achats
  const toggleSelectPurchase = (id: number) => {
    setSelectedPurchaseIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleCreateOrderForSupplier = async (supplierName: string, supplierRecs: PurchaseRecommendation[]) => {
    const supplierRecIds = supplierRecs.map((r) => r.idRecommendation).filter((id) => selectedPurchaseIds.includes(id));
    if (supplierRecIds.length === 0) return;

    try {
      setCreatingSupplier(supplierName);
      const newOrders = await createOrdersFromRecommendations(supplierRecIds);
      if (newOrders && newOrders.length > 0) {
        setPurchaseRecs((prev) =>
          prev.map((r) => (supplierRecIds.includes(r.idRecommendation) ? { ...r, status: "APPROVED" } : r)),
        );
        setSelectedPurchaseIds((prev) => prev.filter((id) => !supplierRecIds.includes(id)));
        navigate(`/purchase-orders/${newOrders[0].idPurchaseOrder}/edit`);
      }
    } catch (err) {
      console.error("Erreur lors de la création de la commande groupée :", err);
    } finally {
      setCreatingSupplier(null);
    }
  };



  const handleOpenProduceModal = (rec: ProductionRecommendation) => {
    setSelectedProdRec(rec);
    setProductionQuantity(rec.recommendedQuantity.toString());
    setModalError(null);
    setIsProduceModalOpen(true);
  };

  const handleExecuteProduction = async () => {
    if (!selectedProdRec) return;

    try {
      setModalLoading(true);
      setModalError(null);

      // On appelle directement la fonction de ton service
      await produceProduct(selectedProdRec.idProduct, Number(productionQuantity));

      // Si l'appel réussit, on met à jour la liste et on ferme
      setProductionRecs((prev) =>
        prev.map((r) =>
          r.idProductionRecommendation === selectedProdRec.idProductionRecommendation
            ? { ...r, status: "APPROVED" }
            : r
        ),
      );

      setIsProduceModalOpen(false);
      navigate(`/manufacturing/orders`);
    } catch (err: any) {
      console.error("Erreur de production :", err);

      // Récupération propre du message d'erreur renvoyé par ton apiFetch / backend
      const errorMessage = 
        err?.message || 
        err?.error || 
        "Erreur lors du lancement de la fabrication.";

      setModalError(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  if (loadingPurchase || loadingProduction)
    return <div className="mx-auto max-w-7xl px-6 py-8 text-slate-400">Chargement des recommandations...</div>;
  if (errorPurchase || errorProduction)
    return <div className="mx-auto max-w-7xl px-6 py-8 text-red-400">Erreur de chargement.</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* En-tête de la page */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Recommandations
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Pilotage des flux
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Gérez vos besoins d'approvisionnement en matières/composants et vos ordres de fabrication de produits finis.
        </p>
      </div>

      {/* Sélecteur de menu principal (Onglets Achats / Production) */}
      <div className="mt-8 flex gap-3 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("PURCHASES")}
          className={[
            "cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold transition",
            activeTab === "PURCHASES"
              ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
              : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          Achats ({purchaseRecs.filter(r => r.status !== "APPROVED" && r.status !== "CANCELLED").length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PRODUCTION")}
          className={[
            "cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold transition",
            activeTab === "PRODUCTION"
              ? "bg-indigo-400 text-slate-950 shadow-lg shadow-indigo-400/10"
              : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          Fabrication ({productionRecs.filter(r => r.status !== "APPROVED" && r.status !== "CANCELLED").length})
        </button>
      </div>

      {/* ================================================= */}
      {/* CONTENU ONGLET ACHATS                             */}
      {/* ================================================= */}
      {activeTab === "PURCHASES" && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {(["ALL", "URGENT", "HIGH", "MEDIUM", "APPROVED"] as RecommendationFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setPurchaseFilter(f)}
                className={[
                  "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
                  purchaseFilter === f
                    ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {f === "ALL" && "Toutes"}
                {f === "URGENT" && "Urgentes"}
                {f === "HIGH" && "Prioritaires"}
                {f === "MEDIUM" && "À surveiller"}
                {f === "APPROVED" && "Approuvées"}
              </button>
            ))}
          </div>

          {Object.keys(groupedBySupplier).length === 0 ? (
            <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center text-slate-500">
              Aucune recommandation d'achat trouvée pour ce filtre.
            </section>
          ) : (
            <div className="mt-6 space-y-8">
              {Object.entries(groupedBySupplier).map(([supplierName, recs]) => {
                const anySelected = recs.some((r) => selectedPurchaseIds.includes(r.idRecommendation));
                const isCreating = creatingSupplier === supplierName;
                const hasNoSupplier = supplierName === "Sans fournisseur assigné";

                return (
                  <div key={supplierName} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Fournisseur</span>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          {supplierName}
                          {hasNoSupplier && (
                            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-xs font-normal text-amber-300">
                              Action requise : assigner un fournisseur
                            </span>
                          )}
                        </h2>
                      </div>

                      {!hasNoSupplier ? (
                        <button
                          type="button"
                          disabled={!anySelected || isCreating}
                          onClick={() => handleCreateOrderForSupplier(supplierName, recs)}
                          className="cursor-pointer rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:opacity-40"
                        >
                          {isCreating
                            ? "Création en cours..."
                            : `Commander la sélection (${recs.filter((r) => selectedPurchaseIds.includes(r.idRecommendation)).length})`}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Impossible de générer une commande sans fournisseur</span>
                      )}
                    </div>

                    <div className="mt-4 divide-y divide-white/5">
                      {recs.map((rec) => {
                        const priority = getPurchasePriority(rec);
                        const isChecked = selectedPurchaseIds.includes(rec.idRecommendation);

                        return (
                          <div key={rec.idRecommendation} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={rec.status === "APPROVED"}
                                onChange={() => toggleSelectPurchase(rec.idRecommendation)}
                                className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-800 text-cyan-400 focus:ring-cyan-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${priority.className}`}>
                                    {priority.label}
                                  </span>
                                  <span className="text-xs text-slate-500">{rec.productReference}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white mt-1">{rec.productName}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Rupture estimée : {new Date(rec.estimatedStockoutDate).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 justify-between md:justify-end">
                              <div className="text-right">
                                <p className="text-xs text-slate-500">Qté recommandée</p>
                                <p className="text-sm font-bold text-cyan-300">{rec.recommendedQuantity}</p>
                              </div>
                              <Link to={`/products/${rec.idProduct}`} className="text-xs text-slate-400 hover:text-white underline transition">
                                Produit
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* CONTENU ONGLET PRODUCTION                         */}
      {/* ================================================= */}
      {activeTab === "PRODUCTION" && (
        <div className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {(["ALL", "URGENT", "HIGH", "MEDIUM", "APPROVED"] as RecommendationFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setProductionFilter(f)}
                  className={[
                    "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
                    productionFilter === f
                      ? "border-indigo-400/20 bg-indigo-400/10 text-indigo-300"
                      : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {f === "ALL" && "Toutes"}
                  {f === "URGENT" && "Urgentes"}
                  {f === "HIGH" && "Prioritaires"}
                  {f === "MEDIUM" && "À surveiller"}
                  {f === "APPROVED" && "Approuvées"}
                </button>
              ))}
            </div>
          </div>

          {filteredProduction.length === 0 ? (
            <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center text-slate-500">
              Aucune recommandation de production trouvée pour ce filtre.
            </section>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
              <div className="divide-y divide-white/5">
                {filteredProduction.map((rec) => {
                  const priority = getProductionPriority(rec);
                  const isApproved = rec.status === "APPROVED";

                  return (
                    <div key={rec.idProductionRecommendation} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${priority.className}`}>
                              {priority.label}
                            </span>
                            <span className="text-xs text-slate-500">{rec.productReference}</span>
                            {isApproved && (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                                Approuvée
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1">{rec.productName}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {rec.reason} • Rupture estimée : {new Date(rec.estimatedStockoutDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Qté à fabriquer</p>
                          <p className="text-sm font-bold text-indigo-300">{rec.recommendedQuantity}</p>
                        </div>

                        {!isApproved ? (
                          <button
                            type="button"
                            onClick={() => handleOpenProduceModal(rec)}
                            className="cursor-pointer rounded-xl bg-indigo-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-indigo-400/10 transition hover:bg-indigo-300"
                          >
                            Lancer la fabrication
                          </button>
                        ) : (
                          <Link to={`/manufacturing/orders`} className="text-xs text-indigo-400 hover:underline">
                            Voir l'ordre
                          </Link>
                        )}

                        <Link to={`/products/${rec.idProduct}`} className="text-xs text-slate-400 hover:text-white underline transition">
                          Produit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modale de Fabrication */}
      {selectedProdRec && (
        <ProduceModal
          product={{
            idProduct: selectedProdRec.idProduct,
            name: selectedProdRec.productName,
            reference: selectedProdRec.productReference,
            currentStock: selectedProdRec.currentStock,
            unit: "unités", // Ajuste selon le champ exact de ton type Product
            fractional: false,
          } as any}
          open={isProduceModalOpen}
          quantity={productionQuantity}
          error={modalError}
          loading={modalLoading}
          quantityStep="1"
          onQuantityChange={setProductionQuantity}
          onClose={() => setIsProduceModalOpen(false)}
          onSubmit={handleExecuteProduction}
        />
      )}
    </div>
  );
}