import { clampPercent } from "../../lib/format";

export function ProgressBar({
  value,
  className = "",
  trackClassName = "bg-zinc-100",
  barClassName = "bg-indigo-600",
  label,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  label: string;
}) {
  const pct = clampPercent(value);
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${barClassName} motion-safe:transition-[width] motion-safe:duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
