import type { ReactNode } from "react";

/** Single accent for the whole page: Tailwind's `green` scale (green-600 ≈ #16A34A), never teal/emerald.
 * Explicit ring color (not bare `ring-2`) so Tailwind v4 actually paints it — a transparent default
 * ring color is a known dead idiom in this stack. `outline-none` only suppresses the native outline;
 * it never races a `focus-visible:outline-*` here because this page uses `ring`, not `outline`, for focus. */
export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function Card({
  children,
  className = "",
  colSpan = "",
  rowSpan = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`min-w-0 flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm ${colSpan} ${rowSpan} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
  description,
}: {
  title: string;
  action?: ReactNode;
  description?: string;
}) {
  return (
    <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-zinc-900">{title}</h2>
        {description && <p className="mt-0.5 truncate text-xs text-zinc-500">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

type Tone = "green" | "amber" | "red" | "zinc";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  zinc: "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200",
};

export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  "aria-label": string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex flex-shrink-0 rounded-lg bg-zinc-100 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`h-7 rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 ease-out ${FOCUS_RING} ${
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

/** Tiny deterministic sparkline. Coordinates are plain linear interpolation (no trig), still
 * rounded to 2 decimals to keep SVG markup tidy and match the project's coordinate-rounding rule. */
export function Sparkline({ values, width = 120, height = 32, tone = "zinc" }: { values: number[]; width?: number; height?: number; tone?: "zinc" | "green" }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = Math.round(i * step * 100) / 100;
      const y = Math.round((height - ((v - min) / range) * height) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = tone === "green" ? "#16a34a" : "#71717a";
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`Trend sparkline, ${values.length} points, from ${min} to ${max}`}
      className="overflow-visible"
    >
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function formatMs(n: number): string {
  return `${n.toFixed(0)}ms`;
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
