import { apiFetch } from "./client";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export async function login(
  data: LoginRequest,
): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response) {
    throw new Error("Réponse de connexion invalide.");
  }

  return response;
}

export async function register(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await apiFetch<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  if (!response) {
    throw new Error("Réponse d'inscription invalide.");
  }

  return response;
}

export async function forgotPassword(email: string): Promise<null> {
  return apiFetch<null>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<null> {
  return apiFetch<null>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}