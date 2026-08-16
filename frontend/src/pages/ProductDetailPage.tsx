import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProductById } from "../api/product.api";
import { getPurchaseRecommendations } from "../api/purchaseRecommendation.api";
import { getStockMovements } from "../api/stockMovement.api";
import useAsync from "../hooks/useAsync";

import type { Product } from "../types/product";
import type { PurchaseRecommendation } from "../types/purchaseRecommendation";
import type { StockMovement } from "../types/stockMovement";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<
    PurchaseRecommendation[]
  >([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const {
    loading: productLoading,
    error: productError,
    execute: executeProduct,
  } = useAsync<Product>();

  const { loading: recommendationsLoading, execute: executeRecommendations } =
    useAsync<PurchaseRecommendation[]>();

  const { loading: stockMovementsLoading, execute: executeStockMovements } =
    useAsync<StockMovement[]>();

  useEffect(() => {
    if (!Number.isInteger(productId)) {
      return;
    }

    const loadProduct = async () => {
      const data = await executeProduct(() => getProductById(productId));

      if (data) {
        setProduct(data);
      }
    };

    void loadProduct();
  }, [productId, executeProduct]);

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await executeRecommendations(() =>
        getPurchaseRecommendations(),
      );

      if (data) {
        setRecommendations(data);
      }
    };

    void loadRecommendations();
  }, [executeRecommendations]);

  useEffect(() => {
    const loadStockMovements = async () => {
      const data = await executeStockMovements(() => getStockMovements());

      if (data) {
        setStockMovements(data);
      }
    };

    void loadStockMovements();
  }, [executeStockMovements]);

  const recommendation = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      recommendations.find((item) => item.idProduct === product.idProduct) ??
      null
    );
  }, [product, recommendations]);

  const loading =
    productLoading || recommendationsLoading || stockMovementsLoading;

  if (!Number.isInteger(productId)) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Produit introuvable
          </p>

          <p className="mt-2 text-sm text-red-300">
            L'identifiant du produit est invalide.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-flex cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />

        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger ce produit.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Le produit n'existe pas ou n'est pas accessible depuis votre
            entreprise.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-5 cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const stockCritical = product.currentStock <= 0;

  const formattedStock = product.currentStock.toLocaleString("fr-FR");

  const productMovements = stockMovements
    .filter((movement) => movement.idProduct === product.idProduct)
    .sort(
      (a, b) =>
        new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime(),
    )
    .slice(0, 8);

  const movementLabels: Record<string, string> = {
    PURCHASE: "Commande reçue",
    SALE: "Vente",
    RETURN: "Retour",
    LOSS: "Perte / casse",
    ADJUSTMENT: "Ajustement",
    TRANSFER: "Transfert",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/products"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-300"
          >
            ← Produits
          </Link>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            {product.reference}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {product.name}
            </h1>

            {!product.active && (
              <span className="rounded-full border border-slate-400/20 bg-slate-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Inactif
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {product.description}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
          <p className="text-xs text-slate-500">Unité</p>

          <p className="mt-1 text-sm font-bold text-white">{product.unit}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  État du stock
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Situation actuelle du produit.
                </p>
              </div>

              <span
                className={[
                  "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                  stockCritical
                    ? "border-rose-400/20 bg-rose-400/5 text-rose-300"
                    : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
                ].join(" ")}
              >
                {stockCritical ? "Rupture" : "Stock disponible"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-xs text-slate-500">Stock actuel</p>

                <p
                  className={[
                    "mt-2 text-2xl font-bold",
                    stockCritical ? "text-rose-300" : "text-white",
                  ].join(" ")}
                >
                  {formattedStock}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  {product.unit}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-xs text-slate-500">Référence</p>

                <p className="mt-2 truncate text-sm font-bold text-white">
                  {product.reference}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  Référence interne
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-xs text-slate-500">Unité</p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {product.unit}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  Condition de suivi
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Derniers mouvements
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Les derniers changements enregistrés sur ce produit.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-600">
                {productMovements.length}
              </span>
            </div>

            {productMovements.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-5 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  Aucun mouvement récent
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Les réceptions, ventes et ajustements apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-white/5">
                {productMovements.map((movement) => {
                  const quantityIsPositive = movement.quantity > 0;

                  const movementType =
                    movementLabels[movement.movementType] ??
                    movement.movementType;

                  return (
                    <div
                      key={movement.idStockMovement}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200">
                          {movementType}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {new Date(movement.movementDate).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <span
                        className={[
                          "shrink-0 text-sm font-bold",
                          quantityIsPositive
                            ? "text-emerald-300"
                            : "text-rose-300",
                        ].join(" ")}
                      >
                        {quantityIsPositive ? "+" : ""}
                        {movement.quantity.toLocaleString("fr-FR")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {recommendation && (
            <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Recommandation BuyLogic
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Une action d'achat est actuellement recommandée pour ce
                    produit.
                  </p>
                </div>

                <span className="rounded-full border border-rose-400/20 bg-rose-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-300">
                  À traiter
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-500">Quantité recommandée</p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {recommendation.recommendedQuantity.toLocaleString("fr-FR")}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    {product.unit}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-500">Confiance</p>

                  <p className="mt-2 text-2xl font-bold text-emerald-300">
                    {recommendation.confidenceScore.toLocaleString("fr-FR", {
                      maximumFractionDigits: 1,
                    })}
                    %
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-slate-950/40 p-4">
                <p className="text-xs text-slate-500">
                  Pourquoi BuyLogic recommande cette action
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {recommendation.reason}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    // Le workflow de commande préparée
                    // sera branché ici.
                  }}
                  className="flex-1 cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
                >
                  Préparer la commande
                </button>

                <Link
                  to={`/recommendations/${recommendation.idRecommendation}`}
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Voir la recommandation
                </Link>
              </div>
            </section>
          )}

          {!recommendation && (
            <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
              <p className="text-sm font-semibold text-white">
                Aucune recommandation active
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                BuyLogic ne recommande actuellement aucune action d'achat pour
                ce produit.
              </p>
            </section>
          )}
        </div>

        <aside className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
          <p className="text-sm font-semibold text-white">Vue rapide</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Les informations essentielles avant d'agir.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Référence</span>

              <span className="text-sm font-semibold text-slate-200">
                {product.reference}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Stock actuel</span>

              <span
                className={[
                  "text-sm font-semibold",
                  stockCritical ? "text-rose-300" : "text-slate-200",
                ].join(" ")}
              >
                {formattedStock} {product.unit}
              </span>
            </div>

            {recommendation && (
              <>
                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    Quantité recommandée
                  </span>

                  <span className="text-sm font-semibold text-cyan-300">
                    {recommendation.recommendedQuantity.toLocaleString("fr-FR")}{" "}
                    {product.unit}
                  </span>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">Fournisseur</span>

                  <span className="text-right text-sm font-semibold text-slate-200">
                    {recommendation.supplierName}
                  </span>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">Délai estimé</span>

                  <span className="text-sm font-semibold text-slate-200">
                    {recommendation.estimatedLeadTimeDays} jours
                  </span>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
