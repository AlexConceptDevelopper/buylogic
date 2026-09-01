import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getPurchaseOrderById,
  updatePurchaseOrderArc,
  sendPurchaseOrderEmail,
} from "../api/purchaseOrder.api";
import { getPurchaseOrderItemsByPurchaseOrderId } from "../api/purchaseOrderItem.api";
import { getCompanyById } from "../api/company.api";
import { getSupplierById } from "../api/supplier.api";
import { getSupplierProducts } from "../api/supplierProduct.api";
import useAsync from "../hooks/useAsync";

import type { PurchaseOrder } from "../types/purchaseOrder";
import type { PurchaseOrderItem } from "../types/purchaseOrderItem";
import type { Company } from "../types/company";
import type { Supplier } from "../types/supplier";
import type { SupplierProduct } from "../types/supplierProduct";
import { EmailComposerModal } from "../components/EmailComposerModal";
import { PurchaseOrderPdfModal } from "../components/purchaseDetail/PurchaseOrderPdfModal";
import { PurchaseOrderArcForm } from "../components/purchaseDetail/PurchaseOrderArcForm";

const statusStyles: Record<
  string,
  {
    label: string;
    className: string;
    description: string;
  }
> = {
  DRAFT: {
    label: "Brouillon",
    className: "border-slate-400/20 bg-slate-400/5 text-slate-300",
    description:
      "Cette commande est encore en préparation et peut être modifiée.",
  },
  ORDERED: {
    label: "Commandée",
    className: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
    description:
      "La commande a été transmise au fournisseur et attend son traitement.",
  },
  PARTIALLY_RECEIVED: {
    label: "Partiellement reçue",
    className: "border-amber-400/20 bg-amber-400/5 text-amber-300",
    description:
      "Une partie de la commande a été reçue. Une quantité reste encore à réceptionner.",
  },
  RECEIVED: {
    label: "Reçue",
    className: "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
    description: "Toutes les quantités attendues ont été réceptionnées.",
  },
  CANCELLED: {
    label: "Annulée",
    className: "border-rose-400/20 bg-rose-400/5 text-rose-300",
    description: "Cette commande a été annulée.",
  },
  SENT: {
    label: "En attente d'ARC",
    className: "border-purple-400/20 bg-purple-400/5 text-purple-300",
    description:
      "Le bon de commande a été envoyé au fournisseur, en attente de l'Accusé de Réception de Commande.",
  },
};

export default function PurchaseOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const orderId = Number(id);

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [supplierProducts, setSupplierProducts] = useState<
    SupplierProduct[] | null
  >([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // États pour la modale d'e-mail et le message de succès optionnel
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Nouveaux états pour l'ARC et la date prévisionnelle
  const [arcNumber, setArcNumber] = useState("");
  const [expectedDeliveryInput, setExpectedDeliveryInput] = useState("");
  const [savingArc, setSavingArc] = useState(false);

  const {
    loading: orderLoading,
    error: orderError,
    execute: executeOrder,
  } = useAsync<PurchaseOrder>();

  const {
    loading: itemsLoading,
    error: itemsError,
    execute: executeItems,
  } = useAsync<PurchaseOrderItem[]>();

  useEffect(() => {
    if (!Number.isInteger(orderId)) {
      return;
    }

    const loadData = async () => {
      try {
        const orderData = await executeOrder(() =>
          getPurchaseOrderById(orderId),
        );

        if (orderData) {
          setOrder(orderData);
          if (orderData.arcNumber) setArcNumber(orderData.arcNumber);
          if (orderData.expectedDeliveryDate) {
            setExpectedDeliveryInput(
              orderData.expectedDeliveryDate.split("T")[0],
            );
          }

          const [companyData, supplierData, allSpData] = await Promise.all([
            getCompanyById(orderData.idCompany),
            getSupplierById(orderData.idSupplier),
            getSupplierProducts(),
          ]);
          setCompany(companyData);
          setSupplier(supplierData);
          setSupplierProducts(allSpData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails", err);
      }
    };

    void loadData();
  }, [executeOrder, orderId]);

  useEffect(() => {
    if (!Number.isInteger(orderId)) {
      return;
    }

    const loadItems = async () => {
      const data = await executeItems(() =>
        getPurchaseOrderItemsByPurchaseOrderId(orderId),
      );

      if (data) {
        setItems(data);
      }
    };

    void loadItems();
  }, [executeItems, orderId]);

  const handleSaveArc = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSavingArc(true);
    try {
      const updated = await updatePurchaseOrderArc(orderId, {
        arcNumber,
        expectedDeliveryDate: expectedDeliveryInput,
      });
      if (updated) {
        setOrder(updated);
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'ARC", err);
    } finally {
      setSavingArc(false);
    }
  };

  const getSupplierProductForItem = (productId: number) => {
    if (!order || !supplierProducts) return undefined;
    return supplierProducts.find(
      (sp) => sp.idProduct === productId && sp.idSupplier === order.idSupplier,
    );
  };

  if (!Number.isInteger(orderId)) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Commande introuvable
          </p>
          <p className="mt-2 text-sm text-red-300">
            L'identifiant de la commande est invalide.
          </p>
          <Link
            to="/purchase-orders"
            className="mt-5 inline-flex cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const loading = orderLoading || itemsLoading;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-10 w-80 animate-pulse rounded bg-white/5" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="h-72 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-72 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger cette commande.
          </p>
          <p className="mt-2 text-sm text-red-300">
            La commande n'existe pas ou n'est pas accessible depuis votre
            entreprise.
          </p>
          <button
            type="button"
            onClick={() => navigate("/purchase-orders")}
            className="mt-5 cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  const status = statusStyles[order.status] ?? {
    label: order.status,
    className: "border-white/10 bg-white/5 text-slate-300",
    description: "Statut de commande actuellement enregistré.",
  };

  const orderedDate = new Date(
    order.orderedAt ?? order.createdAt,
  ).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const expectedDeliveryDate = order.expectedDeliveryDate
    ? new Date(order.expectedDeliveryDate).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  const receivedDate = order.receivedAt
    ? new Date(order.receivedAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to="/purchase-orders"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-300"
      >
        ← Commandes
      </Link>

      {/* Message de succès d'envoi d'e-mail */}
      {successMessage && (
        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-300 text-sm font-medium flex items-center gap-2 animate-fadeIn transition-all duration-500">
          <span>✅</span> {successMessage}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Commande
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{order.supplierName}</p>
        </div>

        <div className="flex items-center gap-3">
          {order.status === "DRAFT" && (
            <>
              <button
                type="button"
                onClick={() =>
                  navigate(`/purchase-orders/${order.idPurchaseOrder}/edit`)
                }
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Aperçu & Envoyer
              </button>
            </>
          )}
          <span
            className={[
              "self-start rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide",
              status.className,
            ].join(" ")}
          >
            {status.label}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold text-white">
              Lignes de commande
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Produits inclus dans cette commande.
            </p>

            {itemsError ? (
              <div className="mt-6 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                <p className="text-sm text-red-300">
                  Impossible de charger les lignes de commande.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-6 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  Aucune ligne de commande
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-162.5 border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                        Produit / Réf Fournisseur
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                        Commandé
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                        Reçu
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                        Prix unitaire HT
                      </th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                        Total HT
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => {
                      const lineTotal = item.quantityOrdered * item.unitPrice;
                      const supplierProduct = getSupplierProductForItem(
                        item.idProduct,
                      );

                      return (
                        <tr
                          key={item.idPurchaseOrderItem}
                          className="border-b border-white/5 last:border-b-0"
                        >
                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-slate-200">
                              {item.productName ?? `Produit #${item.idProduct}`}
                            </p>
                            {supplierProduct?.supplierReference && (
                              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-cyan-400 font-medium">
                                Réf : {supplierProduct.supplierReference}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold text-slate-200">
                            {item.quantityOrdered.toLocaleString("fr-FR")}
                            {supplierProduct?.packagingQuantity &&
                              supplierProduct.packagingQuantity > 1 && (
                                <span className="block text-[10px] text-slate-400 font-normal">
                                  (Cond. : {supplierProduct.packagingQuantity})
                                </span>
                              )}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span
                              className={[
                                "text-sm font-semibold",
                                item.quantityReceived >= item.quantityOrdered
                                  ? "text-emerald-300"
                                  : "text-amber-300",
                              ].join(" ")}
                            >
                              {item.quantityReceived.toLocaleString("fr-FR")}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-400">
                            {item.unitPrice.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold text-slate-200">
                            {lineTotal.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold text-white">
              Suivi de la commande
            </p>
            <p className="mt-1 text-xs text-slate-500">
              État actuel du traitement de la commande.
            </p>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              {status.description}
            </p>

            {order.status === "SENT" && (
              <PurchaseOrderArcForm
                arcNumber={arcNumber}
                expectedDeliveryInput={expectedDeliveryInput}
                savingArc={savingArc}
                onChangeArcNumber={setArcNumber}
                onChangeExpectedDelivery={setExpectedDeliveryInput}
                onSubmit={handleSaveArc}
              />
            )}

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Numéro d'ARC</span>
                <span className="text-sm font-semibold text-slate-200">
                  {order.arcNumber ?? "Non renseigné"}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Livraison prévue</span>
                <span className="text-sm font-semibold text-slate-200">
                  {expectedDeliveryDate ?? "Non définie"}
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">Réception</span>
                <span className="text-sm font-semibold text-slate-200">
                  {receivedDate ?? "Pas encore réceptionnée"}
                </span>
              </div>
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
          <p className="text-sm font-semibold text-white">Résumé</p>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs text-slate-500">Fournisseur</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">
                {order.supplierName}
              </p>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <p className="text-xs text-slate-500">Date de commande</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">
                {orderedDate}
              </p>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <p className="text-xs text-slate-500">Montant total HT estimé</p>
              <p className="mt-1 text-lg font-bold text-white">
                {order.totalAmount.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* 1. Modale d'aperçu du PDF externalisée */}
      <PurchaseOrderPdfModal
        isOpen={isPdfModalOpen}
        order={order}
        items={items}
        company={company}
        supplier={supplier}
        orderedDate={orderedDate}
        supplierProducts={supplierProducts}
        onClose={() => setIsPdfModalOpen(false)}
        onContinueToEmail={() => {
          setIsPdfModalOpen(false);
          setIsEmailModalOpen(true);
        }}
      />

      {/* 2. Intégration de la modale e-mail */}
      <EmailComposerModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={async (emailData) => {
          try {
            setIsSendingEmail(true);
            await sendPurchaseOrderEmail(orderId, emailData);
            
            setIsEmailModalOpen(false);
            setIsPdfModalOpen(false);

            setSuccessMessage("E-mail de bon de commande envoyé avec succès ! Redirection en cours...");
            setTimeout(() => {
              navigate("/purchase-orders");
            }, 3000);

          } catch (err) {
            console.error(
              "Erreur lors de l'envoi de l'e-mail de commande",
              err,
            );
          } finally {
            setIsSendingEmail(false);
          }
        }}
        supplierEmail={supplier?.email ?? ""}
        supplierName={supplier?.name ?? order.supplierName}
        orderNumber={order.orderNumber}
        totalAmount={order.totalAmount}
        companyName={company?.name ?? ""}
        loading={isSendingEmail}
      />
    </div>
  );
}