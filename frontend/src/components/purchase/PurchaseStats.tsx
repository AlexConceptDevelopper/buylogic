type PurchaseStatsProps = {
  stats: {
    total: number;
    draft: number;
    ordered: number;
    partiallyReceived: number;
  };
  filter: string;
  onSelectFilter: (filter: any) => void;
};

export default function PurchaseStats({
  stats,
  filter,
  onSelectFilter,
}: PurchaseStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <button
        type="button"
        onClick={() => onSelectFilter("ALL")}
        className={[
          "cursor-pointer rounded-2xl border p-5 text-left transition",
          filter === "ALL"
            ? "border-cyan-400/20 bg-cyan-400/5"
            : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
        ].join(" ")}
      >
        <p className="text-xs text-slate-500">Toutes</p>
        <p className="mt-2 text-2xl font-bold text-white">{stats.total}</p>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter("DRAFT")}
        className={[
          "cursor-pointer rounded-2xl border p-5 text-left transition",
          filter === "DRAFT"
            ? "border-slate-400/20 bg-slate-400/5"
            : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
        ].join(" ")}
      >
        <p className="text-xs text-slate-500">Brouillons</p>
        <p className="mt-2 text-2xl font-bold text-slate-300">{stats.draft}</p>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter("ORDERED")}
        className={[
          "cursor-pointer rounded-2xl border p-5 text-left transition",
          filter === "ORDERED"
            ? "border-cyan-400/20 bg-cyan-400/5"
            : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
        ].join(" ")}
      >
        <p className="text-xs text-slate-500">Commandées</p>
        <p className="mt-2 text-2xl font-bold text-cyan-300">{stats.ordered}</p>
      </button>

      <button
        type="button"
        onClick={() => onSelectFilter("PARTIALLY_RECEIVED")}
        className={[
          "cursor-pointer rounded-2xl border p-5 text-left transition",
          filter === "PARTIALLY_RECEIVED"
            ? "border-amber-400/20 bg-amber-400/5"
            : "border-white/5 bg-slate-900/70 hover:border-white/10 hover:bg-slate-900",
        ].join(" ")}
      >
        <p className="text-xs text-slate-500">Réceptions partielles</p>
        <p className="mt-2 text-2xl font-bold text-amber-300">
          {stats.partiallyReceived}
        </p>
      </button>
    </div>
  );
}