"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FOCUS_RING, FOCUS_RING_INSET } from "./focus";
import type { RiskBand } from "./data";

/**
 * Font-weight budget for this whole route is exactly three rendered weights: 400 (body copy,
 * table cells, captions), 500 (labels, nav, buttons, badges, tab/segmented-control text) and 600
 * (headings, headline numbers, the wordmark). 700/`font-bold` never appears anywhere, and every
 * element that browsers bold by default (`<th>`, `<caption>` in some UAs) carries an explicit
 * weight override instead.
 */

export const ACCENT_SOLID = "bg-violet-600 hover:bg-violet-700 text-white";

export function Card({
  children,
  className = "",
  padded = true,
  id,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag
      id={id}
      className={`min-w-0 rounded-2xl border border-white/10 bg-zinc-900/60 ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

const RISK_BAND_CLASS: Record<RiskBand, { text: string; bg: string; border: string; bar: string }> = {
  low: { text: "text-emerald-300", bg: "bg-emerald-400/15", border: "border-emerald-400/30", bar: "bg-emerald-400/60" },
  medium: { text: "text-amber-300", bg: "bg-amber-400/15", border: "border-amber-400/30 border-dashed", bar: "bg-amber-400/60" },
  high: { text: "text-orange-300", bg: "bg-orange-400/15", border: "border-orange-400/40 border-dashed", bar: "bg-orange-400/60" },
  critical: { text: "text-rose-300", bg: "bg-rose-400/15", border: "border-rose-400/50 border-dashed", bar: "bg-rose-400/60" },
};

export function riskBandClass(band: RiskBand) {
  return RISK_BAND_CLASS[band];
}

export function RiskBadge({ band, label }: { band: RiskBand; label: string }) {
  const c = RISK_BAND_CLASS[band];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${c.text} ${c.bg} ${c.border}`}
    >
      {label}
    </span>
  );
}

export function TierBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-300">
      {label}
    </span>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div role="img" aria-label={label} className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full bg-violet-500" style={{ width: `${safe}%` }} />
    </div>
  );
}

export function Sparkline({
  values,
  width = 96,
  height = 30,
  className = "",
  ariaLabel,
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  ariaLabel: string;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / span) * height;
      return `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`shrink-0 ${className}`} style={{ width, height }} role="img" aria-label={ariaLabel}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ value: T; label: string; icon?: LucideIcon }>;
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex min-w-0 flex-wrap items-center gap-0.5 rounded-full border border-white/10 bg-zinc-950/60 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`${FOCUS_RING} flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${
              active ? "bg-violet-600 text-white" : "text-zinc-300 hover:text-zinc-50"
            }`}
          >
            {Icon && <Icon aria-hidden="true" className="size-3.5 shrink-0" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  activeId,
  onChange,
  ariaLabel,
}: {
  tabs: Array<{ id: T; label: string; icon?: LucideIcon; count?: number }>;
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex min-w-0 flex-wrap gap-1 border-b border-white/10">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const idx = tabs.findIndex((t) => t.id === activeId);
              const next = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
              onChange(tabs[next].id);
              const nextEl = e.currentTarget.parentElement?.children[next];
              if (nextEl instanceof HTMLElement) nextEl.focus();
            }}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium ${FOCUS_RING_INSET} ${
              active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-zinc-300">{tab.count}</span>
            )}
            {active && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-violet-400" />}
          </button>
        );
      })}
    </div>
  );
}

/** A real switch with its accessible name carried by a connected `<label>` (never a mismatched
 *  `aria-label`), used for the adjacency table's "concentration risk only" filter. */
export function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex min-w-0 shrink-0 items-center gap-2 text-sm font-normal text-zinc-300">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${FOCUS_RING} relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-white/10 transition-colors motion-reduce:transition-none ${
          checked ? "bg-violet-600" : "bg-white/10"
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block size-4 rounded-full bg-white transition-transform motion-reduce:transition-none ${
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </button>
      {label}
    </label>
  );
}

export function DropdownMenu<T extends string>({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  open,
  onOpenChange,
}: {
  label: string;
  icon?: LucideIcon;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const current = options.find((o) => o.value === value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onOpenChange(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={`${FOCUS_RING} flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-white/10 bg-white/5 px-3 text-sm font-normal text-zinc-200 hover:bg-white/10`}
      >
        {Icon && <Icon aria-hidden="true" className="size-3.5 shrink-0 text-zinc-400" />}
        {label}: <span className="font-medium text-zinc-50">{current?.label}</span>
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  onOpenChange(false);
                }}
                className={`${FOCUS_RING_INSET} flex w-full items-center px-3 py-2 text-left text-sm font-normal ${
                  opt.value === value ? "bg-violet-600/20 text-violet-200" : "text-zinc-200 hover:bg-white/10"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
