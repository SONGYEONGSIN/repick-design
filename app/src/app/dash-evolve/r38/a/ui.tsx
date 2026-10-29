"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CreditCard, Fingerprint, Truck, MessageSquare, MapPin, ShieldAlert, CheckCircle2, AlertTriangle, OctagonAlert } from "lucide-react";
import type { Category, Status } from "./data";

/**
 * Visually-hidden text that may live inside a horizontally-scrolling container (the box-plot strip)
 * must sit on its own positioned ancestor. Tailwind's `sr-only` utility sets `position:absolute` on
 * the element itself — with no positioned ancestor that absolute box is laid out against the
 * nearest positioned ancestor *outside* the scroller (often the viewport), so it paints at
 * unscrolled coordinates and inflates `document.scrollWidth` at narrow viewports even though
 * nothing visible moved. Wrapping every `sr-only` span in a `relative` span gives it a local
 * containing block, so it stays inside the scroller's own box no matter where it is used.
 */
export function SrOnly({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="sr-only">{children}</span>
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Payments: CreditCard,
  Identity: Fingerprint,
  Logistics: Truck,
  Messaging: MessageSquare,
  Maps: MapPin,
  Fraud: ShieldAlert,
};

const STATUS_META: Record<Status, { icon: LucideIcon; text: string; bg: string }> = {
  "on-track": { icon: CheckCircle2, text: "text-emerald-700", bg: "bg-emerald-50" },
  watch: { icon: AlertTriangle, text: "text-amber-700", bg: "bg-amber-50" },
  breach: { icon: OctagonAlert, text: "text-rose-700", bg: "bg-rose-50" },
};

export function StatusBadge({ status, label }: { status: Status; label: string }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${meta.text} ${meta.bg}`}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

export function CategoryTag({ category }: { category: Category }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-normal text-zinc-500">
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {category}
    </span>
  );
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
  panelId,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  panelId: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex min-w-0 flex-wrap gap-1 border-b border-zinc-200">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            id={`tab-${panelId}-${opt.value}`}
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const i = options.findIndex((o) => o.value === value);
              const next = e.key === "ArrowRight" ? (i + 1) % options.length : (i - 1 + options.length) % options.length;
              onChange(options[next].value);
            }}
            className={`-mb-px rounded-t-md px-3 py-2 text-xs font-medium outline-offset-2 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none ${
              active ? "border-b-2 border-indigo-600 text-indigo-700" : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex min-w-0 rounded-lg bg-zinc-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium outline-offset-2 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none ${
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

export function ProgressBar({ value, label, valueText }: { value: number; label: string; valueText: string }) {
  return (
    <div className="min-w-0">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={valueText}
        className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.max(0, Math.min(100, value)).toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** A tiny deterministic polyline sparkline — coordinates are a linear scale, rounded to 2dp. */
export function Sparkline({ points, width = 56, height = 20 }: { points: number[]; width?: number; height?: number }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points
    .map((p, i) => {
      const x = round2(i * step);
      const y = round2(height - ((p - min) / span) * (height - 2) - 1);
      return `${x},${y}`;
    })
    .join(" ");
  const rising = points[points.length - 1] >= points[0];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0 overflow-visible">
      <polyline points={coords} fill="none" stroke={rising ? "#e11d48" : "#4f46e5"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InitialsAvatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-indigo-600 font-medium text-white ${className}`}>
      {initials}
    </span>
  );
}
