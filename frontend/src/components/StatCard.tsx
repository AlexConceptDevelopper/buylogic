interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: string;
  warning?: boolean;
  danger?: boolean;
}

export default function StatCard({
  label,
  value,
  detail,
  icon,
  warning = false,
  danger = false,
}: StatCardProps) {
  const iconClass = danger
    ? "bg-rose-400/10 text-rose-300"
    : warning
      ? "bg-amber-400/10 text-amber-300"
      : "bg-cyan-400/10 text-cyan-300";

  const valueClass = danger
    ? "text-rose-400"
    : "text-white";

  return (
    <div className="group rounded-2xl border border-white/5 bg-slate-900/70 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p
            className={`mt-3 text-3xl font-bold tracking-tight ${valueClass}`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {detail}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition duration-300 group-hover:scale-105 ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}