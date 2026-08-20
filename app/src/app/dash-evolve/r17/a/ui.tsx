"use client";

/**
 * Backhaul — the shared component system for this route. Every surface on the page is built from
 * these primitives so radius, border, shadow, padding, label tracking and focus behaviour stay
 * identical across the funnel card, the ledger, the inspector and the held-units table.
 *
 * Exactly three computed font weights exist on this route: 400 (`font-normal`, body and table
 * cells), 500 (`font-medium`, labels, buttons, captions) and 600 (`font-semibold`, headings,
 * figures and stage names). Every text node below carries an explicit weight class so Tailwind's
 * preflight can never leave an unstyled 400 sneaking a fourth value in.
 */

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { SlaState, Tone } from "./tokens";
import {
  BORDER,
  CARD,
  EYEBROW,
  FOCUS,
  NUM,
  SLA_LABEL,
  SLA_TONE,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TONE,
  TRANSITION,
  cx,
} from "./tokens";

/* ------------------------------------------------------------------- Card */

export function Card({
  children,
  className,
  padded = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
  Icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
        {description ? <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(EYEBROW, TEXT_CAPTION, className)}>{children}</span>;
}

/* ----------------------------------------------------------------- Badges */

export function Badge({
  tone,
  Icon,
  children,
}: {
  tone: Tone;
  Icon?: LucideIcon;
  children: ReactNode;
}) {
  const t = TONE[tone];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        t.text,
        t.bg,
        t.border,
      )}
    >
      {Icon ? <Icon size={12} aria-hidden="true" className="shrink-0" /> : null}
      {children}
    </span>
  );
}

const SLA_ICON: Record<SlaState, LucideIcon> = {
  "on-track": CheckCircle2,
  "at-risk": AlertTriangle,
  breached: XCircle,
};

/** SLA state always reads as icon + word + colour — colour is never the sole carrier. */
export function SlaBadge({ state }: { state: SlaState }) {
  return (
    <Badge tone={SLA_TONE[state]} Icon={SLA_ICON[state]}>
      {SLA_LABEL[state]}
    </Badge>
  );
}

/** Direction is carried by an arrow icon and a sign, not by the colour alone. */
export function DeltaChip({ value, suffix }: { value: number; suffix: string }) {
  const up = value > 0;
  const flat = value === 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={cx("inline-flex items-center gap-1 text-xs font-medium", flat ? TEXT_CAPTION : up ? "text-emerald-300" : "text-orange-300")}>
      {flat ? null : <Icon size={13} aria-hidden="true" className="shrink-0" />}
      <span className={NUM}>
        {up ? "+" : value < 0 ? "−" : ""}
        {Math.abs(value).toFixed(1)}%
      </span>
      <span className={cx("font-normal", TEXT_CAPTION)}>{suffix}</span>
    </span>
  );
}

/* --------------------------------------------------------- Outside close */

export function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* ----------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-xl border p-0.5", BORDER, "bg-zinc-950/60")}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cx(
              "h-9 min-w-11 rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-indigo-600 font-semibold text-white" : cx("font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Tabs */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cx("flex items-center gap-4 border-b", BORDER)}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cx(
              "-mb-px min-h-11 border-b-2 px-0.5 text-xs",
              TRANSITION,
              FOCUS,
              active ? "border-indigo-400 font-semibold text-zinc-50" : "border-transparent font-medium text-zinc-400 hover:text-zinc-50",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------- Stat tile */

export function StatTile({
  label,
  value,
  sub,
  Icon,
  emphasis,
}: {
  label: string;
  value: string;
  sub: ReactNode;
  Icon: LucideIcon;
  emphasis?: boolean;
}) {
  return (
    <div className={cx(CARD, "min-w-0 p-4", emphasis && "border-indigo-400/40")}>
      <div className="flex items-center gap-1.5">
        <Icon size={13} aria-hidden="true" className={emphasis ? "text-indigo-400" : TEXT_CAPTION} />
        <span className={cx(EYEBROW, emphasis ? "text-indigo-300" : TEXT_CAPTION, "truncate")}>{label}</span>
      </div>
      <p className={cx("mt-2 text-3xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>{value}</p>
      <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">{sub}</div>
    </div>
  );
}

/* ------------------------------------------------------------- Sparkline */

/**
 * Single-series sparkline. One series only, so there is no colour-alone encoding to resolve; the
 * caller always prints the current value as text beside it, never on hover.
 */
export function Sparkline({ values, ariaHidden = true }: { values: number[]; ariaHidden?: boolean }) {
  const w = 64;
  const h = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(0.1, max - min);
  const pts = values.map((v, i) => {
    const x = Math.round(((i / (values.length - 1)) * w) * 100) / 100;
    const y = Math.round((h - 2 - ((v - min) / span) * (h - 4)) * 100) / 100;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden={ariaHidden} className="block h-5 w-16 shrink-0 overflow-visible">
      <polyline points={pts.join(" ")} fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="2" fill="#818cf8" />
    </svg>
  );
}

/* ------------------------------------------------------------- Value bar */

/** Horizontal labelled bar used by the drop-off breakdown and the dwell profile. */
export function ValueBar({
  label,
  value,
  share,
  fillPct,
  emphasis,
}: {
  label: string;
  value: string;
  share: string;
  fillPct: number;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className={cx("min-w-0 flex-1 truncate text-xs font-medium", TEXT_PRIMARY)}>{label}</span>
        <span className={cx("shrink-0 text-xs font-semibold", NUM, TEXT_PRIMARY)}>{value}</span>
        <span className={cx("w-14 shrink-0 text-right text-xs font-normal", NUM, TEXT_CAPTION)}>{share}</span>
      </div>
      <div className={cx("mt-1.5 h-2 w-full overflow-hidden rounded-full border", BORDER, "bg-zinc-950/60")}>
        <div
          className={cx("h-full rounded-full", emphasis ? "bg-indigo-400" : "bg-indigo-600")}
          style={{ width: `${Math.max(2, Math.round(fillPct * 10) / 10)}%` }}
        />
      </div>
    </div>
  );
}
