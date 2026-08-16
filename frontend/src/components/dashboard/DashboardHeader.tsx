export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Vue d'ensemble
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Gardez un œil sur vos stocks, vos commandes et les
          recommandations de BuyLogic.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

            <span className="text-xs font-semibold text-emerald-300">
              Système opérationnel
            </span>
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white"
        >
          Actualiser
        </button>
      </div>
    </div>
  );
}