export default function CompatibilityBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Intégration sans friction
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Compatible avec votre logiciel actuel (même fermé).
          </h3>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            Pas besoin d'API complexe ou d'accès administrateur chez vos fournisseurs/ERP. Un simple export de vos ventes ou de vos stocks suffit pour alimenter le moteur de BuyLogic.
          </p>
        </div>
        <div className="shrink-0">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4 text-center">
            <span className="block text-2xl font-black text-cyan-300">100%</span>
            <span className="text-xs font-semibold text-slate-400">Autonome & Indépendant</span>
          </div>
        </div>
      </div>
    </section>
  );
}