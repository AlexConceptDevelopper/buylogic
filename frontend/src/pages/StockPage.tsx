import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../api/product.api";
import { Link } from "react-router-dom";
import useAsync from "../hooks/useAsync";

import type { Product } from "../types/product";

type StockFilter = "ALL" | "OUT_OF_STOCK" | "LOW_STOCK" | "AVAILABLE";

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StockFilter>("ALL");

  const { loading, error, execute } = useAsync<Product[]>();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await execute(() => getProducts());

      if (data) {
        setProducts(data);
      }
    };

    void loadProducts();
  }, [execute]);

  const stockStats = useMemo(() => {
    const outOfStock = products.filter(
      (product) => product.currentStock <= 0,
    ).length;

    const lowStock = products.filter(
      (product) => product.currentStock > 0 && product.currentStock <= 5,
    ).length;

    const available = products.filter(
      (product) => product.currentStock > 5,
    ).length;

    return {
      total: products.length,
      outOfStock,
      lowStock,
      available,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.reference.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      switch (filter) {
        case "OUT_OF_STOCK":
          return product.currentStock <= 0;

        case "LOW_STOCK":
          return product.currentStock > 0 && product.currentStock <= 5;

        case "AVAILABLE":
          return product.currentStock > 5;

        default:
          return true;
      }
    });
  }, [products, search, filter]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-4 w-16 animate-pulse rounded bg-white/5" />

        <div className="mt-3 h-10 w-64 animate-pulse rounded bg-white/5" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        </div>

        <div className="mt-6 h-12 animate-pulse rounded-xl bg-white/5" />

        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Stock
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          État du stock
        </h1>

        <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger le stock.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Une erreur est survenue lors de la récupération des produits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Stock
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          État du stock
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Surveillez rapidement les niveaux de stock de vos produits et
          identifiez les situations qui nécessitent une action.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
          <p className="text-xs text-slate-500">Produits suivis</p>

          <p className="mt-2 text-2xl font-bold text-white">
            {stockStats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-400/10 bg-rose-400/5 p-5">
          <p className="text-xs text-slate-500">Ruptures</p>

          <p className="mt-2 text-2xl font-bold text-rose-300">
            {stockStats.outOfStock}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">
          <p className="text-xs text-slate-500">Stock faible</p>

          <p className="mt-2 text-2xl font-bold text-amber-300">
            {stockStats.lowStock}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
          <p className="text-xs text-slate-500">Stock disponible</p>

          <p className="mt-2 text-2xl font-bold text-emerald-300">
            {stockStats.available}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <label htmlFor="stock-search" className="sr-only">
            Rechercher un produit
          </label>

          <input
            id="stock-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par nom ou référence..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={[
              "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
              filter === "ALL"
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Tous
          </button>

          <button
            type="button"
            onClick={() => setFilter("OUT_OF_STOCK")}
            className={[
              "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
              filter === "OUT_OF_STOCK"
                ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Rupture
          </button>

          <button
            type="button"
            onClick={() => setFilter("LOW_STOCK")}
            className={[
              "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
              filter === "LOW_STOCK"
                ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Faible
          </button>

          <button
            type="button"
            onClick={() => setFilter("AVAILABLE")}
            className={[
              "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
              filter === "AVAILABLE"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            Disponible
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <p className="text-sm font-semibold text-white">
            Aucun produit trouvé
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Aucun produit ne correspond aux critères sélectionnés.
          </p>
        </section>
      ) : (
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175 border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Produit
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Référence
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Stock
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stockCritical = product.currentStock <= 0;

                  const stockLow =
                    product.currentStock > 0 && product.currentStock <= 5;

                  const status = stockCritical
                    ? {
                        label: "Rupture",
                        className:
                          "border-rose-400/20 bg-rose-400/5 text-rose-300",
                      }
                    : stockLow
                      ? {
                          label: "Stock faible",
                          className:
                            "border-amber-400/20 bg-amber-400/5 text-amber-300",
                        }
                      : {
                          label: "Disponible",
                          className:
                            "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
                        };

                  return (
                    <tr
                      key={product.idProduct}
                      className="border-b border-white/5 last:border-b-0 transition hover:bg-white/2"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/products/${product.idProduct}`}
                          className="cursor-pointer text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
                        >
                          {product.name}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {product.reference}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span
                          className={[
                            "text-sm font-bold",
                            stockCritical
                              ? "text-rose-300"
                              : stockLow
                                ? "text-amber-300"
                                : "text-slate-200",
                          ].join(" ")}
                        >
                          {product.currentStock.toLocaleString("fr-FR")}
                        </span>

                        <span className="ml-1 text-[11px] text-slate-600">
                          {product.unit}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
