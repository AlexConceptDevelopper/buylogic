export default function BusinessModelsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 md:p-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Polyvalence métier
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Que vous vendiez du brut ou du transformé.
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Chaque entreprise a sa propre logique de stock. BuyLogic s'adapte à votre réalité terrain, que vous soyez purement commerçant ou fabricant.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-semibold text-cyan-300">
              Négoce & Distribution
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              Acheter et revendre en direct
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-6">
              Vous gérez des produits finis, vous suivez vos fournisseurs et vous réapprovisionnez au meilleur prix pour vos clients finaux sans transformation intermédiaire.
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-semibold text-emerald-300">
              Fabrication & Atelier
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              Produire à partir de composants
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-6">
              Vous achetez des pièces et des matières premières, vous les assemblez dans votre atelier, et BuyLogic déduit automatiquement les stocks de composants lorsque vous lancez une production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}