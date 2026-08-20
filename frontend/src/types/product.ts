export type ProductType = "PURCHASED" | "MANUFACTURED";

export type ProductUnit =
  | "UNIT"
  | "BOX"
  | "SET"
  | "KG"
  | "G"
  | "L"
  | "ML";

export interface ProductCompositionDTO {
  idChildProduct: number;
  quantity: number;
  childProductName?: string;
}

export interface Product {
  idProduct: number;
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  type: ProductType; // Ajouté ici
  unit: ProductUnit;
  currentStock: number;
  fractional: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  components?: ProductCompositionDTO[]; // Ajouté ici aussi
}

export interface ProductCreate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  type: ProductType; // Ajouté ici
  unit: ProductUnit;
  fractional: boolean;
  components?: ProductCompositionDTO[]; // Ajouté ici
}

export interface ProductUpdate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  type: ProductType; // Ajouté ici
  unit: ProductUnit;
  fractional: boolean;
  active: boolean;
  components?: ProductCompositionDTO[]; // Ajouté ici
}