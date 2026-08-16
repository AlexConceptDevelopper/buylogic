import { apiFetch } from "./client";
import type { PurchaseRecommendation } from "../types/purchaseRecommendation";

export function getPurchaseRecommendations() {
  return apiFetch<PurchaseRecommendation[]>(
    "/recommendations",
  );
}

export function getPurchaseRecommendationById(
  id: number,
) {
  return apiFetch<PurchaseRecommendation>(
    `/recommendations/${id}`,
  );
}

export function deletePurchaseRecommendation(
  id: number,
) {
  return apiFetch<void>(
    `/recommendations/${id}`,
    {
      method: "DELETE",
    },
  );
}