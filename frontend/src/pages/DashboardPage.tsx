import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import StockAlerts from "../components/dashboard/StockAlerts";
import RecommendationPreview from "../components/dashboard/RecommendationPreview";
import RecentOrders from "../components/dashboard/RecentOrders";
import CompanyConfigurationCard from "../components/dashboard/CompanyConfigurationCard";

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <DashboardHeader />

        <div className="mt-6">
          <CompanyConfigurationCard />
        </div>

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