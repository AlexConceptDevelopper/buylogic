import { Link } from "react-router-dom";
import { OrderStatus } from "../../types/OrderStatus";
import type { PurchaseOrder } from "../../types/purchaseOrder";

const statusStyles: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  [OrderStatus.DRAFT]: {
    label: "Brouillon",
    className: "border-slate-400/20 bg-slate-400/5 text-slate-300",
  },
  [OrderStatus.SENT]: {
    label: "Envoyée (Attente ARC)",
    className: "border-indigo-400/20 bg-indigo-400/5 text-indigo-300",
  },
  [OrderStatus.CONFIRMED]: {
    label: "Commandée",
    className: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
  },
  [OrderStatus.PARTIALLY_RECEIVED]: {
    label: "Partiellement reçue",
    className: "border-amber-400/20 bg-amber-400/5 text-amber-300",
  },
  [OrderStatus.RECEIVED]: {
    label: "Reçue",
    className: "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
  },
  [OrderStatus.CANCELLED]: {
    label: "Annulée",
    className: "border-rose-400/20 bg-rose-400/5 text-rose-300",
  },
};

type PurchaseTableProps = {
  orders: PurchaseOrder[];
  deletingId: number | null;
  onStartDelete: (id: number) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: number) => void;
};

export default function PurchaseTable({
  orders,
  deletingId,
  onStartDelete,
  onCancelDelete,
  onConfirmDelete,
}: PurchaseTableProps) {
  if (orders.length === 0) {
    return (
      <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
        <p className="text-sm font-semibold text-white">
          Aucune commande trouvée
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Aucune commande ne correspond aux critères sélectionnés.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5 border-collapse">
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
            {orders.map((order) => {
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

              const isConfirming = deletingId === order.idPurchaseOrder;

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
                    {order.status === OrderStatus.DRAFT && (
                      <div className="flex items-center justify-end gap-2">
                        {isConfirming ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onConfirmDelete(order.idPurchaseOrder)
                              }
                              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-400/40 bg-rose-400/20 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/30"
                            >
                              Confirmer
                            </button>
                            <button
                              type="button"
                              onClick={onCancelDelete}
                              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/purchase-orders/${order.idPurchaseOrder}`}
                              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                            >
                              Continuer
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                onStartDelete(order.idPurchaseOrder)
                              }
                              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-400/10"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {order.status === OrderStatus.SENT && (
                      <Link
                        to={`/purchase-orders/${order.idPurchaseOrder}`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-400/5 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:border-indigo-400/30 hover:bg-indigo-400/10"
                      >
                        Ajouter l'ARC
                      </Link>
                    )}

                    {(order.status === OrderStatus.CONFIRMED ||
                      order.status === OrderStatus.PARTIALLY_RECEIVED) && (
                      <Link
                        to={`/purchase-orders/${order.idPurchaseOrder}/receive`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:border-amber-400/30 hover:bg-amber-400/10"
                      >
                        Réceptionner
                      </Link>
                    )}

                    {order.status === OrderStatus.RECEIVED && (
                      <Link
                        to={`/purchase-orders/${order.idPurchaseOrder}`}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
                      >
                        Consulter
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}