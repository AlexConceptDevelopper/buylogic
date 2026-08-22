import DashboardPreview from "../components/home/DashboardPreview";
import FeaturesSection from "../components/home/FeaturesSection";
import HeroSection from "../components/home/HeroSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import BusinessModelsSection from "../components/home/BusinessModelsSection";
import Navbar from "../components/Navbar";
import TrialOffer from "../components/home/TrialOffer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative">
        <HeroSection />
        <TrialOffer />
        <DashboardPreview />
        <FeaturesSection />
        <BusinessModelsSection />
        <HowItWorksSection />
      </main>

      <footer className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BuyLogic</p>

          <p>
            La bonne commande, au bon moment.
          </p>
        </div>
      </footer>
    </div>
  );
}