"use client";

import type { ReactNode } from "react";
import type { ReplStatus, Priority } from "./data";

// A pure outline (no ring/ring-offset) so it always paints — Tailwind v4 can render ring+offset
// fully transparent depending on stacking context, outline cannot.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700";

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-sm font-medium text-zinc-900 ${className}`}>{children}</h2>;
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{children}</p>;
}

type Tone = "neutral" | "info" | "warning" | "danger" | "success";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-zinc-600",
  info: "bg-sky-50 text-sky-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  success: "bg-green-50 text-green-700",
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${TONE_CLASS[tone]}`}>
      {children}
    </span>
  );
}

const STATUS_TONE: Record<ReplStatus, Tone> = {
  pending: "neutral",
  "in-transit": "info",
  overdue: "danger",
};

export function StatusBadge({ status, label }: { status: ReplStatus; label: string }) {
  return <Badge tone={STATUS_TONE[status]}>{label}</Badge>;
}

const PRIORITY_TONE: Record<Priority, Tone> = {
  low: "neutral",
  medium: "warning",
  high: "danger",
};

export function PriorityBadge({ priority, label }: { priority: Priority; label: string }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{label}</Badge>;
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
    <div role="group" aria-label={label} className="inline-flex min-w-0 flex-shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS} ${
              active ? "bg-green-700 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-100"
      >
        <div
          className="h-full rounded-full bg-green-600 motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${pct.toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}

// A small inline trend line. Decorative only — the figures it traces are always stated as text
// elsewhere, so this never carries information on its own. Coordinates are plain linear
// interpolation of a fixed input array, rounded to 2 decimals for deterministic markup.
export function Sparkline({ values, width = 72, height = 24 }: { values: number[]; width?: number; height?: number }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const points = values
    .map((v, i) => {
      const x = Math.round(i * stepX * 100) / 100;
      const y = Math.round((height - ((v - min) / span) * height) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      className="flex-shrink-0 overflow-visible text-green-600"
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
