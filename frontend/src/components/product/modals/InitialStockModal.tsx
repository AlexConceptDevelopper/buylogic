import type { Product } from "../../../types/product";

interface InitialStockModalProps {
  product: Product;
  open: boolean;
  quantity: string;
  error: string | null;
  loading: boolean;
  quantityStep: string;
  onQuantityChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function InitialStockModal({
  product,
  open,
  quantity,
  error,
  loading,
  quantityStep,
  onQuantityChange,
  onClose,
  onSubmit,
}: InitialStockModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="initial-stock-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
              Stock initial
            </p>

            <h2
              id="initial-stock-title"
              className="mt-2 text-2xl font-bold text-white"
            >
              Initialiser le stock
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

        <div className="mt-6">
          <label
            htmlFor="initial-stock-quantity"
            className="text-xs font-semibold text-slate-400"
          >
            Quantité actuelle *
          </label>

          <div className="mt-2 flex items-center gap-3">
            <input
              id="initial-stock-quantity"
              type="number"
              min="0"
              step={quantityStep}
              value={quantity}
              onChange={(event) =>
                onQuantityChange(event.target.value)
              }
              disabled={loading}
              placeholder={
                product.fractional ? "Ex. 18.5" : "Ex. 18"
              }
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
            />

            <span className="shrink-0 rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm font-semibold text-slate-300">
              {product.unit}
            </span>
          </div>

          <p className="mt-2 text-[10px] text-slate-600">
            {product.fractional
              ? "Les quantités décimales sont autorisées pour ce produit."
              : "Ce produit doit être géré en quantités entières."}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
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
              ? "Enregistrement..."
              : "Enregistrer le stock"}
          </button>
        </div>
      </div>
    </div>
  );
}