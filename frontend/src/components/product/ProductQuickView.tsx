import type { Product } from "../../types/product";
import type { PurchaseRecommendation } from "../../types/purchaseRecommendation";

interface ProductQuickViewProps {
  product: Product;
  recommendation: PurchaseRecommendation | null;
}

export default function ProductQuickView({
  product,
  recommendation,
}: ProductQuickViewProps) {
  const stockCritical = product.currentStock <= 0;

  const formattedStock = product.currentStock.toLocaleString(
    "fr-FR",
  );

  return (
    <aside className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <p className="text-sm font-semibold text-white">
        Vue rapide
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        Les informations essentielles avant d'agir.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Référence
          </span>

          <span className="text-sm font-semibold text-slate-200">
            {product.reference}
          </span>
        </div>

        <div className="h-px bg-white/5" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Stock actuel
          </span>

          <span
            className={[
              "text-sm font-semibold",
              stockCritical
                ? "text-rose-300"
                : "text-slate-200",
            ].join(" ")}
          >
            {formattedStock} {product.unit}
          </span>
        </div>

        <div className="h-px bg-white/5" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Quantités
          </span>

          <span className="text-sm font-semibold text-slate-200">
            {product.fractional
              ? "Fractionnaires"
              : "Entières"}
          </span>
        </div>

        {recommendation && (
          <>
            <div className="h-px bg-white/5" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Quantité recommandée
              </span>

              <span className="text-sm font-semibold text-cyan-300">
                {recommendation.recommendedQuantity.toLocaleString(
                  "fr-FR",
                )}{" "}
                {product.unit}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Fournisseur
              </span>

              <span className="text-right text-sm font-semibold text-slate-200">
                {recommendation.supplierName}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Délai estimé
              </span>

              <span className="text-sm font-semibold text-slate-200">
                {recommendation.estimatedLeadTimeDays}{" "}
                jours
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}