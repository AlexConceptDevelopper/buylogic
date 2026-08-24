import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../api/product.api";
import useAsync from "../../hooks/useAsync";
import type { Product } from "../../types/product";
import ProductAlertRow from "../ProductAlertRow";

export default function StockAlerts() {
  const [products, setProducts] = useState<Product[]>([]);

  const {
    loading,
    error,
    execute,
  } = useAsync<Product[]>();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await execute(
        () => getProducts(),
      );

      if (data) {
        setProducts(data);
      }
    };

    loadProducts();
  }, [execute]);

  const productsToWatch = useMemo(() => {
    return products.filter(
      (product) => product.currentStock <= 0,
    );
  }, [products]);

  const displayedProducts = productsToWatch.slice(0, 4);

  if (loading) {
    return (
      <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Produits à surveiller
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Analyse de votre stock...
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-16 animate-pulse rounded-xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-400/10 bg-slate-900/70 p-6">
        <p className="text-sm font-semibold text-white">
          Produits à surveiller
        </p>

        <p className="mt-2 text-sm leading-6 text-red-300">
          Impossible de charger les données de stock.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Produits à surveiller
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Les produits présentant actuellement le plus de risques.
          </p>
        </div>

        <Link
          to="/stock?filter=OUT_OF_STOCK"
          className="cursor-pointer self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-300"
        >
          Voir tout
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {displayedProducts.map((product) => (
          <ProductAlertRow
            key={product.idProduct}
            name={product.name}
            reference={product.reference}
            stock={product.currentStock}
            status="Risque de rupture"
            severity="critical"
          />
        ))}
      </div>

      {displayedProducts.length === 0 && (
        <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-5">
          <p className="text-sm font-semibold text-emerald-300">
            Aucun produit en rupture
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Aucun produit ne présente actuellement de stock nul.
          </p>
        </div>
      )}
    </section>
  );
}