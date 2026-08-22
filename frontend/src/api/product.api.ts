import { apiFetch } from "./client";
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductType,
  ProductCompositionDTO,
} from "../types/product";

export function getProducts() {
  return apiFetch<Product[]>("/products");
}

export function getProductById(id: number) {
  return apiFetch<Product>(`/products/${id}`);
}

export function createProduct(data: ProductCreate & { type: ProductType; components?: ProductCompositionDTO[] }) {
  return apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: number, data: ProductUpdate & { type: ProductType; components?: ProductCompositionDTO[] }) {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

//chaque mouvement génère un historique dans stock_movement en bdd (historique)
export function adjustProductStock(idProduct: number, data: { targetStock: number, reason: string }) {
  return apiFetch<Product>(`/products/${idProduct}/adjust-stock`, {
    method: "PATCH", // ou PUT selon ton @RequestMapping
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number) {
  return apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
  });
}


// ajout de produit composant LE produit
export function addProductComponent(idProduct: number, data: ProductCompositionDTO) {
  return apiFetch<Product>(`/products/${idProduct}/components`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// lancer la production du produit manufacturé
export function produceProduct(idProduct: number, quantityToProduce: number) {
  return apiFetch<Product>(`/products/${idProduct}/produce?quantityToProduce=${quantityToProduce}`, {
    method: "POST",
  });
}

//supprimer des produit d'une recette d'un produit manufacture
export function removeProductComponent(idProduct: number, idChildProduct: number) {
  return apiFetch<void>(`/products/${idProduct}/components/${idChildProduct}`, {
    method: "DELETE",
  });
}