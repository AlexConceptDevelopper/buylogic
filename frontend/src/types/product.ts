export type ProductUnit =
  | "UNIT"
  | "BOX"
  | "SET"
  | "KG"
  | "G"
  | "L"
  | "ML";

export interface Product {
  idProduct: number;
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  unit: ProductUnit;
  currentStock: number;
  fractional: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  unit: ProductUnit;
  fractional: boolean;
}

export interface ProductUpdate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  unit: ProductUnit;
  fractional: boolean;
  active: boolean;
}