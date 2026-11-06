"use client";

import type { ReactNode, Ref } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  CircleDashed,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

/** Shared focus ring — never `outline-none`, never ring-only. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

export function Card({
  children,
  className = "",
  innerRef,
}: {
  children: ReactNode;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      className={`rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${className}`}
    >
      {children}
    </div>
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
    <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
      <div className="min-w-0">
        <h2 className="truncate text-[13px] font-semibold text-zinc-50">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export type StatusKind = "compliant" | "at-risk" | "non-compliant" | "na";

export const STATUS_META: Record<
  StatusKind,
  { label: string; dot: string; text: string; ring: string; icon: typeof ShieldCheck }
> = {
  compliant: {
    label: "Compliant",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    ring: "ring-emerald-400/40",
    icon: ShieldCheck,
  },
  "at-risk": {
    label: "At Risk",
    dot: "bg-amber-400",
    text: "text-amber-400",
    ring: "ring-amber-400/40",
    icon: ShieldAlert,
  },
  "non-compliant": {
    label: "Non-Compliant",
    dot: "bg-red-400",
    text: "text-red-400",
    ring: "ring-red-400/40",
    icon: ShieldOff,
  },
  na: {
    label: "Not Applicable",
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    ring: "ring-zinc-500/40",
    icon: CircleDashed,
  },
};

export type SeverityKind = "critical" | "high" | "medium" | "low";

export const SEVERITY_META: Record<
  SeverityKind,
  { label: string; className: string }
> = {
  critical: { label: "Critical", className: "bg-red-400/15 text-red-300 ring-1 ring-inset ring-red-400/30" },
  high: { label: "High", className: "bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/30" },
  medium: { label: "Medium", className: "bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-400/30" },
  low: { label: "Low", className: "bg-zinc-400/15 text-zinc-300 ring-1 ring-inset ring-zinc-400/30" },
};

export function SeverityBadge({ severity }: { severity: SeverityKind }) {
  const m = SEVERITY_META[severity];
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium tracking-wide ${m.className}`}>
      {m.label}
    </span>
  );
}

export const COLUMN_META: Record<string, { label: string; className: string }> = {
  backlog: { label: "Backlog", className: "bg-zinc-400/15 text-zinc-300 ring-1 ring-inset ring-zinc-400/30" },
  "in-progress": { label: "In Progress", className: "bg-sky-400/15 text-sky-300 ring-1 ring-inset ring-sky-400/30" },
  "evidence-review": { label: "Evidence Review", className: "bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/30" },
  attested: { label: "Attested", className: "bg-emerald-400/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/30" },
};

export function ColumnBadge({ column }: { column: string }) {
  const m = COLUMN_META[column];
  return (
    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium tracking-wide ${m.className}`}>
      {m.label}
    </span>
  );
}

/** A plain additive trend chip: receives the two raw rates and subtracts in render, so the
 * printed delta can never drift from the two numbers sitting next to it. Orientation: ArrowUp
 * = improvement (rate went up), ArrowDown = regression — verified at both call sites in page.tsx. */
export function TrendChip({ rate, compareRate }: { rate: number; compareRate: number }) {
  const delta = rate - compareRate;
  const up = delta >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums ${
        up ? "bg-emerald-400/15 text-emerald-400" : "bg-red-400/15 text-red-400"
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {up ? "+" : ""}
      {delta} pts
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
      className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-950/60 p-0.5"
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
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "bg-emerald-400/15 text-emerald-300" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortHeaderButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex w-full items-center gap-1 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
    >
      {label}
      {active ? (
        direction === "asc" ? (
          <ArrowUp className="h-3 w-3 text-emerald-400" aria-hidden="true" />
        ) : (
          <ArrowDown className="h-3 w-3 text-emerald-400" aria-hidden="true" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100" aria-hidden="true" />
      )}
    </button>
  );
}

/** Small inline proportional bar — a supporting micro-component (not the page's dominant chart). */
export function MiniStackedBar({
  segments,
}: {
  segments: { key: StatusKind; value: number }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800" role="img" aria-label="Status proportion bar">
      {segments.map((s) =>
        s.value > 0 ? (
          <div
            key={s.key}
            style={{ width: `${(s.value / total) * 100}%` }}
            className={STATUS_META[s.key].dot}
          />
        ) : null,
      )}
    </div>
  );
}
