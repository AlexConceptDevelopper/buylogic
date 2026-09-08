export default function CsvImportDoc() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
          Fonctionnalités avancées
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
          Importer un fichier CSV
        </h2>
        <p className="text-slate-300 leading-relaxed mt-2">
          Le centre d'import permet d'injecter massivement vos données de ventes et de consommations historiques pour alimenter le moteur prédictif et suivre vos flux en temps réel sans saisie manuelle.
        </p>
      </div>

      {/* Section 1 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">1</span>
          Préparer son fichier CSV
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Votre fichier doit contenir au minimum trois informations clés pour chaque ligne de transaction :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">La date de vente :</strong> Au format strict <code className="text-cyan-300">AAAA-MM-JJ</code> (ex: 2026-06-15).</li>
          <li><strong className="text-white">La référence produit :</strong> Le code SKU ou la référence exacte enregistrée dans votre catalogue BuyLogic.</li>
          <li><strong className="text-white">La quantité :</strong> Un nombre entier ou décimal strictement supérieur à 0.</li>
        </ul>
        <p className="text-slate-300 text-sm leading-relaxed">
          Le séparateur de colonnes (virgule <code className="text-cyan-300">,</code> ou point-virgule <code className="text-cyan-300">;</code>) est détecté automatiquement lors du chargement.
        </p>
      </div>

      {/* Section 2 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">2</span>
          Associer les colonnes (Mapping)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Si les en-têtes de votre fichier ne correspondent pas exactement aux dénominations standard de l'application, un écran de correspondance interactif s'affiche automatiquement.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Il vous suffit d'utiliser les listes déroulantes pour relier manuellement vos propres colonnes aux trois champs obligatoires (<span className="text-cyan-300">Date de vente</span>, <span className="text-cyan-300">Référence produit</span> et <span className="text-cyan-300">Quantité</span>) avant de valider l'analyse.
        </p>
      </div>

      {/* Section 3 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">3</span>
          Vérifier l'aperçu et valider l'import
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          L'interface affiche un tableau récapitulatif détaillant le nombre de lignes valides et les éventuelles erreurs détectées (références inconnues dans le catalogue, formats de date incorrects ou quantités invalides).
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Le bouton de validation reste verrouillé tant qu'une seule erreur subsiste, garantissant l'intégrité de vos données en base. Une fois validé, un hachage cryptographique du fichier est effectué pour éviter les doublons d'importation.
        </p>
      </div>
    </div>
  );
}