import { Link } from "react-router-dom";

export default function TrialOffer() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-linear-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 shadow-2xl shadow-cyan-500/5 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              Offre découverte
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                30 jours gratuits.
              </h2>

              <span className="pb-1 text-sm font-semibold text-cyan-300">
                Pour vraiment voir ce que BuyLogic apporte.
              </span>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Donnez à BuyLogic le temps d'analyser votre activité, d'observer
              vos consommations et d'améliorer ses recommandations au fil des
              données.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/5 bg-white/3 px-3.5 py-2 text-xs font-semibold text-slate-300">
                ✓ Aucune carte bancaire
              </div>

              <div className="rounded-xl border border-white/5 bg-white/3 px-3.5 py-2 text-xs font-semibold text-slate-300">
                ✓ Aucun prélèvement automatique
              </div>

              <div className="rounded-xl border border-white/5 bg-white/3 px-3.5 py-2 text-xs font-semibold text-slate-300">
                ✓ Vos données restent les vôtres
              </div>
            </div>
          </div>

          <div className="shrink-0 lg:min-w-57.5">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-xl backdrop-blur-xl">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Pendant 30 jours
              </p>

              <p className="mt-2 text-2xl font-black text-white">0,00 €</p>

              <p className="mt-1 text-xs text-slate-500">
                Aucun moyen de paiement requis
              </p>

              <Link
                to="/register"
                className="mt-4 block w-full cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
