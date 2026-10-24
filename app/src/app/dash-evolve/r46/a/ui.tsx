"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Minus } from "lucide-react";

/** The one verified-visible focus pattern used across this route: `ring-2 ring-offset-*` renders
 *  fully transparent under this app's Tailwind v4 setup, and this utility must never follow
 *  `outline-none` (that combination cancels itself). Sky is the single assigned accent, so the
 *  focus outline carries it through every interactive element — including inside open menus, the
 *  command palette, and the integration-name buttons layered over the bump chart. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

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
  const cardClassName = `rounded-xl border border-white/10 bg-zinc-900 shadow-sm ${className}`;
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

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400/10 font-medium text-[11px] text-sky-300 ${className}`}
    >
      {initials}
    </span>
  );
}

export function CategoryTag({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex min-w-0 items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-normal text-[11px] text-zinc-400 ${className}`}>
      <span className="truncate">{label}</span>
    </span>
  );
}

/**
 * A signed rank delta. The arrow direction always means the same thing everywhere it appears on
 * this page (legend-free chart labels, table Δ column, hero stat chip): "up" = the integration
 * moved toward rank 1 (improved standing), "down" = it moved away from rank 1. Color carries the
 * good/bad judgment; the arrow only ever reports which way the rank number moved, and a positive
 * `delta` always means an improvement because callers pass `rankAt(from) - rankAt(to)`.
 */
export function RankDelta({ delta, className = "" }: { delta: number; className?: string }) {
  if (delta === 0) {
    return (
      <span className={`inline-flex items-center gap-1 font-medium text-xs tabular-nums text-zinc-400 ${className}`}>
        <Minus className="h-3 w-3" aria-hidden="true" />
        No change
      </span>
    );
  }
  const improved = delta > 0;
  const tone = improved ? "text-emerald-400" : "text-rose-400";
  const noun = Math.abs(delta) === 1 ? "spot" : "spots";
  return (
    <span className={`inline-flex items-center gap-1 font-medium text-xs tabular-nums ${tone} ${className}`}>
      {improved ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
      {improved ? "+" : ""}
      {delta} {noun}
    </span>
  );
}

/** Small deterministic trend line: a plain linear map from fixed values to SVG points, no trig,
 *  no randomness. It never appears without the same series also being readable as exact numbers
 *  elsewhere on the page (the fallback table), so it is never the only way to read a trend. */
export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
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
      <polyline points={points} fill="none" className="stroke-sky-400" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
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
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-sky-400/15 text-sky-300" : "text-zinc-400 hover:text-zinc-50"
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
            aria-controls={`${idBase}-panel-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-2.5 py-1.5 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-sky-400 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-50"
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
  className = "",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onSort: () => void;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={`px-2 py-2 ${className}`}>
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
