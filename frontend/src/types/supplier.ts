export interface Supplier {
  idSupplier: number;
  idCompany: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface SupplierCreate {
  idCompany: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface SupplierUpdate {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}