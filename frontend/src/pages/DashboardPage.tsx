import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import StockAlerts from "../components/dashboard/StockAlerts";
import RecommendationPreview from "../components/dashboard/RecommendationPreview";
import RecentOrders from "../components/dashboard/RecentOrders";
import OnboardingBanner from "../components/dashboard/OnboardingBanner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies, completeOnboarding } from "../api/company.api";
import type { Company } from "../types/company";

export default function DashboardPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    getCompanies()
      .then((data) => {
        if (data && data.length > 0) {
          setCompany(data[0]);
        }
      })
      .catch((err) => console.error("Erreur chargement company", err));
  }, []);

  const handleCompleteOnboarding = async () => {
    try {
      const updated = await completeOnboarding();
      setCompany(updated);
    } catch (err) {
      console.error("Erreur validation onboarding", err);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 relative">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <DashboardHeader 
          remainingTrialDays={company?.remainingTrialDays} 
          trialExpired={company?.trialExpired} 
        />

        {company && !company.onboardingCompleted && (
          <div className="mt-6">
            <OnboardingBanner onComplete={handleCompleteOnboarding} />
          </div>
        )}

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

      {/* Bulle d'aide discrète menant directement vers la page de documentation */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isHelpOpen ? (
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 hover:scale-105 cursor-pointer"
            title="Besoin d'aide ?"
          >
            <span className="text-xl font-bold">?</span>
          </button>
        ) : (
          <div className="w-72 rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase">
                  Support BuyLogic
                </span>
                <h3 className="text-base font-bold text-white">Besoin d'aide ?</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕ Fermer
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez notre centre d'aide complet pour retrouver tous les guides d'utilisation, la gestion des stocks et les imports CSV.
            </p>

            <Link
              to="/docs"
              className="block w-full text-center rounded-xl bg-cyan-400 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
            >
              Accéder au centre d'aide →
            </Link>

            <div className="border-t border-white/10 pt-3 text-center">
              <p className="text-[10px] text-slate-500">
                Notre équipe technique reste également à votre disposition depuis votre espace.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}