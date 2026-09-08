export default function SupplierManagementDoc() {
  return (
    <div className="space-y-6">
      <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
        Achats & Approvisionnement
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-white">
        Gérer les fournisseurs
      </h2>
      <p className="text-slate-300 leading-relaxed">
        Pour alimenter efficacement vos stocks de produits achetés, BuyLogic centralise votre carnet de partenaires commerciaux. La section dédiée aux fournisseurs vous permet d'enregistrer et de modifier leurs coordonnées en toute simplicité.
      </p>

      <h3 className="text-xl font-bold text-white pt-4">1. Enregistrement d'un nouveau fournisseur</h3>
      <p className="text-slate-300 leading-relaxed">
        Depuis la page principale des fournisseurs, le bouton <strong className="text-white">Ajouter un fournisseur</strong> ouvre une modale de création. Les informations clés à renseigner sont :
      </p>
      <ul className="list-disc pl-5 space-y-2 text-slate-300">
        <li><strong className="text-white">Nom du fournisseur :</strong> Le nom officiel ou l'enseigne (champ obligatoire).</li>
        <li><code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Email</code> : L'adresse de contact pour l'envoi des bons de commande.</li>
        <li><code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Téléphone</code> : Le numéro direct du service commercial ou des commandes.</li>
        <li><code className="text-cyan-300 bg-slate-950 px-2 py-0.5 rounded">Adresse</code> : L'adresse postale du siège ou du dépôt.</li>
      </ul>

      <h3 className="text-xl font-bold text-white pt-4">2. Recherche et filtrage rapide</h3>
      <p className="text-slate-300 leading-relaxed">
        La barre de recherche instantanée en haut de la page permet de filtrer dynamiquement vos partenaires en tapant directement une partie de leur <strong className="text-white">nom</strong>, de leur <strong className="text-white">email</strong> ou de leur <strong className="text-white">numéro de téléphone</strong>.
      </p>

      <h3 className="text-xl font-bold text-white pt-4">3. Modification et statut Actif / Inactif</h3>
      <p className="text-slate-300 leading-relaxed">
        Chaque carte de fournisseur dispose d'un bouton <strong className="text-white">Modifier</strong> permettant d'ajuster ses coordonnées à tout moment. Vous y trouverez également une case pour basculer le statut du fournisseur entre <strong className="text-emerald-400">Actif</strong> et <strong className="text-slate-400">Inactif</strong>, idéal pour archiver un partenaire avec qui vous ne travaillez plus sans perdre l'historique de vos données.
      </p>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5 text-sm text-cyan-200">
        💡 <strong className="font-semibold">Navigation :</strong> Cliquez directement sur la carte d'un fournisseur pour accéder à sa fiche détaillée et consulter l'ensemble des références associées.
      </div>
    </div>
  );
}