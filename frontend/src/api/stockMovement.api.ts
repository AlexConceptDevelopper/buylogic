import { apiFetch } from "./client";

import type {
  StockAdjustment,
  StockMovement,
  StockMovementCreate,
} from "../types/stockMovement";

export function getStockMovements() {
  return apiFetch<StockMovement[]>("/stock-movements");
}

export function getStockMovementById(id: number) {
  return apiFetch<StockMovement>(
    `/stock-movements/${id}`,
  );
}

export function createStockMovement(
  data: StockMovementCreate,
) {
  return apiFetch<StockMovement>("/stock-movements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adjustStock(
  idProduct: number,
  data: StockAdjustment,
) {
  return apiFetch<StockMovement>(
    `/stock-movements/${idProduct}/adjust`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export function deleteStockMovement(id: number) {
  return apiFetch<void>(
    `/stock-movements/${id}`,
    {
      method: "DELETE",
    },
  );
}

//verifie si le produit à déjà été initialisé
export function checkHasInitialStock(idProduct: number) {
  return apiFetch<boolean>(`/stock-movements/product/${idProduct}/has-initial`);
}