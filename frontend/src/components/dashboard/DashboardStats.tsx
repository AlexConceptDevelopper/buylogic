import { useEffect, useState } from "react";

import { getProducts } from "../../api/product.api";
import { getPurchaseOrders } from "../../api/purchaseOrder.api";
import { getPurchaseRecommendations } from "../../api/purchaseRecommendation.api";
import useAsync from "../../hooks/useAsync";
import type { Product } from "../../types/product";
import type { PurchaseOrder } from "../../types/purchaseOrder";
import type { PurchaseRecommendation } from "../../types/purchaseRecommendation";
import StatCard from "../StatCard";

export default function DashboardStats() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [recommendations, setRecommendations] = useState<
    PurchaseRecommendation[]
  >([]);

  const {
    loading: productsLoading,
    error: productsError,
    execute: executeProducts,
  } = useAsync<Product[]>();

  const {
    loading: ordersLoading,
    error: ordersError,
    execute: executeOrders,
  } = useAsync<PurchaseOrder[]>();

  const {
    loading: recommendationsLoading,
    error: recommendationsError,
    execute: executeRecommendations,
  } = useAsync<PurchaseRecommendation[]>();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await executeProducts(() => getProducts());

      if (data) {
        setProducts(data);
      }
    };

    loadProducts();
  }, [executeProducts]);

  useEffect(() => {
    const loadPurchaseOrders = async () => {
      const data = await executeOrders(() => getPurchaseOrders());

      if (data) {
        setPurchaseOrders(data);
      }
    };

    loadPurchaseOrders();
  }, [executeOrders]);

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await executeRecommendations(
        () => getPurchaseRecommendations(),
      );

      if (data) {
        setRecommendations(data);
      }
    };

    loadRecommendations();
  }, [executeRecommendations]);

  const productsInStockAlert = products.filter(
    (product) => product.currentStock <= 0,
  ).length;

  const activePurchaseOrders = purchaseOrders.filter(
    (order) =>
      order.status === "ORDERED" ||
      order.status === "PARTIALLY_RECEIVED",
  ).length;

  const priorityRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.status === "PENDING",
  ).length;

  const productsErrorMessage = productsError
    ? "Impossible de charger les produits"
    : "Produits actifs";

  const ordersErrorMessage = ordersError
    ? "Impossible de charger les commandes"
    : "Commandes à suivre";

  const recommendationsDetail = recommendationsError
    ? "Impossible de charger les recommandations"
    : `${priorityRecommendations} prioritaires`;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Produits suivis"
        value={
          productsLoading
            ? "..."
            : products.length.toString()
        }
        detail={productsErrorMessage}
        icon="▣"
      />

      <StatCard
        label="Alertes stock"
        value={
          productsLoading
            ? "..."
            : productsInStockAlert.toString()
        }
        detail="Produits sans stock"
        icon="!"
        danger={productsInStockAlert > 0}
      />

      <StatCard
        label="Commandes en cours"
        value={
          ordersLoading
            ? "..."
            : activePurchaseOrders.toString()
        }
        detail={ordersErrorMessage}
        icon="◫"
        warning={activePurchaseOrders > 0}
      />

      <StatCard
        label="Recommandations"
        value={
          recommendationsLoading
            ? "..."
            : recommendations.length.toString()
        }
        detail={recommendationsDetail}
        icon="✦"
        danger={priorityRecommendations > 0}
      />
    </div>
  );
}