"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";

// Shared component system for Ledgercheck — dark product surface. Text never drops below
// zinc-400 on this canvas (zinc-950/900), per this catalogue's documented dark-contrast floor.
// Exactly three font weights are used anywhere in this candidate: font-normal, font-medium,
// font-semibold. No display face — numbers lean on tabular-nums and scale instead.

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
      className={`rounded-xl border border-white/10 bg-zinc-900 shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "lime" | "amber" | "rose";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/10 text-zinc-300",
    lime: "bg-lime-400/15 text-lime-300",
    amber: "bg-amber-400/15 text-amber-300",
    rose: "bg-rose-400/15 text-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function IconButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none ${className}`}
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
      className={`flex h-11 items-center gap-2 rounded-lg bg-lime-400 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none ${className}`}
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
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex h-11 items-center rounded-lg bg-white/5 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`h-9 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none ${
              active ? "bg-zinc-800 text-zinc-50" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-lime-400/15 text-[11px] font-semibold text-lime-300"
    >
      {initials}
    </span>
  );
}

export function Sparkline({ points, width = 96, height = 28 }: { points: number[]; width?: number; height?: number }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = Number((i * stepX).toFixed(2));
    const y = Number((height - ((p - min) / range) * height).toFixed(2));
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0">
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
