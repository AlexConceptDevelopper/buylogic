interface PurchaseOrderArcFormProps {
  arcNumber: string;
  expectedDeliveryInput: string;
  savingArc: boolean;
  onChangeArcNumber: (val: string) => void;
  onChangeExpectedDelivery: (val: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
}

export function PurchaseOrderArcForm({
  arcNumber,
  expectedDeliveryInput,
  savingArc,
  onChangeArcNumber,
  onChangeExpectedDelivery,
  onSubmit,
}: PurchaseOrderArcFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 rounded-xl border border-purple-400/20 bg-purple-400/5 p-4 space-y-4"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
        Enregistrement de l'Accusé de Réception (ARC)
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Numéro d'ARC
          </label>
          <input
            type="text"
            value={arcNumber}
            onChange={(e) => onChangeArcNumber(e.target.value)}
            placeholder="Ex: ARC-2026-001"
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Date de prévision fournisseur
          </label>
          <input
            type="date"
            value={expectedDeliveryInput}
            onChange={(e) => onChangeExpectedDelivery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-purple-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={savingArc}
          className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
        >
          {savingArc ? "Enregistrement..." : "Enregistrer l'ARC"}
        </button>
      </div>
    </form>
  );
}