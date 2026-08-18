import type { Product } from "../../types/product";

interface ProductStockSectionProps {
  product: Product;
  isOwner: boolean;
  hasProductMovements: boolean;
  onAdjustStock: () => void;
  onInitializeStock: () => void;
}

export default function ProductStockSection({
  product,
  isOwner,
  hasProductMovements,
  onAdjustStock,
  onInitializeStock,
}: ProductStockSectionProps) {
  const stockCritical = product.currentStock <= 0;

  const formattedStock = product.currentStock.toLocaleString(
    "fr-FR",
  );

  return (
    <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            État du stock
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Situation actuelle du produit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
              stockCritical
                ? "border-rose-400/20 bg-rose-400/5 text-rose-300"
                : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
            ].join(" ")}
          >
            {stockCritical
              ? "Rupture"
              : "Stock disponible"}
          </span>

          {isOwner && (
            <button
              type="button"
              onClick={onAdjustStock}
              className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:bg-white/5 hover:text-cyan-300"
            >
              Ajuster le stock
            </button>
          )}
        </div>
      </div>

      {!hasProductMovements &&
        product.currentStock === 0 && (
          <div className="mt-5 flex flex-col gap-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-300">
                Stock initial non renseigné
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Saisissez le stock déjà présent dans votre
                entreprise pour démarrer le suivi BuyLogic.
              </p>
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={onInitializeStock}
                className="shrink-0 cursor-pointer rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Initialiser le stock
              </button>
            )}
          </div>
        )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="text-xs text-slate-500">
            Stock actuel
          </p>

          <p
            className={[
              "mt-2 text-2xl font-bold",
              stockCritical
                ? "text-rose-300"
                : "text-white",
            ].join(" ")}
          >
            {formattedStock}
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            {product.unit}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="text-xs text-slate-500">
            Référence
          </p>

          <p className="mt-2 truncate text-sm font-bold text-white">
            {product.reference}
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            Référence interne
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="text-xs text-slate-500">
            Quantités
          </p>

          <p className="mt-2 text-sm font-bold text-white">
            {product.fractional
              ? "Fractionnaires"
              : "Entières"}
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            {product.fractional
              ? "Décimales autorisées"
              : "Uniquement des entiers"}
          </p>
        </div>
      </div>
    </section>
  );
}