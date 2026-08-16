import { apiFetch } from "./client";

import type { CompanyConfiguration } from "../types/companyConfiguration";

export function getCompanyConfiguration() {
  return apiFetch<CompanyConfiguration>(
    "/company-configuration",
  );
}