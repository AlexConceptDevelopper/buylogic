import { Helmet } from "react-helmet";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StockCalculator from "../../components/StockCalculator";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CalculateurStockPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <Helmet>
        <title>Calculateur de Stock de Sécurité & Point de Commande | BuyLogic</title>
        <meta
          name="description"
          content="Calculez gratuitement votre stock de sécurité et votre seuil de réapprovisionnement en ligne. Outil interactif pour PME et ateliers."
        />
        <link
          rel="canonical"
          href="https://buylogic.fr/outils/calculateur-stock-securite"
        />
      </Helmet>

      <Navbar />

      <main className="grow py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Outil Métier 100% Gratuit</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Calculateur de{" "}
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Stock de Sécurité
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Déterminez instantanément votre seuil de réassort pour éviter les ruptures de stock sans vous prendre la tête sur Excel.
          </p>
        </div>

        {/* Intégration de ton composant calculateur */}
        <StockCalculator />

        {/* Bannière de conversion vers BuyLogic */}
        <div className="mt-12 bg-linear-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg font-bold text-white">
              Automatisez vos seuils pour tout votre catalogue
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fini les calculs manuels article par article. <strong>BuyLogic</strong> surveille vos stocks en temps réel et génère vos bons de commande au moment idéal.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-400/20"
          >
            Tester BuyLogic Gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}