import type { Product, ProductUnit } from "../../../types/product";
import type { Supplier } from "../../../types/supplier";
import type {
  SupplierProduct,
  SupplierProductCreate,
} from "../../../types/supplierProduct";
import { UNIT_LABELS } from "../../../constants/product.constants";

interface SupplierProductModalProps {
  open: boolean;
  product: Product;
  suppliers: Supplier[];
  supplierProducts: SupplierProduct[];
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

  const availableSuppliers = suppliers.filter(
    (supplier) =>
      !supplierProducts.some(
        (item) =>
          item.idSupplier === supplier.idSupplier,
      ),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-6 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplier-product-title"
        className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
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

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Définissez les conditions dans lesquelles ce
              fournisseur propose ce produit.
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
                  idSupplier: Number(event.target.value),
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
                  supplierReference: event.target.value,
                })
              }
              disabled={loading}
              placeholder="Ex. FAR-T55-25"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />
          </div>

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
                      ? undefined
                      : Number(event.target.value),
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
              step="0.001"
              value={form.minimumOrderQuantity ?? ""}
              onChange={(event) =>
                onChange({
                  ...form,
                  minimumOrderQuantity:
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                })
              }
              disabled={loading}
              placeholder="10"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Quantité minimale que le fournisseur accepte
              par commande.
            </p>
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
                      ? undefined
                      : Number(event.target.value),
                })
              }
              disabled={loading}
              placeholder="2"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Délai habituel entre la commande et la réception.
            </p>
          </div>

          {/* Quantité de livraison / conditionnement */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="supplier-product-pkg-qty"
                className="text-xs font-semibold text-slate-400"
              >
                Qté par livraison *
              </label>
              <input
                id="supplier-product-pkg-qty"
                type="number"
                min="0"
                step="0.001"
                value={form.packagingQuantity ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    packagingQuantity:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                disabled={loading}
                placeholder="25"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="supplier-product-pkg-unit"
                className="text-xs font-semibold text-slate-400"
              >
                Unité *
              </label>
              <select
                id="supplier-product-pkg-unit"
                value={form.packagingUnit ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    packagingUnit: e.target.value === "" ? undefined : (e.target.value as ProductUnit),
                  })
                }
                disabled={loading}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              >
                <option value="">Sélectionner</option>
                {Object.entries(UNIT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Option fractionnable */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="supplier-product-fractionable"
              type="checkbox"
              checked={form.fractionable ?? false}
              onChange={(e) =>
                onChange({
                  ...form,
                  fractionable: e.target.checked,
                })
              }
              disabled={loading}
              className="h-4 w-4 rounded border-white/10 bg-slate-950 text-cyan-400 focus:ring-cyan-400/20"
            />
            <label
              htmlFor="supplier-product-fractionable"
              className="text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Conditionnement fractionnable
            </label>
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