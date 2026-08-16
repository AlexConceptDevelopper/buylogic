import Step from "./Step";

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Comment ça marche
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            BuyLogic observe.
            <span className="block text-cyan-400">
              Puis vous conseille.
            </span>
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-400">
            Stocks, consommations, commandes en cours, fournisseurs et
            délais sont croisés pour construire une vision réaliste de
            votre situation.
          </p>
        </div>

        <div className="space-y-4">
          <Step
            number="01"
            title="Collecter"
            text="BuyLogic rassemble les informations de votre activité."
          />

          <Step
            number="02"
            title="Analyser"
            text="Les tendances de consommation et les risques sont identifiés."
          />

          <Step
            number="03"
            title="Recommander"
            text="Vous obtenez une décision claire : quoi commander, quand et chez qui."
          />
        </div>
      </div>
    </section>
  );
}