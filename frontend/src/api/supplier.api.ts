import { apiFetch } from "./client";
import type {
  Supplier,
  SupplierCreate,
  SupplierUpdate,
} from "../types/supplier";

export function getSuppliers() {
  return apiFetch<Supplier[]>("/suppliers");
}

export function getSupplierById(id: number) {
  return apiFetch<Supplier>(`/suppliers/${id}`);
}

export function createSupplier(data: SupplierCreate) {
  return apiFetch<Supplier>("/suppliers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSupplier(id: number, data: SupplierUpdate) {
  return apiFetch<Supplier>(`/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteSupplier(id: number) {
  return apiFetch<void>(`/suppliers/${id}`, {
    method: "DELETE",
  });
}