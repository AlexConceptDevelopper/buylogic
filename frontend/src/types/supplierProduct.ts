import type { ProductUnit } from "./product";

export interface SupplierProduct {
  idSupplierProduct: number;
  idProduct: number;
  idSupplier: number;
  supplierReference: string;
  unitPrice: number;
  minimumOrderQuantity: number;
  expectedLeadTimeDays: number;
  packagingQuantity: number;
  packagingUnit: ProductUnit;
  fractionable: boolean;
  active: boolean;
}

export interface SupplierProductCreate {
  idProduct: number;
  idSupplier: number;
  supplierReference?: string;
  unitPrice?: number;
  minimumOrderQuantity?: number;
  expectedLeadTimeDays?: number;
  packagingQuantity?: number;
  packagingUnit?: ProductUnit;
  fractionable: boolean;
}

export interface SupplierProductUpdate {
  idProduct: number;
  idSupplier: number;
  supplierReference?: string;
  unitPrice?: number;
  minimumOrderQuantity?: number;
  expectedLeadTimeDays?: number;
  packagingQuantity?: number;
  packagingUnit?: ProductUnit;
  fractionable: boolean;
  active: boolean;
}