export type ProductManagementMode =
  | "RESALE"
  | "PRODUCTION"
  | "MIXED";

export interface CompanyConfiguration { 
  idCompanyConfiguration: number; 
  idCompany: number; 
  productManagementMode: ProductManagementMode; 
}