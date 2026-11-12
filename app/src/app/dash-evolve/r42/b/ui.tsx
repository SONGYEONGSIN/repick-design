"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CircleCheck, TrendingDown, TrendingUp } from "lucide-react";

// The one verified-safe focus pattern in this repo's exact Tailwind v4 setup: outline-2 +
// outline-offset-2 with nothing that cancels it (no `outline-none` anywhere upstream, no bare
// `ring`/`ring-offset` standing in as the only focus signal).
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700";

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
            className={`min-h-7 rounded-md px-3 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-white text-green-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function RangeSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="font-medium text-xs text-zinc-700">
          {label}
        </label>
        <span className="font-semibold text-xs tabular-nums text-green-700">{formatValue(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`mt-2 h-6 w-full cursor-pointer accent-green-700 ${FOCUS_RING}`}
      />
    </div>
  );
}

/** SLA attainment status. Always paired with an icon + text label, never color alone. */
export function SlaBadge({ breach, className = "" }: { breach: boolean; className?: string }) {
  if (breach) {
    return (
      <span
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-50 px-2 py-0.5 font-semibold text-[11px] uppercase tracking-[0.03em] text-red-700 ${className}`}
      >
        <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
        Below SLA
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-green-50 px-2 py-0.5 font-semibold text-[11px] uppercase tracking-[0.03em] text-green-700 ${className}`}
    >
      <CircleCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
      On target
    </span>
  );
}

/** Single consistent meaning everywhere it is used: gap = scheduled − required. Positive
 *  (surplus, good) always renders TrendingUp in green; negative (deficit, needs hiring) always
 *  renders TrendingDown in red. No other call site repurposes this component or these icons for
 *  a different direction's meaning. */
export function GapIndicator({ gap, className = "h-3.5 w-3.5" }: { gap: number; className?: string }) {
  const positive = gap >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return <Icon className={`${className} shrink-0 ${positive ? "text-green-700" : "text-red-700"}`} aria-hidden="true" />;
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-green-100 font-medium text-green-700 ${className}`}>
      {initials}
    </span>
  );
}
