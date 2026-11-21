"use client";

import { useId, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { AlertStatus, Severity } from "../lib/data";

// Shared component system for Vigil — pure-white light surface, single orange brand accent.
// Contrast note: orange-600 on white measures under the 4.5:1 text floor, so orange is never a
// TEXT color here — orange-700/800 carry accent text, orange-600/500 are reserved for non-text
// fills (bars, active rails, chart strokes) where only the 3:1 non-text floor applies. Severity
// and status badges use a second semantic scale (rose/amber/sky/zinc) and always pair color with
// a text label, never color alone.

/** The pattern that actually paints in this Tailwind v4 setup: never pair `outline-none` with a
 * later `focus-visible:outline` (the `none` cancels it), and set color + offset unconditionally
 * since they are harmless with zero outline width — only the width is gated on focus-visible. */
export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-orange-600";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-w-0 rounded-2xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3.5 sm:px-5">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-zinc-900">{title}</h2>
        {subtitle ? <p className="mt-0.5 truncate text-xs text-zinc-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

const SEVERITY_TONE: Record<Severity, string> = {
  critical: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
  high: "bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200",
  medium: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
  low: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-200",
};

const SEVERITY_TEXT: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_TONE[severity]}`}>
      {SEVERITY_TEXT[severity]}
    </span>
  );
}

const STATUS_TONE: Record<AlertStatus, string> = {
  open: "bg-rose-50 text-rose-700",
  investigating: "bg-sky-50 text-sky-700",
  resolved: "bg-emerald-50 text-emerald-700",
  suppressed: "bg-zinc-100 text-zinc-600",
};

const STATUS_TEXT: Record<AlertStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  suppressed: "Suppressed",
};

export function StatusBadge({ status }: { status: AlertStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[status]}`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {STATUS_TEXT[status]}
    </span>
  );
}

export function OnCallBadge({ onCall }: { onCall: boolean }) {
  return onCall ? (
    <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
      On call
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
      Off call
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
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex min-w-0 shrink-0 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
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

/** Multi-select toggle group (severity filter) — a toolbar of independent pressed buttons, not a
 * radiogroup, since more than one value can be active at once. */
export function ToggleChipGroup<T extends string>({
  options,
  active,
  onToggle,
  ariaLabel,
  toneFor,
}: {
  options: { value: T; label: string }[];
  active: Set<T>;
  onToggle: (v: T) => void;
  ariaLabel: string;
  toneFor?: (v: T) => string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex min-w-0 flex-wrap items-center gap-1.5">
      {options.map((opt) => {
        const on = active.has(opt.value);
        const tone = toneFor?.(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(opt.value)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
              on ? (tone ?? "border-orange-300 bg-orange-50 text-orange-800") : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Underline tabs — a real `tablist`/`tab` pair, used where activating a tab swaps a visible
 * content panel (see InspectorPanel). Not used for list filtering, which stays a radiogroup. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
  idPrefix,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  idPrefix: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex min-w-0 items-center gap-4 border-b border-zinc-200">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.value}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${t.value}`}
            onClick={() => onChange(t.value)}
            className={`relative shrink-0 whitespace-nowrap pb-2.5 pt-1 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
              active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {t.label}
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full ${active ? "bg-orange-600" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

/** Generic single-select popover/listbox — the category and sort pickers in the filter bar each
 * mount one instance. Closes via a full-viewport invisible button, same pattern as the sidebar's
 * workspace switcher, so there is no document-level listener/effect to keep in sync. */
export function Dropdown<T extends string>({
  label,
  ariaLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const current = options.find((o) => o.value === value)?.label ?? label;
  return (
    <div className="relative min-w-0 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={uid}
        className={`flex h-9 min-w-0 max-w-[12rem] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-left text-xs font-medium text-zinc-700 hover:border-zinc-300 sm:max-w-[16rem] ${FOCUS_RING}`}
      >
        <span className="shrink-0 text-zinc-500">{label}:</span>
        <span className="min-w-0 flex-1 truncate">{current}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <>
          <button type="button" tabIndex={-1} aria-label={`Close ${ariaLabel} menu`} onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />
          <ul
            id={uid}
            role="listbox"
            aria-label={ariaLabel}
            className="absolute left-0 top-full z-20 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-xl"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full min-w-0 items-center justify-between gap-2 px-3 py-1.5 text-left text-xs ${FOCUS_RING} ${
                    opt.value === value ? "bg-orange-50 text-orange-800" : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span className="min-w-0 truncate">{opt.label}</span>
                  {opt.value === value ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

const AVATAR_TONES = [
  "bg-orange-100 text-orange-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
];

/** Deterministic tone from the name string (char-code sum mod palette length) — the same analyst
 * always gets the same color, with no lookup table to keep in sync by hand. */
function toneForName(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

export function Avatar({ name, initials, size = 28 }: { name: string; initials: string; size?: number }) {
  return (
    <span
      role="img"
      aria-label={name}
      style={{ height: size, width: size, fontSize: Math.max(10, Math.round(size * 0.38)) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${toneForName(name)}`}
    >
      {initials}
    </span>
  );
}

/**
 * Horizontal fill bar with its percentage always printed as real text beside it — the bar is a
 * supporting visual, never the only place the number lives.
 */
export function ProgressBar({ percent, tone = "bg-orange-600" }: { percent: number; tone?: string }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-zinc-100" aria-hidden="true">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/**
 * Decorative 7-point trend line. `aria-hidden` on the SVG itself because the caller always prints
 * the real total/average as adjacent text — the line never carries a number that isn't also
 * written out as text.
 */
export function Sparkline({ values, width = 120, height = 32, colorClass = "text-orange-600" }: {
  values: number[];
  width?: number;
  height?: number;
  colorClass?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const coords = values.map((v, i) => {
    const x = Math.round(i * stepX * 100) / 100;
    const y = Math.round((height - 3 - ((v - min) / range) * (height - 6)) * 100) / 100;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className={`${colorClass} max-w-full shrink-0`}>
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
