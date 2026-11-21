"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Flame } from "lucide-react";
import type { Priority } from "./data";

/** The only verified-safe focus pattern in this build: outline-2 + outline-offset-2
 *  with an explicit color, never preceded by outline-none, never a bare
 *  ring/ring-offset (renders fully transparent on this repo's Tailwind v4 setup). */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600";

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

export const PRIORITY_META: Record<Priority, { icon: typeof Flame; label: string; text: string; soft: string }> = {
  urgent: { icon: Flame, label: "Urgent", text: "text-rose-700", soft: "bg-rose-50" },
  high: { icon: AlertTriangle, label: "High", text: "text-amber-700", soft: "bg-amber-50" },
  normal: { icon: Clock3, label: "Normal", text: "text-zinc-600", soft: "bg-zinc-100" },
};

export function PriorityBadge({ priority, className = "" }: { priority: Priority; className?: string }) {
  const meta = PRIORITY_META[priority];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function ReviewedBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-xs text-emerald-700 ${className}`}>
      <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
      Reviewed
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
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-rose-600 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-100 font-medium text-zinc-700 ${className}`}>
      {initials}
    </span>
  );
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1 border-b border-zinc-200">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`min-h-9 rounded-t-md px-3 py-2 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-b-2 border-rose-600 text-rose-700" : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, className = "", barClassName = "bg-rose-600" }: { value: number; className?: string; barClassName?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100) / 100}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`h-full rounded-full ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** Deterministic linear map from values to SVG points — coordinates rounded to
 *  2 decimals for consistent SSR/client output. */
export function Sparkline({ values, className = "", stroke = "stroke-rose-600" }: { values: number[]; className?: string; stroke?: string }) {
  const w = 96;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = Math.round((i / (values.length - 1)) * w * 100) / 100;
      const y = Math.round((h - ((v - min) / range) * h) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-7 w-24 ${className}`} aria-hidden="true">
      <polyline points={points} fill="none" className={stroke} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
