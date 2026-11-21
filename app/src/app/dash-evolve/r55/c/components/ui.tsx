"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from "lucide-react";

/** Shared focus style — always a visible, colored outline, never a bare ring and never
 * `outline-none` paired with a later `focus-visible:outline` on the same element. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * One trend component used at every call site that shows improvement vs. decline — ticker,
 * row badges, drawer, command palette — so the up/down icon orientation is decided exactly once
 * (ArrowUpRight = improvement, ArrowDownRight = decline) instead of re-implemented per call site,
 * which is how a reused directional icon ends up backwards in one of its uses.
 */
export function TrendIndicator({
  delta,
  className = "",
  srPrefix,
}: {
  delta: number;
  className?: string;
  srPrefix?: string;
}) {
  const flat = Math.abs(delta) < 0.05;
  const up = delta > 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const color = flat ? "text-zinc-600" : up ? "text-lime-700" : "text-rose-600";
  const sign = delta > 0 ? "+" : "";
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${color} ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        {sign}
        {delta.toFixed(1)}
      </span>
      <span className="sr-only">
        {srPrefix ? `${srPrefix} ` : ""}
        {flat ? "unchanged" : up ? "improved" : "declined"} by {Math.abs(delta).toFixed(1)} points
      </span>
    </span>
  );
}

export function FlaggedBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Flagged
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
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-0.5"
    >
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

export function Switch({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-xs font-medium text-zinc-600 select-none">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
          checked ? "bg-lime-600" : "bg-zinc-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-150 motion-reduce:transition-none ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
          aria-hidden="true"
        />
      </button>
      {label}
    </label>
  );
}
