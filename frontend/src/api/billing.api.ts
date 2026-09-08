import { apiFetch } from "./client";
import type { CheckoutSessionResponse } from '../types/billing';

export function createCheckoutSession() {
  return apiFetch<CheckoutSessionResponse>(
    `/billing/create-checkout-session`,
    {
      method: "POST",
    }
  );
}

export function cancelSubscription() {
  return apiFetch<{ message: string }>(
    `/billing/cancel-subscription`,
    {
      method: "POST",
    }
  );
}

export function resumeSubscription() {
  return apiFetch<{ message: string }>(
    `/billing/resume-subscription`,
    {
      method: "POST",
    }
  );
}