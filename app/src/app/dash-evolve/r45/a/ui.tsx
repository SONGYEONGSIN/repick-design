"use client";

import type { ReactNode } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CircleCheck } from "lucide-react";
import type { VendorStatus } from "./status";

/** The one verified-visible focus pattern used across this route: `ring-2 ring-offset-*` renders
 *  fully transparent under this app's Tailwind v4 setup, and this utility must never follow
 *  `outline-none` (that combination cancels itself). Indigo is the single assigned accent, so the
 *  focus outline carries it through every interactive element, including inside open menus and
 *  the command palette — states the automated accessibility gate does not reach. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

export function Card({
  children,
  className = "",
  as = "div",
  ariaLabelledBy,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  ariaLabelledBy?: string;
  id?: string;
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
    <div id={id} className={cardClassName}>
      {children}
    </div>
  );
}

const STATUS_STYLES: Record<VendorStatus, { icon: typeof CircleCheck; label: string; short: string; text: string; soft: string }> = {
  stable: { icon: CircleCheck, label: "Stable", short: "OK", text: "text-emerald-700", soft: "bg-emerald-50" },
  "at-risk": { icon: AlertTriangle, label: "At risk", short: "Risk", text: "text-rose-700", soft: "bg-rose-50" },
};

export function StatusBadge({ status, abbreviated = false, className = "" }: { status: VendorStatus; abbreviated?: boolean; className?: string }) {
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
 * (positive -> up, negative -> down) and is never flipped — every call site on this route uses
 * this exact component for every delta, so the arrow's meaning (direction of change) can never
 * disagree with itself anywhere on the page. Whether that direction is *good* is a separate
 * question answered by `invertGoodness` (e.g. rising renewal risk is a positive number but a bad
 * outcome): color carries judgment, the arrow only ever reports which way the number moved.
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
  const tone = isGood ? "text-emerald-700" : "text-rose-700";
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
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-medium text-[11px] text-indigo-700 ${className}`}
    >
      {initials}
    </span>
  );
}

export function ProgressBar({
  pct,
  className = "",
  trackClassName = "bg-zinc-100",
  fillClassName = "bg-indigo-600",
  ariaLabel,
}: {
  pct: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  ariaLabel?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full ${fillClassName} motion-safe:transition-[width] motion-safe:duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** Small deterministic trend line: a plain linear map from fixed values to SVG points, no trig,
 *  no randomness. It is always paired with the same two endpoint numbers printed as real text
 *  right next to it, so the line is never the only way to read the trend. */
export function Sparkline({ values, className = "", stroke = "stroke-indigo-600" }: { values: number[]; className?: string; stroke?: string }) {
  const w = 120;
  const h = 32;
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
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-8 w-[120px] ${className}`} aria-hidden="true">
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
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-white text-indigo-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
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
    <div role="tablist" aria-label={ariaLabel} className="inline-flex gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.value}`}
            aria-selected={active}
            aria-controls={`${idBase}-panel-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-2.5 py-1.5 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-indigo-600 text-zinc-900" : "border-transparent text-zinc-600 hover:text-zinc-900"
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
        } ${active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
      >
        {align === "right" ? null : <span>{label}</span>}
        <SortIcon active={active} dir={dir} />
        {align === "right" ? <span>{label}</span> : null}
      </button>
    </th>
  );
}
