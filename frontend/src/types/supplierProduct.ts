export interface SupplierProduct {
  idSupplierProduct: number;
  idProduct: number;
  idSupplier: number;
  supplierReference: string;
  unitPrice: number;
  minimumOrderQuantity: number;
  expectedLeadTimeDays: number;
  active: boolean;
}

export interface SupplierProductCreate {
  idProduct: number;
  idSupplier: number;
  supplierReference?: string;
  unitPrice?: number;
  minimumOrderQuantity?: number;
  expectedLeadTimeDays?: number;
}

export interface SupplierProductUpdate {
  idProduct: number;
  idSupplier: number;
  supplierReference?: string;
  unitPrice?: number;
  minimumOrderQuantity?: number;
  expectedLeadTimeDays?: number;
  active: boolean;
}