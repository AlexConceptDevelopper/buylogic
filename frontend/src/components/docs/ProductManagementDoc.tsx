export default function ProductManagementDoc() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
          Gestion des stocks & Produits
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
          Créer et gérer un produit
        </h2>
        <p className="text-slate-300 leading-relaxed mt-2">
          Dans BuyLogic, chaque référence gérée dispose d'une fiche complète regroupant ses caractéristiques, ses fournisseurs et son historique. Voici comment structurer et administrer votre catalogue pas à pas.
        </p>
      </div>

      {/* Section 1 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">1</span>
          Création de la fiche de base
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Lors de l'ajout d'un nouvel article, commencez par renseigner ses paramètres fondamentaux :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Référence :</strong> Votre code interne unique (ex: <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">CLIM-25-INV</code>).</li>
          <li><strong className="text-white">Type de produit :</strong> Distingue les articles <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Achetés</code> (auprès de fournisseurs) des articles <code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Fabriqués</code> (assemblés en interne).</li>
          <li><code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Unité</code> : L'unité de mesure principale (ex: Pièces, kg, mètres).</li>
          <li><code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Quantité fractionnaire</code> : Permet d'autoriser ou non les décimales (ex: 1,5 kg).</li>
        </ul>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200 space-y-1">
          <p>⚠️ <strong className="font-semibold">Note importante :</strong> Cette étape sert uniquement à définir la carte d'identité du produit et à lui lier ses fournisseurs potentiels. <strong className="text-white">Aucune quantité physique ni stock initial</strong> ne s'ajoute ici. Pour alimenter ou modifier les quantités en stock, rendez-vous directement dans le module dédié à la <strong className="text-white">Gestion des stocks</strong>.</p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">2</span>
          Association des fournisseurs (Articles achetés)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pour les articles approvisionnés auprès de tiers, rendez-vous sur la <strong className="text-white">fiche de détail du produit</strong>. Utilisez la section dédiée aux fournisseurs pour ouvrir le formulaire d'association et y renseigner les paramètres d'achat (référence fournisseur, prix unitaire, quantité minimale de commande, délai de livraison et conditionnement).
        </p>
      </div>

      {/* Section 3 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">3</span>
          Composition et fabrication (Articles fabriqués)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pour les articles de type <strong className="text-white">Fabriqué</strong>, l'onglet de composition permet de lier des ingrédients (autres produits du catalogue) avec les quantités précises nécessaires à l'assemblage. 
        </p>
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-200 space-y-1.5">
          <p>⚙️ <strong className="font-semibold">Action de fabrication :</strong> Depuis la liste ou la fiche du produit, le bouton <span className="underline font-semibold">Fabriquer</span> ouvre un assistant rapide.</p>
          <p>En indiquant la quantité à produire, BuyLogic vérifie la disponibilité des stocks, déduit automatiquement les matières premières et incrémente le stock du produit fini en une seule opération.</p>
        </div>
      </div>

      {/* Section 4 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">4</span>
          Recherche, filtres et archivage
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Le catalogue intègre un système de recherche par nom ou référence, des filtres par onglets (<strong className="text-white">Tous</strong>, <strong className="text-white">Achetés</strong>, <strong className="text-white">Fabriqués</strong>) ainsi qu'un mode d'archivage pour masquer les références obsolètes sans perdre leur historique comptable ou de stock.
        </p>
      </div>
    </div>
  );
}