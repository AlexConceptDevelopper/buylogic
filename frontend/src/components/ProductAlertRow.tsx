type AlertSeverity = "critical" | "high" | "medium";

interface ProductAlertRowProps {
  name: string;
  reference: string;
  stock: number;
  status: string;
  severity: AlertSeverity;
  onClick?: () => void;
}

export default function ProductAlertRow({
  name,
  reference,
  stock,
  status,
  severity,
  onClick,
}: ProductAlertRowProps) {
  let dotClass = "bg-amber-400";
  let stockClass = "text-amber-300";
  let badgeClass =
    "border-amber-400/20 bg-amber-400/10 text-amber-300";

  if (severity === "critical") {
    dotClass = "bg-rose-400";
    stockClass = "text-rose-300";
    badgeClass =
      "border-rose-400/20 bg-rose-400/10 text-rose-300";
  } else if (severity === "high") {
    dotClass = "bg-orange-400";
    stockClass = "text-orange-300";
    badgeClass =
      "border-orange-400/20 bg-orange-400/10 text-orange-300";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-4 text-left transition duration-200 hover:border-white/10 hover:bg-slate-950/70"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass}`}
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-200">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {reference}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
            Stock
          </p>

          <p className={`mt-1 text-sm font-bold ${stockClass}`}>
            {stock}
          </p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${badgeClass}`}
        >
          {status}
        </span>
      </div>
    </button>
  );
}