type PurchaseFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onSelectFilter: (filter: any) => void;
};

const filterOptions = [
  ["ALL", "Toutes"],
  ["DRAFT", "Brouillons"],
  ["ORDERED", "Commandées"],
  ["PARTIALLY_RECEIVED", "Partiellement reçues"],
  ["RECEIVED", "Reçues"],
  ["CANCELLED", "Annulées"],
] as const;

export default function PurchaseFilters({
  search,
  onSearchChange,
  filter,
  onSelectFilter,
}: PurchaseFiltersProps) {
  return (
    <div className="mt-8 flex flex-col gap-4 lg:flex-row">
      <div className="flex-1">
        <label htmlFor="purchase-order-search" className="sr-only">
          Rechercher une commande
        </label>
        <input
          id="purchase-order-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher par numéro ou fournisseur..."
          className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelectFilter(value)}
            className={[
              "cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-semibold transition",
              filter === value
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}