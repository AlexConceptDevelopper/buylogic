import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { createProduct, getProducts } from "../api/product.api";
import { getSupplierProducts } from "../api/supplierProduct.api";
import { getSuppliers } from "../api/supplier.api";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";

import type { Product, ProductCreate } from "../types/product";
import type { Supplier } from "../types/supplier";
import type { SupplierProduct } from "../types/supplierProduct";

export default function ProductsPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>(
    [],
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [createOpen, setCreateOpen] = useState(false);

  const [form, setForm] = useState<ProductCreate>({
    idCompany: user?.idCompany ?? 0,
    reference: "",
    name: "",
    description: "",
    unit: "UNIT",
  });

  const [createError, setCreateError] = useState<string | null>(null);

  const { loading, error, execute } = useAsync<Product[]>();

  const { loading: creating, execute: executeCreate } = useAsync<Product>();

  const { execute: executeSupplierProducts } = useAsync<SupplierProduct[]>();

  const { execute: executeSuppliers } = useAsync<Supplier[]>();

  useEffect(() => {
    if (user?.idCompany) {
      setForm((current) => ({
        ...current,
        idCompany: user.idCompany,
      }));
    }
  }, [user?.idCompany]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await execute(() => getProducts());

      if (data) {
        setProducts(data);
      }
    };

    void loadProducts();
  }, [execute]);

  useEffect(() => {
    const loadSupplierData = async () => {
      const [supplierProductData, supplierData] = await Promise.all([
        executeSupplierProducts(() => getSupplierProducts()),
        executeSuppliers(() => getSuppliers()),
      ]);

      if (supplierProductData) {
        setSupplierProducts(supplierProductData);
      }

      if (supplierData) {
        setSuppliers(supplierData);
      }
    };

    void loadSupplierData();
  }, [executeSupplierProducts, executeSuppliers]);

  const handleCreate = async () => {
    setCreateError(null);

    const trimmedName = form.name.trim();
    const trimmedReference = form.reference?.trim() ?? "";
    const trimmedDescription = form.description?.trim() ?? "";

    if (!trimmedName) {
      setCreateError("Le nom du produit est obligatoire.");
      return;
    }

    if (!user?.idCompany) {
      setCreateError("Impossible de déterminer l'entreprise courante.");
      return;
    }

    const payload: ProductCreate = {
      idCompany: user.idCompany,
      reference: trimmedReference || "",
      name: trimmedName,
      description: trimmedDescription || undefined,
      unit: form.unit.trim() || "UNIT",
    };

    const created = await executeCreate(() => createProduct(payload));

    if (!created) {
      setCreateError(
        "Impossible de créer le produit. Vérifiez les informations saisies.",
      );
      return;
    }

    setProducts((current) => [created, ...current]);

    setForm({
      idCompany: user.idCompany,
      reference: "",
      name: "",
      description: "",
      unit: "UNIT",
    });

    setCreateOpen(false);
  };

  const handleCloseCreate = () => {
    if (creating) {
      return;
    }

    setCreateError(null);

    setForm({
      idCompany: user?.idCompany ?? 0,
      reference: "",
      name: "",
      description: "",
      unit: "UNIT",
    });

    setCreateOpen(false);
  };

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
            Créez et consultez les produits suivis par BuyLogic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
            <p className="text-xs text-slate-500">Produits</p>

            <p className="mt-1 text-xl font-bold text-white">
              {products.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}
            className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
          >
            Ajouter un produit
          </button>
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
            Commencez par créer votre premier produit.
          </p>

          <button
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateOpen(true);
            }}
            className="mt-5 cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Ajouter un produit
          </button>
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
            {products.map((product) => {
              const productSupplierNames = supplierProducts
                .filter(
                  (item) => item.idProduct === product.idProduct && item.active,
                )
                .map(
                  (item) =>
                    suppliers.find(
                      (supplier) => supplier.idSupplier === item.idSupplier,
                    )?.name,
                )
                .filter((name): name is string => Boolean(name));

              return (
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
                        {product.reference || "Sans référence"}
                      </p>

                      {product.description && (
                        <p className="mt-2 max-w-2xl truncate text-sm text-slate-500">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] uppercase tracking-[0.15em] text-slate-600">
                          Fournisseurs associés
                        </span>

                        {productSupplierNames.length > 0 ? (
                          productSupplierNames.slice(0, 2).map((name) => (
                            <span
                              key={name}
                              className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-semibold text-cyan-300"
                            >
                              {name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-600">
                            Aucun fournisseur
                          </span>
                        )}

                        {productSupplierNames.length > 2 && (
                          <span className="text-[11px] text-slate-600">
                            +{productSupplierNames.length - 2}
                          </span>
                        )}
                      </div>
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
              );
            })}
          </div>
        </section>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-product-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Nouveau produit
                </p>

                <h2
                  id="create-product-title"
                  className="mt-2 text-2xl font-bold text-white"
                >
                  Ajouter un produit
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Créez l'article qui sera ensuite suivi par BuyLogic.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                disabled={creating}
                aria-label="Fermer"
                className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="product-name"
                  className="text-xs font-semibold text-slate-400"
                >
                  Nom du produit *
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ex. Farine T55"
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="product-reference"
                  className="text-xs font-semibold text-slate-400"
                >
                  Référence
                </label>

                <input
                  id="product-reference"
                  type="text"
                  value={form.reference}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      reference: event.target.value,
                    }))
                  }
                  placeholder="Ex. FARINE-T55-001"
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="text-xs font-semibold text-slate-400"
                >
                  Description
                </label>

                <textarea
                  id="product-description"
                  value={form.description ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Ex. Farine de blé T55 pour pain courant"
                  disabled={creating}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="product-unit"
                  className="text-xs font-semibold text-slate-400"
                >
                  Unité *
                </label>

                <select
                  id="product-unit"
                  value={form.unit}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      unit: event.target.value,
                    }))
                  }
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                >
                  <option value="UNIT">UNIT — unité</option>

                  <option value="BOX">BOX — boîte</option>

                  <option value="SET">SET — lot / jeu</option>
                </select>

                <p className="mt-2 text-[11px] leading-5 text-slate-600">
                  Le stock initial sera créé lors d'une réception, pas ici.
                </p>
              </div>

              {createError && (
                <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                  <p className="text-sm text-red-300">{createError}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseCreate}
                disabled={creating}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={creating}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-bold transition",
                  creating
                    ? "cursor-not-allowed bg-slate-700 text-slate-500"
                    : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                ].join(" ")}
              >
                {creating ? "Création..." : "Créer le produit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
