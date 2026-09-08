import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-16 md:pb-20 md:pt-24">
      <div className="max-w-4xl">
        {/* Badge "Pill" ultra-net */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          La gestion des achats devient prédictive
        </div>

        {/* Titre avec gradient pour le punch */}
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Achetez moins.{" "}
          <span className="bg-linear-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Achetez mieux.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl font-light">
          BuyLogic analyse vos stocks, votre consommation, vos commandes et vos
          fournisseurs pour vous dire instantanément{" "}
          <span className="font-semibold text-white underline decoration-cyan-500/50 decoration-2 underline-offset-4">
            quoi acheter, quand acheter et chez qui acheter.
          </span>
        </p>

        {/* Boutons d'action rehaussés */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center justify-center rounded-xl bg-cyan-400 px-7 py-4 text-center text-sm font-bold text-slate-950 shadow-xl shadow-cyan-400/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/40"
          >
            <span>Découvrir le dashboard</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-7 py-4 text-center text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white"
          >
            Voir comment ça fonctionne
          </a>
        </div>
      </div>
    </section>
  );
}
