"use client";

import type { ReactNode } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CircleCheck, PauseCircle } from "lucide-react";
import type { ResourceStatus } from "./data";

/** The one verified-visible focus pattern in this setup: `ring-*` + `ring-offset-*` renders fully
 *  transparent here, and this utility must never be preceded by `outline-none` (that flag cancels
 *  it). Amber is the single assigned accent, so the focus outline carries it through every state. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

export function Card({
  children,
  className = "",
  as = "div",
  ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  ariaLabelledBy?: string;
}) {
  const cardClassName = `rounded-xl border border-white/10 bg-zinc-900 ${className}`;
  if (as === "section") {
    return (
      <section aria-labelledby={ariaLabelledBy} className={cardClassName}>
        {children}
      </section>
    );
  }
  return <div className={cardClassName}>{children}</div>;
}

const STATUS_STYLES: Record<ResourceStatus, { icon: typeof CircleCheck; label: string; short: string; text: string; soft: string }> = {
  optimized: { icon: CircleCheck, label: "Optimized", short: "OK", text: "text-emerald-400", soft: "bg-emerald-500/10" },
  idle: { icon: PauseCircle, label: "Idle", short: "Idle", text: "text-zinc-400", soft: "bg-white/5" },
  anomalous: { icon: AlertTriangle, label: "Anomalous", short: "Alert", text: "text-rose-400", soft: "bg-rose-500/10" },
};

export const STATUS_SEVERITY: Record<ResourceStatus, number> = { anomalous: 2, idle: 1, optimized: 0 };

export function StatusBadge({ status, abbreviated = false, className = "" }: { status: ResourceStatus; abbreviated?: boolean; className?: string }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[11px] ${s.soft} ${s.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{abbreviated ? s.short : s.label}</span>
    </span>
  );
}

/**
 * A signed delta. The arrow direction always reflects the literal, mathematical sign of `value`
 * (positive -> up, negative -> down) and is never flipped — that invariant is what keeps every
 * call site honest regardless of what the metric means. Whether that direction is *good* is a
 * separate question answered by `invertGoodness` (e.g. being over budget is a positive number but
 * a bad outcome): color carries judgment, the arrow only ever reports which way the number moved.
 */
export function Delta({
  value,
  suffix = "%",
  invertGoodness = false,
  digits = 1,
}: {
  value: number;
  suffix?: string;
  invertGoodness?: boolean;
  digits?: number;
}) {
  const isUpward = value >= 0;
  const isGood = invertGoodness ? !isUpward : isUpward;
  const tone = isGood ? "text-emerald-400" : "text-rose-400";
  const sign = isUpward ? "+" : "";
  return (
    <span className={`inline-flex items-center gap-0.5 font-medium text-xs tabular-nums ${tone}`}>
      {isUpward ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
      {sign}
      {value.toFixed(digits)}
      {suffix}
    </span>
  );
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 font-medium text-[11px] text-amber-400 ${className}`}
    >
      {initials}
    </span>
  );
}

export function ProgressBar({
  pct,
  className = "",
  trackClassName = "bg-white/10",
  fillClassName = "bg-amber-400",
}: {
  pct: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}>
      <div
        className={`h-full rounded-full ${fillClassName} motion-safe:transition-[width] motion-safe:duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** Small deterministic trend line: a plain linear map from values to SVG points, no trig. It is
 *  always paired with the same numbers printed as real text next to it, so it is never the only
 *  way to read the data — consistent with the dominant treemap's own always-visible-text rule. */
export function Sparkline({ values, className = "", stroke = "stroke-amber-400" }: { values: number[]; className?: string; stroke?: string }) {
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
              active ? "bg-amber-400/15 text-amber-400" : "text-zinc-400 hover:text-zinc-50"
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
  tabs,
  value,
  onChange,
  idBase,
  ariaLabel,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  idBase: string;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex gap-1 border-b border-white/10">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.value}`}
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-2.5 py-1.5 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-amber-400 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-60" aria-hidden="true" />;
  return dir === "asc" ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />;
}

export function SortHeader({
  label,
  active,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onSort: () => void;
  align?: "left" | "right";
}) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className="px-2 py-2">
      <button
        type="button"
        onClick={onSort}
        className={`inline-flex min-h-7 w-full items-center gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          align === "right" ? "justify-end" : "justify-start"
        } ${active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"}`}
      >
        {align === "right" ? null : <span>{label}</span>}
        <SortIcon active={active} dir={dir} />
        {align === "right" ? <span>{label}</span> : null}
      </button>
    </th>
  );
}
