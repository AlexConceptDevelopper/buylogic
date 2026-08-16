interface StepProps {
  number: string;
  title: string;
  text: string;
}

export default function Step({
  number,
  title,
  text,
}: StepProps) {
  return (
    <div className="flex gap-5 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-400">
        {number}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}