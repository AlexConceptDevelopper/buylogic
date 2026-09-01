import type { PurchaseOrder } from "../../types/purchaseOrder";
import type { PurchaseOrderItem } from "../../types/purchaseOrderItem";
import type { Company } from "../../types/company";
import type { Supplier } from "../../types/supplier";
import type { SupplierProduct } from "../../types/supplierProduct";

interface PurchaseOrderPdfModalProps {
  isOpen: boolean;
  order: PurchaseOrder;
  items: PurchaseOrderItem[];
  company: Company | null;
  supplier: Supplier | null;
  orderedDate: string;
  supplierProducts: SupplierProduct[] | null;
  onClose: () => void;
  onContinueToEmail: () => void;
}

export function PurchaseOrderPdfModal({
  isOpen,
  order,
  items,
  company,
  supplier,
  orderedDate,
  supplierProducts,
  onClose,
  onContinueToEmail,
}: PurchaseOrderPdfModalProps) {
  if (!isOpen) return null;

  const getSupplierProductForItem = (productId: number) => {
    if (!supplierProducts) return undefined;
    return supplierProducts.find(
      (sp) => sp.idProduct === productId && sp.idSupplier === order.idSupplier,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white text-slate-900 shadow-2xl p-8 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
            <h3 className="text-base font-bold text-slate-900">
              Aperçu du bon de commande
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold cursor-pointer transition"
          >
            ✕ Fermer
          </button>
        </div>

        <div className="bg-white rounded-lg p-2">
          <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6 items-start">
            <div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {company?.name ?? "MatiGuard"}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {company?.address ?? "Adresse non renseignée"}
              </p>
              {company?.siret && (
                <p className="text-xs text-slate-500 mt-0.5">
                  SIRET : {company.siret}
                </p>
              )}
              {company?.phone && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Tél : {company.phone}
                </p>
              )}
            </div>

            <div className="space-y-4 text-right">
              <div>
                <span className="inline-block bg-slate-900 text-white px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                  Bon de Commande
                </span>
                <p className="text-sm font-bold text-cyan-700 mt-1.5">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Date : {orderedDate}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 border-l-4 border-l-cyan-600 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                  Fournisseur destinataire
                </p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {supplier?.name ?? order.supplierName}
                </p>
                {supplier?.email && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Contact : {supplier.email}
                  </p>
                )}
                {supplier?.address && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Adresse : {supplier.address}
                  </p>
                )}
                {supplier?.phone && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tél : {supplier.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 font-bold">
                    Article & Réf. Fournisseur
                  </th>
                  <th className="py-2.5 text-center font-bold">Quantité</th>
                  <th className="py-2.5 text-right font-bold">P.U. HT</th>
                  <th className="py-2.5 text-right font-bold">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item) => {
                  const supplierProduct = getSupplierProductForItem(
                    item.idProduct,
                  );
                  return (
                    <tr
                      key={item.idPurchaseOrderItem}
                      className="hover:bg-slate-50/50"
                    >
                      <td className="py-3 font-semibold text-slate-900">
                        {item.productName ?? `Produit #${item.idProduct}`}
                        {supplierProduct?.supplierReference && (
                          <span className="block text-[10px] font-bold text-cyan-700 mt-0.5 uppercase tracking-wider">
                            Réf : {supplierProduct.supplierReference}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-center font-medium text-slate-700">
                        {item.quantityOrdered}
                      </td>
                      <td className="py-3 text-right text-slate-700">
                        {item.unitPrice.toFixed(2)} €
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        {(item.quantityOrdered * item.unitPrice).toFixed(2)} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t border-slate-200">
            <div className="w-64 space-y-1.5 text-right text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Total HT :</span>
                <span className="font-semibold text-slate-900">
                  {order.totalAmount.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>TVA (20% indicatif*) :</span>
                <span>
                  {(order.totalAmount * 0.2).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 bg-cyan-50/50 p-2 rounded-lg border border-cyan-100">
                <span>Total TTC estimé :</span>
                <span className="text-cyan-700">
                  {(order.totalAmount * 1.2).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onContinueToEmail}
            className="cursor-pointer rounded-xl bg-cyan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-700 flex items-center gap-1.5"
          >
            ✉️ Continuer vers l'envoi de l'e-mail
          </button>
        </div>
      </div>
    </div>
  );
}