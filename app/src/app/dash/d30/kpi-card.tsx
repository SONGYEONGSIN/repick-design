import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "./cn";

interface KpiCardProps {
  label: string;
  value: string;
  helpText?: string;
  deltaText: string;
  /** Actual color tone for the delta — depending on the metric, an increase/decrease can be positive or negative, so the caller computes and passes this */
  tone: "positive" | "negative" | "neutral";
  direction: "up" | "down" | "flat";
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  accentClass: string;
}

const TONE_CLASSES: Record<KpiCardProps["tone"], string> = {
  positive: "text-emerald-700 bg-emerald-50",
  negative: "text-rose-700 bg-rose-50",
  neutral: "text-zinc-600 bg-zinc-100",
};

export function KpiCard({
  label,
  value,
  helpText,
  deltaText,
  tone,
  direction,
  icon: Icon,
  accentClass,
}: KpiCardProps) {
  const DirectionIcon = direction === "down" ? TrendingDown : TrendingUp;

  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          {label}
        </p>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            accentClass,
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <p className="text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">
        {value}
      </p>

      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11.5px] font-medium tabular-nums",
            TONE_CLASSES[tone],
          )}
        >
          {direction !== "flat" ? (
            <DirectionIcon className="h-3 w-3" aria-hidden="true" />
          ) : null}
          {deltaText}
        </span>
        {helpText ? <span className="truncate text-[11.5px] text-zinc-400">{helpText}</span> : null}
      </div>
    </article>
  );
}
