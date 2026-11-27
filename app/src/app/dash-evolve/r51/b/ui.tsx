"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, OctagonAlert, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { Status } from "./data";
import { STATUS_LABEL } from "./data";

/**
 * Shared primitives for Clearbid.
 *
 * Font-weight budget (exactly 3, held across every file in this folder):
 *   font-normal (400)   — body copy, table/feed cells, captions, data values
 *   font-medium (500)   — labels, nav items, buttons, tabs, uppercase eyebrows
 *   font-semibold (600) — headings, the wordmark, card titles, the chart's headline numbers
 * font-light / font-bold / font-extrabold are never used anywhere in this folder, and every
 * element that a browser default-styles as bold (h1–h3, th) gets one of the three above explicitly.
 *
 * Focus ring: a plain `outline` utility on `:focus-visible` only — never `ring`+`ring-offset`
 * (renders transparent on this Tailwind v4 stack) and never `outline-none` anywhere.
 */
export const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

export function Card({
  children,
  className = "",
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  "aria-labelledby"?: string;
}) {
  const Comp = as;
  return (
    <Comp className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`} {...rest}>
      {children}
    </Comp>
  );
}

const STATUS_STYLE: Record<Status, { text: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  healthy: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2 },
  degraded: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle },
  "at-risk": { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: OctagonAlert },
};

export function StatusBadge({ status, className = "" }: { status: Status; className?: string }) {
  const m = STATUS_STYLE[status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${m.bg} ${m.text} ${m.border} ${className}`}>
      <Icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ProgressBar({
  value,
  label,
  barClassName = "bg-sky-600",
  trackClassName = "bg-zinc-100",
}: {
  value: number;
  label: string;
  barClassName?: string;
  trackClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${barClassName} motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out`}
        style={{ width: `${pct}%` }}
      />
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
    <div role="group" aria-label={ariaLabel} className="inline-flex h-8 flex-shrink-0 items-center rounded-lg bg-zinc-100 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-7 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition-colors duration-150 ease-out ${FOCUS_RING} ${
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

/** `idBase` names the tab/panel id pair (`${idBase}-tab-${value}` / `${idBase}-panel-${value}`) —
 *  pass the matching panel ids to `role="tabpanel"`+`aria-labelledby` on whatever you render below. */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  idBase,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  idBase: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-shrink-0 gap-4 border-b border-zinc-200 px-4">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            id={`${idBase}-tab-${opt.value}`}
            aria-selected={active}
            aria-controls={`${idBase}-panel-${opt.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={`-mb-px border-b-2 px-0.5 py-2.5 text-xs font-medium transition-colors duration-150 ease-out ${FOCUS_RING} ${
              active ? "border-sky-600 text-zinc-900" : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortHeader({
  active,
  direction,
  onClick,
  children,
  align = "left",
}: {
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sort by ${children}, ${active ? (direction === "asc" ? "ascending" : "descending") : "not sorted"}`}
      className={`group inline-flex w-full items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600 transition-colors duration-150 ease-out hover:text-zinc-900 ${FOCUS_RING} ${
        align === "right" ? "flex-row-reverse justify-end" : ""
      } ${active ? "text-zinc-900" : ""}`}
    >
      <span className="truncate">{children}</span>
      <Icon className={`h-3 w-3 flex-shrink-0 ${active ? "text-sky-700" : "text-zinc-400 group-hover:text-zinc-500"}`} aria-hidden="true" />
    </button>
  );
}

/** Closes an open popover/menu/drawer on outside pointerdown or Escape. */
export function useOutsideClose<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);
  return ref;
}

/** A tiny inline trend line — decoration alongside always-visible numeric text, never the only
 *  carrier of a value. Deterministic SVG path from already-rounded data, no external chart lib. */
export function Sparkline({
  values,
  width = 72,
  height = 24,
  className = "text-sky-600",
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const points = values
    .map((v, i) => {
      const x = values.length > 1 ? (i / (values.length - 1)) * width : width / 2;
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true" className={className}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
