import { apiFetch } from "./client";
import type {
  SupplierProduct,
  SupplierProductCreate,
  SupplierProductUpdate,
} from "../types/supplierProduct";

export function getSupplierProducts() {
  return apiFetch<SupplierProduct[]>("/supplier-products");
}

export function getSupplierProductById(id: number) {
  return apiFetch<SupplierProduct>(
    `/supplier-products/${id}`,
  );
}

export function createSupplierProduct(
  data: SupplierProductCreate,
) {
  return apiFetch<SupplierProduct>("/supplier-products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSupplierProduct(
  id: number,
  data: SupplierProductUpdate,
) {
  return apiFetch<SupplierProduct>(
    `/supplier-products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export function deleteSupplierProduct(id: number) {
  return apiFetch<void>(`/supplier-products/${id}`, {
    method: "DELETE",
  });
}