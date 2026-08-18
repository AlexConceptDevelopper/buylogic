import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProductById } from "../api/product.api";
import { getPurchaseRecommendations } from "../api/purchaseRecommendation.api";
import {
  adjustStock,
  createStockMovement,
  getStockMovements,
} from "../api/stockMovement.api";
import {
  createSupplierProduct,
  getSupplierProducts,
} from "../api/supplierProduct.api";
import { getSuppliers } from "../api/supplier.api";

import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";

import type { Product } from "../types/product";
import type { PurchaseRecommendation } from "../types/purchaseRecommendation";
import type { StockMovement, StockAdjustment } from "../types/stockMovement";
import type { Supplier } from "../types/supplier";
import type {
  SupplierProduct,
  SupplierProductCreate,
} from "../types/supplierProduct";

import ProductHeader from "../components/product/ProductHeader";
import ProductQuickView from "../components/product/ProductQuickView";
import ProductStockSection from "../components/product/ProductStockSection";
import ProductSuppliersSection from "../components/product/ProductSuppliersSection";
import ProductMovementsSection from "../components/product/ProductMovementsSection";
import ProductRecommendationSection from "../components/product/ProductRecommendationSection";

import SupplierProductModal from "../components/product/modals/SupplierProductModal";
import InitialStockModal from "../components/product/modals/InitialStockModal";
import StockAdjustmentModal from "../components/product/modals/StockAdjustementModal";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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
    unitPrice: undefined as unknown as number,
    minimumOrderQuantity: undefined as unknown as number,
    expectedLeadTimeDays: undefined as unknown as number,
    packagingQuantity: undefined as unknown as number,
    packagingUnit: "UNIT",
    fractionable: false,
  });

  const [supplierFormError, setSupplierFormError] = useState<string | null>(
    null,
  );

  const [initialStockOpen, setInitialStockOpen] = useState(false);

  const [initialStockQuantity, setInitialStockQuantity] = useState("");

  const [initialStockError, setInitialStockError] = useState<string | null>(
    null,
  );

  const [stockAdjustmentOpen, setStockAdjustmentOpen] = useState(false);

  const [stockAdjustmentQuantity, setStockAdjustmentQuantity] = useState("");

  const [stockAdjustmentReason, setStockAdjustmentReason] = useState("");

  const [stockAdjustmentError, setStockAdjustmentError] = useState<
    string | null
  >(null);

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

  const { loading: adjustingStock, execute: executeAdjustStock } =
    useAsync<StockMovement>();

  const isOwner = user?.role === "OWNER";

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

  const quantityStep = product?.fractional ? "0.001" : "1";

  const validateQuantity = (value: number, label: string): string | null => {
    if (!Number.isFinite(value) || value < 0) {
      return `${label} doit être supérieur ou égal à 0.`;
    }

    if (product && !product.fractional && !Number.isInteger(value)) {
      return `${label} doit être un nombre entier pour ce produit.`;
    }

    return null;
  };

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
      product &&
      !product.fractional &&
      !Number.isInteger(supplierForm.minimumOrderQuantity)
    ) {
      setSupplierFormError(
        "Le minimum de commande doit être un nombre entier pour ce produit.",
      );
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

    if (
      supplierForm.packagingQuantity == null ||
      !Number.isFinite(supplierForm.packagingQuantity) ||
      supplierForm.packagingQuantity <= 0
    ) {
      setSupplierFormError(
        "La quantité de conditionnement doit être supérieure à 0.",
      );
      return;
    }

    if (!supplierForm.packagingUnit) {
      setSupplierFormError("Sélectionnez une unité de conditionnement.");
      return;
    }

    if (!product) {
      setSupplierFormError("Impossible de déterminer le produit courant.");
      return;
    }

    if (supplierForm.packagingUnit !== product.unit) {
      setSupplierFormError(
        `L'unité du conditionnement doit correspondre à l'unité du produit (${product.unit}).`,
      );
      return;
    }

    const payload: SupplierProductCreate = {
      idProduct: product.idProduct,
      idSupplier: supplierForm.idSupplier,
      supplierReference: supplierForm.supplierReference?.trim() || undefined,
      unitPrice: supplierForm.unitPrice,
      minimumOrderQuantity: supplierForm.minimumOrderQuantity,
      expectedLeadTimeDays: supplierForm.expectedLeadTimeDays,
      packagingQuantity: supplierForm.packagingQuantity,
      packagingUnit: supplierForm.packagingUnit,
      fractionable: supplierForm.fractionable,
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
      unitPrice: undefined as unknown as number,
      minimumOrderQuantity: undefined as unknown as number,
      expectedLeadTimeDays: undefined as unknown as number,
      packagingQuantity: undefined as unknown as number,
      packagingUnit: product.unit,
      fractionable: false,
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

    const quantityError = validateQuantity(
      quantity,
      "La quantité de stock initial",
    );

    if (quantityError) {
      setInitialStockError(quantityError);
      return;
    }

    if (!product) {
      setInitialStockError("Impossible de déterminer le produit courant.");
      return;
    }

    const hasProductMovements = stockMovements.some(
      (movement) => movement.idProduct === product.idProduct,
    );

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

  const handleAdjustStock = async () => {
    setStockAdjustmentError(null);

    if (!product) {
      setStockAdjustmentError("Impossible de déterminer le produit courant.");
      return;
    }

    const targetStock = Number(stockAdjustmentQuantity);

    if (!Number.isFinite(targetStock) || targetStock < 0) {
      setStockAdjustmentError(
        "Le nouveau stock doit être supérieur ou égal à 0.",
      );
      return;
    }

    const quantityError = validateQuantity(targetStock, "Le nouveau stock");

    if (quantityError) {
      setStockAdjustmentError(quantityError);
      return;
    }

    const reason = stockAdjustmentReason.trim();

    if (!reason) {
      setStockAdjustmentError("La raison de l'ajustement est obligatoire.");
      return;
    }

    if (targetStock === product.currentStock) {
      setStockAdjustmentError(
        "Le nouveau stock est identique au stock actuel.",
      );
      return;
    }

    const payload: StockAdjustment = {
      targetStock,
      reason,
    };

    const createdMovement = await executeAdjustStock(() =>
      adjustStock(product.idProduct, payload),
    );

    if (!createdMovement) {
      setStockAdjustmentError("Impossible d'ajuster le stock.");
      return;
    }

    setProduct((current) =>
      current
        ? {
            ...current,
            currentStock: targetStock,
          }
        : current,
    );

    setStockMovements((current) => [createdMovement, ...current]);

    setStockAdjustmentQuantity("");
    setStockAdjustmentReason("");
    setStockAdjustmentOpen(false);
  };

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

  const handleOpenSupplierModal = () => {
    setSupplierFormError(null);

    setSupplierForm({
      idSupplier: 0,
      supplierReference: "",
      unitPrice: undefined as unknown as number,
      minimumOrderQuantity: undefined as unknown as number,
      expectedLeadTimeDays: undefined as unknown as number,
      packagingQuantity: undefined as unknown as number,
      packagingUnit: product.unit,
      fractionable: false,
    });

    setSupplierFormOpen(true);
  };

  const handleOpenInitialStockModal = () => {
    setInitialStockError(null);
    setInitialStockQuantity("");
    setInitialStockOpen(true);
  };

  const handleOpenStockAdjustmentModal = () => {
    setStockAdjustmentError(null);
    setStockAdjustmentQuantity(String(product.currentStock));
    setStockAdjustmentReason("");
    setStockAdjustmentOpen(true);
  };

  const handleCloseSupplierModal = () => {
    if (creatingSupplierProduct) {
      return;
    }

    setSupplierFormError(null);
    setSupplierFormOpen(false);
  };

  const handleCloseInitialStockModal = () => {
    if (creatingInitialStock) {
      return;
    }

    setInitialStockError(null);
    setInitialStockOpen(false);
  };

  const handleCloseStockAdjustmentModal = () => {
    if (adjustingStock) {
      return;
    }

    setStockAdjustmentError(null);
    setStockAdjustmentOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <ProductHeader product={product} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <ProductStockSection
            product={product}
            isOwner={isOwner}
            hasProductMovements={hasProductMovements}
            onInitializeStock={handleOpenInitialStockModal}
            onAdjustStock={handleOpenStockAdjustmentModal}
          />

          <ProductSuppliersSection
            product={product}
            suppliers={suppliers}
            supplierProducts={supplierProducts}
            onAddSupplier={handleOpenSupplierModal}
          />

          <ProductMovementsSection
            movements={productMovements}
          />

          <ProductRecommendationSection
            product={product}
            recommendation={recommendation}
          />
        </div>

        <ProductQuickView product={product} recommendation={recommendation} />
      </div>

      <SupplierProductModal
        product={product}
        suppliers={suppliers}
        supplierProducts={supplierProducts}
        open={supplierFormOpen}
        form={supplierForm}
        error={supplierFormError}
        loading={creatingSupplierProduct}
        onChange={setSupplierForm}
        onClose={handleCloseSupplierModal}
        onSubmit={() => void handleCreateSupplierProduct()}
      />

      <InitialStockModal
        product={product}
        open={initialStockOpen}
        quantity={initialStockQuantity}
        error={initialStockError}
        loading={creatingInitialStock}
        quantityStep={quantityStep}
        onQuantityChange={setInitialStockQuantity}
        onClose={handleCloseInitialStockModal}
        onSubmit={() => void handleCreateInitialStock()}
      />

      <StockAdjustmentModal
        product={product}
        open={stockAdjustmentOpen}
        quantity={stockAdjustmentQuantity}
        reason={stockAdjustmentReason}
        error={stockAdjustmentError}
        loading={adjustingStock}
        quantityStep={quantityStep}
        onQuantityChange={setStockAdjustmentQuantity}
        onReasonChange={setStockAdjustmentReason}
        onClose={handleCloseStockAdjustmentModal}
        onSubmit={() => void handleAdjustStock()}
      />
    </div>
  );
}
