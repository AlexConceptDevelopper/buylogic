export interface Company {
  idCompany: number;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  onboardingCompleted: boolean;
  siret?: string;
  address?: string;
  receptionHours?: string;
  logoUrl?: string;
  remainingTrialDays: number;
  trialExpired: boolean;
  subscriptionStatus?: string;
}

export interface CompanyCreate {
  name: string;
  email: string;
}

export interface CompanyUpdate {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  siret?: string;
  address?: string;
  receptionHours?: string;
  logoUrl?: string;
}