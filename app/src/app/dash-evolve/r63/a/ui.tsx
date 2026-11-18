"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

// Shared component system for Stagebook — white/zinc-50 light surfaces, a single AA-corrected
// orange accent. `orange-600` on white measures 3.56:1 (fails AA for text), so every *text* or
// solid-fill-with-text usage below is `orange-700` (5.18:1) instead; `orange-600` is kept only for
// the focus ring and for very small non-text accents where text contrast doesn't apply.
//
// FOCUS RING — a bare `outline-none` followed by `focus-visible:outline-*` can self-cancel, and
// `ring-2`/`ring-offset-*` sometimes resolve fully transparent in this Tailwind v4 setup. This sets
// width only behind `focus-visible` and leaves color/offset unconditional (harmless at zero width
// outside focus-visible), which always paints.
export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-orange-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Headline/wordmark type only — the one allow-listed display face for this route. Never applied
 *  to body copy or table/caption text. */
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

type BadgeTone = "neutral" | "success" | "accent" | "muted";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "border border-zinc-200 bg-zinc-100 text-zinc-600",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  accent: "border border-orange-200 bg-orange-50 text-orange-700",
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

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg bg-orange-700 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-800 active:bg-orange-900 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
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
        <div className="h-full rounded-full bg-orange-600" style={{ width: `${(pct * 100).toFixed(1)}%` }} />
      </div>
    </div>
  );
}

/** Small initials avatar for table/list rows — no photo, so no `next/image` is needed here. The
 *  one place this route shows a real photo is the account-menu avatar in the topbar, which uses
 *  `PhotoAvatar` below. */
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
