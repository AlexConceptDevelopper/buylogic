import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="mt-24 border-y border-white/5 bg-slate-900/30"
    >
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Un seul objectif
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Transformer vos données en décisions.
          </h2>

          <p className="mt-4 text-slate-400">
            Pas juste afficher des chiffres. Comprendre ce qu'ils
            signifient et savoir quelle action entreprendre.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <FeatureCard
            number="01"
            title="Anticiper les ruptures"
            description="Détecter les produits qui risquent de manquer avant que cela devienne un problème."
          />

          <FeatureCard
            number="02"
            title="Comparer les fournisseurs"
            description="Croiser prix, minimum de commande et délais pour trouver la meilleure option."
          />

          <FeatureCard
            number="03"
            title="Éviter le surstock"
            description="Ne plus immobiliser inutilement votre trésorerie dans des produits qui dorment."
          />

          {/* Nouvelles cartes pour refléter tes ajouts récents */}
          <FeatureCard
            number="04"
            title="Gestion des assemblages"
            description="Structurez vos produits manufacturés avec des compositions multi-niveaux précises."
          />

          <FeatureCard
            number="05"
            title="Atelier de production"
            description="Pilotez la fabrication de vos produits en série pour fluidifier le travail de l'atelier."
          />

          <FeatureCard
            number="06"
            title="Recommandations d'achat"
            description="Laissez BuyLogic calculer exactement quoi commander, quand et chez quel fournisseur."
          />
        </div>
      </div>
    </section>
  );
}