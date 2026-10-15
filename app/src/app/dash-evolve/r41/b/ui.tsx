"use client";

import type { ReactNode } from "react";

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-zinc-900 p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="font-semibold text-sm text-zinc-50">{title}</h2>
      {subtitle ? <p className="mt-0.5 font-normal text-xs text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "good" | "warning";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-rose-500/15 text-rose-300"
      : tone === "good"
        ? "bg-emerald-500/15 text-emerald-300"
        : tone === "warning"
          ? "bg-amber-500/15 text-amber-300"
          : "bg-white/10 text-zinc-300";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-950 p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`h-8 rounded-md px-3 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {option.label}
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
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-4 border-b border-white/10">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`-mb-px flex h-9 items-center border-b-2 px-0.5 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-rose-400 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProgressBar({
  percent,
  tone = "accent",
  label,
}: {
  percent: number;
  tone?: "accent" | "neutral";
  label: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const fillClass = tone === "accent" ? "bg-rose-500" : "bg-zinc-400";
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div
        className={`h-full rounded-full ${fillClass} motion-safe:transition-[width]`}
        style={{ width: `${round2Width(clamped)}%` }}
      />
    </div>
  );
}

function round2Width(value: number): number {
  return Math.round(value * 100) / 100;
}

export function Sparkline({
  values,
  color = "#fb7185",
  width = 112,
  height = 32,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = round2(i * stepX);
    const y = round2(height - ((v - min) / span) * (height - 4) - 2);
    return `${x},${y}`;
  });
  const last = points[points.length - 1].split(",").map(Number);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
