import { apiFetch } from "./client";
import type { Company, CompanyCreate, CompanyUpdate } from "../types/company";
import type { CompanyConfiguration } from "../types/companyConfiguration";
import type { User, UserUpdate } from "../types/user";

// ==========================================
// SECTION : GESTION DES ENTREPRISES (COMPANIES)
// ==========================================

export function adminGetAllCompanies() {
  return apiFetch<Company[]>("/admin/companies");
}

export function adminCreateCompany(dto: CompanyCreate) {
  return apiFetch<Company>("/admin/companies", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function adminUpdateCompany(id: number, dto: CompanyUpdate) {
  return apiFetch<Company>(`/admin/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

//soft delete (isActive = false)
export function adminDeleteCompany(id: number) {
  return apiFetch<void>(`/admin/companies/${id}`, {
    method: "DELETE",
  });
}

// ==========================================
// SECTION : GESTION DES CONFIGURATIONS
// ==========================================

export function adminGetCompanyConfiguration(idCompany: number) {
  return apiFetch<CompanyConfiguration>(
    `/admin/companies/${idCompany}/configuration`,
  );
}

export function adminUpdateCompanyConfiguration(idCompany: number, dto: CompanyConfiguration) {
  return apiFetch<CompanyConfiguration>(
    `/admin/companies/${idCompany}/configuration`,
    {
      method: "PUT",
      body: JSON.stringify(dto),
    },
  );
}

// ==========================================
// SECTION : GESTION DES UTILISATEURS (USERS)
// ==========================================

export function adminGetAllUsers() {
  return apiFetch<User[]>("/admin/users");
}

export function adminUpdateUser(id: number, dto: UserUpdate) {
  return apiFetch<User>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// Soft delete ou suppression utilisateur selon ton back
export function adminDeleteUser(id: number) {
  return apiFetch<void>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}