export interface Product {
  idProduct: number;
  idCompany: number;
  reference: string;
  name: string;
  description: string;
  unit: string;
  currentStock: number;
  active: boolean;
}

export interface ProductCreate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  unit: string;
}

export interface ProductUpdate {
  idCompany: number;
  reference: string;
  name: string;
  description?: string;
  unit: string;
  active: boolean;
}