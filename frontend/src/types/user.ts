export interface User {
  idAppUser: number;
  idCompany: number;
  companyName?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
}

export interface UserCreate {
  idCompany: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  role?: string;
  active?: boolean;
}