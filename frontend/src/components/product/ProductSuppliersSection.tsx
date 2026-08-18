import type { Product } from "../../types/product";
import type { Supplier } from "../../types/supplier";
import type { SupplierProduct } from "../../types/supplierProduct";

interface ProductSuppliersSectionProps {
  product: Product;
  suppliers: Supplier[];
  supplierProducts: SupplierProduct[];
  onAddSupplier: () => void;
}

export default function ProductSuppliersSection({
  product,
  suppliers,
  supplierProducts,
  onAddSupplier,
}: ProductSuppliersSectionProps) {
  return (
    <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Fournisseurs du produit
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Définissez les conditions d'achat utilisées par BuyLogic.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSupplier}
          disabled={suppliers.length === 0}
          className={[
            "rounded-xl px-4 py-2.5 text-xs font-bold transition",
            suppliers.length > 0
              ? "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              : "cursor-not-allowed bg-slate-700 text-slate-500",
          ].join(" ")}
        >
          Ajouter un fournisseur
        </button>
      </div>

      {supplierProducts.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-5 text-center">
          <p className="text-sm font-semibold text-slate-300">
            Aucun fournisseur associé
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            Associez un fournisseur pour permettre à BuyLogic de
            calculer les conditions d'achat.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {supplierProducts.map((supplierProduct) => {
            const supplier = suppliers.find(
              (item) =>
                item.idSupplier === supplierProduct.idSupplier,
            );

            return (
              <div
                key={supplierProduct.idSupplierProduct}
                className="rounded-xl border border-white/5 bg-white/2 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {supplier?.name ??
                        `Fournisseur #${supplierProduct.idSupplier}`}
                    </p>

                    {supplierProduct.supplierReference && (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                        Réf. fournisseur :{" "}
                        {supplierProduct.supplierReference}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={[
                        "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                        supplierProduct.active
                          ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                          : "border-slate-400/20 bg-slate-400/5 text-slate-400",
                      ].join(" ")}
                    >
                      {supplierProduct.active
                        ? "Actif"
                        : "Inactif"}
                    </span>

                    {supplierProduct.fractionable && (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                        Fractionnable
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-[11px] text-slate-600">
                      Prix
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {supplierProduct.unitPrice.toLocaleString(
                        "fr-FR",
                        {
                          style: "currency",
                          currency: "EUR",
                        },
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-600">
                      Minimum
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {supplierProduct.minimumOrderQuantity.toLocaleString(
                        "fr-FR",
                      )}{" "}
                      {product.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-600">
                      Conditionnement
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {supplierProduct.packagingQuantity.toLocaleString(
                        "fr-FR",
                      )}{" "}
                      {supplierProduct.packagingUnit}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-600">
                      Délai
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-200">
                      {supplierProduct.expectedLeadTimeDays}{" "}
                      jour
                      {supplierProduct.expectedLeadTimeDays > 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-white/5 bg-slate-950/30 px-3 py-2.5">
                  <p className="text-[11px] text-slate-500">
                    Conditionnement
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {supplierProduct.packagingQuantity.toLocaleString(
                      "fr-FR",
                    )}{" "}
                    {supplierProduct.packagingUnit}
                    {" · "}
                    {supplierProduct.fractionable
                      ? "fractionnement autorisé"
                      : "conditionnement non fractionnable"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}