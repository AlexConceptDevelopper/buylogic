import type { Article } from "../../types/Article";

export const article: Article = {
  slug: "gestion-litiges-fournisseurs-factures-reliquats",
  title:
    "Gestion des litiges fournisseurs : comment réagir face aux factures non conformes et aux reliquats de livraison",
  category: "Logistique & Comptabilité",
  readTime: "6 min de lecture",
  date: "24 Novembre 2026",
  description:
    "Marchandises abîmées, factures incorrectes, reliquats non livrés : découvrez comment structurer le traitement des litiges fournisseurs pour protéger votre trésorerie en PME.",
  content: `
    <p class="lead">Rien n'irrite plus un gestionnaire ou un comptable qu'une facture reçue pour des marchandises jamais livrées, ou un colis réceptionné avec trois pièces manquantes. En PME, faute de temps, ces petits litiges sont souvent passés par pertes et profits. Une erreur stratégique qui grignote vos marges.</p>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">1. Le contrôle à réception : l'unique rempart</h2>
    <p>Le traitement d'un litige commence dès le quai de réception ou à l'ouverture du colis. Si le bon de livraison (BL) n'est pas émargé avec des réserves précises, le fournisseur considérera la livraison comme conforme :</p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li><strong>Colis endommagé :</strong> Mentionnez obligatoirement des réserves motivées sur le récépissé du transporteur (ex: "colis écrasé, x pièces cassées").</li>
      <li><strong>Quantité manquante :</strong> Notez "sous réserve de décompte" si le contenu détaillé ne peut être vérifié immédiatement à chaud.</li>
    </ul>

    <!-- Illustration d'illustration pour casser la linéarité -->
    <div class="my-8 rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 p-4">
      <img src="/illustrations/gestion-litige.jpg" alt="Contrôle des marchandises et gestion des litiges fournisseurs en entrepôt" class="w-full h-auto rounded-xl object-cover" />
      <p class="text-xs text-slate-400 text-center mt-3">Un contrôle rigoureux dès le quai de réception est la première étape pour sécuriser vos avoirs.</p>
    </div>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">2. Bloquer la facture avant la comptabilité</h2>
    <p>La pire erreur consiste à laisser la facture suivre son circuit de validation automatique alors qu'un litige est en cours. Mettez en place une règle simple :</p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li>Le service réception doit signaler tout écart (quantité ou prix) de manière centralisée.</li>
      <li>Le bon à payer (BAP) est bloqué tant que le fournisseur n'a pas émis un avoir ou corrigé la facture initiale.</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">3. Formaliser la réclamation pour accélérer l'avoir</h2>
    <p>Pour éviter les e-mails perdus qui s'éternisent, une réclamation efficace doit contenir trois éléments factuels incontestables :</p>
    <ul class="list-disc pl-6 space-y-2 my-4">
      <li>Le numéro de commande initiale et le bon de livraison concerné.</li>
      <li>Des photos nettes des dégâts ou le détail précis de l'écart constaté.</li>
      <li>Une demande claire (émission d'un avoir, réexpédition immédiate du manquant ou déduction sur la prochaine facture).</li>
    </ul>

    <h2 class="text-2xl font-bold text-white mt-8 mb-4">Conclusion</h2>
    <p>Traiter rigoureusement les litiges fournisseurs n'est pas qu'une question de comptabilité : c'est un signal fort envoyé à vos partenaires sur votre exigence opérationnelle. Moins vous laissez passer d'erreurs, moins vos fournisseurs en commettront à l'avenir.</p>
  `,
};