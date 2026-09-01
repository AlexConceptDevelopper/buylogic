import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
} from "../api/purchaseOrder.api";
import { getPurchaseOrderItemsByPurchaseOrderId } from "../api/purchaseOrderItem.api";
import { getSuppliers } from "../api/supplier.api";
import { getSupplierProducts } from "../api/supplierProduct.api";
import { getProducts } from "../api/product.api";
import useAsync from "../hooks/useAsync";

import { OrderStatus } from "../types/OrderStatus";
import type { Supplier } from "../types/supplier";
import type { SupplierProduct } from "../types/supplierProduct";
import type { Product } from "../types/product";
import type { PurchaseOrderItem } from "../types/purchaseOrderItem";

interface OrderLineForm {
  idProduct: number;
  productName: string;
  productReference?: string;
  quantityOrdered: number;
  unitPrice: number;
  minOrderQuantity: number;
  packagingUnit?: string;
}

export default function PurchaseOrderFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const orderId = id ? Number(id) : null;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>(
    [],
  );
  const [products, setProducts] = useState<Product[]>([]);

  const [idSupplier, setIdSupplier] = useState<number>(1);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [items, setItems] = useState<OrderLineForm[]>([]);

  const { loading: saving, execute: executeSave } = useAsync<any>();
  const { execute: executeOrder } = useAsync<any>();
  const { execute: executeItems } = useAsync<PurchaseOrderItem[]>();
  const { execute: executeSuppliers } = useAsync<Supplier[]>();
  const { execute: executeSupplierProducts } = useAsync<SupplierProduct[]>();
  const { execute: executeProducts } = useAsync<Product[]>();

  // 1. Charger les fournisseurs, les associations et le catalogue produits au montage
  useEffect(() => {
    const loadInitialData = async () => {
      const [suppliersData, supplierProductsData, productsData] =
        await Promise.all([
          executeSuppliers(() => getSuppliers()),
          executeSupplierProducts(() => getSupplierProducts()),
          executeProducts(() => getProducts()),
        ]);

      if (suppliersData && suppliersData.length > 0) {
        setSuppliers(suppliersData);
        if (!isEditing) {
          setIdSupplier(suppliersData[0].idSupplier);
        }
      }
      if (supplierProductsData) setSupplierProducts(supplierProductsData);
      if (productsData) setProducts(productsData);
    };

    void loadInitialData();
  }, [executeSuppliers, executeSupplierProducts, executeProducts, isEditing]);

  // 2. Filtrer et combiner pour obtenir les produits du fournisseur sélectionné avec leurs infos de prix/quantité
  const currentSupplierProducts = supplierProducts
    .filter((sp) => sp.idSupplier === idSupplier && sp.active)
    .map((sp) => {
      const productInfo = products.find((p) => p.idProduct === sp.idProduct);
      return {
        idProduct: sp.idProduct,
        name: productInfo?.name ?? `Produit #${sp.idProduct}`,
        reference: sp.supplierReference || productInfo?.reference,
        defaultPrice: sp.unitPrice,
        minOrderQuantity: sp.minimumOrderQuantity,
        packagingUnit: sp.packagingUnit,
        packagingQuantity: sp.packagingQuantity,
      };
    });

  // 3. Charger la commande existante en mode édition
  useEffect(() => {
    if (
      isEditing &&
      orderId &&
      Number.isInteger(orderId) &&
      products.length > 0 &&
      supplierProducts.length > 0
    ) {
      const loadExistingOrder = async () => {
        const orderData = await executeOrder(() =>
          getPurchaseOrderById(orderId),
        );

        let activeSupplierId = idSupplier;
        if (orderData) {
          activeSupplierId = orderData.idSupplier;
          setIdSupplier(activeSupplierId);
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
              const foundProduct = products.find(
                (p) => p.idProduct === item.idProduct,
              );

              // Chercher dans le SupplierProduct pour récupérer la bonne référence fournisseur
              const foundSp = supplierProducts.find(
                (sp) =>
                  sp.idSupplier === activeSupplierId &&
                  sp.idProduct === item.idProduct,
              );

              return {
                idProduct: item.idProduct,
                productName:
                  item.productName ??
                  foundProduct?.name ??
                  `Produit #${item.idProduct}`,
                productReference:
                  foundSp?.supplierReference ??
                  item.productReference ??
                  foundProduct?.reference,
                quantityOrdered:
                  item.quantityOrdered ?? foundSp?.minimumOrderQuantity ?? 1,
                unitPrice: item.unitPrice ?? foundSp?.unitPrice ?? 0,
                minOrderQuantity: foundSp?.minimumOrderQuantity ?? 1,
              };
            },
          );
          setItems(mappedItems);
        }
      };

      void loadExistingOrder();
    }
  }, [
    isEditing,
    orderId,
    products,
    supplierProducts,
    executeOrder,
    executeItems,
  ]);

  const handleSupplierChange = (newSupplierId: number) => {
    setIdSupplier(newSupplierId);
    setItems([]);
  };

  const handleAddItem = (product: any) => {
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
          quantityOrdered: product.minOrderQuantity ?? 1,
          unitPrice: product.defaultPrice ?? 0,
          minOrderQuantity: product.minOrderQuantity ?? 1,
          packagingUnit: product.packagingUnit,
        },
      ]);
    }
  };

  const handleUpdateItemQuantity = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index].quantityOrdered = Math.max(
      1,
      isNaN(quantity) ? 1 : quantity,
    );
    setItems(updated);
  };

  const handleUpdateItemPrice = (index: number, price: number) => {
    const updated = [...items];
    updated[index].unitPrice = Math.max(0, isNaN(price) ? 0 : price);
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.quantityOrdered || 0) * (item.unitPrice || 0),
    0,
  );

  const handleSubmit = async (e: React.SyntheticEvent) => {
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
      status: OrderStatus.DRAFT,
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
                {suppliers.map((supplier) => (
                  <option key={supplier.idSupplier} value={supplier.idSupplier}>
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
            Ajouter des produits (fournisseur sélectionné)
          </h2>
          <div className="flex flex-wrap gap-3">
            {currentSupplierProducts.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Aucun produit associé à ce fournisseur.
              </p>
            ) : (
              currentSupplierProducts.map((prod) => (
                <button
                  key={prod.idProduct}
                  type="button"
                  onClick={() => handleAddItem(prod)}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  + {prod.name} ({prod.defaultPrice.toFixed(2)} € /{" "}
                  {prod.packagingUnit}){" "}
                  <span className="text-slate-500 font-normal">
                    | Min: {prod.minOrderQuantity} {prod.packagingUnit}
                  </span>
                </button>
              ))
            )}
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
                      (item.quantityOrdered ?? 0) < item.minOrderQuantity;
                    return (
                      <tr key={item.idProduct ?? index}>
                        <td className="py-4 text-sm font-semibold text-slate-200">
                          {item.productName}
                          {item.productReference && (
                            <span className="block text-[11px] text-cyan-400 font-medium uppercase tracking-widest">
                              Réf : {item.productReference}
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="1"
                                value={item.quantityOrdered ?? 1}
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
                              {/* Affichage de l'unité à côté de l'input */}
                              {item.packagingUnit && (
                                <span className="text-xs text-slate-400 font-medium">
                                  {item.packagingUnit}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] ${isBelowMin ? "text-rose-400 font-bold" : "text-slate-500"}`}
                            >
                              Min requis : {item.minOrderQuantity}{" "}
                              {item.packagingUnit}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice ?? 0}
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
                            (item.quantityOrdered || 0) * (item.unitPrice || 0)
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
