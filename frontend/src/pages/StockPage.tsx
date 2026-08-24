import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, adjustProductStock } from "../api/product.api";
import { checkHasInitialStock } from "../api/stockMovement.api";
import useAsync from "../hooks/useAsync";
import type { Product } from "../types/product";

type StockFilter = "ALL" | "OUT_OF_STOCK" | "LOW_STOCK" | "AVAILABLE";

export default function StockPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  
  // Initialisation du filtre selon l'URL (ex: /stock?filter=OUT_OF_STOCK)
  const urlFilter = searchParams.get("filter") as StockFilter;
  const [filter, setFilter] = useState<StockFilter>(
    urlFilter && ["ALL", "OUT_OF_STOCK", "LOW_STOCK", "AVAILABLE"].includes(urlFilter)
      ? urlFilter
      : "ALL"
  );

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [singleProductTarget, setSingleProductTarget] =
    useState<Product | null>(null);

  const [bulkActionType, setBulkActionType] = useState<
    "SET" | "ADD" | "REMOVE"
  >("SET");
  const [bulkQuantity, setBulkQuantity] = useState<number>(0);
  const [bulkReason, setBulkReason] = useState<string>("AJUSTEMENT");
  const [bulkCustomReason, setBulkCustomReason] = useState<string>("");

  const [hasInitialStock, setHasInitialStock] = useState<boolean>(false);

  const { loading, error, execute } = useAsync<Product[]>();
  const { loading: updatingStock, execute: executeUpdateStock } =
    useAsync<void>();

  const loadProducts = async () => {
    const data = await execute(() => getProducts());
    if (data) setProducts(data);
  };

  useEffect(() => {
    void loadProducts();
  }, [execute]);

  // Met à jour le filtre si l'URL change dynamiquement
  useEffect(() => {
    const param = searchParams.get("filter") as StockFilter;
    if (param && ["ALL", "OUT_OF_STOCK", "LOW_STOCK", "AVAILABLE"].includes(param)) {
      setFilter(param);
    }
  }, [searchParams]);

  const stockStats = useMemo(() => {
    const outOfStock = products.filter((p) => p.currentStock <= 0).length;
    const lowStock = products.filter(
      (p) => p.currentStock > 0 && p.currentStock <= 5,
    ).length;
    const available = products.filter((p) => p.currentStock > 5).length;
    return { total: products.length, outOfStock, lowStock, available };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.reference.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProductIds(
      e.target.checked ? filteredProducts.map((p) => p.idProduct) : [],
    );
  };

  const handleSelectOne = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleOpenSingleModal = async (product: Product) => {
    setSingleProductTarget(product);
    setBulkQuantity(product.currentStock);
    setBulkReason("AJUSTEMENT");
    setBulkCustomReason("");
    setBulkModalOpen(true);

    try {
      const exists = await checkHasInitialStock(product.idProduct);
      const isInitialed = !!exists;
      setHasInitialStock(isInitialed);
      setBulkActionType(isInitialed ? "ADD" : "SET");
    } catch (err) {
      console.error("Erreur vérification stock initial", err);
      setHasInitialStock(false);
      setBulkActionType("SET");
    }
  };

  const handleOpenBulkModal = () => {
    setSingleProductTarget(null);
    setBulkQuantity(0);
    setBulkReason("AJUSTEMENT");
    setBulkCustomReason("");
    setHasInitialStock(false);
    setBulkActionType("ADD");
    setBulkModalOpen(true);
  };

  const handleApplyStock = async () => {
    const finalReason =
      bulkReason === "AUTRE" ? bulkCustomReason.trim() : bulkReason;

    await executeUpdateStock(async () => {
      const qty = Number(bulkQuantity);
      if (singleProductTarget) {
        let targetStock = singleProductTarget.currentStock;
        if (bulkActionType === "SET") targetStock = qty;
        else if (bulkActionType === "ADD")
          targetStock = singleProductTarget.currentStock + qty;
        else if (bulkActionType === "REMOVE")
          targetStock = Math.max(0, singleProductTarget.currentStock - qty);
        await adjustProductStock(singleProductTarget.idProduct, {
          targetStock,
          reason: finalReason,
        });
      } else {
        await Promise.all(
          selectedProductIds.map((id) => {
            const p = products.find((prod) => prod.idProduct === id);
            if (!p) return;
            let ts = p.currentStock;
            if (bulkActionType === "SET") ts = qty;
            else if (bulkActionType === "ADD") ts = p.currentStock + qty;
            else if (bulkActionType === "REMOVE")
              ts = Math.max(0, p.currentStock - qty);
            return adjustProductStock(id, {
              targetStock: ts,
              reason: finalReason,
            });
          }),
        );
      }
    });
    await loadProducts();
    setBulkModalOpen(false);
    setSingleProductTarget(null);
    setSelectedProductIds([]);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <div className="mt-3 h-10 w-64 animate-pulse rounded bg-white/5" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        </div>
        <div className="mt-8 h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Gestion de stock
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          État du stock
        </h1>
        <div className="mt-8 rounded-2xl border border-rose-400/10 bg-rose-400/5 p-6 text-rose-300">
          <p className="font-bold">Erreur de chargement</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => void loadProducts()}
            className="mt-4 rounded-xl bg-rose-400/10 px-4 py-2 text-xs font-semibold hover:bg-rose-400/25 cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Gestion de stock
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          État du stock
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-2xl border p-5 text-left transition cursor-pointer ${
            filter === "ALL"
              ? "border-cyan-400 bg-slate-900/90 shadow-lg shadow-cyan-400/5"
              : "border-white/5 bg-slate-900/70 hover:border-white/20"
          }`}
        >
          <p className="text-xs text-slate-500">Produits suivis</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {stockStats.total}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("OUT_OF_STOCK")}
          className={`rounded-2xl border p-5 text-left transition cursor-pointer ${
            filter === "OUT_OF_STOCK"
              ? "border-rose-400 bg-rose-400/10 shadow-lg shadow-rose-400/5"
              : "border-rose-400/10 bg-rose-400/5 hover:bg-rose-400/10"
          }`}
        >
          <p className="text-xs text-slate-500">Ruptures</p>
          <p className="mt-2 text-2xl font-bold text-rose-300">
            {stockStats.outOfStock}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("LOW_STOCK")}
          className={`rounded-2xl border p-5 text-left transition cursor-pointer ${
            filter === "LOW_STOCK"
              ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/5"
              : "border-amber-400/10 bg-amber-400/5 hover:bg-amber-400/10"
          }`}
        >
          <p className="text-xs text-slate-500">Stock faible</p>
          <p className="mt-2 text-2xl font-bold text-amber-300">
            {stockStats.lowStock}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("AVAILABLE")}
          className={`rounded-2xl border p-5 text-left transition cursor-pointer ${
            filter === "AVAILABLE"
              ? "border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/5"
              : "border-emerald-400/10 bg-emerald-400/5 hover:bg-emerald-400/10"
          }`}
        >
          <p className="text-xs text-slate-500">Stock disponible</p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">
            {stockStats.available}
          </p>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row items-center justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
        />

        {selectedProductIds.length > 0 && (
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end bg-cyan-950/40 border border-cyan-400/20 px-4 py-2.5 rounded-xl">
            <span className="text-xs text-cyan-300 font-medium">
              {selectedProductIds.length} produit
              {selectedProductIds.length > 1 ? "s" : ""} sélectionné
              {selectedProductIds.length > 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={handleOpenBulkModal}
              className="rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition cursor-pointer"
            >
              Ajuster la sélection
            </button>
          </div>
        )}
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="w-12 px-5 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedProductIds.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-white/10 bg-slate-800 text-cyan-400 cursor-pointer"
                />
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase text-slate-600">
                Produit
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase text-slate-600">
                Stock
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.idProduct}
                onClick={() => void handleOpenSingleModal(p)}
                className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
              >
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(p.idProduct)}
                    onChange={() => handleSelectOne(p.idProduct)}
                    className="rounded border-white/10 bg-slate-800 text-cyan-400 cursor-pointer"
                  />
                </td>
                <td className="px-5 py-4 text-sm text-white font-medium">
                  {p.name}
                </td>
                <td className="px-5 py-4 text-right text-sm text-slate-300 font-semibold">
                  {p.currentStock}
                </td>
                <td
                  className="px-5 py-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => void handleOpenSingleModal(p)}
                    className="cursor-pointer rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                  >
                    Ajuster
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">
              {singleProductTarget
                ? "Ajuster le stock"
                : `Ajustement groupé (${selectedProductIds.length} produits)`}
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Type d'action
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(!singleProductTarget || !hasInitialStock) && (
                    <button
                      type="button"
                      onClick={() => setBulkActionType("SET")}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer transition ${bulkActionType === "SET" ? "border-cyan-400 bg-cyan-400/10 text-cyan-300" : "border-white/10 text-slate-400"}`}
                    >
                      Définir
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBulkActionType("ADD")}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer transition ${bulkActionType === "ADD" ? "border-emerald-400 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-400"}`}
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkActionType("REMOVE")}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold cursor-pointer transition ${bulkActionType === "REMOVE" ? "border-rose-400 bg-rose-400/10 text-rose-300" : "border-white/10 text-slate-400"}`}
                  >
                    Retirer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Quantité
                </label>
                <input
                  type="number"
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">
                  Raison du mouvement
                </label>
                <select
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {singleProductTarget && !hasInitialStock && (
                    <option value="STOCK_INITIAL">STOCK_INITIAL</option>
                  )}
                  <option value="INVENTAIRE">Inventaire physique</option>
                  <option value="AJUSTEMENT">Ajustement manuel</option>
                  <option value="AUTRE">Autre (préciser)...</option>
                </select>
              </div>

              {bulkReason === "AUTRE" && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400">
                    Précisez la raison
                  </label>
                  <textarea
                    value={bulkCustomReason}
                    onChange={(e) => setBulkCustomReason(e.target.value)}
                    placeholder="Saisissez la raison de l'ajustement..."
                    rows={2}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-white outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-white/5 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleApplyStock()}
                disabled={
                  updatingStock ||
                  (bulkReason === "AUTRE" && !bulkCustomReason.trim())
                }
                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 cursor-pointer"
              >
                {updatingStock ? "Mise à jour..." : "Appliquer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}