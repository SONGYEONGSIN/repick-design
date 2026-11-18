"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { FlagStatus } from "./data";
import { STATUS_LABEL } from "./data";

// Shared component system for Vernier — white/zinc-50 light surfaces, a single AA-corrected lime
// accent. Tailwind `lime-600` on white measures under 3:1 for text, so every *text* usage below
// (active nav pill, primary button label, link-style buttons) is `lime-700` (passes AA); `lime-600`
// is kept only for progress-bar fills and the focus ring, where text contrast doesn't apply.
//
// FOCUS RING — a bare `outline-none` with a separate `focus-visible:outline-*` can read as "no
// focus style" to a quick scan, and in this Tailwind v4 setup `ring-2`/`ring-offset-*` sometimes
// paints fully transparent. This sets width only behind `focus-visible` and leaves color/offset
// unconditional (harmless at zero width outside focus-visible), so it always actually paints.
export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-lime-700";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Headline/wordmark type only — the one allow-listed display face for this route. Never applied
 *  to body copy, table/caption text, or anything that could carry Korean. */
export const DISPLAY_FACE = { fontFamily: "var(--font-display-mono)" };

export function Card({
  children,
  className = "",
  padded = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
}) {
  return (
    <div id={id} className={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500 ${className}`}>
      {children}
    </span>
  );
}

type BadgeTone = "neutral" | "success" | "muted" | "warn";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "border border-zinc-200 bg-zinc-100 text-zinc-600",
  success: "border border-lime-200 bg-lime-50 text-lime-700",
  warn: "border border-amber-200 bg-amber-50 text-amber-700",
  muted: "border border-zinc-200 bg-zinc-50 text-zinc-600",
};

export function Badge({ tone = "neutral", icon: Icon, children }: { tone?: BadgeTone; icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]}`}>
      {Icon ? <Icon className="h-3 w-3 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

function statusTone(status: FlagStatus): BadgeTone {
  if (status === "active") return "success";
  if (status === "paused") return "warn";
  return "muted";
}

export function StatusBadge({ status }: { status: FlagStatus }) {
  return <Badge tone={statusTone(status)}>{STATUS_LABEL[status]}</Badge>;
}

export function IconButton({
  children,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; "aria-label": string }) {
  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg bg-lime-700 px-4 text-sm font-medium text-white transition-colors hover:bg-lime-800 active:bg-lime-900 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex h-11 min-w-0 shrink-0 items-center rounded-lg border border-zinc-200 bg-zinc-100 p-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`h-9 min-w-0 shrink-0 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
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

export function Progress({ value, label, className = "" }: { value: number; label: string; className?: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-zinc-100 ${className}`}
    >
      <div className="h-full rounded-full bg-lime-600" style={{ width: `${(pct * 100).toFixed(1)}%` }} />
    </div>
  );
}

/** Small initials avatar for table/list/owner cells. No photo is fetched for flag owners, so no
 *  `next/image` is needed here. */
export function InitialsAvatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ height: size, width: size }}
      className="flex shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-medium text-zinc-600"
    >
      {initials}
    </span>
  );
}

/**
 * Deterministic polyline sparkline. All plotted coordinates are rounded to 2 decimal places.
 * Carries its own `role="img"` + `aria-label` summarizing the trend in words — there is no
 * per-point tooltip; a single shared caption lives in the parent (Hero / FlagDetailPanel), not one
 * floating label per data point.
 */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  strokeClassName = "stroke-lime-600",
  ariaLabel,
}: {
  data: number[];
  width?: number;
  height?: number;
  strokeClassName?: string;
  ariaLabel: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const points = data
    .map((v, i) => {
      const x = Number((i * stepX).toFixed(2));
      const y = Number((height - ((v - min) / range) * height).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={ariaLabel} className="shrink-0 overflow-visible">
      <polyline points={points} fill="none" strokeWidth={1.75} className={strokeClassName} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
