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
  type: ProductType;
  unit: ProductUnit;
  currentStock: number;
  fractional: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  components?: ProductCompositionDTO[];
}

export interface ProductCreate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  type: ProductType;
  unit: ProductUnit;
  fractional: boolean;
  components?: ProductCompositionDTO[];
}

export interface ProductUpdate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  type: ProductType;
  unit: ProductUnit;
  fractional: boolean;
  active: boolean;
  currentStock?: number; // Ajouté ici
  components?: ProductCompositionDTO[];
}