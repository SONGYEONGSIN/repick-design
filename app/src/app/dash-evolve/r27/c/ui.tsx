"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ACCENT_SOLID, BORDER, CARD, FOCUS, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <section id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </section>
  );
}

export function CardHead({ title, hint, action, Icon }: { title: ReactNode; hint?: ReactNode; action?: ReactNode; Icon?: LucideIcon }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_AUX} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
        {hint ? <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_AUX)}>{hint}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX, className)} style={style}>
      {children}
    </span>
  );
}

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", BORDER, SURFACE_INSET, TEXT_MUTED, className)}>
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function Segmented<T extends string>({ options, value, onChange, ariaLabel }: { options: { id: T; label: string }[]; value: T; onChange: (id: T) => void; ariaLabel: string }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-xl border p-0.5", BORDER, SURFACE_INSET)}>
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
              "h-9 rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? cx(ACCENT_SOLID, "font-semibold") : cx("font-medium", TEXT_MUTED, "hover:bg-white/5 hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Accessible tabs — role=tablist/tab/tabpanel with roving left/right arrow focus.
 *
 * `idBase` is taken as-is (not remixed with `useId()`) specifically so the caller can pass the
 * exact same string into the matching `TabPanel`s — `aria-controls`/`aria-labelledby` need the two
 * to agree on an id, and generating a second, private id in here would silently break that link.
 */
export function Tabs({
  tabs,
  active,
  onChange,
  idBase,
  ariaLabel,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  idBase: string;
  ariaLabel: string;
}) {
  function onKeyDown(e: ReactKeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    const el = document.getElementById(`${idBase}-tab-${tabs[next].id}`);
    el?.focus();
  }
  return (
    <div role="tablist" aria-label={ariaLabel} className={cx("inline-flex items-center gap-1 rounded-xl border p-0.5", BORDER, SURFACE_INSET)}>
      {tabs.map((t, i) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            id={`${idBase}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cx(
              "h-8 rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              selected ? cx(ACCENT_SOLID, "font-semibold") : cx("font-medium", TEXT_MUTED, "hover:bg-white/5 hover:text-zinc-50"),
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ id, tabId, active, children }: { id: string; tabId: string; active: boolean; children: ReactNode }) {
  if (!active) return null;
  return (
    <div role="tabpanel" id={`${id}-panel-${tabId}`} aria-labelledby={`${id}-tab-${tabId}`} tabIndex={0}>
      {children}
    </div>
  );
}

/** 0–10 meter with the numeric reading always printed beside it — the bar is the shape, the number is the fact. */
export function Meter({ value, max = 10, className, barClassName }: { value: number; max?: number; className?: string; barClassName?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value * 10) / 10}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cx("h-1.5 w-full overflow-hidden rounded-full bg-white/10", className)}
    >
      <div className={cx("h-full rounded-full", barClassName ?? "bg-amber-400")} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Deterministic inline sparkline — fixed data only, no chart library. */
export function Sparkline({ points, className, strokeClassName }: { points: number[]; className?: string; strokeClassName?: string }) {
  const w = 100;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = Math.round((i / (points.length - 1)) * w * 100) / 100;
    const y = Math.round((h - ((p - min) / range) * h) * 100) / 100;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" className={className} role="img" aria-hidden="true">
      <polyline points={coords.join(" ")} fill="none" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={strokeClassName ?? "stroke-amber-400"} />
    </svg>
  );
}

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

export function DropdownCaret({ open }: { open: boolean }) {
  return <ChevronDown size={14} aria-hidden="true" className={cx("shrink-0 transition-transform duration-150 motion-reduce:transition-none", open && "rotate-180")} />;
}
