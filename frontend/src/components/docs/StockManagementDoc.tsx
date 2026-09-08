export default function StockManagementDoc() {
  return (
    <div className="space-y-6">
      <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
        Gestion des stocks
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-white">
        Suivi et ajustement des stocks
      </h2>
      <p className="text-slate-300 leading-relaxed">
        Le module de gestion des stocks de BuyLogic offre une vision centralisée de votre inventaire en temps réel, vous permettant d'identifier instantanément les articles en rupture ou en stock faible.
      </p>

      <h3 className="text-xl font-bold text-white pt-4">1. Tableau de bord et indicateurs clés</h3>
      <p className="text-slate-300 leading-relaxed">
        En haut de la page de stock, des cartes interactives filtrent instantanément vos références selon leur niveau critique :
      </p>
      <ul className="list-disc pl-5 space-y-2 text-slate-300">
        <li><strong className="text-white">Produits suivis :</strong> L'ensemble du catalogue actif.</li>
        <li><strong className="text-rose-300">Ruptures :</strong> Articles dont le stock est inférieur ou égal à zéro.</li>
        <li><strong className="text-amber-300">Stock faible :</strong> Articles proches de la rupture (entre 1 et 5 unités).</li>
        <li><strong className="text-emerald-300">Stock disponible :</strong> Articles disposant d'un stock confortable (plus de 5 unités).</li>
      </ul>

      <h3 className="text-xl font-bold text-white pt-4">2. Ajustement unitaire ou groupé</h3>
      <p className="text-slate-300 leading-relaxed">
        Vous pouvez modifier le stock d'un produit en cliquant directement sur sa ligne, ou bien sélectionner plusieurs produits à la fois pour effectuer un <strong className="text-white">ajustement groupé</strong>. Trois types d'actions sont proposés :
      </p>
      <ul className="list-disc pl-5 space-y-2 text-slate-300">
        <li><strong className="text-cyan-300">Définir :</strong> Fixe la quantité exacte (idéal pour l'initialisation d'un produit).</li>
        <li><strong className="text-emerald-300">Ajouter :</strong> Incrémente le stock actuel (réception de marchandises).</li>
        <li><strong className="text-rose-300">Retirer :</strong> Décrémente le stock (pertes, casse ou sortie manuelle).</li>
      </ul>

      <h3 className="text-xl font-bold text-white pt-4">3. Traçabilité et motifs de mouvements</h3>
      <p className="text-slate-300 leading-relaxed">
        Chaque modification de stock requiert de préciser un motif (comme <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">STOCK_INITIAL</code>, <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">INVENTAIRE</code> ou <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">AJUSTEMENT</code>) afin de conserver un historique propre et auditable de tous les mouvements réalisés dans votre entreprise.
      </p>
    </div>
  );
}