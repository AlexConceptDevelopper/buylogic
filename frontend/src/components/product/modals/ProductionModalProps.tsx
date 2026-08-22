import { useState } from "react";
import type { Product } from "../../../types/product";

interface ProductionModalProps {
  product: Product;
  open: boolean;
  error: string | null;
  loading: boolean;
  quantityStep: string;
  onClose: () => void;
  onSubmit: (quantityToProduce: number) => void;
}

export default function ProductionModal({
  product,
  open,
  error,
  loading,
  quantityStep,
  onClose,
  onSubmit,
}: ProductionModalProps) {
  const [quantity, setQuantity] = useState("1");

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    const qty = Number(quantity);
    onSubmit(qty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-400">
              Fabrication / Production
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Lancer la production
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-200">
              {product.name}
            </p>

            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
              Stock actuel : {product.currentStock.toLocaleString("fr-FR")} {product.unit}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
            className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">
              Quantité à produire *
            </label>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min="1"
                step={quantityStep}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10 disabled:opacity-50"
              />

              <span className="shrink-0 rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm font-semibold text-slate-300">
                {product.unit}
              </span>
            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              Cette action va consommer automatiquement les ingrédients de la recette et augmenter le stock de ce produit.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={[
              "rounded-xl px-4 py-3 text-sm font-bold transition",
              loading
                ? "cursor-not-allowed bg-slate-700 text-slate-500"
                : "cursor-pointer bg-emerald-500 text-slate-950 hover:bg-emerald-400",
            ].join(" ")}
          >
            {loading ? "Fabrication en cours..." : "Lancer la production"}
          </button>
        </div>
      </div>
    </div>
  );
}