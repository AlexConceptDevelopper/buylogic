import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          La gestion des achats devient prédictive
        </div>

        <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Achetez moins.
          <span className="block text-cyan-400">
            Achetez mieux.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
          BuyLogic analyse vos stocks, votre consommation, vos commandes
          et vos fournisseurs pour vous aider à savoir{" "}
          <span className="font-semibold text-slate-200">
            quoi acheter, quand acheter et chez qui acheter.
          </span>
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="cursor-pointer rounded-xl bg-cyan-400 px-6 py-3.5 text-center text-sm font-bold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            Découvrir le dashboard
          </Link>

          <a
            href="#how-it-works"
            className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
          >
            Voir comment ça fonctionne
          </a>
        </div>
      </div>
    </section>
  );
}