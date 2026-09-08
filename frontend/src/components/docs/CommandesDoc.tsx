export default function CommandesDoc() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">
          Achats & Fournisseurs
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
          Tout savoir sur le module des commandes
        </h2>
        <p className="text-slate-300 leading-relaxed mt-2">
          Le module de gestion des commandes centralise l'ensemble de vos achats fournisseurs. Il vous accompagne à chaque étape, de la création du panier jusqu'à l'entrée en stock du matériel livré.
        </p>
      </div>

      {/* Section 1 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">1</span>
          Le cycle de vie complet d'une commande
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Chaque commande évolue à travers des statuts dotés de codes couleurs précis pour comprendre d'un seul coup d'œil où en est un dossier :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Brouillon :</strong> La commande est en cours de préparation. Vous pouvez y ajouter, modifier ou retirer des articles et changer de fournisseur librement. Rien n'est figé.</li>
          <li><strong className="text-white">En attente d'ARC :</strong> Le bon de commande a été généré et envoyé. Le dossier est en suspens en attendant la validation du fournisseur (l'Accusé de Réception de Commande).</li>
          <li><strong className="text-white">Partiellement reçue :</strong> Une première livraison est arrivée, mais il reste des reliquats ou des articles en attente chez le fournisseur.</li>
          <li><strong className="text-white">Reçue :</strong> La commande est complète, contrôlée et intégrée au stock. Le dossier est clôturé.</li>
          <li><strong className="text-white">Annulée :</strong> La commande a été stoppée suite à un imprévu ou une annulation fournisseur.</li>
        </ul>
      </div>

      {/* Section 2 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">2</span>
          Les actions quotidiennes et la génération de documents
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pour optimiser votre temps de gestion et sécuriser les relations avec vos prestataires, plusieurs outils sont intégrés :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Génération de PDF :</strong> En un clic depuis le brouillon, le système met en forme un bon de commande propre, normalisé et professionnel, prêt à être transmis.</li>
          <li><strong className="text-white">Envoi par e-mail direct :</strong> Transmettez le document PDF au fournisseur sans quitter l'interface.</li>
          <li><strong className="text-white">Saisie de l'ARC :</strong> Dès que le fournisseur vous renvoie sa confirmation, enregistrez son numéro d'ARC et la date de livraison prévisionnelle pour affiner votre planning.</li>
          <li><strong className="text-white">Gestion des réceptions :</strong> À l'arrivée de la marchandise, validez les quantités reçues. S'il manque des références, le statut bascule automatiquement pour garder un œil vigilant sur les reliquats.</li>
        </ul>
      </div>

      {/* Section 3 */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">3</span>
          Traçabilité et sécurité anti-oubli
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Le logiciel agit comme un assistant rigoureux pour éliminer les erreurs de gestion :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong className="text-white">Guidage étape par étape :</strong> Le système vous pousse naturellement vers l'action suivante (saisir l'ARC après l'envoi, ou réceptionner les marchandises à l'arrivée).</li>
        </ul>
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-200 space-y-1.5">
          <p>⚡ <strong className="font-semibold">Astuce :</strong> Utilisez les filtres de la liste des commandes pour afficher instantanément celles qui bloquent en « Attente d'ARC » depuis trop longtemps.</p>
        </div>
      </div>
    </div>
  );
}