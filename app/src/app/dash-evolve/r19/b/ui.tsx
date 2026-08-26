"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { BORDER, CARD, FOCUS, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/* ------------------------------------------------------------------------- Card */

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

export function CardHead({
  title,
  hint,
  action,
  Icon,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  Icon?: LucideIcon;
}) {
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

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX, className)}>{children}</span>;
}

/* ------------------------------------------------------------------------ Badge */

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        BORDER,
        SURFACE_INSET,
        TEXT_AUX,
        className,
      )}
    >
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Progress bar */

/**
 * Purely decorative — every call site already prints the percentage as real adjacent text, so this
 * never needs its own accessible name; `aria-hidden` keeps it out of the accessibility tree instead
 * of taking on an unnamed `role="progressbar"`.
 */
export function ProgressBar({ value, className, trackClassName, barClassName }: { value: number; className?: string; trackClassName?: string; barClassName?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <span aria-hidden="true" className={cx("block h-1.5 w-full overflow-hidden rounded-full", SURFACE_INSET, trackClassName, className)}>
      <span className={cx("block h-full rounded-full bg-indigo-600", barClassName)} style={{ width: `${clamped}%` }} />
    </span>
  );
}

/* --------------------------------------------------------- Segmented control */

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
              active ? "bg-zinc-900 font-semibold text-white" : cx("font-medium", TEXT_AUX, "hover:bg-white hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- Dropdown */

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

/* --------------------------------------------------------------- Element width */

/** Measured width for the generated Gantt SVG/HTML overlay. Charts are laid out in 1:1 pixel
 *  coordinates so the geometry stays honest from 1280px through 1920px+ instead of stretching. */
export function useElementWidth<T extends HTMLElement>(fallback: number): {
  ref: RefObject<T | null>;
  width: number;
} {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number) => setWidth(Math.max(260, Math.round(w)));
    apply(el.clientWidth || fallback);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) apply(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallback]);
  return { ref, width };
}

/** All generated coordinates go through this — the determinism gate wants 2 decimals, max. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
