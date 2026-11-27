"use client";

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { AccountStage } from "./data";
import { STAGE_LABEL } from "./data";

/** The one verified-visible focus pattern in this setup: `ring-*` + `ring-offset-*` renders fully
 *  transparent here, and this utility must never be preceded by `outline-none` (that flag cancels
 *  it). Blue is the single assigned accent, so the outline color carries it through focus states. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

export function Card({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Tag = as;
  return <Tag className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</Tag>;
}

const STAGE_TONE: Record<AccountStage, string> = {
  expanding: "bg-emerald-50 text-emerald-700",
  stable: "bg-blue-50 text-blue-700",
  contracting: "bg-amber-50 text-amber-800",
  trialing: "bg-zinc-100 text-zinc-600",
  churned: "bg-rose-50 text-rose-700",
};

export function StageBadge({ stage }: { stage: AccountStage }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${STAGE_TONE[stage]}`}>
      {STAGE_LABEL[stage]}
    </span>
  );
}

/**
 * A signed delta. The arrow direction always reflects the literal, mathematical sign of `value`
 * (positive → up, negative → down) and is never flipped — that is the one invariant that keeps
 * every call site honest regardless of what the metric means. Whether that direction is *good* is
 * a separate question, answered by `invertGoodness`: for a metric like churn, a negative value
 * (down arrow) is the good outcome, so its color inverts while the arrow keeps pointing down.
 * This is the fix for the "directional icon" trap — color carries judgment, the arrow never lies
 * about which way the number moved.
 */
export function Delta({
  value,
  suffix = "%",
  invertGoodness = false,
}: {
  value: number;
  suffix?: string;
  invertGoodness?: boolean;
}) {
  const isUpward = value >= 0;
  const isGood = invertGoodness ? !isUpward : isUpward;
  const tone = isGood ? "text-emerald-700" : "text-rose-700";
  const sign = isUpward ? "+" : "";
  return (
    <span className={`inline-flex items-center gap-0.5 font-medium text-xs tabular-nums ${tone}`}>
      {isUpward ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
      {sign}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700 ${className}`}
    >
      {initials}
    </span>
  );
}

export function ProgressBar({
  pct,
  trackClassName = "bg-zinc-100",
  fillClassName = "bg-blue-600",
  className = "",
}: {
  pct: number;
  trackClassName?: string;
  fillClassName?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}>
      <div
        className={`h-full rounded-full ${fillClassName} motion-safe:transition-[width] motion-safe:duration-300`}
        style={{ width: `${clamped}%` }}
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
    <div role="group" aria-label={ariaLabel} className="inline-flex gap-0.5 rounded-lg bg-zinc-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-3 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
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

export function Tabs({
  tabs,
  value,
  onChange,
  idBase,
  ariaLabel,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  idBase: string;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.value}`}
            aria-selected={active}
            tabIndex={0}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-2.5 py-1.5 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-blue-700 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** A tiny, always-decorative trend line — the numbers it traces are also printed as real text next
 *  to it wherever it's used, so nothing here is the only way to read the data (see the dominant
 *  Sankey's own rule: values are never hover-only). `aria-hidden` keeps it out of the a11y tree. */
export function Sparkline({ values, tone = "neutral" }: { values: number[]; tone?: "up" | "down" | "neutral" }) {
  const w = 56;
  const h = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = Math.round((i / (values.length - 1)) * w * 100) / 100;
      const y = Math.round((h - ((v - min) / range) * h) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = tone === "up" ? "var(--color-emerald-600)" : tone === "down" ? "var(--color-rose-600)" : "var(--color-blue-600)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="shrink-0" aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SortHeader({
  label,
  active,
  direction,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th scope="col" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"} className="px-3 py-2.5">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-1 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500 hover:text-zinc-800 ${FOCUS_RING} ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {align === "right" ? null : <span>{label}</span>}
        {active ? (
          direction === "asc" ? (
            <ChevronUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />
        )}
        {align === "right" ? <span>{label}</span> : null}
      </button>
    </th>
  );
}
