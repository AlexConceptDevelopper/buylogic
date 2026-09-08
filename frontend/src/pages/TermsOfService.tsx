import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-300">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 transition hover:text-cyan-300"
        >
          ← Retour à l'accueil
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white">Conditions Générales d'Utilisation (CGU)</h1>
          <p className="mt-2 text-xs text-slate-500">Dernière mise à jour : Septembre 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Objet</h2>
          <p>Les présentes CGU définissent les règles d'utilisation de la plateforme SaaS, dédiée à la gestion des équipements et des données par importation.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Offre d'essai et Paiements (Stripe)</h2>
          <p>L'accès à la plateforme peut inclure une période d'essai de 30 jours sans exigence de carte bancaire. Au-delà, l'accès au service est régi par une souscription payante gérée de manière sécurisée via notre partenaire Stripe.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Responsabilité des données et des contenus</h2>
          <p>
            La plateforme agit en qualité de prestataire technique (hébergeur). Les services fournis consistent à mettre à devise des outils numériques permettant au créateur ou à la créatrice du compte (directeur, dirigeant(e) ou personne ayant l'autorité légale ou déléguée pour le compte de l'entreprise, ci-après désigné(e) « l'Administrateur(trice) ») de stocker, gérer et publier des données, des informations ou des documents sous sa seule responsabilité.
          </p>
          <p>
            L'éditeur n'exerce aucun contrôle a priori ou modération systématique des contenus saisis. En conséquence, l'éditeur ne saurait être tenu pour responsable de la nature, de l'exactitude, de la légalité ou de la mise à jour des contenus générés, importés ou intégrés par l'Administrateur(trice) ou les utilisateurs rattachés à son compte. Chaque entreprise cliente demeure seule maître et responsable des informations qu'elle manipule via la plateforme.
          </p>
        </section>
      </div>
    </div>
  );
}