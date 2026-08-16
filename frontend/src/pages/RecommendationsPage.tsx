import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getPurchaseRecommendations } from "../api/purchaseRecommendation.api";
import useAsync from "../hooks/useAsync";

import type { PurchaseRecommendation } from "../types/purchaseRecommendation";

type RecommendationFilter = "ALL" | "URGENT" | "HIGH" | "MEDIUM" | "RESOLVED";

const statusLabels: Record<string, string> = {
  PENDING: "À traiter",
  ACTIVE: "À traiter",
  RESOLVED: "Résolue",
  CANCELLED: "Annulée",
};

function getPriority(recommendation: PurchaseRecommendation) {
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
      className: "border-rose-400/20 bg-rose-400/5 text-rose-300",
    };
  }

  if (stockoutDate <= reorderDeadline) {
    return {
      key: "HIGH" as const,
      label: "Prioritaire",
      className: "border-amber-400/20 bg-amber-400/5 text-amber-300",
    };
  }

  return {
    key: "MEDIUM" as const,
    label: "À surveiller",
    className: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
  };
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    PurchaseRecommendation[]
  >([]);
  const [filter, setFilter] = useState<RecommendationFilter>("ALL");

  const { loading, error, execute } = useAsync<PurchaseRecommendation[]>();

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await execute(() => getPurchaseRecommendations());

      if (data) {
        setRecommendations(data);
      }
    };

    void loadRecommendations();
  }, [execute]);

  const activeRecommendations = useMemo(
    () =>
      recommendations.filter(
        (recommendation) =>
          recommendation.status !== "RESOLVED" &&
          recommendation.status !== "CANCELLED",
      ),
    [recommendations],
  );

  const counts = useMemo(() => {
    const urgent = activeRecommendations.filter(
      (recommendation) => getPriority(recommendation).key === "URGENT",
    ).length;

    const high = activeRecommendations.filter(
      (recommendation) => getPriority(recommendation).key === "HIGH",
    ).length;

    const medium = activeRecommendations.filter(
      (recommendation) => getPriority(recommendation).key === "MEDIUM",
    ).length;

    const resolved = recommendations.filter(
      (recommendation) => recommendation.status === "RESOLVED",
    ).length;

    return {
      total: activeRecommendations.length,
      urgent,
      high,
      medium,
      resolved,
    };
  }, [activeRecommendations, recommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((recommendation) => {
      const isResolved = recommendation.status === "RESOLVED";

      const isCancelled = recommendation.status === "CANCELLED";

      switch (filter) {
        case "URGENT":
          return (
            !isResolved &&
            !isCancelled &&
            getPriority(recommendation).key === "URGENT"
          );

        case "HIGH":
          return (
            !isResolved &&
            !isCancelled &&
            getPriority(recommendation).key === "HIGH"
          );

        case "MEDIUM":
          return (
            !isResolved &&
            !isCancelled &&
            getPriority(recommendation).key === "MEDIUM"
          );

        case "RESOLVED":
          return isResolved;

        default:
          return !isCancelled;
      }
    });
  }, [recommendations, filter]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />

        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        </div>

        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Recommandations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Achats recommandés
        </h1>

        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger les recommandations.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération des recommandations
            BuyLogic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Recommandations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Achats recommandés
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Retrouvez les produits pour lesquels BuyLogic recommande actuellement
          une action d'achat.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
          <p className="text-xs text-slate-500">À traiter</p>

          <p className="mt-2 text-2xl font-bold text-white">{counts.total}</p>
        </div>

        <div className="rounded-2xl border border-rose-400/10 bg-rose-400/5 p-5">
          <p className="text-xs text-slate-500">Urgentes</p>

          <p className="mt-2 text-2xl font-bold text-rose-300">
            {counts.urgent}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">
          <p className="text-xs text-slate-500">Prioritaires</p>

          <p className="mt-2 text-2xl font-bold text-amber-300">
            {counts.high}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
          <p className="text-xs text-slate-500">Résolues</p>

          <p className="mt-2 text-2xl font-bold text-emerald-300">
            {counts.resolved}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={[
            "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
            filter === "ALL"
              ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          Toutes
        </button>

        <button
          type="button"
          onClick={() => setFilter("URGENT")}
          className={[
            "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
            filter === "URGENT"
              ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          Urgentes
        </button>

        <button
          type="button"
          onClick={() => setFilter("HIGH")}
          className={[
            "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
            filter === "HIGH"
              ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          Prioritaires
        </button>

        <button
          type="button"
          onClick={() => setFilter("MEDIUM")}
          className={[
            "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
            filter === "MEDIUM"
              ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          À surveiller
        </button>

        <button
          type="button"
          onClick={() => setFilter("RESOLVED")}
          className={[
            "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
            filter === "RESOLVED"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
          ].join(" ")}
        >
          Résolues
        </button>
      </div>

      {filteredRecommendations.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <p className="text-sm font-semibold text-white">
            Aucune recommandation
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Il n'y a actuellement aucune recommandation correspondant à ce
            filtre.
          </p>
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          {filteredRecommendations.map((recommendation) => {
            const priority = getPriority(recommendation);

            const statusLabel =
              statusLabels[recommendation.status] ?? recommendation.status;

            return (
              <article
                key={recommendation.idRecommendation}
                className="rounded-2xl border border-white/5 bg-slate-900/70 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                          priority.className,
                        ].join(" ")}
                      >
                        {priority.label}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        {statusLabel}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-white">
                      {recommendation.productName}
                    </h2>

                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-600">
                      {recommendation.productReference}
                    </p>
                  </div>

                  <div className="shrink-0 text-left lg:text-right">
                    <p className="text-xs text-slate-500">
                      Quantité recommandée
                    </p>

                    <p className="mt-1 text-2xl font-bold text-cyan-300">
                      {recommendation.recommendedQuantity.toLocaleString(
                        "fr-FR",
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                    <p className="text-xs text-slate-500">Stock actuel</p>

                    <p className="mt-2 text-lg font-bold text-white">
                      {recommendation.currentStock.toLocaleString("fr-FR")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                    <p className="text-xs text-slate-500">Fournisseur</p>

                    <p className="mt-2 truncate text-sm font-bold text-slate-200">
                      {recommendation.supplierName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                    <p className="text-xs text-slate-500">Montant estimé</p>

                    <p className="mt-2 text-lg font-bold text-white">
                      {recommendation.estimatedPurchaseAmount.toLocaleString(
                        "fr-FR",
                        {
                          style: "currency",
                          currency: "EUR",
                        },
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                    <p className="text-xs text-slate-500">Confiance</p>

                    <p className="mt-2 text-lg font-bold text-emerald-300">
                      {recommendation.confidenceScore.toLocaleString("fr-FR", {
                        maximumFractionDigits: 1,
                      })}
                      %
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-white/5 bg-white/2 p-4">
                  <p className="text-xs text-slate-500">Pourquoi ?</p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {recommendation.reason}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Rupture estimée</p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {new Date(
                        recommendation.estimatedStockoutDate,
                      ).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/products/${recommendation.idProduct}`}
                      className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                    >
                      Voir le produit
                    </Link>

                    <button
                      type="button"
                      className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
                    >
                      Préparer la commande
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
