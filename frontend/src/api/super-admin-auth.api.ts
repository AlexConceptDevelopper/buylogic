import { apiFetch } from "./client";
import type {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
} from "../types/super-admin";

export async function superAdminLogin(
  data: SuperAdminLoginRequest,
): Promise<SuperAdminLoginResponse> {
  const response = await apiFetch<SuperAdminLoginResponse>(
    "/auth/super-admin/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response) {
    throw new Error("Réponse de connexion super-admin invalide.");
  }

  return response;
}