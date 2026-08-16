export interface Company {
  idCompany: number;
  name: string;
  email: string;
  active: boolean;
}

export interface CompanyCreate {
  name: string;
  email: string;
}

export interface CompanyUpdate {
  name?: string;
  email?: string;
  active?: boolean;
}