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
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative space-y-12 md:space-y-16 pb-16">
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