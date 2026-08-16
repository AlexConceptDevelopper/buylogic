import { apiFetch } from "./client";
import type { Notification } from "../types/notification";

export function getNotifications() {
  return apiFetch<Notification[]>("/notifications");
}

export function getNotificationById(id: number) {
  return apiFetch<Notification>(
    `/notifications/${id}`,
  );
}

export function deleteNotification(id: number) {
  return apiFetch<void>(
    `/notifications/${id}`,
    {
      method: "DELETE",
    },
  );
}