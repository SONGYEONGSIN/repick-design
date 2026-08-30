"use client";

import type { ReactNode } from "react";
import { round2 } from "./data";

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <As className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {children}
    </As>
  );
}

export function Badge({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
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
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex h-11 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={[
              "h-full rounded-md px-3 text-sm font-medium transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100",
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
            ].join(" ")}
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
  ariaLabel,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-5 border-b border-zinc-200">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={[
              "relative -mb-px flex h-11 items-center gap-1.5 border-b-2 px-0.5 text-sm font-medium transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
              active ? "border-teal-700 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800",
            ].join(" ")}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={[
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                  active ? "bg-teal-50 text-teal-700" : "bg-zinc-100 text-zinc-600",
                ].join(" ")}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
    >
      <div className={`h-full rounded-full ${className}`} style={{ width: `${round2(pct)}%` }} />
    </div>
  );
}

/** Deterministic sparkline: plain SVG polyline from a fixed numeric series. No randomness, no
 *  animation loop — coordinates are computed once from static data and rounded to 2dp. */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  strokeClassName = "stroke-zinc-500",
  dotClassName = "fill-zinc-500",
}: {
  data: number[];
  width?: number;
  height?: number;
  strokeClassName?: string;
  dotClassName?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = round2(i * stepX);
      const y = round2(height - ((v - min) / span) * (height - 4) - 2);
      return `${x},${y}`;
    })
    .join(" ");
  const lastX = round2((data.length - 1) * stepX);
  const lastY = round2(height - ((data[data.length - 1] - min) / span) * (height - 4) - 2);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" className="overflow-visible">
      <polyline points={points} fill="none" strokeWidth={1.75} className={strokeClassName} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.25} className={dotClassName} />
    </svg>
  );
}

export function KeyCap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-zinc-300 bg-white px-1 font-mono text-[10px] font-medium text-zinc-500">
      {children}
    </kbd>
  );
}
