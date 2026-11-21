"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

// Shared component system for Jobline — white/zinc-50 light surfaces, a single AA-corrected green
// accent. `green-600` on white measures ~3.3:1 (fails AA for text), so every *text* or
// solid-fill-with-text usage below is `green-700` (~5:1) instead; `green-600` is kept only for the
// focus ring, the bullet-chart fill and other non-text accents where a 3:1 component-contrast floor
// applies instead of the 4.5:1 text floor.
//
// FOCUS RING — a bare `outline-none` followed by `focus-visible:outline-*` can self-cancel, and
// `ring-2`/`ring-offset-*` sometimes resolve fully transparent in this Tailwind v4 setup. This sets
// width only behind `focus-visible` and leaves color/offset unconditional (harmless at zero width
// outside focus-visible), which always paints.
export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-green-700";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Headline/wordmark/large-numeral type only — the one allow-listed display face for this route.
 *  Never applied to body copy, table/caption text, or Korean. Set at `font-semibold` (600) only, so
 *  it never adds a 4th rendered weight beyond the route's three (400 / 500 / 600). */
export const DISPLAY_FACE = { fontFamily: "var(--font-display-wide)" };

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
    <div className={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
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

// Every tone below is either the one brand accent (green, for "success"/"done" states) or a plain
// zinc neutral — urgency and "in progress" are read through weight/shape (a solid dark fill, a
// warning glyph), never through a second saturated hue, per the single-accent rule.
type BadgeTone = "neutral" | "success" | "strong" | "muted";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "border border-zinc-200 bg-zinc-100 text-zinc-600",
  success: "border border-green-200 bg-green-50 text-green-800",
  strong: "border border-zinc-900 bg-zinc-900 text-white",
  muted: "border border-zinc-200 bg-zinc-50 text-zinc-600 border-dashed",
};

export function Badge({
  tone = "neutral",
  icon: Icon,
  children,
}: {
  tone?: BadgeTone;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]}`}>
      {Icon ? <Icon className="h-3 w-3 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
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

export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }
>(function PrimaryButton({ children, className = "", ...rest }, ref) {
  return (
    <button
      ref={ref}
      {...rest}
      className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg bg-green-700 px-4 text-sm font-medium text-white transition-colors hover:bg-green-800 active:bg-green-900 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
});

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

export function Progress({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="min-w-0">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-zinc-100"
      >
        <div className="h-full rounded-full bg-green-600" style={{ width: `${(pct * 100).toFixed(1)}%` }} />
      </div>
    </div>
  );
}

/** Tab strip — real ARIA tabs (`role="tablist"`/`"tab"`), roving `tabIndex`. Pair with `TabPanel`,
 *  which owns the matching `role="tabpanel"` and visibility. `idPrefix` keeps ids unique if more
 *  than one tab strip is ever mounted on the same page. */
export function TabList<T extends string>({
  label,
  idPrefix,
  tabs,
  value,
  onChange,
}: {
  label: string;
  idPrefix: string;
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex min-w-0 items-center gap-1 border-b border-zinc-200">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.value}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${t.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={`-mb-px h-9 min-w-0 shrink-0 whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "border-green-700 text-green-700" : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  idPrefix,
  value,
  activeValue,
  children,
}: {
  idPrefix: string;
  value: string;
  activeValue: string;
  children: ReactNode;
}) {
  const active = value === activeValue;
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${value}`}
      aria-labelledby={`${idPrefix}-tab-${value}`}
      hidden={!active}
      className="min-w-0"
    >
      {active ? children : null}
    </div>
  );
}

/** Small inline sparkline — a static, non-interactive trend line (the bullet-chart grid is this
 *  route's one interactive, always-labeled dataviz; this is a lightweight supporting glance).
 *  Geometry is computed fresh from `values`, rounded to 2 decimals, never hand-typed. */
export function Sparkline({
  values,
  width = 72,
  height = 28,
  label,
}: {
  values: number[];
  width?: number;
  height?: number;
  label: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const pad = 2;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const points = values.map((v, i) => ({
    x: round2(pad + (i / (values.length - 1)) * plotW),
    y: round2(pad + ((max - v) / span) * plotH),
  }));
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="shrink-0" style={{ width, height }} role="img" aria-label={label}>
      <path d={d} fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="2" fill="#15803d" />
    </svg>
  );
}

/** Small initials avatar for board/list/table cells — no photo, so no `next/image` is needed here.
 *  The one place this route shows a real photo is the signed-in dispatcher's avatar in the topbar
 *  and sidebar footer, which uses `PhotoAvatar` below. */
export function InitialsAvatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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

export function PhotoAvatar({ name, photoId, size = 28 }: { name: string; photoId: string; size?: number }) {
  return (
    <Image
      src={`https://images.unsplash.com/photo-${photoId}?w=${size * 2}&h=${size * 2}&fit=crop&crop=faces&q=80`}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-zinc-200 object-cover"
    />
  );
}
