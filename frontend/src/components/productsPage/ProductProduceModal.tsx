import type { Product } from "../../types/product";
import { UNIT_LABELS, getUnitLabel } from "../../constants/product.constants";

interface ProductProduceModalProps {
  produceTarget: Product | null;
  produceQuantity: string;
  produceLoading: boolean;
  produceError: string | null;
  onChangeQuantity: (qty: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function ProductProduceModal({
  produceTarget,
  produceQuantity,
  produceLoading,
  produceError,
  onChangeQuantity,
  onSubmit,
  onClose,
}: ProductProduceModalProps) {
  if (!produceTarget) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10 bg-black/60 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="produce-product-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">Atelier de fabrication</p>
            <h2 id="produce-product-title" className="mt-2 text-2xl font-bold text-white">
              Lancer une production
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-200">{produceTarget.name}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
              Stock actuel : {produceTarget.currentStock} {getUnitLabel(produceTarget.unit, produceTarget.currentStock)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={produceLoading}
            aria-label="Fermer"
            className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="produce-quantity" className="text-xs font-semibold text-slate-400">
              Quantité à produire *
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="produce-quantity"
                type="number"
                min="1"
                step={produceTarget.fractional ? "0.01" : "1"}
                value={produceQuantity}
                onChange={(event) => onChangeQuantity(event.target.value)}
                disabled={produceLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
              />
              <span className="shrink-0 rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm font-semibold text-slate-300">
                {UNIT_LABELS[produceTarget.unit] || produceTarget.unit}
              </span>
            </div>
          </div>

          {produceError && (
            <div className="rounded-xl border border-rose-400/10 bg-rose-400/5 p-4">
              <p className="text-sm text-rose-300">{produceError}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={produceLoading}
            className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={produceLoading}
            className={[
              "rounded-xl px-4 py-3 text-sm font-bold transition",
              produceLoading
                ? "cursor-not-allowed bg-slate-700 text-slate-500"
                : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
            ].join(" ")}
          >
            {produceLoading ? "Fabrication..." : "Lancer la fabrication"}
          </button>
        </div>
      </div>
    </div>
  );
}