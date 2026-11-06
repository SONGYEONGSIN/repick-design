// Shared, small presentational primitives for the Variance Explorer page.
// Kept framework-free (no chart libraries) — everything here is plain markup
// plus hand-written SVG where a shape is needed.

import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{children}</p>
  );
}

const BADGE_TONES = {
  neutral: "bg-zinc-100 text-zinc-600",
  rose: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
  emerald: "bg-emerald-50 text-emerald-700",
} as const;

export function Badge({
  children,
  tone = "neutral",
  icon,
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

/** A horizontal contribution bar. Decorative only — always paired with the
 *  percentage text it represents, so it never carries information alone. */
export function ContributionBar({
  percent,
  tone = "sky",
}: {
  percent: number;
  tone?: "sky" | "zinc";
}) {
  const fillClass = tone === "sky" ? "bg-sky-600" : "bg-zinc-400";
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <span
      aria-hidden="true"
      className="relative block h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
    >
      <span
        className={`absolute inset-y-0 left-0 rounded-full ${fillClass} motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </span>
  );
}

/** Tiny six-point trend line, fully deterministic coordinates (no trig, no
 *  randomness) rounded to 2 decimal places as required for computed SVG
 *  coordinates. */
export function Sparkline({ points, tone = "zinc" }: { points: readonly number[]; tone?: "zinc" | "rose" }) {
  const width = 72;
  const height = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const stepX = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = Math.round(i * stepX * 100) / 100;
    const y = Math.round((height - ((p - min) / span) * height) * 100) / 100;
    return `${x},${y}`;
  });
  const stroke = tone === "rose" ? "#e11d48" : "#71717a";
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="overflow-visible"
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-100 p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
