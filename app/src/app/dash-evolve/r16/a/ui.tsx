"use client";

import Image from "next/image";
import { useId, useState, type ReactNode } from "react";
import { AlertOctagon, CheckCircle2, CircleAlert, Clock3, Info, TriangleAlert } from "lucide-react";
import type { Severity } from "./data";
import { clampPercent, formatDateYear, type SlaStatus } from "./format";

/* ── Card ─────────────────────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  "aria-labelledby"?: string;
}) {
  const Comp = as;
  return (
    <Comp className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`} {...rest}>
      {children}
    </Comp>
  );
}

/* ── Severity badge (color + icon + text — never color alone) ───────────── */

export const SEVERITY_STYLE: Record<Severity, { badge: string; dot: string; icon: typeof AlertOctagon }> = {
  critical: { badge: "border-rose-200 bg-rose-50 text-rose-700", dot: "bg-rose-600", icon: AlertOctagon },
  high: { badge: "border-orange-200 bg-orange-50 text-orange-700", dot: "bg-orange-500", icon: TriangleAlert },
  medium: { badge: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-500", icon: CircleAlert },
  low: { badge: "border-slate-200 bg-slate-50 text-slate-600", dot: "bg-slate-400", icon: Info },
};

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function SeverityBadge({ severity, className = "" }: { severity: Severity; className?: string }) {
  const s = SEVERITY_STYLE[severity];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold whitespace-nowrap ${s.badge} ${className}`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

/* ── SLA status meta (color + icon + text) ───────────────────────────────── */

export const SLA_STATUS_META: Record<
  SlaStatus,
  { label: string; text: string; fill: string; track: string; icon: typeof Clock3 }
> = {
  onTrack: { label: "On track", text: "text-emerald-700", fill: "bg-emerald-500", track: "bg-emerald-50", icon: CheckCircle2 },
  atRisk: { label: "At risk", text: "text-amber-700", fill: "bg-amber-500", track: "bg-amber-50", icon: Clock3 },
  breached: { label: "Breached", text: "text-rose-700", fill: "bg-rose-600", track: "bg-rose-50", icon: AlertOctagon },
  met: { label: "Met SLA", text: "text-emerald-700", fill: "bg-emerald-500", track: "bg-emerald-50", icon: CheckCircle2 },
  missed: { label: "Missed SLA", text: "text-rose-700", fill: "bg-rose-600", track: "bg-rose-50", icon: AlertOctagon },
};

/* ── Avatar ───────────────────────────────────────────────────────────── */

const SIZE_MAP = { xs: 20, sm: 24, md: 32 } as const;

export function Avatar({
  src,
  name,
  size = "sm",
  className = "",
}: {
  src: string;
  name: string;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}) {
  const px = SIZE_MAP[size];
  return (
    <Image
      src={src}
      alt={`${name} profile photo`}
      width={px}
      height={px}
      sizes={`${px}px`}
      className={`shrink-0 rounded-full border border-zinc-200 object-cover ${className}`}
      style={{ width: px, height: px }}
    />
  );
}

/* ── SLA bullet bar — the board's dominant, repeated visualization ──────
   Value (days open) vs target (SLA days for the severity), with the exact numbers always
   rendered as text (never hover-only — see dash-brief-v3 "단일 지배 시각화 완성도"). Hover or
   keyboard focus reveals a small crosshair-style tooltip with the underlying dates. */

export function SlaBar({
  open,
  target,
  status,
  discoveredISO,
  resolvedISO,
  compact = false,
}: {
  open: number;
  target: number;
  status: SlaStatus;
  discoveredISO: string;
  resolvedISO?: string;
  compact?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const show = hover || focus;
  const tooltipId = useId();
  const meta = SLA_STATUS_META[status];
  const pct = clampPercent((open / target) * 100);
  const Icon = meta.icon;

  const detail = resolvedISO
    ? `Discovered ${formatDateYear(discoveredISO)} · Resolved ${formatDateYear(resolvedISO)} · ${target}d SLA`
    : `Discovered ${formatDateYear(discoveredISO)} · Target ${target}d from discovery`;

  return (
    <div className="relative">
      <button
        type="button"
        aria-describedby={tooltipId}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="block w-full cursor-help rounded-md pointer-events-auto focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <span className={`mb-1 flex items-center justify-between gap-2 ${compact ? "text-[11px]" : "text-xs"}`}>
          <span className={`inline-flex items-center gap-1 font-medium ${meta.text}`}>
            <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
            {meta.label}
          </span>
          <span className="shrink-0 font-medium whitespace-nowrap text-zinc-600 tabular-nums">
            {open}d / {target}d
          </span>
        </span>
        <span
          className={`block h-1.5 w-full overflow-hidden rounded-full ${meta.track}`}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${open} of ${target} day SLA target, ${meta.label.toLowerCase()}`}
        >
          <span className={`block h-full rounded-full ${meta.fill}`} style={{ width: `${pct}%` }} />
        </span>
      </button>
      {show ? (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-0 z-20 mb-1.5 w-max max-w-[240px] rounded-lg border border-zinc-200 bg-zinc-900 px-2.5 py-1.5 text-[11px] leading-snug text-zinc-50 shadow-lg"
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
}
