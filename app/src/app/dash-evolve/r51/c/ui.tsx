"use client";

import type { LucideIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BORDER, CARD, FOCUS, SEVERITY_STYLE, STATUS_STYLE, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TRANSITION, avatarTone, cx, initialsOf, type Severity, type Status } from "./tokens";

/* ------------------------------------------------------------------------- Card */

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
        {hint ? <p className={cx("mt-1 max-w-2xl text-xs font-normal leading-relaxed", TEXT_AUX)}>{hint}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX, className)}>{children}</span>;
}

/* ------------------------------------------------------------------------ Badge */

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", BORDER, SURFACE_INSET, TEXT_AUX, className)}>
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** Severity is never colour-alone: every badge pairs a semantic hue with its own icon AND its own
 *  text label, so the signal survives for colour-blind readers and in a print/greyscale capture. */
export function SeverityBadge({ severity, Icon, className }: { severity: Severity; Icon: LucideIcon; className?: string }) {
  const s = SEVERITY_STYLE[severity];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-none", s.border, s.bg, s.text, className)}>
      <Icon size={11} aria-hidden="true" />
      {severity}
    </span>
  );
}

export function StatusBadge({ status, Icon, className }: { status: Status; Icon: LucideIcon; className?: string }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-none", s.border, s.bg, s.text, className)}>
      <Icon size={11} aria-hidden="true" />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------------ Avatar */

/** Generated initials avatar — deterministic colour from `avatarTone`, no photo host, no raw
 *  `<img>`. Simpler and more appropriate for a dense ops feed than curated stock photography. */
export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cx("inline-flex shrink-0 items-center justify-center rounded-full font-semibold", avatarTone(name))}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) }}
    >
      {initialsOf(name)}
    </span>
  );
}

/* --------------------------------------------------------------- Segmented control */

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
              "h-9 whitespace-nowrap rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-white font-semibold text-zinc-900 shadow-sm" : cx("font-medium", TEXT_AUX, "hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------- Tabs */

export function Tabs<T extends string>({ id, tabs, value, onChange, ariaLabel }: { id: string; tabs: { id: T; label: string }[]; value: T; onChange: (id: T) => void; ariaLabel: string }) {
  const baseId = id;
  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
    const el = document.getElementById(`${baseId}-tab-${tabs[next].id}`);
    el?.focus();
  }
  return (
    <div role="tablist" aria-label={ariaLabel} className={cx("flex items-center gap-1 border-b", BORDER)}>
      {tabs.map((tab, idx) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className={cx(
              "-mb-px border-b-2 px-3 py-2 text-xs font-semibold",
              TRANSITION,
              FOCUS,
              active ? "border-green-700 text-green-800" : cx("border-transparent", TEXT_AUX, "hover:text-zinc-900"),
            )}
          >
            {tab.label}
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

/* --------------------------------------------------------------------- Progress bar */

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div>
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label} className={cx("h-1.5 w-full overflow-hidden rounded-full", SURFACE_INSET)}>
        <div className={cx("h-full rounded-full bg-green-700", TRANSITION)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Dropdown helper */

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
