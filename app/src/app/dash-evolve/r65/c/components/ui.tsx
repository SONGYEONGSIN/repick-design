"use client";

import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

// Shared component system for Fulcrum — zinc-950/900 dark surface, single lime accent.
// Contrast note: lime-400/500/600 read as non-text fills only (bars, active rails, chart
// strokes), where the 3:1 non-text floor applies. Any lime TEXT uses lime-300 — measured at
// roughly 13:1 against zinc-950 and 11:1 against zinc-900, comfortably clearing the 4.5:1 body
// floor even though lime is a very bright hue. Secondary/caption text never drops below
// zinc-400 (also ~8:1 on zinc-950), and nothing that carries visible text sits under an
// ancestor `opacity-*` utility — "below target" / "over target" rows are distinguished by
// explicit color + icon + text, never by dimming.

export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-lime-300";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-w-0 rounded-2xl border border-white/10 bg-zinc-900 ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5 sm:px-5">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-medium text-zinc-100">{title}</h2>
        {subtitle ? <p className="mt-0.5 truncate text-xs text-zinc-400">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
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
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex min-w-0 shrink-0 items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-950 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "bg-lime-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SingleSelectChips<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex min-w-0 flex-wrap items-center gap-1.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "border-lime-300/40 bg-lime-400/15 text-lime-300" : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const ROLE_STATUS_TONE: Record<string, string> = {
  Sourcing: "bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/25",
  Interviewing: "bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-500/25",
  "Offer Extended": "bg-lime-400/10 text-lime-300 ring-1 ring-inset ring-lime-400/25",
  Filled: "bg-zinc-500/10 text-zinc-300 ring-1 ring-inset ring-white/10",
  Withdrawn: "bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-500/25",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${ROLE_STATUS_TONE[status] ?? "bg-white/5 text-zinc-300"}`}>
      {status}
    </span>
  );
}

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

export function Dropdown<T extends string>({
  label,
  ariaLabel,
  value,
  options,
  onChange,
  open,
  onOpenChange,
}: {
  label: string;
  ariaLabel: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (v: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const current = options.find((o) => o.value === value)?.label ?? label;
  return (
    <div className="relative min-w-0 shrink-0">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-9 min-w-0 max-w-[12rem] items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-950 px-2.5 text-left text-xs font-medium text-zinc-300 hover:border-white/20 sm:max-w-[16rem] ${FOCUS_RING}`}
      >
        <span className="shrink-0 text-zinc-400">{label}:</span>
        <span className="min-w-0 flex-1 truncate">{current}</span>
      </button>
      {open ? (
        <>
          <button type="button" tabIndex={-1} aria-label={`Close ${ariaLabel} menu`} onClick={() => onOpenChange(false)} className="fixed inset-0 z-10 cursor-default" />
          <ul role="listbox" aria-label={ariaLabel} className="absolute left-0 top-full z-20 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-2xl">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange(opt.value);
                    onOpenChange(false);
                  }}
                  className={`flex w-full min-w-0 items-center gap-2 px-3 py-1.5 text-left text-xs ${FOCUS_RING} ${
                    opt.value === value ? "bg-lime-400/10 text-lime-300" : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="min-w-0 truncate">{opt.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

export function InitialsAvatar({ initials, name, size = 28 }: { initials: string; name: string; size?: number }) {
  return (
    <span
      role="img"
      aria-label={name}
      style={{ height: size, width: size, fontSize: Math.max(10, Math.round(size * 0.38)) }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-lime-400/15 font-medium text-lime-300"
    >
      {initials}
    </span>
  );
}

/** Decorative trend line. `aria-hidden` because the caller always prints the real value and delta
 * as text beside it — the line never carries a number that isn't also written out. */
export function Sparkline({ values, width = 108, height = 30, tone = "text-lime-300" }: {
  values: number[];
  width?: number;
  height?: number;
  tone?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const coords = values.map((v, i) => {
    const x = Math.round(i * stepX * 100) / 100;
    const y = Math.round((height - 3 - ((v - min) / range) * (height - 6)) * 100) / 100;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className={`${tone} max-w-full shrink-0`}>
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function TrendBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value > 0;
  const down = value < 0;
  const Icon = up ? TrendingUp : down ? TrendingDown : TrendingUp;
  const tone = up ? "text-lime-300" : down ? "text-rose-300" : "text-zinc-400";
  const sign = up ? "+" : down ? "−" : "";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${tone}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {sign}
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
}
