import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getProductById,
  getProducts,
  addProductComponent,
  removeProductComponent,
} from "../api/product.api";
import { getPurchaseRecommendations } from "../api/purchaseRecommendation.api";
import {
  createSupplierProduct,
  getSupplierProducts,
} from "../api/supplierProduct.api";
import { getSuppliers } from "../api/supplier.api";

import useAsync from "../hooks/useAsync";

import type { Product, ProductCompositionDTO, ProductUnit } from "../types/product";
import type { PurchaseRecommendation } from "../types/purchaseRecommendation";
import type { Supplier } from "../types/supplier";
import type {
  SupplierProduct,
  SupplierProductCreate,
} from "../types/supplierProduct";

import ProductHeader from "../components/product/ProductHeader";
import ProductSuppliersSection from "../components/product/ProductSuppliersSection";
import ProductRecommendationSection from "../components/product/ProductRecommendationSection";
import ManufacturedProductSection from "../components/product/ManufacturedProductSection";
import { EmailComposerModal } from "../components/EmailComposerModal";

import SupplierProductModal from "../components/product/modals/SupplierProductModal";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const productId = Number(id);

  // Données principales
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<PurchaseRecommendation[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // État du modal fournisseur
  const [supplierModal, setSupplierModal] = useState({
    open: false,
    error: null as string | null,
    form: {
      idSupplier: 0,
      supplierReference: "",
      unitPrice: 0,
      minimumOrderQuantity: 0,
      expectedLeadTimeDays: 0,
      packagingQuantity: 0,
      packagingUnit: "UNIT" as ProductUnit,
      fractionable: false,
    },
  });

  // Hooks Async
  const { loading: productLoading, error: productError, execute: executeProduct } = useAsync<Product>();
  const { execute: executeProducts } = useAsync<Product[]>();
  const { execute: executeRecommendations } = useAsync<PurchaseRecommendation[]>();
  const { execute: executeSupplierProducts } = useAsync<SupplierProduct[]>();
  const { execute: executeSuppliers } = useAsync<Supplier[]>();

  const { loading: creatingSupplierProduct, execute: executeCreateSupplierProduct } = useAsync<SupplierProduct>();
  const { execute: executeAddComponent } = useAsync<Product>();
  const { execute: executeRemoveComponent } = useAsync<void>();

  // Chargement initial global de la page
  useEffect(() => {
    if (!Number.isInteger(productId)) return;

    const loadInitialData = async () => {
      const [prodData, allProdData, recsData, suppProdsData, suppsData] = await Promise.all([
        executeProduct(() => getProductById(productId)),
        executeProducts(() => getProducts()),
        executeRecommendations(() => getPurchaseRecommendations()),
        executeSupplierProducts(() => getSupplierProducts()),
        executeSuppliers(() => getSuppliers()),
      ]);

      if (prodData) setProduct(prodData);
      if (allProdData) setAllProducts(allProdData);
      if (recsData) setRecommendations(recsData);
      if (suppProdsData) {
        setSupplierProducts(suppProdsData.filter((item) => item.idProduct === productId));
      }
      if (suppsData) {
        setSuppliers(suppsData.filter((supplier) => supplier.active));
      }
    };

    void loadInitialData();
  }, [productId, executeProduct, executeProducts, executeRecommendations, executeSupplierProducts, executeSuppliers]);

  const handleAddComponent = async (component: ProductCompositionDTO) => {
    if (!product) return;
    const updatedProduct = await executeAddComponent(() =>
      addProductComponent(product.idProduct, component)
    );
    if (updatedProduct) setProduct(updatedProduct);
  };

  const handleRemoveComponent = async (idChildProduct: number) => {
    if (!product) return;
    const result = await executeRemoveComponent(() =>
      removeProductComponent(product.idProduct, idChildProduct)
    );

    if (result !== null) {
      setProduct((current) => {
        if (!current) return null;
        return {
          ...current,
          components: current.components?.filter(
            (item) => item.idChildProduct !== idChildProduct
          ),
        };
      });
    }
  };

  const handleCreateSupplierProduct = async () => {
    const { form } = supplierModal;
    setSupplierModal((prev) => ({ ...prev, error: null }));

    if (!form.idSupplier) {
      setSupplierModal((prev) => ({ ...prev, error: "Sélectionnez un fournisseur." }));
      return;
    }
    if (form.unitPrice <= 0 || form.minimumOrderQuantity <= 0 || form.expectedLeadTimeDays < 0 || form.packagingQuantity <= 0) {
      setSupplierModal((prev) => ({ ...prev, error: "Veuillez vérifier les valeurs numériques du formulaire." }));
      return;
    }
    if (!product || form.packagingUnit !== product.unit) {
      setSupplierModal((prev) => ({ ...prev, error: `L'unité du conditionnement doit correspondre à (${product?.unit}).` }));
      return;
    }

    const payload: SupplierProductCreate = {
      idProduct: product.idProduct,
      idSupplier: form.idSupplier,
      supplierReference: form.supplierReference?.trim() || undefined,
      unitPrice: form.unitPrice,
      minimumOrderQuantity: form.minimumOrderQuantity,
      expectedLeadTimeDays: form.expectedLeadTimeDays,
      packagingQuantity: form.packagingQuantity,
      packagingUnit: form.packagingUnit,
      fractionable: form.fractionable,
    };

    const created = await executeCreateSupplierProduct(() => createSupplierProduct(payload));

    if (!created) {
      setSupplierModal((prev) => ({ ...prev, error: "Impossible d'associer ce fournisseur." }));
      return;
    }

    setSupplierProducts((current) => [created, ...current]);
    setSupplierModal({ 
      open: false, 
      error: null, 
      form: { 
        idSupplier: 0, 
        supplierReference: "", 
        unitPrice: 0, 
        minimumOrderQuantity: 0, 
        expectedLeadTimeDays: 0, 
        packagingQuantity: 0, 
        packagingUnit: product.unit, 
        fractionable: false 
      } 
    });
  };

  const recommendation = useMemo(() => {
    if (!product) return null;
    return recommendations.find((item) => item.idProduct === product.idProduct) ?? null;
  }, [product, recommendations]);

  if (!Number.isInteger(productId)) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/15 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">Produit introuvable</p>
          <p className="mt-2 text-sm text-red-300">L'identifiant du produit est invalide.</p>
          <Link to="/products" className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-white/5" />
        <div className="mt-8 h-80 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border border-red-400/15 bg-red-400/5 p-6">
          <p className="text-sm font-semibold text-white">Impossible de charger ce produit.</p>
          <button type="button" onClick={() => navigate("/products")} className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white">
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <ProductHeader product={product} />

      <div className="mt-8 space-y-6">
        {product.type === "MANUFACTURED" ? (
          <ManufacturedProductSection
            product={product}
            allProducts={allProducts}
            onAddComponent={handleAddComponent}
            onRemoveComponent={handleRemoveComponent}
            loading={false}
          />
        ) : (
          <ProductSuppliersSection
            product={product}
            suppliers={suppliers}
            supplierProducts={supplierProducts}
            onAddSupplier={() => setSupplierModal({ 
              open: true, 
              error: null, 
              form: { 
                idSupplier: 0, 
                supplierReference: "", 
                unitPrice: 0, 
                minimumOrderQuantity: 0, 
                expectedLeadTimeDays: 0, 
                packagingQuantity: 0, 
                packagingUnit: product.unit, 
                fractionable: false 
              } 
            })}
          />
        )}

        <ProductRecommendationSection product={product} recommendation={recommendation} />
      </div>

      {/* Modal Fournisseur */}
      <SupplierProductModal
        product={product}
        suppliers={suppliers}
        supplierProducts={supplierProducts}
        open={supplierModal.open}
        form={supplierModal.form}
        error={supplierModal.error}
        loading={creatingSupplierProduct}
        onChange={(form) => setSupplierModal((prev) => ({ ...prev, form: form as any }))}
        onClose={() => setSupplierModal((prev) => ({ ...prev, open: false }))}
        onSubmit={() => void handleCreateSupplierProduct()}
      />
    </div>
  );
}