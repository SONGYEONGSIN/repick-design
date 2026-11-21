"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

// Shared component system for Portlane — zinc-950/900 dark surfaces, a single desaturated-green
// brand accent (emerald). Conflict/warning markers use a conventional rose semantic alongside the
// brand accent (icon + text label + dashed border, never rose alone) — the same "one brand accent,
// plus a small conventional status triad" split this catalogue already uses elsewhere.
//
// FOCUS RING — the one safe pattern for this repo's Tailwind v4 setup: a bare `outline-none`
// followed by `focus-visible:outline` cancels the later rule, and `ring-2`/`ring-offset-*` resolve
// transparent here. This sets width only behind `focus-visible` and leaves color/offset
// unconditional (harmless at zero width), so it always paints.
export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-emerald-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Headline/wordmark type only — the one allow-listed display face for this route. Never applied
 *  to body copy, Korean, or table/caption text. */
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
    <div className={`min-w-0 rounded-xl border border-white/10 bg-zinc-900 shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block truncate text-[11px] font-medium uppercase tracking-wide text-zinc-400 ${className}`}>
      {children}
    </span>
  );
}

type BadgeTone = "neutral" | "accent" | "danger";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "border border-white/10 bg-white/[0.04] text-zinc-300",
  accent: "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  danger: "border border-rose-400/30 bg-rose-400/10 text-rose-300",
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
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-50 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
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
      className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-300 active:bg-emerald-500 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
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
    <div role="radiogroup" aria-label={label} className={`inline-flex h-11 min-w-0 shrink-0 items-center rounded-lg border border-white/10 bg-white/[0.03] p-1 ${className}`}>
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
              active ? "bg-emerald-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ name, photoId, size = 28 }: { name: string; photoId: string; size?: number }) {
  return (
    <Image
      src={`https://images.unsplash.com/photo-${photoId}?w=${size * 2}&h=${size * 2}&fit=crop&crop=faces&q=80`}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-white/10 object-cover"
    />
  );
}
