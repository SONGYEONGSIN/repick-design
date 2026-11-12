// A labeled progress bar. The percentage is always printed as text next to the bar — the bar's
// fill color is never the only carrier of meaning.
export function ProgressMeter({
  fraction,
  label,
  valueText,
  tone = "green",
}: {
  fraction: number;
  label: string;
  valueText: string;
  tone?: "green" | "amber";
}) {
  const pct = Math.max(0, Math.min(1, fraction)) * 100;
  const barClass = tone === "green" ? "bg-green-500" : "bg-amber-500";
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-normal text-slate-400">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-slate-100">{valueText}</span>
      </div>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${pct.toFixed(2)}%` }} />
      </div>
    </div>
  );
}
