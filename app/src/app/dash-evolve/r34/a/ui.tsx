"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Shared focus ring. Tailwind v4 renders a bare `ring`/`ring-offset` fully
 * transparent in this setup, and `outline-none` cancels any later
 * `focus-visible:outline-*` via the `--tw-outline-style` variable — so this
 * route never pairs the two. Every focusable element in this folder uses
 * exactly this string and nothing before it.
 */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

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
      className={`rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${
        padded ? "p-4 sm:p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  caption,
  action,
}: {
  title: ReactNode;
  caption?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-zinc-50">{title}</h2>
        {caption ? <p className="mt-0.5 truncate text-xs text-zinc-400">{caption}</p> : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}

type BadgeTone = "neutral" | "violet" | "positive" | "warning";

const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-white/5 text-zinc-300 border-white/10",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  positive: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${BADGE_TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function Progress({ value, tone = "violet" }: { value: number; tone?: "violet" | "neutral" }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10" role="presentation">
      <div
        className={`h-full rounded-full ${tone === "violet" ? "bg-violet-400" : "bg-zinc-400"} motion-safe:transition-[width] motion-safe:duration-300`}
        style={{ width: `${Math.round(clamped * 100) / 100}%` }}
      />
    </div>
  );
}

export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const w = 72;
  const h = 24;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values
    .map((v, i) => {
      const x = Math.round(i * step * 100) / 100;
      const y = Math.round((h - ((v - min) / range) * h) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  const lastX = Math.round((values.length - 1) * step * 100) / 100;
  const lastY = Math.round((h - ((values[values.length - 1] - min) / range) * h) * 100) / 100;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={className}
      role="img"
      aria-label={`Trend sparkline, values ${values.join(", ")}`}
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
    </svg>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  "aria-label": string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={`${FOCUS_RING} rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap motion-safe:transition-colors ${
              active ? "bg-violet-500/20 text-violet-200" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: { id: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  "aria-label": string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-1 border-b border-white/10">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`${FOCUS_RING} flex items-center gap-1.5 px-3 py-2 text-xs font-medium motion-safe:transition-colors ${
              active ? "border-b-2 border-violet-400 text-zinc-50" : "border-b-2 border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
            style={{ marginBottom: "-1px" }}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ src, alt, size = 28 }: { src: string; alt: string; size?: number }) {
  return (
    <span
      className="relative inline-block flex-shrink-0 overflow-hidden rounded-full border border-white/10 bg-zinc-800"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}
