import { apiFetch } from "./client";
import type { Company, CompanyUpdate } from "../types/company";

// ==========================================
// ADMIN: COMPANIES MANAGEMENT
// ==========================================

export function getAdminCompanies() {
  return apiFetch<Company[]>("/admin/companies");
}

export function getAdminCompanyById(id: number) {
  return apiFetch<Company>(`/admin/companies/${id}`);
}

export function updateAdminCompany(id: number, data: CompanyUpdate) {
  return apiFetch<Company>(`/admin/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteAdminCompany(id: number) {
  return apiFetch<void>(`/admin/companies/${id}`, {
    method: "DELETE",
  });
}

// ==========================================
// ADMIN: USERS MANAGEMENT (Prochaine étape)
// ==========================================

// export function getAdminUsers() {
//   return apiFetch<User[]>("/admin/users");
// }