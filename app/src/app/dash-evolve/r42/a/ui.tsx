"use client";

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/** NEVER pair this with `outline-none` — that utility sets an internal outline-style flag that
 *  the focus-visible utilities below never clear, and a bare `ring`/`ring-offset` alone can paint
 *  fully transparent in this setup. This exact pairing is the only verified-visible pattern. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export function Card({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Tag = as;
  return <Tag className={`rounded-xl border border-white/10 bg-zinc-900 ${className}`}>{children}</Tag>;
}

export function SideBadge({ side }: { side: "buy" | "sell" }) {
  const isBuy = side === "buy";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ${
        isBuy ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      }`}
    >
      {isBuy ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      {isBuy ? "Buy" : "Sell"}
    </span>
  );
}

export function ChangeBadge({ value }: { value: number }) {
  const isUp = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-medium text-xs tabular-nums ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
      {isUp ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
      {isUp ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-[11px] text-zinc-50 ${className}`}
    >
      {initials}
    </span>
  );
}

export function ProgressBar({
  pct,
  trackClassName = "bg-white/10",
  fillClassName = "bg-violet-500",
  className = "",
}: {
  pct: number;
  trackClassName?: string;
  fillClassName?: string;
  className?: string;
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

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
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

export function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  const w = 64;
  const h = 22;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = Math.round(((i / (values.length - 1)) * w) * 100) / 100;
      const y = Math.round((h - ((v - min) / range) * h) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="shrink-0" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "var(--color-emerald-400)" : "var(--color-rose-400)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Tabs({
  tabs,
  value,
  onChange,
  idBase,
  ariaLabel,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
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
            tabIndex={0}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-3 py-2 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-violet-400 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
