"use client";

import type { ReactNode } from "react";
import { CircleCheck, OctagonAlert, TriangleAlert } from "lucide-react";
import type { QuotaStatus } from "./data";
import { BUCKETS, bucketTotal } from "./data";

/**
 * Font-weight budget for this route: 400 (body/captions/data cells), 500 (labels, nav, buttons) and
 * 600 (titles, headline numbers). Never 700 — including on elements with a UA-default bold, which
 * are avoided outright (no bare `<th>` without an explicit weight, no `<b>`/`<strong>`).
 *
 * A real, opaque, visible focus ring. `outline-none` alone and `ring-*`/`ring-offset-*` (fully
 * transparent in this Tailwind v4 setup) are both avoided everywhere in this route.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

export function Card({
  children,
  className = "",
  padded = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`min-w-0 rounded-2xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600 ${className}`}>
      {children}
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
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex min-w-0 flex-wrap items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`${FOCUS} h-8 rounded-full px-3 text-xs font-medium transition-colors ${
              active ? "bg-white text-emerald-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const STATUS_TONE: Record<
  QuotaStatus,
  { bg: string; text: string; icon: typeof CircleCheck; label: string }
> = {
  ok: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CircleCheck, label: "OK" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", icon: TriangleAlert, label: "Warning" },
  exceeded: { bg: "bg-rose-50", text: "text-rose-700", icon: OctagonAlert, label: "Exceeded" },
};

export function StatusBadge({ status, className = "" }: { status: QuotaStatus; className?: string }) {
  const tone = STATUS_TONE[status];
  const Icon = tone.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone.bg} ${tone.text} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {tone.label}
    </span>
  );
}

export function EnvBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
      {label}
    </span>
  );
}

/** All quota bars share one scale (0–120%) so the 100% ceiling tick lines up at the same horizontal
 * position on every row, and an over-quota key always gets an explicit multiplier label rather than
 * silently capping its fill at the right edge. */
const QUOTA_SCALE_MAX = 120;

export function QuotaBar({ pct, status }: { pct: number; status: QuotaStatus }) {
  const basePct = Math.min(pct, 100);
  const overflowPct = Math.max(0, pct - 100);
  const baseWidth = (basePct / QUOTA_SCALE_MAX) * 100;
  const overflowWidth = (Math.min(overflowPct, QUOTA_SCALE_MAX - 100) / QUOTA_SCALE_MAX) * 100;
  const ceilingMarkLeft = (100 / QUOTA_SCALE_MAX) * 100;
  const fillTone = status === "exceeded" ? "bg-rose-600" : status === "warning" ? "bg-amber-500" : "bg-emerald-600";
  const textTone = status === "exceeded" ? "text-rose-700" : status === "warning" ? "text-amber-700" : "text-zinc-700";

  return (
    <div className="min-w-0">
      <div
        role="img"
        aria-label={`${pct}% of quota used${overflowPct > 0 ? `, ${(pct / 100).toFixed(2)}× over the limit` : ""}`}
        className="relative h-2 w-full min-w-0 overflow-hidden rounded-full bg-zinc-100"
      >
        <div className={`absolute inset-y-0 left-0 rounded-l-full ${fillTone}`} style={{ width: `${baseWidth}%` }} />
        {overflowPct > 0 && (
          <div
            className="absolute inset-y-0 rounded-r-full bg-rose-600"
            style={{
              left: `${baseWidth}%`,
              width: `${overflowWidth}%`,
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 2px, transparent 2px, transparent 5px)",
            }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-zinc-500"
          style={{ left: `${ceilingMarkLeft}%` }}
        />
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className={`font-mono text-xs font-semibold tabular-nums ${textTone}`}>{pct}% of quota</span>
        {overflowPct > 0 && (
          <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-rose-700">
            {(pct / 100).toFixed(2)}× over
          </span>
        )}
      </div>
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "text-zinc-900",
}: {
  label: string;
  value: string;
  icon?: typeof CircleCheck;
  tone?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />}
        <p className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">{label}</p>
      </div>
      <p className={`mt-1 truncate font-mono text-xl font-semibold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

/** Decorative-only 6-bar mini chart of a key's intraday shape, aggregated from its own request
 * matrix via the same `BUCKETS`/`bucketTotal` the heatmap's table fallback uses. Always wrapped by
 * a row button that already carries a full text `aria-label`, so this stays `aria-hidden`. */
export function MiniBuckets({ matrix, className = "" }: { matrix: number[][]; className?: string }) {
  const totals = BUCKETS.map((b) => matrix.reduce((sum, row) => sum + bucketTotal(row, b.hours), 0));
  const max = Math.max(1, ...totals);
  return (
    <div aria-hidden="true" className={`flex h-5 min-w-0 items-end gap-0.5 ${className}`}>
      {totals.map((t, i) => (
        <span
          key={BUCKETS[i].label}
          className="min-w-0 flex-1 rounded-[1px] bg-emerald-200"
          style={{ height: `${Math.max(8, (t / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
