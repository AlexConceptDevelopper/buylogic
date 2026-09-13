import { Link } from "react-router-dom";

export default function LegalMentions() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-300">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-400 transition hover:text-cyan-300"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold text-white">Mentions Légales</h1>
        
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">1. Édition du site</h2>
          <p>Le présent site, accessible à l'URL buylogic.fr, est édité par la structure commerciale <strong className="text-white">CubTaik</strong>, représentée par :</p>
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4 text-sm text-slate-400 space-y-1">
            <p><strong className="text-white">Entrepreneur individuel :</strong> Alexandre Cubizolle</p>
            <p><strong className="text-white">Nom commercial :</strong> CubTaik</p>
            <p><strong className="text-white">SIREN :</strong> 109 752 832</p>
            <p><strong className="text-white">Siège social :</strong> 3 Chem des Brandes, 17600 Sablonceaux, France</p>
            <p><strong className="text-white">TVA :</strong> TVA non applicable, art. 293 B du CGI</p>
            <p><strong className="text-white">Directeur de la publication :</strong> Alexandre Cubizolle</p>
            <p>
              <strong className="text-white">Contact :</strong>{" "}
              <a
                href="mailto:contact@buylogic.fr"
                className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-4 transition hover:text-cyan-300"
              >
                contact@buylogic.fr
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">2. Hébergement</h2>
          <p>Le site et les données de l'application sont hébergés par :</p>
          <div className="rounded-xl border border-white/5 bg-slate-900/50 p-4 text-sm text-slate-400 space-y-1">
            <p><strong className="text-white">Hébergeur :</strong> Railway Corp.</p>
            <p><strong className="text-white">Siège social :</strong> San Francisco, CA, USA</p>
            <p>
              <strong className="text-white">Site web :</strong>{" "}
              <a
                href="https://railway.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-4 transition hover:text-cyan-300"
              >
                https://railway.app
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-white">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site et de ses contenus relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>
        </section>
      </div>
    </div>
  );
}