export default function BenefitsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <div className="text-2xl font-black text-cyan-400">0</div>
          <h4 className="mt-2 font-bold text-white">Rupture subie</h4>
          <p className="mt-1 text-sm text-slate-400">
            Anticipez les délais fournisseurs pour ne plus jamais être pris au dépourvu sur vos pièces critiques.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <div className="text-2xl font-black text-cyan-400">-30%</div>
          <h4 className="mt-2 font-bold text-white">Trésorerie immobilisée</h4>
          <p className="mt-1 text-sm text-slate-400">
            Ajustez vos volumes pour éliminer le stock dormant qui ne tourne pas et pèse sur les comptes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
          <div className="text-2xl font-black text-cyan-400">5 min</div>
          <h4 className="mt-2 font-bold text-white">Par semaine suffisent</h4>
          <p className="mt-1 text-sm text-slate-400">
            Glissez votre export, lisez les recommandations prêtes à l'emploi et validez vos commandes en un clin d'œil.
          </p>
        </div>
      </div>
    </section>
  );
}