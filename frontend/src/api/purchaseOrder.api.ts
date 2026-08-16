import { apiFetch } from "./client";
import type {
  PurchaseOrder,
  PurchaseOrderCreate,
  PurchaseOrderUpdate,
} from "../types/purchaseOrder";

export function getPurchaseOrders() {
  return apiFetch<PurchaseOrder[]>("/purchase-orders");
}

export function getPurchaseOrderById(id: number) {
  return apiFetch<PurchaseOrder>(
    `/purchase-orders/${id}`,
  );
}

export function createPurchaseOrder(
  data: PurchaseOrderCreate,
) {
  return apiFetch<PurchaseOrder>("/purchase-orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updatePurchaseOrder(
  id: number,
  data: PurchaseOrderUpdate,
) {
  return apiFetch<PurchaseOrder>(
    `/purchase-orders/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export function deletePurchaseOrder(id: number) {
  return apiFetch<void>(`/purchase-orders/${id}`, {
    method: "DELETE",
  });
}