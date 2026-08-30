import type { Product, ProductCreate, ProductUnit, ProductType } from "../../types/product";
import { UNIT_LABELS } from "../../constants/product.constants";

interface ProductEditModalProps {
  editProduct: Product | null;
  updating: boolean;
  editForm: ProductCreate;
  editError: string | null;
  onChangeForm: (updater: (current: ProductCreate) => ProductCreate) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function ProductEditModal({
  editProduct,
  updating,
  editForm,
  editError,
  onChangeForm,
  onSubmit,
  onClose,
}: ProductEditModalProps) {
  if (!editProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10 bg-black/60 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
              Modifier le produit
            </p>
            <h2
              id="edit-product-title"
              className="mt-2 text-2xl font-bold text-white"
            >
              {editProduct.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Mettez à jour les informations de cet article.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            aria-label="Fermer"
            className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="edit-product-name"
              className="text-xs font-semibold text-slate-400"
            >
              Nom du produit *
            </label>
            <input
              id="edit-product-name"
              type="text"
              value={editForm.name}
              onChange={(event) =>
                onChangeForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              disabled={updating}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-product-type"
              className="text-xs font-semibold text-slate-400"
            >
              Type de produit *
            </label>
            <select
              id="edit-product-type"
              value={editForm.type}
              onChange={(event) =>
                onChangeForm((current) => ({
                  ...current,
                  type: event.target.value as ProductType,
                }))
              }
              disabled={updating}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            >
              <option value="PURCHASED">
                Acheté (Matière première, ingrédient...)
              </option>
              <option value="MANUFACTURED">
                Fabriqué (Recette, produit fini...)
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="edit-product-reference"
              className="text-xs font-semibold text-slate-400"
            >
              Référence
            </label>
            <input
              id="edit-product-reference"
              type="text"
              value={editForm.reference}
              onChange={(event) =>
                onChangeForm((current) => ({
                  ...current,
                  reference: event.target.value,
                }))
              }
              disabled={updating}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-product-description"
              className="text-xs font-semibold text-slate-400"
            >
              Description
            </label>
            <textarea
              id="edit-product-description"
              value={editForm.description ?? ""}
              onChange={(event) =>
                onChangeForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              disabled={updating}
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-product-unit"
              className="text-xs font-semibold text-slate-400"
            >
              Unité *
            </label>
            <select
              id="edit-product-unit"
              value={editForm.unit}
              onChange={(event) =>
                onChangeForm((current) => ({
                  ...current,
                  unit: event.target.value as ProductUnit,
                }))
              }
              disabled={updating}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            >
              {Object.entries(UNIT_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {code} — {label}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-xl border border-white/5 bg-white/2 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={editForm.fractional}
                  onChange={(event) =>
                    onChangeForm((current) => ({
                      ...current,
                      fractional: event.target.checked,
                    }))
                  }
                  disabled={updating}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-white/20 bg-slate-950 accent-cyan-400"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-200">
                    Produit fractionnable
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Autorise les quantités décimales pour le stock et les
                    commandes.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {editError && (
            <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
              <p className="text-sm text-red-300">{editError}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={updating}
            className={[
              "rounded-xl px-4 py-3 text-sm font-bold transition",
              updating
                ? "cursor-not-allowed bg-slate-700 text-slate-500"
                : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
            ].join(" ")}
          >
            {updating
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </div>
  );
}