export default function PredictiveEngineDoc() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
          Gestion des stocks & Produits
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
          Comment fonctionne le moteur prédictif ?
        </h2>
        <p className="text-slate-300 leading-relaxed mt-2">
          BuyLogic intègre un moteur intelligent qui analyse en continu vos flux de stocks, vos historiques de consommation et vos délais d'approvisionnement pour anticiper les ruptures.
        </p>
      </div>

      {/* Section 1 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">1</span>
          Analyse des besoins d'achats
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pour les matières premières et composants achetés, le moteur calcule une <strong className="text-white">date de rupture estimée</strong> basée sur votre cadence d'utilisation. Dès qu'un seuil critique est atteint par rapport au délai de livraison du fournisseur, une recommandation d'achat est générée.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Urgentes :</strong> Le stock est déjà épuisé ou la rupture est estimée à très court terme (délai critique).</li>
          <li><strong className="text-white">Prioritaires :</strong> La commande doit être passée rapidement pour couvrir le délai fournisseur avant la rupture.</li>
          <li><strong className="text-white">À surveiller :</strong> Le stock descend progressivement mais l'échéance est encore lointaine.</li>
        </ul>
      </div>

      {/* Section 2 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">2</span>
          Pilotage des ordres de fabrication
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pour les produits finis assemblés en interne, le moteur évalue la demande prévisionnelle et l'état des stocks de composants. Il émet des <strong className="text-white">recommandations de production</strong> pour vous permettre d'anticiper l'assemblage avant d'impacter vos clients.
        </p>
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-200 space-y-1.5">
          <p>⚡ <strong className="font-semibold">Action directe :</strong> Depuis l'onglet de fabrication des recommandations, un assistant de production vous permet de lancer directement l'ordre en vérifiant la disponibilité des ingrédients.</p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">3</span>
          Validation et gain de temps sur les commandes
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Le module de pilotage centralise ces suggestions sous forme de listes interactives pour vous faire gagner un temps précieux au quotidien :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Commande directe :</strong> Vous pouvez passer une commande fournisseur en un clic directement depuis les recommandations sélectionnées, évitant ainsi de ressaisir les articles un par un.</li>
          <li><strong className="text-white">Regroupement par fournisseur :</strong> BuyLogic groupe automatiquement les produits par fournisseur pour structurer vos achats globaux instantanément.</li>
          <li><strong className="text-white">Suivi des statuts :</strong> Une fois validée ou transformée, la recommandation passe au statut <strong className="text-white">Approuvée</strong> pour éviter les doublons.</li>
        </ul>
      </div>
    </div>
  );
}