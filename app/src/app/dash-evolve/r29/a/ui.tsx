"use client";

import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { percentFmt } from "./data";

/** Explicit, directly-specified focus treatment — never relies on ring utilities alone. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 focus-visible:rounded-md";
export const FOCUS_RING_FULL =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 focus-visible:rounded-full";

export function Card({
  children,
  className = "",
  padded = true,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "div" | "section";
}) {
  return (
    <As className={`rounded-xl border border-white/10 bg-zinc-900 shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </As>
  );
}

export function SectionLabel({
  children,
  className = "",
  as: As = "p",
}: {
  children: ReactNode;
  className?: string;
  /** Set to "h2" for a card that is a genuine named region of the page (keeps identical styling). */
  as?: "p" | "h2";
}) {
  return <As className={`text-[11px] font-semibold uppercase tracking-wide text-zinc-400 ${className}`}>{children}</As>;
}

export function Badge({
  tone,
  icon: Icon,
  children,
}: {
  tone: "emerald" | "amber" | "teal" | "zinc" | "indigo" | "rose";
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const toneClasses: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/30",
    teal: "bg-teal-500/15 text-teal-400 ring-1 ring-inset ring-teal-500/30",
    zinc: "bg-zinc-500/15 text-zinc-400 ring-1 ring-inset ring-zinc-500/30",
    indigo: "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30",
    rose: "bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />}
      {children}
    </span>
  );
}

export function ChangeReadout({ pct, className = "" }: { pct: number; className?: string }) {
  const dir = pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat";
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const tone = dir === "up" ? "text-emerald-400" : dir === "down" ? "text-rose-400" : "text-zinc-400";
  return (
    <span className={`inline-flex items-center gap-1 font-medium tabular-nums ${tone} ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden={true} />
      {percentFmt.format(pct / 100)}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  className = "",
  tone = "indigo",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "indigo" | "emerald";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const barTone = tone === "indigo" ? "bg-indigo-500" : "bg-emerald-500";
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className={`h-full rounded-full ${barTone} motion-safe:transition-[width] motion-safe:duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-zinc-200"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
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
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`h-full rounded-md px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            value === opt.value ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export interface TabOption {
  value: string;
  label: string;
}

export function Tabs({
  options,
  value,
  onChange,
  label,
  idPrefix,
}: {
  options: TabOption[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  /** When set, wires each tab's id + aria-controls to a single panel with id `${idPrefix}-panel`. */
  idPrefix?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex items-center gap-1 border-b border-white/10">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${opt.value}` : undefined}
            aria-controls={idPrefix ? `${idPrefix}-panel` : undefined}
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {opt.label}
            {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-indigo-400" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

export function Sparkline({ values, tone }: { values: number[]; tone: "emerald" | "rose" | "zinc" }) {
  if (values.length < 2) return null;
  const w = 64;
  const h = 22;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = Math.round((i / (values.length - 1)) * w * 100) / 100;
      const y = Math.round((h - ((v - min) / span) * h) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  const strokeClass = tone === "emerald" ? "stroke-emerald-400" : tone === "rose" ? "stroke-rose-400" : "stroke-zinc-400";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0 overflow-visible">
      <polyline points={points} fill="none" className={strokeClass} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
