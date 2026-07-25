import type { ReactNode } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "./utils";
import { formatPercent, round2 } from "./data";

export function Card({
  id,
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  id?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      aria-labelledby={title && id ? `${id}-title` : undefined}
      className={cn(
        "flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 shadow-sm",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-5">
          <div className="min-w-0">
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                title={title}
                className="truncate text-sm font-semibold text-zinc-100"
              >
                {title}
              </h2>
            )}
            {description && (
              <p title={description} className="mt-0.5 truncate text-xs text-zinc-500">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export function ChangeBadge({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  const isZero = Math.abs(value) < 0.005;
  const isPositive = value > 0;
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium tabular-nums",
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs",
        isZero
          ? "bg-zinc-500/10 text-zinc-400"
          : isPositive
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400",
      )}
    >
      <Icon aria-hidden="true" className="size-3" />
      {formatPercent(value)}
    </span>
  );
}

export function AssetIcon({
  symbol,
  color,
  size = "md",
}: {
  symbol: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "size-6 text-[9px]" : size === "lg" ? "size-11 text-sm" : "size-8 text-[10px]";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 font-bold tracking-tight",
        sizeClass,
      )}
      style={{ backgroundColor: `${color}22`, color }}
    >
      {symbol.slice(0, 2)}
    </span>
  );
}

export function StatusBadge({ status }: { status: "completed" | "pending" }) {
  const label = status === "completed" ? "Completed" : "Pending";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
        status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", status === "completed" ? "bg-emerald-400" : "bg-amber-400")}
      />
      {/* Text hides below sm to keep the transactions table clipping-free on narrow screens;
          it stays in the accessibility tree via sr-only so status is never color-only. */}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{children}</p>;
}

/**
 * Small decorative trend line for rail rows. Purely presentational — the
 * numeric % change next to it is the real, screen-reader-accessible signal
 * (this stays aria-hidden so it never becomes a color-only data channel).
 */
export function Sparkline({
  values,
  color,
  width = 48,
  height = 20,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || Math.max(max * 0.01, 1);
  const points = values
    .map((v, i) => {
      const x = round2((i / (values.length - 1)) * width);
      const y = round2(height - ((v - min) / range) * height);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="presentation"
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
