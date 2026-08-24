import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createProduct,
  getProducts,
  updateProduct,
  produceProduct,
} from "../api/product.api";
import { getSupplierProducts } from "../api/supplierProduct.api";
import { getSuppliers } from "../api/supplier.api";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";

import type {
  Product,
  ProductCreate,
  ProductUnit,
  ProductType,
} from "../types/product";
import type { Supplier } from "../types/supplier";
import type { SupplierProduct } from "../types/supplierProduct";
import { UNIT_LABELS } from "../constants/product.constants";

export default function ProductsPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>(
    [],
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "ALL" | "PURCHASED" | "MANUFACTURED"
  >("ALL");

  // États pour la modale de fabrication
  const [produceTarget, setProduceTarget] = useState<Product | null>(null);
  const [produceQuantity, setProduceQuantity] = useState<string>("1");
  const [produceLoading, setProduceLoading] = useState<boolean>(false);
  const [produceError, setProduceError] = useState<string | null>(null);

  // États pour la modale de modification
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductCreate>({
    idCompany: user?.idCompany ?? 0,
    reference: "",
    name: "",
    description: "",
    type: "PURCHASED",
    unit: "UNIT",
    fractional: false,
  });
  const [editError, setEditError] = useState<string | null>(null);

  const [form, setForm] = useState<ProductCreate>({
    idCompany: user?.idCompany ?? 0,
    reference: "",
    name: "",
    description: "",
    type: "PURCHASED",
    unit: "UNIT",
    fractional: false,
  });

  const [createError, setCreateError] = useState<string | null>(null);

  const { loading, error, execute } = useAsync<Product[]>();
  const { loading: creating, execute: executeCreate } = useAsync<Product>();
  const { loading: updating, execute: executeUpdateAsync } =
    useAsync<Product>();
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

  const displayedProducts = products.filter((p) => {
    const matchesArchive = showArchived ? !p.active : p.active;
    if (!matchesArchive) return false;

    if (activeTab === "PURCHASED") return p.type === "PURCHASED";
    if (activeTab === "MANUFACTURED") return p.type === "MANUFACTURED";
    return true; // "ALL"
  });

  const handleToggleArchive = async (product: Product) => {
    const updatedProduct = await executeUpdateAsync(() =>
      updateProduct(product.idProduct, { ...product, active: !product.active }),
    );

    if (updatedProduct) {
      setProducts((current) =>
        current.map((p) =>
          p.idProduct === product.idProduct ? updatedProduct : p,
        ),
      );
    }
  };

  const handleOpenEdit = (product: Product) => {
    setEditError(null);
    setEditProduct(product);
    setEditForm({
      idCompany: product.idCompany ?? user?.idCompany ?? 0,
      reference: product.reference ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      type: product.type,
      unit: product.unit,
      fractional: product.fractional,
    });
  };

  const handleCloseEdit = () => {
    if (updating) return;
    setEditProduct(null);
    setEditError(null);
  };

  const handleUpdate = async () => {
    if (!editProduct) return;
    setEditError(null);

    const trimmedName = editForm.name.trim();
    const trimmedReference = editForm.reference?.trim() ?? "";
    const trimmedDescription = editForm.description?.trim() ?? "";

    if (!trimmedName) {
      setEditError("Le nom du produit est obligatoire.");
      return;
    }

    const payload = {
      ...editProduct,
      reference: trimmedReference || "",
      name: trimmedName,
      description: trimmedDescription || undefined,
      type: editForm.type,
      unit: editForm.unit,
      fractional: editForm.fractional,
    };

    const updated = await executeUpdateAsync(() =>
      updateProduct(editProduct.idProduct, payload),
    );

    if (!updated) {
      setEditError(
        "Impossible de modifier le produit. Vérifiez les informations saisies.",
      );
      return;
    }

    setProducts((current) =>
      current.map((p) => (p.idProduct === updated.idProduct ? updated : p)),
    );

    setEditProduct(null);
  };

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
      type: form.type,
      unit: form.unit,
      fractional: form.fractional,
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
      type: "PURCHASED",
      unit: "UNIT",
      fractional: false,
    });

    setCreateOpen(false);
  };

  const handleCloseCreate = () => {
    if (creating) return;

    setCreateError(null);
    setForm({
      idCompany: user?.idCompany ?? 0,
      reference: "",
      name: "",
      description: "",
      type: "PURCHASED",
      unit: "UNIT",
      fractional: false,
    });

    setCreateOpen(false);
  };

  const handleProduceSubmit = async () => {
    if (!produceTarget) return;

    const qty = Number(produceQuantity);
    if (isNaN(qty) || qty <= 0) {
      setProduceError("Veuillez entrer une quantité valide.");
      return;
    }

    setProduceLoading(true);
    setProduceError(null);

    try {
      await produceProduct(produceTarget.idProduct, qty);
      setProduceTarget(null);
      setProduceQuantity("1");

      // Recharger la liste des produits pour mettre à jour les stocks
      const data = await execute(() => getProducts());
      if (data) {
        setProducts(data);
      }
    } catch (err: any) {
      setProduceError(
        err.message ||
          "Erreur lors de la fabrication. Vérifiez les stocks des composants.",
      );
    } finally {
      setProduceLoading(false);
    }
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

  const activeProductsCount = products.filter((p) =>
    showArchived ? !p.active : p.active,
  ).length;
  const purchasedCount = products.filter(
    (p) => (showArchived ? !p.active : p.active) && p.type === "PURCHASED",
  ).length;
  const manufacturedCount = products.filter(
    (p) => (showArchived ? !p.active : p.active) && p.type === "MANUFACTURED",
  ).length;

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

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
            <p className="text-xs text-slate-500">Produits</p>
            <p className="mt-1 text-xl font-bold text-white">
              {products.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            {showArchived ? "Voir les actifs" : "Voir les archivés"}
          </button>

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

      {displayedProducts.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-white/5 bg-slate-900/70 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/5 text-2xl text-cyan-300">
            📦
          </div>
          <h2 className="mt-5 text-lg font-semibold text-white">
            {showArchived ? "Aucun produit archivé" : "Aucun produit"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {showArchived
              ? "Vous n'avez aucun produit dans les archives."
              : "Commencez par créer votre premier produit."}
          </p>
          {!showArchived && (
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
          )}
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
          {/* Barre d'onglets de filtrage */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/5 px-6 py-3 bg-slate-900/50">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "ALL"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Tous ({activeProductsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("PURCHASED")}
              className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "PURCHASED"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Achetés ({purchasedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("MANUFACTURED")}
              className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === "MANUFACTURED"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Fabriqués ({manufacturedCount})
            </button>
          </div>

          <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                {showArchived ? "Produits archivés" : "Liste des produits"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Cliquez sur un produit pour consulter son détail.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {displayedProducts.length} élément
              {displayedProducts.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {displayedProducts.map((product) => {
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
                <div
                  key={product.idProduct}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-white/3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <Link
                    to={`/products/${product.idProduct}`}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
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
                      <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                        {product.type === "MANUFACTURED"
                          ? "Fabriqué"
                          : "Acheté"}
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
                      {product.type === "MANUFACTURED" ? (
                        <>
                          <span className="text-[11px] uppercase tracking-[0.15em] text-slate-600">
                            Atelier
                          </span>
                          <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
                            Produit assemblé / fabriqué
                          </span>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center justify-between gap-6 lg:justify-end">
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
                          {UNIT_LABELS[product.unit] || product.unit}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 border-l border-white/5 pl-6">
                      {product.type === "MANUFACTURED" && (
                        <button
                          type="button"
                          onClick={() => {
                            setProduceTarget(product);
                            setProduceQuantity("1");
                            setProduceError(null);
                          }}
                          className="cursor-pointer rounded-xl bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                        >
                          Fabriquer
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleToggleArchive(product)}
                        className={[
                          "cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition",
                          product.active
                            ? "border-rose-400/20 bg-rose-400/5 text-rose-400 hover:bg-rose-400/10 hover:text-rose-300"
                            : "border-emerald-400/20 bg-emerald-400/5 text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300",
                        ].join(" ")}
                      >
                        {product.active ? "Archiver" : "Désarchiver"}
                      </button>
                    </div>

                    <Link
                      to={`/products/${product.idProduct}`}
                      className="cursor-pointer text-xs font-semibold text-cyan-300"
                    >
                      Voir →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Modale de création */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10 bg-black/60 px-6 backdrop-blur-sm">
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
                  htmlFor="product-type"
                  className="text-xs font-semibold text-slate-400"
                >
                  Type de produit *
                </label>
                <select
                  id="product-type"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as ProductType,
                    }))
                  }
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                >
                  <option value="PURCHASED">
                    Acheté (Matière première, ingrédient...)
                  </option>
                  <option value="MANUFACTURED">
                    Fabriqué (Recette, produit fini...)
                  </option>
                </select>
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
                      unit: event.target.value as ProductUnit,
                    }))
                  }
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                >
                  {Object.entries(UNIT_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>
                      {code} — {label}
                    </option>
                  ))}
                </select>

                <div className="mt-4 rounded-xl border border-white/5 bg-white/2 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.fractional}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          fractional: event.target.checked,
                        }))
                      }
                      disabled={creating}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-white/20 bg-slate-950 accent-cyan-400"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-200">
                        Produit fractionnable
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Autorise les quantités décimales pour le stock et les
                        commandes.
                      </span>
                    </span>
                  </label>
                </div>
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

      {/* Modale de fabrication */}
      {produceTarget && (
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
                  Stock actuel : {produceTarget.currentStock} {UNIT_LABELS[produceTarget.unit] || produceTarget.unit}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setProduceTarget(null)}
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
                    onChange={(event) => setProduceQuantity(event.target.value)}
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
                onClick={() => setProduceTarget(null)}
                disabled={produceLoading}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => void handleProduceSubmit()}
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
      )}

      {/* Modale de modification */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10 bg-black/60 px-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Modifier le produit
                </p>
                <h2
                  id="edit-product-title"
                  className="mt-2 text-2xl font-bold text-white"
                >
                  {editProduct.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Mettez à jour les informations de cet article.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={updating}
                aria-label="Fermer"
                className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="edit-product-name"
                  className="text-xs font-semibold text-slate-400"
                >
                  Nom du produit *
                </label>
                <input
                  id="edit-product-name"
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  disabled={updating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-product-type"
                  className="text-xs font-semibold text-slate-400"
                >
                  Type de produit *
                </label>
                <select
                  id="edit-product-type"
                  value={editForm.type}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      type: event.target.value as ProductType,
                    }))
                  }
                  disabled={updating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                >
                  <option value="PURCHASED">
                    Acheté (Matière première, ingrédient...)
                  </option>
                  <option value="MANUFACTURED">
                    Fabriqué (Recette, produit fini...)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-product-reference"
                  className="text-xs font-semibold text-slate-400"
                >
                  Référence
                </label>
                <input
                  id="edit-product-reference"
                  type="text"
                  value={editForm.reference}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      reference: event.target.value,
                    }))
                  }
                  disabled={updating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-product-description"
                  className="text-xs font-semibold text-slate-400"
                >
                  Description
                </label>
                <textarea
                  id="edit-product-description"
                  value={editForm.description ?? ""}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  disabled={updating}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-product-unit"
                  className="text-xs font-semibold text-slate-400"
                >
                  Unité *
                </label>
                <select
                  id="edit-product-unit"
                  value={editForm.unit}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      unit: event.target.value as ProductUnit,
                    }))
                  }
                  disabled={updating}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                >
                  {Object.entries(UNIT_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>
                      {code} — {label}
                    </option>
                  ))}
                </select>

                <div className="mt-4 rounded-xl border border-white/5 bg-white/2 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={editForm.fractional}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          fractional: event.target.checked,
                        }))
                      }
                      disabled={updating}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-white/20 bg-slate-950 accent-cyan-400"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-200">
                        Produit fractionnable
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Autorise les quantités décimales pour le stock et les
                        commandes.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {editError && (
                <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                  <p className="text-sm text-red-300">{editError}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={updating}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => void handleUpdate()}
                disabled={updating}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-bold transition",
                  updating
                    ? "cursor-not-allowed bg-slate-700 text-slate-500"
                    : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                ].join(" ")}
              >
                {updating
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
