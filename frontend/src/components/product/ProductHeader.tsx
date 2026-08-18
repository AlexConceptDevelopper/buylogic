import { Link } from "react-router-dom";

import type { Product } from "../../types/product";

interface ProductHeaderProps {
  product: Product;
}

export default function ProductHeader({
  product,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Link
          to="/products"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-300"
        >
          ← Produits
        </Link>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
          {product.reference}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {product.name}
          </h1>

          {!product.active && (
            <span className="rounded-full border border-slate-400/20 bg-slate-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Inactif
            </span>
          )}

          {product.fractional && (
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-300">
              Quantité fractionnaire
            </span>
          )}
        </div>

        {product.description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {product.description}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
        <p className="text-xs text-slate-500">
          Unité
        </p>

        <p className="mt-1 text-sm font-bold text-white">
          {product.unit}
        </p>
      </div>
    </div>
  );
}