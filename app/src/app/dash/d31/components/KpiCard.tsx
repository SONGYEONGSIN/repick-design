import { TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  delta: number;
  deltaGoodDirection?: "up" | "down";
  caption: string;
  Icon: ComponentType<{ className?: string }>;
}

export default function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaGoodDirection = "up",
  caption,
  Icon,
}: KpiCardProps) {
  const isPositive = delta >= 0;
  const isGood = deltaGoodDirection === "up" ? isPositive : !isPositive;
  const DeltaIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <span className="flex size-7 items-center justify-center rounded-lg bg-white/[0.06] text-zinc-400">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-zinc-50 sm:text-[28px]">
          {value}
        </span>
        {unit ? <span className="text-sm text-zinc-500">{unit}</span> : null}
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-medium tabular-nums ${
            isGood ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          <DeltaIcon className="size-3" aria-hidden="true" />
          {isPositive ? "+" : ""}
          {delta.toFixed(1)}%
        </span>
        <span className="text-zinc-500">{caption}</span>
      </div>
    </div>
  );
}
