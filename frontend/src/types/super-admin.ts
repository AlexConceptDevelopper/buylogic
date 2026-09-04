// types/super-admin.ts
export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminLoginResponse {
  token: string;
}