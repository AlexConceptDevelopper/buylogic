import type { Product } from "../../../types/product";
import type { Supplier } from "../../../types/supplier";
import type {
  SupplierProductCreate,
} from "../../../types/supplierProduct";;

interface SupplierProductModalProps {
  open: boolean;
  product: Product;
  suppliers: Supplier[];
  supplierProducts: SupplierProductCreate[];
  form: Omit<SupplierProductCreate, "idProduct">;
  error: string | null;
  loading: boolean;
  onChange: (
    form: Omit<SupplierProductCreate, "idProduct">,
  ) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function SupplierProductModal({
  open,
  product,
  suppliers,
  supplierProducts,
  form,
  error,
  loading,
  onChange,
  onSubmit,
  onClose,
}: SupplierProductModalProps) {
  if (!open) {
    return null;
  }

  const quantityStep = product.fractional
    ? "0.001"
    : "1";

  const availableSuppliers = suppliers.filter(
    (supplier) =>
      !supplierProducts.some(
        (item) =>
          item.idSupplier === supplier.idSupplier,
      ),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-product-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
              Conditions d'achat
            </p>

            <h2
              id="supplier-product-title"
              className="mt-2 text-2xl font-bold text-white"
            >
              Associer un fournisseur
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-200">
              {product.name}
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
              {product.reference || "Sans référence"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
            className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="supplier-product-supplier"
              className="text-xs font-semibold text-slate-400"
            >
              Fournisseur *
            </label>

            <select
              id="supplier-product-supplier"
              value={form.idSupplier}
              onChange={(event) =>
                onChange({
                  ...form,
                  idSupplier: Number(
                    event.target.value,
                  ),
                })
              }
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            >
              <option value={0}>
                Sélectionner un fournisseur
              </option>

              {availableSuppliers.map((supplier) => (
                <option
                  key={supplier.idSupplier}
                  value={supplier.idSupplier}
                >
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="supplier-product-reference"
              className="text-xs font-semibold text-slate-400"
            >
              Référence fournisseur
            </label>

            <input
              id="supplier-product-reference"
              type="text"
              value={form.supplierReference ?? ""}
              onChange={(event) =>
                onChange({
                  ...form,
                  supplierReference:
                    event.target.value,
                })
              }
              disabled={loading}
              placeholder="Ex. FAR-T55-25"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="supplier-product-price"
                className="text-xs font-semibold text-slate-400"
              >
                Prix unitaire (€) *
              </label>

              <input
                id="supplier-product-price"
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice ?? ""}
                onChange={(event) =>
                  onChange({
                    ...form,
                    unitPrice:
                      event.target.value === ""
                        ? (undefined as unknown as number)
                        : Number(
                            event.target.value,
                          ),
                  })
                }
                disabled={loading}
                placeholder="18.50"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-product-minimum"
                className="text-xs font-semibold text-slate-400"
              >
                Minimum de commande *
              </label>

              <input
                id="supplier-product-minimum"
                type="number"
                min="0"
                step={quantityStep}
                value={form.minimumOrderQuantity ?? ""}
                onChange={(event) =>
                  onChange({
                    ...form,
                    minimumOrderQuantity:
                      event.target.value === ""
                        ? (undefined as unknown as number)
                        : Number(
                            event.target.value,
                          ),
                  })
                }
                disabled={loading}
                placeholder={
                  product.fractional
                    ? "Ex. 2.5"
                    : "Ex. 10"
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              />

              <p className="mt-1 text-[10px] text-slate-600">
                {product.fractional
                  ? "Les quantités décimales sont autorisées."
                  : "Ce produit doit être commandé en quantité entière."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="supplier-product-packaging-quantity"
                className="text-xs font-semibold text-slate-400"
              >
                Quantité du conditionnement *
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="supplier-product-packaging-quantity"
                  type="number"
                  min="0"
                  step={quantityStep}
                  value={form.packagingQuantity ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...form,
                      packagingQuantity:
                        event.target.value === ""
                          ? (undefined as unknown as number)
                          : Number(
                              event.target.value,
                            ),
                    })
                  }
                  disabled={loading}
                  placeholder={
                    product.fractional
                      ? "Ex. 25.5"
                      : "Ex. 25"
                  }
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />

                <div className="flex items-center rounded-xl border border-white/5 bg-white/2 px-3 text-xs font-semibold text-slate-400">
                  {product.unit}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="supplier-product-packaging-unit"
                className="text-xs font-semibold text-slate-400"
              >
                Unité du conditionnement *
              </label>

              <select
                id="supplier-product-packaging-unit"
                value={form.packagingUnit}
                onChange={(event) =>
                  onChange({
                    ...form,
                    packagingUnit:
                      event.target.value as
                        | "UNIT"
                        | "KG"
                        | "L",
                  })
                }
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              >
                <option value="UNIT">UNIT</option>
                <option value="KG">KG</option>
                <option value="L">L</option>
              </select>

              <p className="mt-1 text-[10px] text-slate-600">
                Doit correspondre à l'unité du produit :{" "}
                {product.unit}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/2 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.fractionable}
                onChange={(event) =>
                  onChange({
                    ...form,
                    fractionable:
                      event.target.checked,
                  })
                }
                disabled={loading}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-white/20 bg-slate-950 accent-cyan-400"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-200">
                  Conditionnement fractionnable
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Le fournisseur autorise l'achat ou
                  l'utilisation d'une partie du
                  conditionnement.
                </span>
              </span>
            </label>
          </div>

          <div>
            <label
              htmlFor="supplier-product-lead-time"
              className="text-xs font-semibold text-slate-400"
            >
              Délai fournisseur (jours) *
            </label>

            <input
              id="supplier-product-lead-time"
              type="number"
              min="0"
              step="1"
              value={form.expectedLeadTimeDays ?? ""}
              onChange={(event) =>
                onChange({
                  ...form,
                  expectedLeadTimeDays:
                    event.target.value === ""
                      ? (undefined as unknown as number)
                      : Number(
                          event.target.value,
                        ),
                })
              }
              disabled={loading}
              placeholder="2"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className={[
              "rounded-xl px-4 py-3 text-sm font-bold transition",
              loading
                ? "cursor-not-allowed bg-slate-700 text-slate-500"
                : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
            ].join(" ")}
          >
            {loading
              ? "Association..."
              : "Associer le fournisseur"}
          </button>
        </div>
      </div>
    </div>
  );
}