import { apiFetch } from "./client";
import type {
  PurchaseOrderItem,
  PurchaseOrderItemCreate,
  PurchaseOrderItemUpdate,
} from "../types/purchaseOrderItem";

export function getPurchaseOrderItems() {
  return apiFetch<PurchaseOrderItem[]>(
    "/purchase-order-items",
  );
}

export function getPurchaseOrderItemById(id: number) {
  return apiFetch<PurchaseOrderItem>(
    `/purchase-order-items/${id}`,
  );
}

export function getPurchaseOrderItemsByPurchaseOrderId(
  idPurchaseOrder: number,
) {
  return apiFetch<PurchaseOrderItem[]>(
    `/purchase-order-items/purchase-order/${idPurchaseOrder}`,
  );
} 

export function createPurchaseOrderItem(
  data: PurchaseOrderItemCreate,
) {
  return apiFetch<PurchaseOrderItem>(
    "/purchase-order-items",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export function updatePurchaseOrderItem(
  id: number,
  data: PurchaseOrderItemUpdate,
) {
  return apiFetch<PurchaseOrderItem>(
    `/purchase-order-items/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export function deletePurchaseOrderItem(id: number) {
  return apiFetch<void>(
    `/purchase-order-items/${id}`,
    {
      method: "DELETE",
    },
  );
}