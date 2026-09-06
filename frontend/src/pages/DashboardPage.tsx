import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import StockAlerts from "../components/dashboard/StockAlerts";
import RecommendationPreview from "../components/dashboard/RecommendationPreview";
import RecentOrders from "../components/dashboard/RecentOrders";
import { getCompanies } from "../api/company.api";
import type { Company } from "../types/company";

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    getCompanies()
      .then((data) => {
        if (data && data.length > 0) {
          setCompany(data[0]);
        }
      })
      .catch((err) => console.error("Erreur chargement company", err));
  }, []);

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <DashboardHeader 
          remainingTrialDays={company?.remainingTrialDays} 
          trialExpired={company?.trialExpired} 
        />

        <div className="mt-8">
          <DashboardStats />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <StockAlerts />
          <RecommendationPreview />
        </div>

        <div className="mt-6">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}