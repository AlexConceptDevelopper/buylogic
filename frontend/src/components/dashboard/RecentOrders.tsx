import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getPurchaseOrders } from "../../api/purchaseOrder.api";
import useAsync from "../../hooks/useAsync";
import type { PurchaseOrder } from "../../types/purchaseOrder";

type OrderStatus =
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED"
  | "DRAFT";

const statusStyles: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Brouillon",
    className:
      "border-slate-400/20 bg-slate-400/5 text-slate-300",
  },

  ORDERED: {
    label: "Commandée",
    className:
      "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
  },

  PARTIALLY_RECEIVED: {
    label: "Partiellement reçue",
    className:
      "border-amber-400/20 bg-amber-400/5 text-amber-300",
  },

  RECEIVED: {
    label: "Reçue",
    className:
      "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
  },

  CANCELLED: {
    label: "Annulée",
    className:
      "border-rose-400/20 bg-rose-400/5 text-rose-300",
  },
};

export default function RecentOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  const {
    loading,
    error,
    execute,
  } = useAsync<PurchaseOrder[]>();

  useEffect(() => {
    const loadOrders = async () => {
      const data = await execute(
        () => getPurchaseOrders(),
      );

      if (data) {
        setOrders(data);
      }
    };

    loadOrders();
  }, [execute]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(
          a.orderedAt ?? a.createdAt,
        ).getTime();

        const dateB = new Date(
          b.orderedAt ?? b.createdAt,
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 4);
  }, [orders]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Commandes récentes
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Chargement des dernières commandes...
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-400/10 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold text-white">
          Commandes récentes
        </p>

        <p className="mt-2 text-sm leading-6 text-red-300">
          Impossible de charger les commandes.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Commandes récentes
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Les dernières commandes enregistrées dans BuyLogic.
          </p>
        </div>

        <Link
          to="/purchase-orders"
          className="cursor-pointer self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-300"
        >
          Voir toutes les commandes
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/5 bg-white/2 px-4 py-6">
          <p className="text-sm font-semibold text-slate-300">
            Aucune commande récente
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Les commandes de votre entreprise apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-175 border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Commande
                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Fournisseur
                </th>

                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Date
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Montant
                </th>

                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Statut
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => {
                const status =
                  statusStyles[
                    order.status as OrderStatus
                  ] ?? {
                    label: order.status,
                    className:
                      "border-white/10 bg-white/5 text-slate-300",
                  };

                const orderDate = new Date(
                  order.orderedAt ?? order.createdAt,
                ).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <tr
                    key={order.idPurchaseOrder}
                    className="border-b border-white/5 last:border-b-0 transition hover:bg-white/2"
                  >
                    <td className="px-4 py-4">
                      <Link
                        to={`/purchase-orders/${order.idPurchaseOrder}`}
                        className="cursor-pointer text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-400">
                      {order.supplierName}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {orderDate}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-slate-200">
                      {order.totalAmount.toLocaleString(
                        "fr-FR",
                        {
                          style: "currency",
                          currency: "EUR",
                        },
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}