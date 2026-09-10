import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-white">Politique de Confidentialité</h1>
          <p className="mt-2 text-xs text-slate-500">Dernière mise à jour : Septembre 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Données collectées</h2>
          <p>Dans le cadre de l'utilisation de BuyLogic, nous collectons les informations de compte (adresse email, nom d'entreprise) ainsi que les données métiers nécessaires aux calculs (exports CSV de ventes, stocks et catalogues de fournisseurs).</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Stockage local et sécurité de session</h2>
          <p>
            La plateforme utilise le mécanisme de stockage local (<code className="text-cyan-400 font-mono text-xs">localStorage</code>) du navigateur exclusivement pour stocker un jeton de sécurité (token d'authentification) indispensable au maintien de votre session active. Aucun cookie publicitaire, traceur tiers ou cookie de mesure d'audience n'est déposé sur votre terminal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Sécurité des mots de passe et des données</h2>
          <p>
            Nous accordons une importance capitale à la protection de vos informations. Vos mots de passe ne sont jamais stockés en clair : ils font l'objet d'un hachage cryptographique robuste (via BCrypt) avant d'être enregistrés dans notre base de données.
          </p>
          <p>
            Les communications entre votre navigateur et notre plateforme sont entièrement chiffrées (HTTPS/TLS). De plus, l'architecture de notre application garantit un cloisonnement strict des données entre chaque entreprise, sécurisé par un système d'authentification par jeton JWT.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">4. Prestataires tiers et sous-traitants</h2>
          <p>Pour assurer le bon fonctionnement du service, nous faisons appel à des prestataires techniques tiers de confiance :</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong className="text-slate-200">Stripe :</strong> Gestion sécurisée des transactions de paiement et des abonnements.</li>
            <li><strong className="text-slate-200">Cloudinary :</strong> Hébergement, stockage et gestion des médias et images importés sur la plateforme.</li>
            <li><strong className="text-slate-200">Brevo :</strong> Gestion et envoi des emails transactionnels (envois de commandes).</li>
            <li><strong className="text-slate-200">Railway :</strong> Hébergement des données de l'application.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">5. Vos droits (RGPD)</h2>
          <p>Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, vous pouvez nous contacter à l'adresse email : contact@buylogic.fr.</p>
        </section>
      </div>
    </div>
  );
}