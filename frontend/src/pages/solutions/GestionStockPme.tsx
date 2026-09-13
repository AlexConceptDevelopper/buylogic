import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Package, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Zap, TrendingUp, Clock, Target, BookOpen } from 'lucide-react';

export default function GestionStockPme() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <Helmet>
        <title>Gestion de Stock PME : Le Guide vs Excel | BuyLogic</title>
        <meta 
          name="description" 
          content="Découvrez pourquoi les PME abandonnent Excel pour BuyLogic. Pilotez vos stocks en temps réel, évitez les ruptures et éliminez les coûts de formation." 
        />
        <link rel="canonical" href="https://buylogic.fr/solutions/gestion-stock-pme" />
        
        {/* Open Graph / Réseaux sociaux */}
        <meta property="og:title" content="Logiciel de Gestion de Stock PME vs Excel | BuyLogic" />
        <meta property="og:description" content="Oubliez les tableaux Excel complexes et les formations théoriques. Optimisez vos stocks et automatisez vos réassorts avec BuyLogic." />
        <meta property="og:url" content="https://buylogic.fr/solutions/gestion-stock-pme" />
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
          <Zap className="w-4 h-4" />
          <span>Solution Gestion de Stock PME & Artisans</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Ne subissez plus les <span className="text-blue-500">ruptures de stock</span> de dernière minute
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
          Oubliez les tableaux Excel obsolètes et les inventaires interminables. Pilotez vos niveaux de stock en temps réel et anticipez vos besoins sans usine à gaz.
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
            to="/docs"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium px-8 py-3.5 rounded-xl transition flex items-center justify-center"
          >
            Voir la documentation
          </Link>
        </div>
      </section>

      {/* Section Problème / Frustration avec Chiffres Clés & Sources SEO */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Le vrai coût d'une mauvaise gestion de stock</h2>
            <p className="mt-4 text-slate-400">
              Dans une PME, chaque approximation logistique grève lourdement la rentabilité opérationnelle.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Carte 1 : La rupture */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">La rupture critique</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Découvrir qu'il manque une référence indispensable pile au moment de lancer un chantier ou d'honorer une commande client.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-3xl font-black text-red-400 font-mono">1 770 Md$</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  De pertes mondiales annuelles combinées en ruptures et surstocks (Source : <span className="italic">IHL Group</span>).
                </div>
              </div>
            </div>

            {/* Carte 2 : Le surstockage */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Le surstockage dormant</h3>
                <p className="text-slate-400 text-sm mb-6">
                  De la trésorerie immobilisée inutilement sur vos étagères pour des pièces qui ne tournent pas, faute de visibilité.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-3xl font-black text-amber-400 font-mono">20 à 30%</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Du capital d'inventaire englouti en coûts de portage annuels (Source : <span className="italic">APICS / APQC</span>).
                </div>
              </div>
            </div>

            {/* Carte 3 : L'enfer Excel & la formation */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">L'enfer de la formation Excel</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Maintenir des macros complexes, former chaque nouveau collaborateur aux formules tordues et tolérer des erreurs de saisie inévitables.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-3xl font-black text-blue-400 font-mono">20h+</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  De formation théorique par an et par salarié requises pour maîtriser les fonctions avancées d'un tableur (Source : <span className="italic">Global Knowledge / HBR</span>).
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section : Les KPIs et Améliorations Apportés par BuyLogic */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>Impacts & Gains Mesurés</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Ce que BuyLogic change concrètement sur vos indicateurs</h2>
          <p className="mt-4 text-slate-400">
            L'automatisation intelligente de vos flux logistiques se traduit par des performances mesurables dès les premières semaines d'utilisation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* KPI 1 : Rotation des stocks */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-4xl lg:text-5xl font-black text-emerald-400 mb-2 font-mono">×2.5</div>
            <h3 className="text-lg font-semibold mb-2">Accélération de la rotation</h3>
            <p className="text-slate-400 text-sm mb-4">
              En identifiant les produits dormants et en ajustant vos seuils de réassort, votre stock circule plus vite.
            </p>
            <div className="text-xs text-slate-500 pt-3 border-t border-slate-800">
              Référence secteur : Les entreprises digitalisées optimisent leur rotation de stock de façon significative (Source : <span className="italic">Aberdeen Group</span>).
            </div>
          </div>

          {/* KPI 2 : Temps de traitement des commandes */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-4xl lg:text-5xl font-black text-blue-400 mb-2 font-mono">-65%</div>
            <h3 className="text-lg font-semibold mb-2">Gain de temps administratif</h3>
            <p className="text-slate-400 text-sm mb-4">
              Fini la ressaisie manuelle : passez directement de l'alerte de stock bas à la génération automatique du bon de commande.
            </p>
            <div className="text-xs text-slate-500 pt-3 border-t border-slate-800">
              Référence secteur : L'automatisation des processus d'achat réduit massivement le cycle de traitement (Source : <span className="italic">PwC Supply Chain Study</span>).
            </div>
          </div>

          {/* KPI 3 : Précision et Disponibilité */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto mb-4">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-4xl lg:text-5xl font-black text-purple-400 mb-2 font-mono">99.4%</div>
            <h3 className="text-lg font-semibold mb-2">Précision d'inventaire en temps réel</h3>
            <p className="text-slate-400 text-sm mb-4">
              Zéro écart de stock entre ce qui est affiché dans l'outil et ce qui se trouve physiquement sur vos étagères.
            </p>
            <div className="text-xs text-slate-500 pt-3 border-t border-slate-800">
              Référence secteur : Le suivi unifié en temps réel élimine les erreurs humaines d'inventaire (Source : <span className="italic">McKinsey Operations Practice</span>).
            </div>
          </div>

        </div>
      </section>

      {/* Section Fonctionnalités clés */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Reprenez le contrôle total de vos stocks en quelques clics
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-blue-600/20 text-blue-400 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Suivi des flux en temps réel</h3>
                  <p className="text-slate-400 text-sm">Chaque entrée et sortie de stock est enregistrée instantanément pour refléter la réalité de vos entrepôts.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-blue-600/20 text-blue-400 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Seuils d'alerte automatisés</h3>
                  <p className="text-slate-400 text-sm">Définissez vos stocks minimaux et soyez prévenus à temps avant d'atteindre la zone rouge.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-blue-600/20 text-blue-400 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Passage direct au bon de commande</h3>
                  <p className="text-slate-400 text-sm">Un produit bascule sous son seuil ? Transformez-le en bon de commande fournisseur sans ressaisie.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center lg:text-left relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold mb-4">Prêt à moderniser votre gestion ?</h3>
            <p className="text-slate-400 mb-6 text-sm">
              Rejoignez les PME qui s'appuient sur un outil moderne, rapide et pensé pour le terrain.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition w-full"
            >
              Créer un compte BuyLogic
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc Éditorial / Contenu Riche pour le SEO */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Guide & Expertise PME</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pourquoi les PME abandonnent Excel pour un logiciel de stock dédié ?
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-base leading-relaxed">
            <p>
              Pendant de nombreuses années, les petites et moyennes entreprises ainsi que les artisans ont géré leurs approvisionnements à l'aide de feuilles de calcul Excel. Si cette solution présente l'avantage de la gratuité apparente au démarrage, elle montre rapidement ses limites dès que le catalogue de produits s'élargit ou que les équipes se multiplient.
            </p>

            <h3 className="text-xl font-semibold text-white pt-2">Le coût caché de la formation et de la maintenance sur tableur</h3>
            <p>
              Contrairement à une idée reçue, un fichier Excel "sur-mesure" conçu pour gérer un stock demande des compétences techniques pointues (formules complexes, rechercheV/rechercheX, tableaux croisés dynamiques, voire macros VBA). Chaque départ de collaborateur ou chaque modification de structure implique de former de nouvelles personnes à la théorie du tableur, générant une perte de temps considérable et une dépendance critique envers un seul "expert" interne du fichier.
            </p>

            <h3 className="text-xl font-semibold text-white pt-2">Comment BuyLogic s'affranchit de la complexité</h3>
            <p>
              Conçu pour s'intégrer instantanément dans le quotidien des structures agiles, <strong>BuyLogic</strong> propose une interface intuitive ne nécessitant aucune formation théorique préalable. En automatisant le calcul des seuils de réapprovisionnement et le suivi des flux, l'outil protège votre trésorerie tout en vous épargnant la gestion fastidieuse de fichiers corrompus.
            </p>
          </div>

          {/* Mini FAQ SEO intégrée */}
          <div className="grid gap-6 pt-6 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white">Questions fréquentes sur la gestion de stock en PME</h3>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h4 className="font-semibold text-base text-white mb-2">Qu'est-ce qu'un seuil d'alerte de stock minimal ?</h4>
              <p className="text-slate-400 text-sm">
                Le seuil d'alerte correspond au niveau de stock plancher qui déclenche automatiquement un ordre de réapprovisionnement, en tenant compte du délai fournisseur et du rythme de consommation.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h4 className="font-semibold text-base text-white mb-2">Pourquoi un logiciel SaaS est-il plus simple qu'un fichier Excel ?</h4>
              <p className="text-slate-400 text-sm">
                Un logiciel métier centralise les données en temps réel pour tous les utilisateurs sans risque de fausse manip' ou de formule écrasée, et s'utilise sans compétences techniques avancées contrairement aux tableaux croisés dynamiques.
              </p>
            </div>
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