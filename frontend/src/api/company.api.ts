import { apiFetch } from "./client";
import type {
  Company,
  CompanyCreate,
  CompanyUpdate,
} from "../types/company";

export function getCompanies() {
  return apiFetch<Company[]>("/companies");
}

export function getCompanyById(id: number) {
  return apiFetch<Company>(`/companies/${id}`);
}

export function createCompany(data: CompanyCreate) {
  return apiFetch<Company>("/companies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCompany(id: number, data: CompanyUpdate) {
  return apiFetch<Company>(`/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function uploadCompanyLogo(id: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<Company>(`/companies/${id}/logo`, {
    method: "POST",
    body: formData, 
  });
}

export function deleteCompany(id: number) {
  return apiFetch<void>(`/companies/${id}`, {
    method: "DELETE",
  });
}