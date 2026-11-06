"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Minus, PauseCircle, PlayCircle, TrendingDown, TrendingUp } from "lucide-react";
import type { ExperimentStatus, LiftClass } from "./data";
import { formatSignedPct } from "./format";

/** The only verified-safe focus pattern in this codebase: outline-2 + outline-offset-2 with no
 *  preceding `outline-none` and no bare `ring`/`ring-offset` anywhere as the sole focus signal. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400";

export function Card({
  children,
  className = "",
  as = "div",
  id,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  "aria-labelledby"?: string;
}) {
  const cardClassName = `rounded-xl border border-white/10 bg-zinc-900 ${className}`;
  if (as === "section") {
    return (
      <section id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
      {children}
    </div>
  );
}

export const STATUS_META: Record<ExperimentStatus, { icon: typeof PlayCircle; label: string; text: string; soft: string }> = {
  running: { icon: PlayCircle, label: "Running", text: "text-lime-400", soft: "bg-lime-400/10" },
  completed: { icon: CheckCircle2, label: "Shipped", text: "text-zinc-50", soft: "bg-white/10" },
  paused: { icon: PauseCircle, label: "Paused", text: "text-amber-400", soft: "bg-amber-400/10" },
};

export function StatusBadge({ status, className = "" }: { status: ExperimentStatus; className?: string }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export const LIFT_META: Record<LiftClass, { icon: typeof TrendingUp; text: string; label: string }> = {
  positive: { icon: TrendingUp, text: "text-lime-400", label: "Significant lift" },
  negative: { icon: TrendingDown, text: "text-rose-400", label: "Significant drop" },
  inconclusive: { icon: Minus, text: "text-zinc-400", label: "Not significant yet" },
};

/** Shared by the bench cards, the table, and the command palette so a given experiment's
 *  direction icon is never flipped relative to its meaning anywhere else on the page. */
export function LiftBadge({
  liftPct,
  liftClass,
  size = "md",
  className = "",
}: {
  liftPct: number;
  liftClass: LiftClass;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = LIFT_META[liftClass];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold tabular-nums ${meta.text} ${size === "md" ? "text-sm" : "text-xs"} ${className}`}
    >
      <Icon className={size === "md" ? "h-3.5 w-3.5 shrink-0" : "h-3 w-3 shrink-0"} aria-hidden="true" />
      {formatSignedPct(liftPct)}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-lg border border-white/10 bg-zinc-950 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-lime-400/15 text-lime-400" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-zinc-50 ${className}`}
    >
      {initials}
    </span>
  );
}

/** Deterministic trend line: a linear map from data values to SVG points, no trig involved.
 *  Coordinates are still rounded to 2 decimals for hydration safety. */
export function Sparkline({
  values,
  className = "",
  stroke = "stroke-lime-400",
}: {
  values: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 72;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-6 w-[72px] ${className}`} aria-hidden="true">
      <polyline points={points} fill="none" className={stroke} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
