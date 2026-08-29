import { apiFetch } from "./client";
import type {
  PurchaseOrder,
  PurchaseOrderArcUpdateDTO,
  PurchaseOrderCreate,
  PurchaseOrderReceiveDTO,
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

//met à jour uniquement le status de la commande
export function updatePurchaseOrderStatus(
  id: number,
  status: string,
) {
  return apiFetch<PurchaseOrder>(
    `/purchase-orders/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PATCH",
    },
  );
}

//créer une commande via ses recommendations
export const createOrdersFromRecommendations = async (recommendationIds: number[]): Promise<PurchaseOrder[]> => {
  const response = await apiFetch<PurchaseOrder[]>("/purchase-orders/from-recommendations", {
    method: 'POST',
    body: JSON.stringify(recommendationIds),
  });

  if (!response) {
    throw new Error("Failed to create purchase orders from recommendations.");
  }

  return response;
}

export function deletePurchaseOrder(id: number) {
  return apiFetch<void>(`/purchase-orders/${id}`, {
    method: "DELETE",
  });
}

//recevoir la commande
export function receivePurchaseOrder(
  id: number,
  data: PurchaseOrderReceiveDTO
): Promise<PurchaseOrder | null> {
  return apiFetch<PurchaseOrder | null>(`/purchase-orders/${id}/receive`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getPurchaseOrderWithItems(id: number) {
  return apiFetch<PurchaseOrder>(`/purchase-orders/${id}/with-items`);
}

export function updatePurchaseOrderArc(
  id: number,
  data: PurchaseOrderArcUpdateDTO
) {
  return apiFetch<PurchaseOrder>(`/purchase-orders/${id}/arc`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

//endpoint d'envoi de mail
export function sendPurchaseOrderEmail(
  id: number,
  emailData?: { to: string; subject: string; body: string }
) {
  return apiFetch<string>(`/purchase-orders/${id}/send`, {
    method: "POST",
    body: emailData ? JSON.stringify(emailData) : undefined,
  });
}