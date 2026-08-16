import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProductById } from "../api/product.api";
import { getPurchaseRecommendations } from "../api/purchaseRecommendation.api";
import {
  createStockMovement,
  getStockMovements,
} from "../api/stockMovement.api";
import {
  createSupplierProduct,
  getSupplierProducts,
} from "../api/supplierProduct.api";
import { getSuppliers } from "../api/supplier.api";
import useAsync from "../hooks/useAsync";

import type { Product } from "../types/product";
import type { PurchaseRecommendation } from "../types/purchaseRecommendation";
import type { StockMovement } from "../types/stockMovement";
import type { Supplier } from "../types/supplier";
import type {
  SupplierProduct,
  SupplierProductCreate,
} from "../types/supplierProduct";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<
    PurchaseRecommendation[]
  >([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>(
    [],
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState<
    Omit<SupplierProductCreate, "idProduct">
  >({
    idSupplier: 0,
    supplierReference: "",
    unitPrice: undefined,
    minimumOrderQuantity: undefined,
    expectedLeadTimeDays: undefined,
  });
  const [supplierFormError, setSupplierFormError] = useState<string | null>(
    null,
  );
  const [initialStockOpen, setInitialStockOpen] = useState(false);
  const [initialStockQuantity, setInitialStockQuantity] = useState("");
  const [initialStockError, setInitialStockError] = useState<string | null>(
    null,
  );

  const {
    loading: productLoading,
    error: productError,
    execute: executeProduct,
  } = useAsync<Product>();

  const { loading: recommendationsLoading, execute: executeRecommendations } =
    useAsync<PurchaseRecommendation[]>();

  const { loading: stockMovementsLoading, execute: executeStockMovements } =
    useAsync<StockMovement[]>();

  const { loading: supplierProductsLoading, execute: executeSupplierProducts } =
    useAsync<SupplierProduct[]>();

  const { loading: suppliersLoading, execute: executeSuppliers } =
    useAsync<Supplier[]>();

  const {
    loading: creatingSupplierProduct,
    execute: executeCreateSupplierProduct,
  } = useAsync<SupplierProduct>();

  const { loading: creatingInitialStock, execute: executeCreateInitialStock } =
    useAsync<StockMovement>();

  useEffect(() => {
    if (!Number.isInteger(productId)) {
      return;
    }

    const loadProduct = async () => {
      const data = await executeProduct(() => getProductById(productId));

      if (data) {
        setProduct(data);
      }
    };

    void loadProduct();
  }, [productId, executeProduct]);

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await executeRecommendations(() =>
        getPurchaseRecommendations(),
      );

      if (data) {
        setRecommendations(data);
      }
    };

    void loadRecommendations();
  }, [executeRecommendations]);

  useEffect(() => {
    const loadStockMovements = async () => {
      const data = await executeStockMovements(() => getStockMovements());

      if (data) {
        setStockMovements(data);
      }
    };

    void loadStockMovements();
  }, [executeStockMovements]);

  useEffect(() => {
    if (!Number.isInteger(productId)) {
      return;
    }

    const loadSupplierProducts = async () => {
      const data = await executeSupplierProducts(() => getSupplierProducts());

      if (data) {
        setSupplierProducts(
          data.filter((item) => item.idProduct === productId),
        );
      }
    };

    void loadSupplierProducts();
  }, [executeSupplierProducts, productId]);

  useEffect(() => {
    const loadSuppliers = async () => {
      const data = await executeSuppliers(() => getSuppliers());

      if (data) {
        setSuppliers(data.filter((supplier) => supplier.active));
      }
    };

    void loadSuppliers();
  }, [executeSuppliers]);

  const handleCreateSupplierProduct = async () => {
    setSupplierFormError(null);

    if (!supplierForm.idSupplier) {
      setSupplierFormError("Sélectionnez un fournisseur.");
      return;
    }

    if (
      supplierForm.unitPrice == null ||
      !Number.isFinite(supplierForm.unitPrice) ||
      supplierForm.unitPrice <= 0
    ) {
      setSupplierFormError("Le prix unitaire doit être supérieur à 0.");
      return;
    }

    if (
      supplierForm.minimumOrderQuantity == null ||
      !Number.isFinite(supplierForm.minimumOrderQuantity) ||
      supplierForm.minimumOrderQuantity <= 0
    ) {
      setSupplierFormError("Le minimum de commande doit être supérieur à 0.");
      return;
    }

    if (
      supplierForm.expectedLeadTimeDays == null ||
      !Number.isFinite(supplierForm.expectedLeadTimeDays) ||
      supplierForm.expectedLeadTimeDays < 0
    ) {
      setSupplierFormError(
        "Le délai fournisseur doit être supérieur ou égal à 0.",
      );
      return;
    }

    const currentProduct = product;

    if (!currentProduct) {
      setSupplierFormError("Impossible de déterminer le produit courant.");
      return;
    }

    const payload: SupplierProductCreate = {
      idProduct: currentProduct.idProduct,
      idSupplier: supplierForm.idSupplier,
      supplierReference: supplierForm.supplierReference?.trim() || undefined,
      unitPrice: supplierForm.unitPrice,
      minimumOrderQuantity: supplierForm.minimumOrderQuantity,
      expectedLeadTimeDays: supplierForm.expectedLeadTimeDays,
    };

    const created = await executeCreateSupplierProduct(() =>
      createSupplierProduct(payload),
    );

    if (!created) {
      setSupplierFormError(
        "Impossible d'associer ce fournisseur au produit. Il est peut-être déjà associé.",
      );
      return;
    }

    setSupplierProducts((current) => [created, ...current]);

    setSupplierForm({
      idSupplier: 0,
      supplierReference: "",
      unitPrice: undefined,
      minimumOrderQuantity: undefined,
      expectedLeadTimeDays: undefined,
    });

    setSupplierFormOpen(false);
  };

  const handleCreateInitialStock = async () => {
    setInitialStockError(null);

    const quantity = Number(initialStockQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setInitialStockError(
        "La quantité de stock initial doit être supérieure à 0.",
      );
      return;
    }

    if (!product) {
      setInitialStockError("Impossible de déterminer le produit courant.");
      return;
    }

    if (product.currentStock > 0 || hasProductMovements) {
      setInitialStockError(
        "Le stock initial ne peut être défini qu'avant le premier mouvement de stock.",
      );
      return;
    }

    const createdMovement = await executeCreateInitialStock(() =>
      createStockMovement({
        idProduct: product.idProduct,
        movementType: "ADJUSTMENT",
        quantity,
        reference: "STOCK_INITIAL",
      }),
    );

    if (!createdMovement) {
      setInitialStockError("Impossible d'enregistrer le stock initial.");
      return;
    }

    setProduct((current) =>
      current
        ? {
            ...current,
            currentStock: current.currentStock + quantity,
          }
        : current,
    );

    setStockMovements((current) => [createdMovement, ...current]);

    setInitialStockQuantity("");
    setInitialStockOpen(false);
  };

  const handleUpdateInitialStock = async () => {
    setInitialStockError(null);

    const quantity = Number(initialStockQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setInitialStockError(
        "La quantité de stock initial doit être supérieure à 0.",
      );
      return;
    }

    if (!product || !initialStockMovement) {
      setInitialStockError(
        "Impossible de retrouver le mouvement de stock initial.",
      );
      return;
    }

    const difference = quantity - initialStockMovement.quantity;

    const updatedMovement = await executeCreateInitialStock(() =>
      createStockMovement({
        idProduct: product.idProduct,
        movementType: "ADJUSTMENT",
        quantity: difference,
        reference: "STOCK_INITIAL_CORRECTION",
      }),
    );

    if (!updatedMovement) {
      setInitialStockError("Impossible de corriger le stock initial.");
      return;
    }

    setStockMovements((current) => [updatedMovement, ...current]);

    setProduct((current) =>
      current
        ? {
            ...current,
            currentStock: current.currentStock + difference,
          }
        : current,
    );

    setInitialStockQuantity("");
    setInitialStockOpen(false);
  };

  const initialStockMovement = stockMovements.find(
    (movement) =>
      movement.idProduct === product?.idProduct &&
      movement.movementType === "ADJUSTMENT" &&
      movement.reference === "STOCK_INITIAL",
  );

  const recommendation = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      recommendations.find((item) => item.idProduct === product.idProduct) ??
      null
    );
  }, [product, recommendations]);

  const loading =
    productLoading ||
    recommendationsLoading ||
    stockMovementsLoading ||
    supplierProductsLoading ||
    suppliersLoading;

  if (!Number.isInteger(productId)) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Produit introuvable
          </p>

          <p className="mt-2 text-sm text-red-300">
            L'identifiant du produit est invalide.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-flex cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />

        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/10 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">
            Impossible de charger ce produit.
          </p>

          <p className="mt-2 text-sm text-red-300">
            Le produit n'existe pas ou n'est pas accessible depuis votre
            entreprise.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-5 cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const stockCritical = product.currentStock <= 0;

  const formattedStock = product.currentStock.toLocaleString("fr-FR");

  const productMovements = stockMovements
    .filter((movement) => movement.idProduct === product.idProduct)
    .sort(
      (a, b) =>
        new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime(),
    )
    .slice(0, 8);

  const hasProductMovements = stockMovements.some(
    (movement) => movement.idProduct === product.idProduct,
  );

  const movementLabels: Record<string, string> = {
    PURCHASE: "Commande reçue",
    SALE: "Vente",
    RETURN: "Retour",
    LOSS: "Perte / casse",
    ADJUSTMENT: "Ajustement",
    TRANSFER: "Transfert",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
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
          </div>

          {product.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {product.description}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">
          <p className="text-xs text-slate-500">Unité</p>

          <p className="mt-1 text-sm font-bold text-white">{product.unit}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  État du stock
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Situation actuelle du produit.
                </p>
              </div>

              <span
                className={[
                  "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                  stockCritical
                    ? "border-rose-400/20 bg-rose-400/5 text-rose-300"
                    : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
                ].join(" ")}
              >
                {stockCritical ? "Rupture" : "Stock disponible"}
              </span>
            </div>

            {product.currentStock === 0 && !hasProductMovements && (
              <div className="mt-5 flex flex-col gap-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-cyan-300">
                    Stock initial non renseigné
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Saisissez le stock déjà présent dans votre entreprise pour
                    démarrer le suivi BuyLogic.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setInitialStockError(null);
                    setInitialStockOpen(true);
                  }}
                  className="shrink-0 cursor-pointer rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Initialiser le stock
                </button>
              </div>
            )}

            {initialStockMovement && (
              <div className="mt-5 flex flex-col gap-4 rounded-xl border border-white/5 bg-white/2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Stock initial
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {initialStockMovement.quantity.toLocaleString("fr-FR")}{" "}
                    {product.unit}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setInitialStockError(null);
                    setInitialStockQuantity(
                      String(initialStockMovement.quantity),
                    );
                    setInitialStockOpen(true);
                  }}
                  className="shrink-0 cursor-pointer rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Modifier
                </button>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-xs text-slate-500">Stock actuel</p>

                <p
                  className={[
                    "mt-2 text-2xl font-bold",
                    stockCritical ? "text-rose-300" : "text-white",
                  ].join(" ")}
                >
                  {formattedStock}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  {product.unit}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-xs text-slate-500">Référence</p>

                <p className="mt-2 truncate text-sm font-bold text-white">
                  {product.reference}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  Référence interne
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-xs text-slate-500">Unité</p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {product.unit}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  Condition de suivi
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Fournisseurs du produit
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Définissez les conditions d'achat utilisées par BuyLogic.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSupplierFormError(null);
                  setSupplierFormOpen(true);
                }}
                disabled={suppliers.length === 0}
                className={[
                  "rounded-xl px-4 py-2.5 text-xs font-bold transition",
                  suppliers.length > 0
                    ? "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    : "cursor-not-allowed bg-slate-700 text-slate-500",
                ].join(" ")}
              >
                Ajouter un fournisseur
              </button>
            </div>

            {supplierProducts.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-5 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  Aucun fournisseur associé
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Associez un fournisseur pour permettre à BuyLogic de calculer
                  les conditions d'achat.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {supplierProducts.map((supplierProduct) => {
                  const supplier = suppliers.find(
                    (item) => item.idSupplier === supplierProduct.idSupplier,
                  );

                  return (
                    <div
                      key={supplierProduct.idSupplierProduct}
                      className="rounded-xl border border-white/5 bg-white/2 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {supplier?.name ??
                              `Fournisseur #${supplierProduct.idSupplier}`}
                          </p>

                          {supplierProduct.supplierReference && (
                            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                              Réf. fournisseur :{" "}
                              {supplierProduct.supplierReference}
                            </p>
                          )}
                        </div>

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                          {supplierProduct.active ? "Actif" : "Inactif"}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-[11px] text-slate-600">Prix</p>

                          <p className="mt-1 text-sm font-semibold text-slate-200">
                            {supplierProduct.unitPrice.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-600">Minimum</p>

                          <p className="mt-1 text-sm font-semibold text-slate-200">
                            {supplierProduct.minimumOrderQuantity.toLocaleString(
                              "fr-FR",
                            )}{" "}
                            {product.unit}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-600">Délai</p>

                          <p className="mt-1 text-sm font-semibold text-slate-200">
                            {supplierProduct.expectedLeadTimeDays} jour
                            {supplierProduct.expectedLeadTimeDays > 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Derniers mouvements
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Les derniers changements enregistrés sur ce produit.
                </p>
              </div>

              <span className="text-xs font-semibold text-slate-600">
                {productMovements.length}
              </span>
            </div>

            {productMovements.length === 0 ? (
              <div className="mt-6 rounded-xl border border-white/5 bg-white/2 p-5 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  Aucun mouvement récent
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Les réceptions, ventes et ajustements apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-white/5">
                {productMovements.map((movement) => {
                  const quantityIsPositive = movement.quantity > 0;

                  const movementType =
                    movementLabels[movement.movementType] ??
                    movement.movementType;

                  return (
                    <div
                      key={movement.idStockMovement}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200">
                          {movementType}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {new Date(movement.movementDate).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <span
                        className={[
                          "shrink-0 text-sm font-bold",
                          quantityIsPositive
                            ? "text-emerald-300"
                            : "text-rose-300",
                        ].join(" ")}
                      >
                        {quantityIsPositive ? "+" : ""}
                        {movement.quantity.toLocaleString("fr-FR")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {recommendation && (
            <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/3 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Recommandation BuyLogic
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Une action d'achat est actuellement recommandée pour ce
                    produit.
                  </p>
                </div>

                <span className="rounded-full border border-rose-400/20 bg-rose-400/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-300">
                  À traiter
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-500">Quantité recommandée</p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {recommendation.recommendedQuantity.toLocaleString("fr-FR")}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    {product.unit}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
                  <p className="text-xs text-slate-500">Confiance</p>

                  <p className="mt-2 text-2xl font-bold text-emerald-300">
                    {recommendation.confidenceScore.toLocaleString("fr-FR", {
                      maximumFractionDigits: 1,
                    })}
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
                  onClick={() => {
                    // Le workflow de commande préparée
                    // sera branché ici.
                  }}
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
          )}

          {!recommendation && (
            <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
              <p className="text-sm font-semibold text-white">
                Aucune recommandation active
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                BuyLogic ne recommande actuellement aucune action d'achat pour
                ce produit.
              </p>
            </section>
          )}
        </div>

        <aside className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
          <p className="text-sm font-semibold text-white">Vue rapide</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Les informations essentielles avant d'agir.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Référence</span>

              <span className="text-sm font-semibold text-slate-200">
                {product.reference}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Stock actuel</span>

              <span
                className={[
                  "text-sm font-semibold",
                  stockCritical ? "text-rose-300" : "text-slate-200",
                ].join(" ")}
              >
                {formattedStock} {product.unit}
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
                    {recommendation.recommendedQuantity.toLocaleString("fr-FR")}{" "}
                    {product.unit}
                  </span>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">Fournisseur</span>

                  <span className="text-right text-sm font-semibold text-slate-200">
                    {recommendation.supplierName}
                  </span>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">Délai estimé</span>

                  <span className="text-sm font-semibold text-slate-200">
                    {recommendation.estimatedLeadTimeDays} jours
                  </span>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {supplierFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="supplier-product-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Conditions d'achat
                </p>

                <h2
                  id="supplier-product-title"
                  className="mt-2 text-2xl font-bold text-white"
                >
                  Associer un fournisseur
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {product.name}
                </p>

                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                  {product.reference || "Sans référence"}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Ces données serviront aux futures recommandations BuyLogic.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (creatingSupplierProduct) {
                    return;
                  }

                  setSupplierFormError(null);
                  setSupplierFormOpen(false);
                }}
                disabled={creatingSupplierProduct}
                aria-label="Fermer"
                className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="supplier-product-supplier"
                  className="text-xs font-semibold text-slate-400"
                >
                  Fournisseur *
                </label>

                <select
                  id="supplier-product-supplier"
                  value={supplierForm.idSupplier}
                  onChange={(event) =>
                    setSupplierForm((current) => ({
                      ...current,
                      idSupplier: Number(event.target.value),
                    }))
                  }
                  disabled={creatingSupplierProduct}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                >
                  <option value={0}>Sélectionner un fournisseur</option>

                  {suppliers
                    .filter(
                      (supplier) =>
                        !supplierProducts.some(
                          (item) => item.idSupplier === supplier.idSupplier,
                        ),
                    )
                    .map((supplier) => (
                      <option
                        key={supplier.idSupplier}
                        value={supplier.idSupplier}
                      >
                        {supplier.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="supplier-product-reference"
                  className="text-xs font-semibold text-slate-400"
                >
                  Référence fournisseur
                </label>

                <input
                  id="supplier-product-reference"
                  type="text"
                  value={supplierForm.supplierReference ?? ""}
                  onChange={(event) =>
                    setSupplierForm((current) => ({
                      ...current,
                      supplierReference: event.target.value,
                    }))
                  }
                  disabled={creatingSupplierProduct}
                  placeholder="Ex. FAR-T55-25"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="supplier-product-price"
                    className="text-xs font-semibold text-slate-400"
                  >
                    Prix unitaire (€) *
                  </label>

                  <input
                    id="supplier-product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={supplierForm.unitPrice ?? ""}
                    onChange={(event) =>
                      setSupplierForm((current) => ({
                        ...current,
                        unitPrice:
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                      }))
                    }
                    disabled={creatingSupplierProduct}
                    placeholder="18.50"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="supplier-product-minimum"
                    className="text-xs font-semibold text-slate-400"
                  >
                    Minimum de commande *
                  </label>

                  <input
                    id="supplier-product-minimum"
                    type="number"
                    min="0"
                    step="0.001"
                    value={supplierForm.minimumOrderQuantity ?? ""}
                    onChange={(event) =>
                      setSupplierForm((current) => ({
                        ...current,
                        minimumOrderQuantity:
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                      }))
                    }
                    disabled={creatingSupplierProduct}
                    placeholder="10"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="supplier-product-lead-time"
                  className="text-xs font-semibold text-slate-400"
                >
                  Délai fournisseur (jours) *
                </label>

                <input
                  id="supplier-product-lead-time"
                  type="number"
                  min="0"
                  step="1"
                  value={supplierForm.expectedLeadTimeDays ?? ""}
                  onChange={(event) =>
                    setSupplierForm((current) => ({
                      ...current,
                      expectedLeadTimeDays:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  disabled={creatingSupplierProduct}
                  placeholder="2"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />
              </div>

              {supplierFormError && (
                <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                  <p className="text-sm text-red-300">{supplierFormError}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (creatingSupplierProduct) {
                    return;
                  }

                  setSupplierFormError(null);
                  setSupplierFormOpen(false);
                }}
                disabled={creatingSupplierProduct}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => void handleCreateSupplierProduct()}
                disabled={creatingSupplierProduct}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-bold transition",
                  creatingSupplierProduct
                    ? "cursor-not-allowed bg-slate-700 text-slate-500"
                    : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                ].join(" ")}
              >
                {creatingSupplierProduct
                  ? "Association..."
                  : "Associer le fournisseur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {initialStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="initial-stock-title"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Stock initial
                </p>

                <h2
                  id="initial-stock-title"
                  className="mt-2 text-2xl font-bold text-white"
                >
                  Initialiser le stock
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {product.name}
                </p>

                <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-slate-600">
                  {product.reference || "Sans référence"}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Indiquez la nouvelle quantité de départ. La différence sera
                  enregistrée comme une correction dans l'historique du stock.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (creatingInitialStock) {
                    return;
                  }

                  setInitialStockError(null);
                  setInitialStockOpen(false);
                }}
                disabled={creatingInitialStock}
                aria-label="Fermer"
                className="cursor-pointer rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="initial-stock-quantity"
                className="text-xs font-semibold text-slate-400"
              >
                Quantité actuelle *
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  id="initial-stock-quantity"
                  type="number"
                  min="0"
                  step="0.001"
                  value={initialStockQuantity}
                  onChange={(event) =>
                    setInitialStockQuantity(event.target.value)
                  }
                  disabled={creatingInitialStock}
                  placeholder="Ex. 18"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50"
                />

                <span className="shrink-0 rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-sm font-semibold text-slate-300">
                  {product.unit}
                </span>
              </div>

              {initialStockError && (
                <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                  <p className="text-sm text-red-300">{initialStockError}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (creatingInitialStock) {
                    return;
                  }

                  setInitialStockError(null);
                  setInitialStockOpen(false);
                }}
                disabled={creatingInitialStock}
                className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() =>
                  void (initialStockMovement
                    ? handleUpdateInitialStock()
                    : handleCreateInitialStock())
                }
                disabled={creatingInitialStock}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-bold transition",
                  creatingInitialStock
                    ? "cursor-not-allowed bg-slate-700 text-slate-500"
                    : "cursor-pointer bg-cyan-400 text-slate-950 hover:bg-cyan-300",
                ].join(" ")}
              >
                {creatingInitialStock
                  ? "Enregistrement..."
                  : initialStockMovement
                    ? "Corriger le stock"
                    : "Enregistrer le stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
