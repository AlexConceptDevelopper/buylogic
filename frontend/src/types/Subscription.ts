export interface Subscription {
  idSubscription?: number;
  stripeSubscriptionId?: string;
  status: string; // "PAID", "ACTIVE", "CANCELED_PENDING", etc.
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
}
