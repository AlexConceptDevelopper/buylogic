import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getPurchaseRecommendations } from "../../api/purchaseRecommendation.api";
import useAsync from "../../hooks/useAsync";

import type { PurchaseRecommendation } from "../../types/purchaseRecommendation";

export default function RecommendationPreview() {
  const [recommendations, setRecommendations] = useState<
    PurchaseRecommendation[]
  >([]);

  const {
    loading,
    error,
    execute,
  } = useAsync<PurchaseRecommendation[]>();

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await execute(
        () => getPurchaseRecommendations(),
      );

      if (data) {
        setRecommendations(data);
      }
    };

    loadRecommendations();
  }, [execute]);

  const recommendation = useMemo(() => {
    if (recommendations.length === 0) {
      return null;
    }

    return [...recommendations].sort(
      (a, b) =>
        new Date(a.estimatedStockoutDate).getTime() -
        new Date(b.estimatedStockoutDate).getTime(),
    )[0];
  }, [recommendations]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Recommandation prioritaire
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Analyse des recommandations...
            </p>
          </div>

          <div className="h-6 w-20 animate-pulse rounded-full bg-white/5" />
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-white/5" />

          <div className="h-8 w-64 animate-pulse rounded bg-white/5" />

          <div className="h-16 w-full animate-pulse rounded bg-white/5" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-400/10 bg-red-400/3 p-6">
        <p className="text-sm font-semibold text-white">
          Recommandation prioritaire
        </p>

        <p className="mt-2 text-sm leading-6 text-red-300">
          Impossible de charger les recommandations.
        </p>
      </section>
    );
  }

  if (!recommendation) {
    return (
      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">
              Recommandation prioritaire
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              L'action actuellement jugée la plus importante.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
            À jour
          </span>
        </div>

        <div className="mt-8">
          <p className="text-sm text-slate-500">
            Aucune recommandation pour le moment.
          </p>
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

  const formattedStockoutDate =
    new Date(
      recommendation.estimatedStockoutDate,
    ).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formattedAmount =
    recommendation.estimatedPurchaseAmount.toLocaleString(
      "fr-FR",
      {
        style: "currency",
        currency: "EUR",
      },
    );

  const confidence =
    recommendation.confidenceScore.toLocaleString(
      "fr-FR",
      {
        maximumFractionDigits: 1,
      },
    );

  return (
    <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Recommandation prioritaire
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            L'action actuellement jugée la plus importante.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-rose-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-300">
          Urgent
        </span>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {recommendation.productReference}
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Commander{" "}
          {recommendation.recommendedQuantity.toLocaleString(
            "fr-FR",
          )}{" "}
          unités
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {recommendation.reason}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Produit
          </span>

          <span className="text-right text-sm font-semibold text-slate-200">
            {recommendation.productName}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Fournisseur recommandé
          </span>

          <span className="text-right text-sm font-semibold text-slate-200">
            {recommendation.supplierName}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Montant estimé
          </span>

          <span className="text-sm font-semibold text-cyan-300">
            {formattedAmount}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Délai fournisseur
          </span>

          <span className="text-sm font-semibold text-slate-200">
            {recommendation.estimatedLeadTimeDays} jours
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Rupture estimée
          </span>

          <span className="text-sm font-semibold text-rose-300">
            {formattedStockoutDate}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Confiance
          </span>

          <span className="text-sm font-semibold text-emerald-300">
            {confidence} %
          </span>
        </div>
      </div>

      <Link
        to="/recommendations"
        className="mt-5 flex w-full cursor-pointer items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
      >
        Voir la recommandation
      </Link>
    </section>
  );
}