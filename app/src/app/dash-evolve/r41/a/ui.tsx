"use client";

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

/** NEVER pair this with `outline-none` — that utility sets an internal outline-style flag that
 *  the focus-visible utilities below never clear, producing a fully invisible focus ring. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

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
  return <Tag className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</Tag>;
}

export function SideBadge({ side }: { side: "buy" | "sell" }) {
  const isBuy = side === "buy";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
        isBuy ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
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
    <span
      className={`inline-flex items-center gap-0.5 font-medium text-xs tabular-nums ${isUp ? "text-emerald-700" : "text-rose-700"}`}
    >
      {isUp ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
      {isUp ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-700">
      {initials}
    </span>
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
    <div role="group" aria-label={ariaLabel} className="inline-flex gap-0.5 rounded-lg bg-zinc-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
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
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="shrink-0" role="img" aria-label={`Trend sparkline, ${up ? "up" : "down"} overall`}>
      <polyline
        points={points}
        fill="none"
        stroke={up ? "var(--color-emerald-600)" : "var(--color-rose-600)"}
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
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  idBase: string;
}) {
  return (
    <div role="tablist" aria-label="Order type" className="inline-flex gap-1 border-b border-zinc-200">
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
            tabIndex={0}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-3 py-2 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-emerald-600 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
