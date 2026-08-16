interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  number,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20">
      <span className="text-xs font-bold tracking-[0.2em] text-cyan-400">
        {number}
      </span>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}