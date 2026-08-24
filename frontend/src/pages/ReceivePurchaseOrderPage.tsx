import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPurchaseOrderWithItems,
  receivePurchaseOrder,
} from "../api/purchaseOrder.api";
import type {
  PurchaseOrder,
  PurchaseOrderItemReceiveDTO,
} from "../types/purchaseOrder";

export function ReceivePurchaseOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État combiné : Clé = idPurchaseOrderItem, Valeur = { qty, unitPrice }
  const [receiveDataMap, setReceiveDataMap] = useState<
    Record<number, { qty: number; unitPrice?: number }>
  >({});

  useEffect(() => {
    if (id) {
      loadOrder(Number(id));
    }
  }, [id]);

const loadOrder = async (orderId: number) => {
    try {
      setLoading(true);
      // Utilisation de l'endpoint qui charge les items explicitement
      const data = await getPurchaseOrderWithItems(orderId);
      setOrder(data);
    } catch (err: any) {
      setError("Impossible de charger la commande.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId: number, value: string) => {
    const num = parseFloat(value) || 0;
    setReceiveDataMap((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        qty: num,
      },
    }));
  };

  const handlePriceChange = (itemId: number, value: string) => {
    const num = value === "" ? undefined : parseFloat(value);
    setReceiveDataMap((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        qty: prev[itemId]?.qty || 0,
        unitPrice: num,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSubmitting(true);
      setError(null);

      // On transforme notre Map en tableau de DTO attendu par l'API
      const itemsPayload: PurchaseOrderItemReceiveDTO[] = Object.entries(
        receiveDataMap,
      )
        .filter(([_, data]) => data.qty > 0 || data.unitPrice !== undefined) // Ne garder que ce qui est modifié/reçu
        .map(([itemId, data]) => ({
          idPurchaseOrderItem: Number(itemId),
          quantityReceivedNow: data.qty,
          unitPrice: data.unitPrice,
        }));

      await receivePurchaseOrder(Number(id), { items: itemsPayload });

      // Rediriger vers la liste des commandes après succès
      navigate("/purchase-orders");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la réception de la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Chargement...</div>;
  if (!order)
    return <div className="p-6 text-red-400">Commande introuvable.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">
        Réceptionner la commande : {order.orderNumber}
      </h1>
      <p className="text-gray-400 mb-6">Fournisseur : {order.supplierName}</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 border-b border-gray-700 text-sm">
                <th className="p-3">Produit</th>
                <th className="p-3">Commandé</th>
                <th className="p-3">Déjà reçu</th>
                <th className="p-3">À recevoir maintenant</th>
                <th className="p-3">Prix unitaire (€)</th>
              </tr>
            </thead>
            <tbody>
              {/* @ts-ignore */}
              {order.items?.map((item: any) => (
                <tr
                  key={item.idPurchaseOrderItem}
                  className="border-b border-gray-700/50"
                >
                  <td className="p-3">
                    {item.productName || item.product?.name}
                  </td>
                  <td className="p-3">{item.quantityOrdered}</td>
                  <td className="p-3">{item.quantityReceived || 0}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 w-32 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="0"
                      value={
                        receiveDataMap[item.idPurchaseOrderItem]?.qty || ""
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          item.idPurchaseOrderItem,
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 w-32 text-white focus:outline-none focus:border-cyan-400"
                      placeholder={item.unitPrice ?? "0"}
                      value={
                        receiveDataMap[item.idPurchaseOrderItem]?.unitPrice ??
                        ""
                      }
                      onChange={(e) =>
                        handlePriceChange(
                          item.idPurchaseOrderItem,
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/purchase-orders")}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {submitting ? "Validation..." : "Valider la réception"}
          </button>
        </div>
      </form>
    </div>
  );
}
