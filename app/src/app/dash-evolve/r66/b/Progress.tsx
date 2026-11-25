import { formatPercent } from "./data";
import { cx } from "./ui";

interface ProgressProps {
  ratio: number;
  label: string;
  tone?: "lime" | "zinc";
}

export function Progress({ ratio, label, tone = "lime" }: ProgressProps) {
  const pct = Math.max(0, Math.min(1, ratio));
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
        <span>{label}</span>
        <span className="font-medium tabular-nums text-zinc-700">{formatPercent(pct)}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct * 100)}
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
      >
        <div
          className={cx("h-full rounded-full", tone === "lime" ? "bg-lime-500" : "bg-zinc-400")}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
