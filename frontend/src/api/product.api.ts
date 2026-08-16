import { apiFetch } from "./client";
import type {
  Product,
  ProductCreate,
  ProductUpdate,
} from "../types/product";

export function getProducts() {
  return apiFetch<Product[]>("/products");
}

export function getProductById(id: number) {
  return apiFetch<Product>(`/products/${id}`);
}

export function createProduct(data: ProductCreate) {
  return apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: number, data: ProductUpdate) {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number) {
  return apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
  });
}