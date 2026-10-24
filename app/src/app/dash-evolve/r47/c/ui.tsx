"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useId, useRef } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

/** Shared focus style. Never `outline-none` and never ring-only — see dashboard brief. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export function Card({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className = "",
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-5 ${BADGE_TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  size = "sm",
}: {
  initials: string;
  size?: "sm" | "md";
}) {
  const dimension = size === "md" ? "h-9 w-9 text-sm" : "h-7 w-7 text-[11px]";
  return (
    <span
      className={`inline-flex ${dimension} shrink-0 items-center justify-center rounded-full bg-blue-50 font-medium text-blue-700 border border-blue-100`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function Progress({ value, max = 1 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-zinc-100"
    >
      <div
        className="h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${pct.toFixed(2)}%` }}
      />
    </div>
  );
}

export function IconButton({
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS_RING} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 ${FOCUS_RING} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface SegmentedOption {
  value: string;
  label: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + options.length) % options.length;
    const nextValue = options[next].value;
    onChange(nextValue);
    tabRefs.current[nextValue]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center gap-0.5 rounded-full bg-zinc-100 p-1 ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              tabRefs.current[option.value] = node;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition-colors duration-150 ${FOCUS_RING} ${
              selected ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function RankDelta({ delta }: { delta: number }) {
  const id = useId();
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium tabular-nums text-zinc-600">
        <Minus className="h-3 w-3" aria-hidden="true" />
        <span aria-describedby={id}>0</span>
        <span id={id} className="sr-only">
          no change in rank
        </span>
      </span>
    );
  }
  const improved = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${
        improved ? "text-emerald-700" : "text-red-700"
      }`}
    >
      {improved ? (
        <ArrowUp className="h-3 w-3" aria-hidden="true" />
      ) : (
        <ArrowDown className="h-3 w-3" aria-hidden="true" />
      )}
      <span>{Math.abs(delta)}</span>
      <span className="sr-only">{improved ? "places up since last quarter" : "places down since last quarter"}</span>
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{children}</p>
  );
}
