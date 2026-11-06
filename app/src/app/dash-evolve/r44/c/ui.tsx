"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Radio, ServerCrash, TrendingDown, TrendingUp } from "lucide-react";
import type { IncidentStatus, Severity, ServiceStatus } from "./data";
import { formatSignedMs } from "./format";

/** The only verified-safe focus pattern: outline-2 + outline-offset-2 with an
 *  explicit color, never preceded by outline-none, never a bare ring/ring-offset
 *  (transparent in this repo's Tailwind v4 build). */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";

export function Card({
  children,
  className = "",
  as = "div",
  id,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  "aria-labelledby"?: string;
}) {
  const cardClassName = `rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`;
  if (as === "section") {
    return (
      <section id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
      {children}
    </div>
  );
}

export const SEVERITY_META: Record<Severity, { icon: typeof AlertTriangle; label: string; text: string; soft: string }> = {
  critical: { icon: AlertTriangle, label: "Critical", text: "text-rose-700", soft: "bg-rose-50" },
  warning: { icon: AlertTriangle, label: "Warning", text: "text-amber-700", soft: "bg-amber-50" },
  info: { icon: Radio, label: "Info", text: "text-sky-700", soft: "bg-sky-50" },
};

export function SeverityBadge({ severity, className = "" }: { severity: Severity; className?: string }) {
  const meta = SEVERITY_META[severity];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export const STATUS_META: Record<IncidentStatus, { icon: typeof Clock3; label: string; text: string; soft: string }> = {
  open: { icon: Clock3, label: "Open", text: "text-zinc-700", soft: "bg-zinc-100" },
  investigating: { icon: Clock3, label: "Investigating", text: "text-violet-700", soft: "bg-violet-50" },
  resolved: { icon: CheckCircle2, label: "Resolved", text: "text-emerald-700", soft: "bg-emerald-50" },
};

export function IncidentStatusBadge({ status, className = "" }: { status: IncidentStatus; className?: string }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export const SERVICE_STATUS_META: Record<ServiceStatus, { icon: typeof CheckCircle2; label: string; text: string; soft: string }> = {
  operational: { icon: CheckCircle2, label: "Operational", text: "text-emerald-700", soft: "bg-emerald-50" },
  degraded: { icon: AlertTriangle, label: "Degraded", text: "text-amber-700", soft: "bg-amber-50" },
  down: { icon: ServerCrash, label: "Down", text: "text-rose-700", soft: "bg-rose-50" },
};

export function ServiceStatusBadge({ status, className = "" }: { status: ServiceStatus; className?: string }) {
  const meta = SERVICE_STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs ${meta.soft} ${meta.text} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/** Icon direction always reflects the literal sign of `deltaMs` (trending up = latency
 *  rose, trending down = latency fell). Color is computed separately via
 *  `invertGoodness` (true for a metric where lower is better, e.g. latency), so the
 *  icon's rendered orientation can never be decoupled from its claimed meaning at any
 *  call site. Deliberately a different icon family (Trending*) from the ArrowUp/Down
 *  pair used for sort direction elsewhere, so the two unrelated meanings — "value
 *  moved" vs. "column is sorted this way" — are never visually interchangeable. */
export function DeltaIndicator({
  deltaMs,
  invertGoodness = false,
  className = "",
}: {
  deltaMs: number;
  invertGoodness?: boolean;
  className?: string;
}) {
  if (deltaMs === 0) {
    return <span className={`font-medium tabular-nums text-xs text-zinc-600 ${className}`}>{formatSignedMs(0)}</span>;
  }
  const increased = deltaMs > 0;
  const isGood = invertGoodness ? !increased : increased;
  const Icon = increased ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 font-medium tabular-nums text-xs ${isGood ? "text-emerald-700" : "text-rose-700"} ${className}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {formatSignedMs(deltaMs)}
    </span>
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
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-violet-600 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
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
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1 border-b border-zinc-200">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`min-h-9 rounded-t-md px-3 py-2 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "border-b-2 border-violet-600 text-violet-700" : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ initials, className = "", tone = "bg-zinc-100 text-zinc-700" }: { initials: string; className?: string; tone?: string }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full font-medium ${tone} ${className}`}>
      {initials}
    </span>
  );
}

export function Progress({ value, className = "", barClassName = "bg-violet-600" }: { value: number; className?: string; barClassName?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100) / 100}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`h-full rounded-full ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** Deterministic linear map from values to SVG points — coordinates rounded to
 *  2 decimals for consistent SSR/client output. */
export function Sparkline({
  values,
  className = "",
  stroke = "stroke-violet-600",
}: {
  values: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 96;
  const h = 28;
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
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-7 w-24 ${className}`} aria-hidden="true">
      <polyline points={points} fill="none" className={stroke} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
