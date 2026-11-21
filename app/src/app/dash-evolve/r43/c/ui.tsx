"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Circle, Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { FeedItem, MetricDirection, SentimentLabel, TicketStatus } from "./data";
import { formatSignedDelta } from "./format";

/** The only verified-safe focus pattern in this codebase: outline-2 + outline-offset-2
 *  with an explicit color, never preceded by outline-none, never a bare ring/ring-offset. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700";

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
  const cardClassName = `rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`;
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

export const STATUS_META: Record<TicketStatus, { icon: typeof Circle; label: string; text: string; soft: string }> = {
  open: { icon: Circle, label: "Open", text: "text-zinc-600", soft: "bg-zinc-100" },
  escalated: { icon: AlertTriangle, label: "Escalated", text: "text-rose-700", soft: "bg-rose-50" },
  resolved: { icon: CheckCircle2, label: "Resolved", text: "text-emerald-700", soft: "bg-emerald-50" },
};

export function StatusBadge({ status, className = "" }: { status: TicketStatus; className?: string }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/** Sentiment uses the same two directional icons everywhere on the page: TrendingUp
 *  always means "more positive", TrendingDown always means "more negative". Color
 *  pairs rose (brand accent, doubling as the negative/alert signal) with emerald
 *  (positive) and zinc (neutral), so the one assigned accent never competes with a
 *  second red for the same meaning. */
export const SENTIMENT_META: Record<SentimentLabel, { icon: typeof TrendingUp; label: string; text: string; soft: string }> = {
  positive: { icon: TrendingUp, label: "Positive", text: "text-emerald-700", soft: "bg-emerald-50" },
  neutral: { icon: Minus, label: "Neutral", text: "text-zinc-600", soft: "bg-zinc-100" },
  negative: { icon: TrendingDown, label: "Negative", text: "text-rose-700", soft: "bg-rose-50" },
};

export function SentimentBadge({ sentiment, className = "" }: { sentiment: SentimentLabel; className?: string }) {
  const meta = SENTIMENT_META[sentiment];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function PriorityTag({ priority, className = "" }: { priority: FeedItem["priority"]; className?: string }) {
  const label = priority === "high" ? "High" : priority === "medium" ? "Medium" : "Low";
  const dotClass = priority === "high" ? "bg-rose-700" : priority === "medium" ? "bg-zinc-500" : "bg-zinc-300";
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 font-medium text-xs text-zinc-600 ${className}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}

/** Icon direction always reflects the literal sign of `delta` (up = increased,
 *  down = decreased). Color is computed separately from `goodDirection`, so the
 *  arrow's claimed meaning (numeric direction) can never be flipped relative to
 *  its rendered orientation at any call site. */
export function DeltaIndicator({
  delta,
  goodDirection,
  digits = 0,
  className = "",
}: {
  delta: number;
  goodDirection: MetricDirection;
  digits?: number;
  className?: string;
}) {
  if (delta === 0) {
    return (
      <span className={`inline-flex items-center gap-1 font-medium tabular-nums text-xs text-zinc-600 ${className}`}>
        <Minus className="h-3 w-3 shrink-0" aria-hidden="true" />
        {formatSignedDelta(0, digits)}
      </span>
    );
  }
  const increased = delta > 0;
  const isGood = increased ? goodDirection === "up" : goodDirection === "down";
  const Icon = increased ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 font-medium tabular-nums text-xs ${isGood ? "text-emerald-700" : "text-rose-700"} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {formatSignedDelta(delta, digits)}
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
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-rose-700 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1 border-b border-zinc-200">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`min-h-9 rounded-t-md px-3 py-2 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-b-2 border-rose-700 text-rose-700" : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900"
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
      className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-100 font-medium text-zinc-700 ${className}`}
    >
      {initials}
    </span>
  );
}

/** Deterministic linear map from values to SVG points — no trig, but coordinates
 *  are still rounded to 2 decimals for consistent SSR/client output. */
export function Sparkline({
  values,
  className = "",
  stroke = "stroke-rose-700",
}: {
  values: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 96;
  const h = 28;
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
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-7 w-24 ${className}`} aria-hidden="true">
      <polyline points={points} fill="none" className={stroke} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
