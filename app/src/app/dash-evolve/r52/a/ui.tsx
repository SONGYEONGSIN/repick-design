"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";

// Shared component system for Nightshift — consistent radius/border/shadow/padding across every
// surface. Exactly three font weights are used anywhere in this candidate: font-normal (400),
// font-medium (500), font-semibold (600).

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

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "sky" | "amber" | "rose" | "emerald";
  children: ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-600",
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    emerald: "bg-emerald-50 text-emerald-700",
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
      className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none ${className}`}
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
      className={`flex h-11 items-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none ${className}`}
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
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex h-11 items-center rounded-lg bg-zinc-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`h-9 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 motion-reduce:transition-none ${
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

export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-sky-100 text-[11px] font-semibold text-sky-700"
    >
      {initials}
    </span>
  );
}

export function KpiStat({
  label,
  value,
  delta,
  deltaTone = "neutral",
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
}) {
  const toneClass =
    deltaTone === "up" ? "text-emerald-700" : deltaTone === "down" ? "text-rose-700" : "text-zinc-500";
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-[family-name:var(--font-display-wide)] text-2xl font-semibold tabular-nums text-zinc-900">
          {value}
        </span>
        {delta ? <span className={`text-xs font-medium tabular-nums ${toneClass}`}>{delta}</span> : null}
      </div>
    </div>
  );
}
