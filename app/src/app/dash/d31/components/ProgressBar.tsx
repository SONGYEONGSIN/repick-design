interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  toneClassName?: string;
}

export default function ProgressBar({ value, max, label, toneClassName = "bg-indigo-400" }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
    >
      <div
        className={`h-full rounded-full ${toneClassName} transition-[width] duration-500 ease-out motion-reduce:transition-none`}
        style={{ width: `${pct.toFixed(2)}%` }}
      />
    </div>
  );
}
