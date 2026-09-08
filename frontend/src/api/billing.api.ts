import { apiFetch } from "./client";
import type { CheckoutSessionResponse } from '../types/billing';

export function createCheckoutSession(companyId: number) {
  return apiFetch<CheckoutSessionResponse>(
    `/billing/create-checkout-session?companyId=${companyId}`,
    {
      method: "POST",
    }
  );
}

export function cancelSubscription(companyId: number) {
  return apiFetch<{ message: string }>(
    `/billing/cancel-subscription?companyId=${companyId}`,
    {
      method: "POST",
    }
  );
}