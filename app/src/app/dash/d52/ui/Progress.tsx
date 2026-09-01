import { fmtPct } from "../format";

/** AI grading-confidence meter. `value` is a 0..1 fraction. */
export function Progress({
  value,
  className = "",
  showLabel = true,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label={`Grading confidence ${fmtPct(value)}`}>
      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-zinc-800" aria-hidden="true">
        <div
          className="h-full rounded-full bg-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-[11px] tabular-nums text-zinc-400">{fmtPct(value)}</span>
      )}
    </div>
  );
}
