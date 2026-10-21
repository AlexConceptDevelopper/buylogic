import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Factory,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  PackageCheck,
  Truck,
  Wrench
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function LogicielAchatPmeIndustrie() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <Helmet>
        <title>
          Logiciel d'Achat PME Industrielle & Ateliers | Alternative ERP | BuyLogic
        </title>
        <meta
          name="description"
          content="Optimisez la gestion des achats et des pièces détachées pour PME industrielles, sous-traitants et artisans. Évitez les arrêts de production et gérez vos approvisionnements sans ERP lourd."
        />
        <link
          rel="canonical"
          href="https://buylogic.fr/solutions/logiciel-achat-pme-industrie"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Logiciel d'Achat PME Industrielle & Ateliers | BuyLogic"
        />
        <meta
          property="og:description"
          content="Gérez vos pièces critiques, vos matières et vos commandes fournisseurs sans la complexité d'un ERP industriel."
        />
        <meta
          property="og:url"
          content="https://buylogic.fr/solutions/logiciel-achat-pme-industrie"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />

      <main className="grow">
        {/* Hero Section */}
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-sm mb-6">
            <Factory className="w-4 h-4" />
            <span>Spécial PME Industrielles, Ateliers & BTP</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
            Le logiciel d'achat et de stock pour les{" "}
            <span className="bg-linear-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              PME industrielles
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Un arrêt de chaîne pour une pièce manquante coûte cher. Pilotez vos matières premières, pièces détachées et consommables sans vous noyer dans un ERP hors de prix.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-2"
            >
              Tester BuyLogic gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/solutions/gestion-achats-pme"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-8 py-3.5 rounded-xl transition flex items-center justify-center"
            >
              Voir la démo achats
            </Link>
          </div>
        </section>

        {/* Comparative : ERP / Excel vs BuyLogic */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Pourquoi les usines et ateliers abandonnent les ERP lourds
              </h2>
              <p className="mt-4 text-slate-400">
                L'écart entre la réalité du terrain en atelier et les logiciels administratifs trop rigides.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Le problème */}
              <div className="bg-slate-900 border border-red-500/20 p-8 rounded-2xl relative">
                <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  L'ERP Lourd ou le Tableur Excel
                </h3>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>Mise en place interminable (6 à 12 mois d'intégration).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>Interface complexe nécessitant de longues formations théoriques.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>Coût de licence excessif par utilisateur pour des fonctions inutilisées.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>Saisie manuelle fastidieuse menant à des stocks théoriques faux.</span>
                  </li>
                </ul>
              </div>

              {/* La solution BuyLogic */}
              <div className="bg-slate-900 border border-cyan-500/30 p-8 rounded-2xl relative shadow-xl shadow-cyan-950/30">
                <div className="absolute top-6 right-6 text-cyan-400">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
                  La réponse agile BuyLogic
                </h3>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Opérationnel le jour même (importation CSV de vos références en 2 min).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Prise en main immédiate par les équipes terrain et magasin.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Calcul prédictif des seuils d'alerte pour anticiper les ruptures.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Bons de commande PDF automatisés avec respect des conditionnements.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cas d'usages industriels */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Conçu pour le terrain et la réalité des ateliers
            </h2>
            <p className="mt-4 text-slate-400">
              Que vous gériez de la maintenance, de la sous-traitance ou de l'assemblage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Maintenance & Pièces (MRO)</h3>
              <p className="text-slate-400 text-sm">
                Sécurisez votre stock de roulements, joints et composants critiques pour éviter les arrêts machine impromptus.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Matières Premières</h3>
              <p className="text-slate-400 text-sm">
                Suivez vos consommations de profilés, visserie ou fluides et réapprovisionnez au bon moment auprès de vos fournisseurs.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Fournisseurs</h3>
              <p className="text-slate-400 text-sm">
                Centralisez les tarifs et délais de chaque sous-traitant pour éditer des bons de commande sans erreurs de codification.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 max-w-4xl mx-auto text-center">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Passez à la gestion d'achat industrielle sans usine à gaz
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">
              Rejoignez les PME qui ont fait le choix de la simplicité et de l'efficacité pour leurs approvisionnements.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/20"
            >
              Tester gratuitement 30 jours (Sans CB)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}