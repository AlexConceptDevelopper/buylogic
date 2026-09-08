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
    <div className="group relative rounded-2xl border border-white/5 bg-slate-900/60 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-cyan-950">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black tracking-[0.25em] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}