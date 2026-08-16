import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../api/product.api";
import useAsync from "../hooks/useAsync";
import type { Product } from "../types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const { loading, error, execute } = useAsync<Product[]>();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await execute(() => getProducts());

      if (data) {
        setProducts(data);
      }
    };

    loadProducts();
  }, [execute]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Produits
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Catalogue produits
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Chargement de vos produits...
        </p>

        <div className="mt-8 space-y-3">
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Produits
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Catalogue produits
        </h1>

        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger les produits.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération des produits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Produits
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Catalogue produits
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Consultez les produits de votre entreprise et leur situation
            actuelle en stock.
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
          <p className="text-xs text-slate-500">Produits</p>

          <p className="mt-1 text-xl font-bold text-white">{products.length}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/5 text-2xl text-cyan-300">
            📦
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            Aucun produit
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Aucun produit n'est disponible pour le moment.
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
          <div className="border-b border-white/5 px-6 py-4">
            <p className="text-sm font-semibold text-white">
              Tous les produits
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Cliquez sur un produit pour consulter son détail.
            </p>
          </div>

          <div className="divide-y divide-white/5">
            {products.map((product) => (
              <Link
                key={product.idProduct}
                to={`/products/${product.idProduct}`}
                className="block px-6 py-5 transition hover:bg-white/3"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-sm font-semibold text-white">
                        {product.name}
                      </h2>

                      <span
                        className={[
                          "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                          product.active
                            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                            : "border-slate-400/20 bg-slate-400/5 text-slate-400",
                        ].join(" ")}
                      >
                        {product.active ? "Actif" : "Inactif"}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                      {product.reference}
                    </p>

                    {product.description && (
                      <p className="mt-2 max-w-2xl truncate text-sm text-slate-500">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-8 lg:justify-end">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.15em] text-slate-600">
                        Stock actuel
                      </p>

                      <p
                        className={[
                          "mt-1 text-lg font-bold",
                          product.currentStock <= 0
                            ? "text-rose-300"
                            : "text-white",
                        ].join(" ")}
                      >
                        {product.currentStock}
                        <span className="ml-1 text-xs font-medium text-slate-500">
                          {product.unit}
                        </span>
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-cyan-300">
                      Voir le produit →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
