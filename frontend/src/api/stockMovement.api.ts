import { apiFetch } from "./client";
import type {
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

export function deleteStockMovement(id: number) {
  return apiFetch<void>(`/stock-movements/${id}`, {
    method: "DELETE",
  });
}