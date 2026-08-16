import type {
  ConsumptionMode,
  ConsumptionSource,
  ProductManagementMode,
} from "./companyConfiguration";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  companyId: number;
  email: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  productManagementMode: ProductManagementMode;
  consumptionMode: ConsumptionMode;
  consumptionSource: ConsumptionSource;
}
export interface RegisterResponse {
  userId: number;
  companyId: number;
  email: string;
  role: string;
  message: string;
}