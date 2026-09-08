export default function IntroDoc() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
          Premiers pas
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
          Qu'est-ce que BuyLogic ?
        </h2>
        <p className="text-slate-300 leading-relaxed mt-2">
          BuyLogic est une application SaaS de gestion des stocks, des approvisionnements et des achats, conçue pour simplifier le quotidien des professionnels. Grâce à un moteur prédictif intelligent, l'outil anticipe vos besoins pour éviter les ruptures de stock.
        </p>
      </div>

      {/* Section 1 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">1</span>
          Renseigner rapidement les paramètres de l'entreprise
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Dès vos premiers pas sur la plateforme, il est fortement conseillé de renseigner les informations de votre entreprise (coordonnées, logo, informations légales) dans la section dédiée aux paramètres. 
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Cette étape doit être réalisée en premier, car ces données sont directement exploitées par le système pour générer vos bons de commande PDF et personnaliser vos documents professionnels.
        </p>
      </div>

      {/* Section 2 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">2</span>
          Structurer votre catalogue et vos fournisseurs
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Une fois votre structure configurée, vous pourrez passer à l'intégration de vos partenaires et de vos références produits :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Les fournisseurs :</strong> Enregistrez vos prestataires pour lier chaque article à son source d'approvisionnement.</li>
          <li><strong className="text-white">Les produits :</strong> Créez manuellement vos articles ou gagnez un temps précieux en important un fichier CSV global.</li>
          <li><strong className="text-white">Le suivi des stocks :</strong> Visualisez en temps réel l'état de vos réserves et ajustez les quantités selon vos inventaires physiques.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">3</span>
          Profiter de l'intelligence prédictive
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          BuyLogic analyse vos flux de vente et d'utilisation pour calculer automatiquement les seuils d'alerte. Le système génère des propositions de commandes optimisées afin de maintenir un niveau de stock idéal sans immobiliser inutilement votre trésorerie.
        </p>
      </div>
    </div>
  );
}