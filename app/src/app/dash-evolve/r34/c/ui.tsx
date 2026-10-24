// Shared presentational building blocks for the Verbatim dashboard: Card, Badge,
// Avatar, Sparkline, Progress. Pure rendering only (no hooks, no event handlers),
// so this file carries no "use client" directive and is safe to import from both
// server and client components in this route.
import type { ReactNode, ElementType } from "react";

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cx(
        "rounded-xl border border-white/10 bg-zinc-900/60 p-4 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  as = "h3",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={cx("text-sm font-bold text-zinc-50 tracking-tight", className)}>
      {children}
    </Tag>
  );
}

const BADGE_TONE: Record<string, string> = {
  positive: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  neutral: "border-white/15 bg-white/5 text-zinc-300",
  negative: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  brand: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  default: "border-white/10 bg-white/5 text-zinc-300",
};

export function Badge({
  children,
  tone = "default",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: "positive" | "neutral" | "negative" | "brand" | "default";
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        BADGE_TONE[tone],
        className,
      )}
    >
      {icon ? <span aria-hidden="true" className="flex items-center">{icon}</span> : null}
      {children}
    </span>
  );
}

const AVATAR_SIZE: Record<string, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
};

export function Avatar({
  initials,
  size = "md",
  className,
}: {
  initials: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-zinc-50",
        AVATAR_SIZE[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Deterministic inline SVG sparkline. All coordinates rounded to 2 decimals. */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  className = "stroke-emerald-400",
  summary,
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  summary: string;
}) {
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const xStep = (width - pad * 2) / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = round2(pad + i * xStep);
      const y = round2(pad + (1 - (v - min) / span) * (height - pad * 2));
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <span role="img" aria-label={summary} className="inline-block">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        className="block overflow-visible"
      >
        <polyline
          points={points}
          fill="none"
          strokeWidth={1.5}
          className={className}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export interface ProgressSegment {
  pct: number;
  colorClass: string;
  label: string;
}

/** Thin decorative sentiment-share bar. Mark up-only; adjoining text carries the numbers. */
export function Progress({ segments, className }: { segments: ProgressSegment[]; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("flex h-1.5 w-full overflow-hidden rounded-full bg-white/5", className)}
    >
      {segments.map((s, i) => (
        <span
          key={i}
          className={s.colorClass}
          style={{ width: `${round2(s.pct)}%` }}
          title={s.label}
        />
      ))}
    </div>
  );
}
