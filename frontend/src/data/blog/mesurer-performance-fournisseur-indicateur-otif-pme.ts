import type { Article } from "../../types/Article";

export const article: Article = {
    slug: "mesurer-performance-fournisseur-indicateur-otif-pme",
    title: "Votre fournisseur est-il vraiment fiable ? L'indicateur OTIF expliqué aux PME",
    description: "Fini les retards de livraison masqués et les reliquats manquants. Apprenez à calculer simplement le taux OTIF pour piloter vos fournisseurs avec des données concrètes.",
    date: "20 Octobre 2026",
    category: "Performance & Négociation",
    readTime: "7 min de lecture",
    content: `
    <p class="text-lg text-slate-300 leading-relaxed font-medium">
      "Tout sera livré mardi sans faute !" C'est la promesse habituelle de vos fournisseurs. Mais sur le terrain, vos équipes déplorent régulièrement des manquants ou des retards qui paralysent vos chantiers ou votre production. Comment passer du simple ressenti à une mesure objective ?
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">1. Qu'est-ce que l'indicateur OTIF (On-Time In-Full) ?</h2>
    
    <p>
      L'<strong>OTIF</strong> est le standard international de référence pour évaluer la qualité de service logistique d'un fournisseur. Il pose une question intransigeante :
    </p>

    <!-- Encadré Citation / Définition -->
    <div class="my-6 rounded-xl border-l-4 border-cyan-400 bg-slate-900/80 p-5 italic text-slate-200">
      "La commande a-t-elle été livrée en totalité (In-Full) ET exactement à la date convenue (On-Time) ?"
    </div>

    <p>Contrairement aux moyennes de livraison classiques qui masquent les failles, l'OTIF ne pardonne pas les erreurs partielles :</p>

    <ul class="list-disc pl-6 space-y-2 text-slate-300">
      <li><strong>Exemple Échec :</strong> Vous commandez 100 composants pour mardi. Le fournisseur en livre 90 mardi et les 10 restants le jeudi. <strong>Score OTIF = 0 %</strong> (La commande n'était ni complète le jour J, ni à l'heure pour la totalité).</li>
      <li><strong>Exemple Succès :</strong> Vous commandez 100 composants pour mardi. Les 100 composants arrivent mardi avant l'heure limite fixée. <strong>Score OTIF = 100 %</strong>.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">2. La formule de calcul accessible aux PME</h2>

    <p>Pas besoin d'un ERP industriel hors de prix pour suivre ce score. La formule est d'une grande simplicité :</p>

    <div class="my-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6 text-center">
      <div class="text-xs text-cyan-400 font-mono mb-2">// FORMULE CLÉ</div>
      <div class="text-lg sm:text-xl font-bold text-white">
        Taux OTIF (%) = ( Commandes Conformes & À l'Heure / Total Commandes Passées ) × 100
      </div>
    </div>

    <p>
      Un bon niveau de performance en PME se situe généralement <strong>au-dessus de 92 % à 95 %</strong>. En dessous de 85 %, l'impact sur vos propres délais clients devient critique.
    </p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">3. Comment exploiter vos données OTIF lors des négociations ?</h2>

    <p>
      Arriver à la table des négociations annuelles muni d'un bilan OTIF factuel transforme radicalement le rapport de force avec vos fournisseurs :
    </p>

    <ol class="list-decimal pl-6 space-y-2 text-slate-300">
      <li><strong>Obtenir des compensations :</strong> Négocier le remboursement des frais de transport ou des remises de fin d'année (RFA) en cas de sous-performance avérée.</li>
      <li><strong>Optimiser vos stocks tampons :</strong> Si un fournisseur a un OTIF de 98 %, vous pouvez réduire votre stock de sécurité. S'il stagne à 75 %, vous devez sur-stocker. Pour ajuster vos calculs, consultez notre guide sur le <a href="/blog/calculer-son-stock-de-securite-fournisseur" style="color: #38bdf8; text-decoration: underline;">calcul du stock de sécurité fournisseur</a>.</li>
      <li><strong>Activer la mise en concurrence :</strong> Basculer une partie de vos volumes vers un fournisseur secondaire (stratégie du dual-sourcing).</li>
    </ol>

    <!-- FAQ Section -->
    <h2 class="text-2xl font-bold text-white mt-12 mb-6">Foire Aux Questions (FAQ)</h2>

    <div class="space-y-6 text-slate-200">
      <div class="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h3 class="text-xl font-semibold text-white mb-3">Doit-on pénaliser un fournisseur dès qu'il rate un OTIF ?</h3>
        <p class="text-base text-slate-300 leading-relaxed">
          Non, l'objectif est d'utiliser l'indicateur comme base de discussion constructive. Si un retard est exceptionnel et dû à un cas de force majeure, un plan d'action partagé suffit. En revanche, si la tendance est récurrente, cela justifie pleinement une révision des conditions commerciales.
        </p>
      </div>

      <div class="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h3 class="text-xl font-semibold text-white mb-3">Comment automatiser le suivi OTIF sans effort ?</h3>
        <p class="text-base text-slate-300 leading-relaxed">
          En centralisant vos bons de commande et vos bons de livraison sur une solution de gestion des achats intégrée comme BuyLogic, les dates de réception sont comparées automatiquement aux dates promises.
        </p>
      </div>
    </div>

    <!-- CTA Final -->
    <div class="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
      <h3 class="text-xl font-bold text-white mb-3">Passez au pilotage automatique de vos achats</h3>
      <p class="text-base text-slate-300 mb-4">Anticipez les ruptures et suivez la qualité de vos fournisseurs en temps réel avec BuyLogic.</p>
      <a href="/login" class="inline-block rounded-xl bg-cyan-400 px-6 py-3 text-base font-bold text-slate-950 transition hover:bg-cyan-300">
        Essayer BuyLogic &rarr;
      </a>
    </div>
  `
};