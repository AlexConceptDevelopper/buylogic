import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
} from "../api/purchaseOrder.api";
import { getPurchaseOrderItemsByPurchaseOrderId } from "../api/purchaseOrderItem.api";
import useAsync from "../hooks/useAsync";

import type { PurchaseOrderItem } from "../types/purchaseOrderItem";

interface OrderLineForm {
  idProduct: number;
  productName: string;
  productReference?: string;
  quantityOrdered: number;
  unitPrice: number;
  minOrderQuantity: number;
}

const SUPPLIERS_DATA = [
  {
    id: 1,
    name: "TechGlobal Distribution",
    products: [
      {
        idProduct: 8,
        name: "Laser de chantier rotatif",
        reference: "REF-ELE-003",
        defaultPrice: 250.0,
        minOrderQuantity: 1,
      },
      {
        idProduct: 9,
        name: "Perceuse sans fil 18V",
        reference: "REF-ELE-001",
        defaultPrice: 129.99,
        minOrderQuantity: 2,
      },
      {
        idProduct: 14,
        name: "Meuleuse d angle 125mm",
        reference: "REF-ELE-002",
        defaultPrice: 79.5,
        minOrderQuantity: 1,
      },
      {
        idProduct: 15,
        name: "Batterie de rechange 18V",
        reference: "REF-ELE-004",
        defaultPrice: 45.0,
        minOrderQuantity: 5,
      },
    ],
  },
  {
    id: 2,
    name: "BatiMat Pro",
    products: [
      {
        idProduct: 4,
        name: "Vis bois TFP 5x50 (Boite)",
        reference: "REF-QUI-301",
        defaultPrice: 12.5,
        minOrderQuantity: 10,
      },
      {
        idProduct: 5,
        name: "Chevilles nylon 8mm (Sachet)",
        reference: "REF-QUI-302",
        defaultPrice: 6.2,
        minOrderQuantity: 10,
      },
      {
        idProduct: 7,
        name: "Canevas de protection lourd",
        reference: "REF-LOG-204",
        defaultPrice: 34.0,
        minOrderQuantity: 3,
      },
      {
        idProduct: 13,
        name: "Gonds de porte renforcés",
        reference: "REF-QUI-303",
        defaultPrice: 18.9,
        minOrderQuantity: 4,
      },
    ],
  },
  {
    id: 3,
    name: "BureauDirect",
    products: [
      {
        idProduct: 1,
        name: "Stylos billes bleus (x50)",
        reference: "REF-BUR-102",
        defaultPrice: 8.5,
        minOrderQuantity: 5,
      },
      {
        idProduct: 6,
        name: "Agrafeuse de bureau pro",
        reference: "REF-BUR-104",
        defaultPrice: 14.9,
        minOrderQuantity: 2,
      },
      {
        idProduct: 10,
        name: "Ramette papier A4 80g",
        reference: "REF-BUR-101",
        defaultPrice: 22.0,
        minOrderQuantity: 10,
      },
      {
        idProduct: 11,
        name: "Cartouche d encre Noire XL",
        reference: "REF-BUR-103",
        defaultPrice: 35.0,
        minOrderQuantity: 2,
      },
    ],
  },
  {
    id: 4,
    name: "LogiParts Europe",
    products: [
      {
        idProduct: 2,
        name: "Carton d emballage standard",
        reference: "REF-LOG-201",
        defaultPrice: 1.2,
        minOrderQuantity: 25,
      },
      {
        idProduct: 3,
        name: "Adhésif de scellage marron",
        reference: "REF-LOG-202",
        defaultPrice: 2.5,
        minOrderQuantity: 10,
      },
      {
        idProduct: 12,
        name: "Film étirable palette",
        reference: "REF-LOG-203",
        defaultPrice: 15.0,
        minOrderQuantity: 2,
      },
    ],
  },
];

export default function PurchaseOrderFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const orderId = id ? Number(id) : null;

  const [idSupplier, setIdSupplier] = useState<number>(1);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [items, setItems] = useState<OrderLineForm[]>([]);

  const { loading: saving, execute: executeSave } = useAsync<any>();
  const { execute: executeOrder } = useAsync<any>();
  const { execute: executeItems } = useAsync<PurchaseOrderItem[]>();

  const currentSupplierProducts =
    SUPPLIERS_DATA.find((s) => s.id === idSupplier)?.products ?? [];

  useEffect(() => {
    if (isEditing && orderId && Number.isInteger(orderId)) {
      const loadExistingOrder = async () => {
        const orderData = await executeOrder(() =>
          getPurchaseOrderById(orderId),
        );
        if (orderData) {
          setIdSupplier(orderData.idSupplier);
          if (orderData.expectedDeliveryDate) {
            setExpectedDeliveryDate(
              orderData.expectedDeliveryDate.split("T")[0],
            );
          }
        }

        const itemsData = await executeItems(() =>
          getPurchaseOrderItemsByPurchaseOrderId(orderId),
        );
        if (itemsData && itemsData.length > 0) {
          const mappedItems: OrderLineForm[] = itemsData.map(
            (item: PurchaseOrderItem) => {
              const foundProduct = SUPPLIERS_DATA.flatMap(
                (s) => s.products,
              ).find((p) => p.idProduct === item.idProduct);
              return {
                idProduct: item.idProduct,
                productName: item.productName ?? `Produit #${item.idProduct}`,
                productReference: item.productReference ?? undefined,
                quantityOrdered: item.quantityOrdered,
                unitPrice: item.unitPrice,
                minOrderQuantity: foundProduct?.minOrderQuantity ?? 1,
              };
            },
          );
          setItems(mappedItems);
        }
      };

      void loadExistingOrder();
    }
  }, [isEditing, orderId, executeOrder, executeItems]);

  const handleSupplierChange = (newSupplierId: number) => {
    setIdSupplier(newSupplierId);
    setItems([]); // Nettoyage immédiat et sans fioriture des lignes
  };

  const handleAddItem = (product: (typeof currentSupplierProducts)[0]) => {
    const existingIndex = items.findIndex(
      (item) => item.idProduct === product.idProduct,
    );
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantityOrdered += 1;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          idProduct: product.idProduct,
          productName: product.name,
          productReference: product.reference,
          quantityOrdered: product.minOrderQuantity,
          unitPrice: product.defaultPrice,
          minOrderQuantity: product.minOrderQuantity,
        },
      ]);
    }
  };

  const handleUpdateItemQuantity = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index].quantityOrdered = Math.max(1, quantity);
    setItems(updated);
  };

  const handleUpdateItemPrice = (index: number, price: number) => {
    const updated = [...items];
    updated[index].unitPrice = Math.max(0, price);
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantityOrdered * item.unitPrice,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Veuillez ajouter au moins un produit à la commande.");
      return;
    }

    const invalidItem = items.find(
      (item) => item.quantityOrdered < item.minOrderQuantity,
    );
    if (invalidItem) {
      alert(
        `Attention : La quantité pour "${invalidItem.productName}" est inférieure au minimum requis (${invalidItem.minOrderQuantity}).`,
      );
      return;
    }

    const payload = {
      idCompany: 1,
      idSupplier,
      orderNumber: `CMD-${Date.now().toString().slice(-6)}`,
      status: "DRAFT",
      expectedDeliveryDate,
      totalAmount,
      items: items.map((item) => ({
        idProduct: item.idProduct,
        quantityOrdered: item.quantityOrdered,
        unitPrice: item.unitPrice,
      })),
    };

    const result = await executeSave(() =>
      isEditing && orderId
        ? updatePurchaseOrder(orderId, payload)
        : createPurchaseOrder(payload),
    );

    if (result) {
      navigate("/purchase-orders");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <Link
        to="/purchase-orders"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-300"
      >
        ← Commandes
      </Link>

      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          {isEditing ? "Édition" : "Création"}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          {isEditing ? "Modifier la commande" : "Nouvelle commande fournisseur"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6 space-y-6">
          <h2 className="text-sm font-semibold text-white">
            Informations générales
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-400 mb-2">
                Fournisseur
              </label>
              <select
                value={idSupplier}
                onChange={(e) => handleSupplierChange(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
              >
                {SUPPLIERS_DATA.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-2">
                Date de livraison prévue
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">
            Ajouter des produits
          </h2>
          <div className="flex flex-wrap gap-3">
            {currentSupplierProducts.map((prod) => (
              <button
                key={prod.idProduct}
                type="button"
                onClick={() => handleAddItem(prod)}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                + {prod.name} ({prod.defaultPrice.toFixed(2)} €){" "}
                <span className="text-slate-500 font-normal">
                  | Min: {prod.minOrderQuantity}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6 space-y-6">
          <h2 className="text-sm font-semibold text-white">
            Lignes de la commande
          </h2>

          {items.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-white/2 p-6 text-center">
              <p className="text-sm text-slate-400">
                Aucun produit ajouté pour l'instant.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                    <th className="pb-3">Produit</th>
                    <th className="pb-3 text-right">Quantité (Min.)</th>
                    <th className="pb-3 text-right">Prix U. (€)</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item, index) => {
                    const isBelowMin =
                      item.quantityOrdered < item.minOrderQuantity;
                    return (
                      <tr key={item.idProduct}>
                        <td className="py-4 text-sm font-semibold text-slate-200">
                          {item.productName}
                          {item.productReference && (
                            <span className="block text-[11px] text-slate-500 font-normal">
                              {item.productReference}
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <input
                              type="number"
                              min="1"
                              value={item.quantityOrdered}
                              onChange={(e) =>
                                handleUpdateItemQuantity(
                                  index,
                                  Number(e.target.value),
                                )
                              }
                              className={`w-20 rounded-lg border bg-slate-900 px-3 py-1.5 text-right text-sm text-white outline-none ${
                                isBelowMin
                                  ? "border-rose-500/80 focus:border-rose-400"
                                  : "border-white/10 focus:border-cyan-400/40"
                              }`}
                            />
                            <span
                              className={`text-[10px] ${isBelowMin ? "text-rose-400 font-bold" : "text-slate-500"}`}
                            >
                              Min requis : {item.minOrderQuantity}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItemPrice(
                                index,
                                Number(e.target.value),
                              )
                            }
                            className="w-24 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-right text-sm text-white outline-none focus:border-cyan-400/40"
                          />
                        </td>
                        <td className="py-4 text-right text-sm font-semibold text-slate-200">
                          {(
                            item.quantityOrdered * item.unitPrice
                          ).toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="cursor-pointer text-xs text-rose-400 hover:text-rose-300"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-white/5">
            <div className="text-right">
              <p className="text-xs text-slate-400">Total général</p>
              <p className="text-2xl font-bold text-white">
                {totalAmount.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            to="/purchase-orders"
            className="cursor-pointer rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer la commande"}
          </button>
        </div>
      </form>
    </div>
  );
}