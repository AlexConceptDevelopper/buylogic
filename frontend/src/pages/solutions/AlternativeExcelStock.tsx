import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FileSpreadsheet, ArrowRight, CheckCircle2, XCircle, Zap, ShieldAlert, Sparkles, Database, RefreshCw, BarChart3 } from 'lucide-react';

export default function AlternativeExcelStock() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <Helmet>
        <title>Alternative Excel Gestion de Stock : Le Guide et Logiciel PME | BuyLogic</title>
        <meta 
          name="description" 
          content="Marre des tableaux Excel instables pour vos stocks ? Découvrez pourquoi et comment migrer vers BuyLogic, le logiciel SaaS simple, rapide et sans formation." 
        />
        <link rel="canonical" href="https://buylogic.fr/solutions/alternative-excel-gestion-stock" />
        
        {/* Open Graph / Réseaux sociaux */}
        <meta property="og:title" content="Alternative Excel Gestion de Stock : Le Guide et Logiciel PME | BuyLogic" />
        <meta property="og:description" content="Oubliez les macros cassées et les erreurs de saisie. Passez à BuyLogic pour piloter vos stocks et vos achats en toute sérénité." />
        <meta property="og:url" content="https://buylogic.fr/solutions/alternative-excel-gestion-stock" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header minimaliste */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold">
              B
            </div>
            <span>BuyLogic</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition">
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          <span>La transition logique pour les PME</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Encore en train de piloter votre stock sur <span className="text-blue-500">Excel</span> ? Il est temps de grandir.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
          Formules écrasées, fichiers corrompus, impossibilité de travailler à plusieurs en même temps... Découvrez l'alternative moderne et intuitive conçue pour remplacer vos tableurs.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Tester BuyLogic gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/solutions/gestion-stock-pme"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-8 py-3.5 rounded-xl transition flex items-center justify-center"
          >
            Voir la solution Stock PME
          </Link>
        </div>
      </section>

      {/* Tableau Comparatif : Excel vs BuyLogic */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Le match : Tableur vs Logiciel SaaS Métier</h2>
            <p className="mt-4 text-slate-400">
              Pourquoi les équipes logistiques et les dirigeants font le choix de quitter Excel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Colonne Excel */}
            <div className="bg-slate-900 border border-red-500/20 p-8 rounded-2xl relative">
              <div className="absolute top-6 right-6 text-red-400">
                <FileSpreadsheet className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                Le fichier Excel « Maison »
              </h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Risque élevé d'erreurs humaines (formules effacées, copier-coller raté).</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Conflits de versions permanent ("Stock_v2_final_DEFINITIF.xlsx").</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Pas de multi-utilisateurs temps réel fluide sans verrouillage de fichier.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Zéro alerte automatisée : c'est à vous de surveiller les lignes chaque matin.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Dépendance critique à la personne qui a créé le fichier.</span>
                </li>
              </ul>
            </div>

            {/* Colonne BuyLogic */}
            <div className="bg-slate-900 border border-blue-500/30 p-8 rounded-2xl relative shadow-xl shadow-blue-950/50">
              <div className="absolute top-6 right-6 text-blue-400">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                La solution BuyLogic SaaS
              </h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Intégrité des données garantie : champs sécurisés et contrôlés.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Base de données unique partagée et synchronisée instantanément en équipe.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Accès sécurisé Cloud depuis n'importe quel poste ou tablette en entrepôt.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Seuils d'alerte automatiques et transformation directe en bons de commande.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>Prise en main immédiate sans aucune connaissance en macros ou formules.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Les 4 Piliers de la transition */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Qu'est-ce qui change concrètement le jour où vous basculez ?</h2>
          <p className="mt-4 text-slate-400">
            Passer d'un tableur statique à un outil métier change radicalement la dynamique opérationnelle de votre entreprise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Centralisation</h3>
            <p className="text-slate-400 text-sm">
              Fini les fichiers éparpillés sur les bureaux de chacun. Vos articles, fournisseurs et mouvements vivent au même endroit.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Temps Réel</h3>
            <p className="text-slate-400 text-sm">
              Un collaborateur sort une pièce du stock sur le terrain ? La quantité se met à jour instantanément pour toute l'équipe.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Anti-Ruptures</h3>
            <p className="text-slate-400 text-sm">
              Ne devinez plus quand recommander. L'application calcule vos seuils et vous prévient avant la rupture critique.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sérénité Achats</h3>
            <p className="text-slate-400 text-sm">
              Passez d'une ligne d'alerte de stock directement à l'édition d'un bon de commande PDF propre en quelques secondes.
            </p>
          </div>

        </div>
      </section>

      {/* Bloc Éditorial / SEO Profond */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pourquoi le passage d'Excel à un logiciel SaaS est incontournable pour structurer sa PME
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-base leading-relaxed">
            <p>
              À ses débuts, toute PME ou structure artisanale gère ses flux de marchandises avec les moyens du bord. Le fichier Excel, initialement pratique et rapide à mettre en place, devient rapidement une béquille fragile. À mesure que le nombre de références augmente, que les entrées/sorties s'accélèrent et que l'équipe s'agrandit, le tableur se transforme en source majeure d'erreurs de gestion.
            </p>
            <p>
              Le principal écueil d'un fichier Excel de stock réside dans son opacité et l'absence de contrôle de cohérence natif. Une simple cellule écrasée par erreur, une formule de somme mal étirée sur de nouvelles lignes, et c'est tout un inventaire qui se retrouve faussé, entraînant des commandes fournisseurs inadaptées, de la trésorerie bloquée ou, pire, des clients déçus suite à une rupture imprévue.
            </p>
            <p>
              Adopter un outil comme <strong>BuyLogic</strong> ne demande pas de compétences techniques particulières. Pensé pour s'interfacer directement dans vos habitudes de travail, il supprime la charge mentale liée à la maintenance de fichiers complexes et offre à votre équipe la visibilité et la fiabilité indispensables pour se concentrer sur l'essentiel : développer l'activité.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} BuyLogic. Tous droits réservés.</p>
      </footer>
    </div>
  );
}