import { apiFetch } from "./client";
import type {
  Consumption,
  ConsumptionCreate,
  ConsumptionImport
} from "../types/consumption";

export function getConsumptions() {
  return apiFetch<Consumption[]>("/consumptions");
}

export function getConsumptionById(id: number) {
  return apiFetch<Consumption>(
    `/consumptions/${id}`,
  );
}

export function createConsumption(
  data: ConsumptionCreate,
) {
  return apiFetch<Consumption>("/consumptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function importConsumptions(
  data: ConsumptionImport,
) {
  return apiFetch<number>("/consumptions/import", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getConsumptionsByProductAndPeriod(
  idProduct: number,
  startDate: string,
  endDate: string,
) {
  return apiFetch<Consumption[]>(
    `/consumptions/product/${idProduct}` +
    `?startDate=${encodeURIComponent(startDate)}` +
    `&endDate=${encodeURIComponent(endDate)}`,
  );
}

export function deleteConsumption(id: number) {
  return apiFetch<void>(`/consumptions/${id}`, {
    method: "DELETE",
  });
}