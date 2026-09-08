import DashboardPreview from "../components/home/DashboardPreview";
import FeaturesSection from "../components/home/FeaturesSection";
import HeroSection from "../components/home/HeroSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import BusinessModelsSection from "../components/home/BusinessModelsSection";
import CompatibilityBanner from "../components/home/CompatibilityBanner";
import BenefitsSection from "../components/home/BenefitsSection";
import Navbar from "../components/Navbar";
import TrialOffer from "../components/home/TrialOffer";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Effets de lumière dynamiques et subtils */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute right-[-10%] top-1/4 h-125 w-125 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute left-1/3 bottom-1/4 h-100 w-100 rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <Navbar />

      <main className="relative space-y-20 pb-20">
        <HeroSection />
        <TrialOffer />
        <DashboardPreview />
        <BenefitsSection />
        <FeaturesSection />
        <BusinessModelsSection />
        <HowItWorksSection />
        <CompatibilityBanner />
      </main>

      <Footer />
    </div>
  );
}