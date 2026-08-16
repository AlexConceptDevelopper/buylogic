import { apiFetch } from "./client";
import type {
  User,
  UserCreate,
  UserUpdate,
} from "../types/user";

export function getUsers() {
  return apiFetch<User[]>("/users");
}

export function getUserById(id: number) {
  return apiFetch<User>(`/users/${id}`);
}

export function createUser(data: UserCreate) {
  return apiFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateUser(id: number, data: UserUpdate) {
  return apiFetch<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: number) {
  return apiFetch<void>(`/users/${id}`, {
    method: "DELETE",
  });
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiFetch<User>("/users/me");

  if (!response) {
    throw new Error(
      "Impossible de récupérer l'utilisateur connecté.",
    );
  }

  return response;
}