import type { Product } from "../../../types/product";

interface StockAdjustmentModalProps {
  product: Product;
  open: boolean;
  quantity: string;
  reason: string;
  error: string | null;
  loading: boolean;
  quantityStep: string;
  onQuantityChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function StockAdjustmentModal({
  product,
  open,
  quantity,
  reason,
  error,
  loading,
  quantityStep,
  onQuantityChange,
  onReasonChange,
  onClose,
  onSubmit,
}: StockAdjustmentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-adjustment-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
              Ajustement du stock
            </p>

            <h2
              id="stock-adjustment-title"
              className="mt-2 text-2xl font-bold text-white"
            >
              Corriger le stock
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-200">
              {product.name}
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
              Stock actuel :{" "}
              {product.currentStock.toLocaleString("fr-FR")}{" "}
              {product.unit}
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
              htmlFor="stock-adjustment-quantity"
              className="text-xs font-semibold text-slate-400"
            >
              Nouveau stock *
            </label>

            <div className="mt-2 flex items-center gap-3">
              <input
                id="stock-adjustment-quantity"
                type="number"
                min="0"
                step={quantityStep}
                value={quantity}
                onChange={(event) =>
                  onQuantityChange(event.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              />

              <span className="shrink-0 rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm font-semibold text-slate-300">
                {product.unit}
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              {product.fractional
                ? "Les quantités décimales sont autorisées."
                : "Le stock doit être une quantité entière."}
            </p>
          </div>

          <div>
            <label
              htmlFor="stock-adjustment-reason"
              className="text-xs font-semibold text-slate-400"
            >
              Raison *
            </label>

            <textarea
              id="stock-adjustment-reason"
              value={reason}
              onChange={(event) =>
                onReasonChange(event.target.value)
              }
              disabled={loading}
              rows={3}
              placeholder="Ex. Correction après inventaire physique"
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
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
              ? "Ajustement..."
              : "Enregistrer l'ajustement"}
          </button>
        </div>
      </div>
    </div>
  );
}