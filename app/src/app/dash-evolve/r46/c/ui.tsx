"use client";

import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatPctSigned } from "./format";

/** The only verified-visible focus pattern in this codebase's Tailwind v4 build:
 *  `outline-2` + `outline-offset-2` with an explicit color. Never pair with
 *  `outline-none`, and never rely on a bare `ring`/`ring-offset` (paints fully
 *  transparent here). Used on every focusable element on this route. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

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
  const cls = `rounded-xl border border-white/10 bg-zinc-900 ${className}`;
  if (as === "section") {
    return (
      <section id={id} aria-labelledby={ariaLabelledBy} className={cls}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} aria-labelledby={ariaLabelledBy} className={cls}>
      {children}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="inline-flex gap-0.5 rounded-lg border border-white/10 bg-zinc-950 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-violet-500/15 text-violet-400" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Icon direction always reflects the literal sign of `value` (up = gain vs.
 *  baseline, down = decline). For revenue, up is always the good direction, so
 *  color follows the same sign with no inversion anywhere this component is used.
 *  A different icon family (Trending*) from the ArrowUp/Down/UpDown pair used for
 *  table sort direction elsewhere on this page, so "value moved" and "column is
 *  sorted this way" can never be visually confused at any call site. */
export function TrendBadge({ value, className = "" }: { value: number; className?: string }) {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) {
    return <span className={`inline-flex items-center gap-1 font-medium tabular-nums text-xs text-zinc-400 ${className}`}>{formatPctSigned(0)}</span>;
  }
  const up = rounded > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 font-medium tabular-nums text-xs ${up ? "text-violet-400" : "text-rose-400"} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {formatPctSigned(rounded)}
    </span>
  );
}

/** Single source of truth for "which text color does this signed value get" — reused
 *  by the row's own current-value label, the KPI strip and the fallback table's
 *  current-value column, so the same number is never colored two different ways in
 *  two different places on this page. */
export function valueTextClass(v: number): string {
  const rounded = Math.round(v * 10) / 10;
  if (rounded > 0) return "text-violet-300";
  if (rounded < 0) return "text-rose-300";
  return "text-zinc-300";
}
