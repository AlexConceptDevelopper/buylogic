export type ProductManagementMode =
  | "RESALE"
  | "PRODUCTION"
  | "MIXED";

export type ConsumptionMode =
  | "DIRECT_STOCK_OUT"
  | "COMPOSITION"
  | "MIXED";

export type ConsumptionSource =
  | "CSV"
  | "MANUAL"
  | "MIXED";

export interface CompanyConfiguration { 
  idCompanyConfiguration: number; 
  idCompany: number; 
  productManagementMode: ProductManagementMode; 
  consumptionMode: ConsumptionMode; 
  consumptionSource: ConsumptionSource; 
}