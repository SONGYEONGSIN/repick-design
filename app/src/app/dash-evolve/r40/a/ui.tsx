"use client";

import type { ReactNode } from "react";
import { AlertOctagon, AlertTriangle, CircleCheck, Wrench } from "lucide-react";
import type { RegionStatus } from "./data";
import { STATUS_LABEL, STATUS_WORD } from "./data";

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

export const STATUS_STYLES: Record<
  RegionStatus,
  { icon: typeof AlertOctagon; text: string; soft: string; dot: string }
> = {
  healthy: { icon: CircleCheck, text: "text-green-400", soft: "bg-green-500/10", dot: "bg-green-400" },
  degraded: { icon: AlertTriangle, text: "text-amber-400", soft: "bg-amber-500/10", dot: "bg-amber-400" },
  critical: { icon: AlertOctagon, text: "text-red-400", soft: "bg-red-500/10", dot: "bg-red-400" },
  maintenance: { icon: Wrench, text: "text-sky-400", soft: "bg-sky-500/10", dot: "bg-sky-400" },
};

export function Card({
  children,
  className = "",
  id,
  "aria-labelledby": ariaLabelledBy,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  as?: "div" | "section";
}) {
  const cardClassName = `rounded-xl border border-white/10 bg-zinc-900 ${className}`;
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

export function StatusBadge({
  status,
  className = "",
  abbreviated = false,
}: {
  status: RegionStatus;
  className?: string;
  abbreviated?: boolean;
}) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${s.soft} ${s.text} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{abbreviated ? STATUS_LABEL[status] : STATUS_WORD[status]}</span>
    </span>
  );
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-[11px] text-zinc-50 ${className}`}
    >
      {initials}
    </span>
  );
}

export function ProgressBar({ pct, className = "" }: { pct: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className="h-full rounded-full bg-green-500 motion-safe:transition-[width] motion-safe:duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** Small deterministic trend line: linear mapping from data values to SVG points, no trig involved. */
export function Sparkline({
  values,
  className = "",
  stroke = "stroke-green-400",
}: {
  values: number[];
  className?: string;
  stroke?: string;
}) {
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
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`h-6 w-[72px] ${className}`}
      aria-hidden="true"
    >
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
              active ? "bg-green-500/15 text-green-400" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
