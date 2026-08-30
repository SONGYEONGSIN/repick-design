"use client";

import type { KeyboardEvent, ReactNode, RefObject } from "react";
import { Check, ChevronDown, TrendingDown, TrendingUp } from "lucide-react";

/**
 * Shared focus treatment. Uses native `outline` (not `ring`) on purpose —
 * Tailwind v4 paints an un-colored `ring` transparent, and `outline-none`
 * placed before `focus-visible:outline` self-cancels via the shared
 * `--tw-outline-style` variable. A plain, always-colored `outline` utility
 * has neither trap and is what the sweep's focus check actually renders.
 */
export const FOCUS_RING =
  "outline outline-2 outline-offset-2 outline-transparent focus-visible:outline-[#5b9bec]";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-zinc-900 ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "critical" | "brand";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/5 text-zinc-300 border-white/10",
    good: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    critical: "bg-red-500/10 text-red-300 border-red-500/25",
    brand: "bg-[rgba(57,135,229,0.14)] text-[#8ab6f2] border-[rgba(57,135,229,0.32)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function DeltaChip({ deltaPct, isGood }: { deltaPct: number; isGood: boolean }) {
  const Icon = deltaPct >= 0 ? TrendingUp : TrendingDown;
  const sign = deltaPct > 0 ? "+" : "";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums ${
        isGood
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/25 bg-red-500/10 text-red-300"
      }`}
    >
      <Icon size={12} aria-hidden="true" />
      <span>
        {sign}
        {deltaPct.toFixed(1)}%
      </span>
    </span>
  );
}

export function Progress({ pct, tone = "brand" }: { pct: number; tone?: "brand" | "neutral" }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/8"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${tone === "brand" ? "bg-[#3987e5]" : "bg-zinc-400"}`}
        style={{ width: `${clamped.toFixed(2)}%` }}
      />
    </div>
  );
}

export function Sparkline({
  values,
  width = 88,
  height = 26,
  color = "#5b9bec",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) return <svg width={width} height={height} aria-hidden="true" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = Number((i * step).toFixed(2));
      const y = Number((height - ((v - min) / range) * height).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");
  const lastX = Number(((values.length - 1) * step).toFixed(2));
  const lastY = Number((height - ((values[values.length - 1] - min) / range) * height).toFixed(2));
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-950/60 p-0.5"
    >
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={`h-9 rounded-md px-3 text-[13px] font-medium transition-colors ${FOCUS_RING} ${
              selected ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
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
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-4 border-b border-white/10">
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.id)}
            className={`relative -mb-px py-2 text-[13px] font-medium ${FOCUS_RING} ${
              selected ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {opt.label}
            <span
              className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full ${selected ? "bg-[#3987e5]" : "bg-transparent"}`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export interface SelectOption {
  id: string;
  label: string;
  meta?: string;
}

/**
 * Listbox-style select button. Focus stays on the trigger button while
 * `aria-activedescendant` marks the highlighted option — the pattern
 * page-brief-core documents for combobox-shaped controls: options are not
 * individually tabbable (`tabIndex={-1}`), so a screen reader still
 * announces the active item via `aria-activedescendant` alone.
 */
export function SelectPopover({
  id,
  label,
  icon,
  value,
  options,
  onChange,
  open,
  onOpenChange,
  highlight,
  onHighlightChange,
  triggerRef,
}: {
  id: string;
  label: string;
  icon?: ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlight: number;
  onHighlightChange: (i: number) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const selected = options.find((o) => o.id === value);
  const selectedIndex = options.findIndex((o) => o.id === value);

  function openList() {
    onHighlightChange(selectedIndex >= 0 ? selectedIndex : 0);
    onOpenChange(true);
  }

  function commit(i: number) {
    onChange(options[i].id);
    onOpenChange(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onHighlightChange(Math.min(highlight + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onHighlightChange(Math.max(highlight - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(highlight);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === "Tab") {
      onOpenChange(false);
    }
  }

  return (
    <div className="relative min-w-0">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-opt-${highlight}` : undefined}
        onClick={() => (open ? onOpenChange(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/60 px-3 text-left text-[13px] font-medium text-zinc-50 hover:border-white/20 ${FOCUS_RING}`}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? "Select…"}</span>
        <ChevronDown size={16} className={`shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 w-full min-w-[15rem] overflow-auto rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40"
        >
          {options.map((opt, i) => {
            const isSelected = opt.id === value;
            const isHighlighted = i === highlight;
            return (
              <li
                key={opt.id}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onMouseEnter={() => onHighlightChange(i)}
                onClick={() => commit(i)}
                className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-[13px] ${
                  isHighlighted ? "bg-white/10 text-zinc-50" : "text-zinc-300"
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{opt.label}</span>
                  {opt.meta && <span className="truncate text-[11px] font-normal text-zinc-500">{opt.meta}</span>}
                </span>
                {isSelected && <Check size={14} className="shrink-0 text-[#5b9bec]" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
