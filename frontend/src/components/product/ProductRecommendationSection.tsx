import { Link } from "react-router-dom";

import type { Product } from "../../types/product";
import type { PurchaseRecommendation } from "../../types/purchaseRecommendation";

interface ProductRecommendationSectionProps {
  product: Product;
  recommendation: PurchaseRecommendation | null;
}

export default function ProductRecommendationSection({
  product,
  recommendation,
}: ProductRecommendationSectionProps) {
  if (!recommendation) {
    return (
      <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold text-white">
          Aucune recommandation active
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          BuyLogic ne recommande actuellement aucune action
          d'achat pour ce produit.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Recommandation BuyLogic
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Une action d'achat est actuellement recommandée pour
            ce produit.
          </p>
        </div>

        <span className="rounded-full border border-rose-400/20 bg-rose-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-300">
          À traiter
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">
            Quantité recommandée
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {recommendation.recommendedQuantity.toLocaleString(
              "fr-FR",
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            {product.unit}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">
            Confiance
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-300">
            {recommendation.confidenceScore.toLocaleString(
              "fr-FR",
              {
                maximumFractionDigits: 1,
              },
            )}
            %
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-white/5 bg-slate-950/40 p-4">
        <p className="text-xs text-slate-500">
          Pourquoi BuyLogic recommande cette action
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {recommendation.reason}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {}}
          className="flex-1 cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
        >
          Préparer la commande
        </button>

        <Link
          to={`/recommendations/${recommendation.idRecommendation}`}
          className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Voir la recommandation
        </Link>
      </div>
    </section>
  );
}