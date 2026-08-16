import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getPurchaseOrders } from "../api/purchaseOrder.api";
import useAsync from "../hooks/useAsync";

import type { PurchaseOrder } from "../types/purchaseOrder";

type OrderFilter =
  | "ALL"
  | "DRAFT"
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

const statusStyles: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Brouillon",
    className: "border-slate-400/20 bg-slate-400/5 text-slate-300",
  },

  ORDERED: {
    label: "Commandée",
    className: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
  },

  PARTIALLY_RECEIVED: {
    label: "Partiellement reçue",
    className: "border-amber-400/20 bg-amber-400/5 text-amber-300",
  },

  RECEIVED: {
    label: "Reçue",
    className: "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
  },

  CANCELLED: {
    label: "Annulée",
    className: "border-rose-400/20 bg-rose-400/5 text-rose-300",
  },
};

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<OrderFilter>("ALL");

  const { loading, error, execute } = useAsync<PurchaseOrder[]>();

  useEffect(() => {
    const loadOrders = async () => {
      const data = await execute(() => getPurchaseOrders());

      if (data) {
        setOrders(data);
      }
    };

    void loadOrders();
  }, [execute]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      draft: orders.filter((order) => order.status === "DRAFT").length,
      ordered: orders.filter((order) => order.status === "ORDERED").length,
      partiallyReceived: orders.filter(
        (order) => order.status === "PARTIALLY_RECEIVED",
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        const matchesSearch =
          !normalizedSearch ||
          order.orderNumber.toLowerCase().includes(normalizedSearch) ||
          order.supplierName.toLowerCase().includes(normalizedSearch);

        if (!matchesSearch) {
          return false;
        }

        if (filter === "ALL") {
          return true;
        }

        return order.status === filter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.orderedAt ?? a.createdAt).getTime();

        const dateB = new Date(b.orderedAt ?? b.createdAt).getTime();

        return dateB - dateA;
      });
  }, [orders, search, filter]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />

        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        </div>

        <div className="mt-6 h-12 animate-pulse rounded-xl bg-white/5" />

        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Commandes
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Vos commandes
        </h1>

        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger les commandes.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération des commandes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Commandes
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Vos commandes
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Suivez les commandes préparées, envoyées et réceptionnées par votre
            entreprise.
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
          <p className="text-xs text-slate-500">Total des commandes</p>

          <p className="mt-1 text-xl font-bold text-white">{stats.total}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={[
            "cursor-pointer rounded-2xl border p-5 text-left transition",
            filter === "ALL"
              ? "border-cyan-400/20 bg-cyan-400/5"
              : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
          ].join(" ")}
        >
          <p className="text-xs text-slate-500">Toutes</p>

          <p className="mt-2 text-2xl font-bold text-white">{stats.total}</p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("DRAFT")}
          className={[
            "cursor-pointer rounded-2xl border p-5 text-left transition",
            filter === "DRAFT"
              ? "border-slate-400/20 bg-slate-400/5"
              : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
          ].join(" ")}
        >
          <p className="text-xs text-slate-500">Brouillons</p>

          <p className="mt-2 text-2xl font-bold text-slate-300">
            {stats.draft}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("ORDERED")}
          className={[
            "cursor-pointer rounded-2xl border p-5 text-left transition",
            filter === "ORDERED"
              ? "border-cyan-400/20 bg-cyan-400/5"
              : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
          ].join(" ")}
        >
          <p className="text-xs text-slate-500">Commandées</p>

          <p className="mt-2 text-2xl font-bold text-cyan-300">
            {stats.ordered}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("PARTIALLY_RECEIVED")}
          className={[
            "cursor-pointer rounded-2xl border p-5 text-left transition",
            filter === "PARTIALLY_RECEIVED"
              ? "border-amber-400/20 bg-amber-400/5"
              : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
          ].join(" ")}
        >
          <p className="text-xs text-slate-500">Réceptions partielles</p>

          <p className="mt-2 text-2xl font-bold text-amber-300">
            {stats.partiallyReceived}
          </p>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <label htmlFor="purchase-order-search" className="sr-only">
            Rechercher une commande
          </label>

          <input
            id="purchase-order-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par numéro ou fournisseur..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["ALL", "Toutes"],
              ["DRAFT", "Brouillons"],
              ["ORDERED", "Commandées"],
              ["PARTIALLY_RECEIVED", "Partiellement reçues"],
              ["RECEIVED", "Reçues"],
              ["CANCELLED", "Annulées"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={[
                "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
                filter === value
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <p className="text-sm font-semibold text-white">
            Aucune commande trouvée
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Aucune commande ne correspond aux critères sélectionnés.
          </p>
        </section>
      ) : (
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-262.5 border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Commande
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Fournisseur
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Livraison prévue
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Montant
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Statut
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const status = statusStyles[order.status] ?? {
                    label: order.status,
                    className: "border-white/10 bg-white/5 text-slate-300",
                  };

                  const orderedDate = new Date(
                    order.orderedAt ?? order.createdAt,
                  ).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  const expectedDeliveryDate = order.expectedDeliveryDate
                    ? new Date(order.expectedDeliveryDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "—";

                  return (
                    <tr
                      key={order.idPurchaseOrder}
                      className="border-b border-white/5 last:border-b-0 transition hover:bg-white/2"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/purchase-orders/${order.idPurchaseOrder}`}
                          className="cursor-pointer text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {order.supplierName}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {orderedDate}
                      </td>

                      <td className="px-5 py-4 text-right text-sm text-slate-500">
                        {expectedDeliveryDate}
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-semibold text-slate-200">
                        {order.totalAmount.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span
                          className={[
                            "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                            status.className,
                          ].join(" ")}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        {order.status === "DRAFT" && (
                          <Link
                            to={`/purchase-orders/${order.idPurchaseOrder}`}
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                          >
                            Continuer
                          </Link>
                        )}

                        {order.status === "PARTIALLY_RECEIVED" && (
                          <Link
                            to={`/purchase-orders/${order.idPurchaseOrder}`}
                            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:border-amber-400/30 hover:bg-amber-400/10"
                          >
                            Réceptionner
                          </Link>
                        )}

                        {order.status !== "DRAFT" &&
                          order.status !== "PARTIALLY_RECEIVED" && (
                            <span className="text-xs text-slate-700">—</span>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
