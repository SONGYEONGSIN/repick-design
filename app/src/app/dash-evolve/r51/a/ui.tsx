"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import type { Grade } from "./tokens";
import { BORDER, CARD, FOCUS, GRADE_BADGE, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

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

/** Grade badge — always driven by `gradeForRate(rate)`, never typed independently of the number it
 *  sits next to (page-brief-core §3). */
export function GradeBadge({ grade, className }: { grade: Grade; className?: string }) {
  return <span className={cx("inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-semibold leading-none", GRADE_BADGE[grade], className)}>{grade}</span>;
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
              "h-9 rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-lime-400 font-semibold text-zinc-950" : cx("font-medium", TEXT_AUX, "hover:bg-white/[0.06] hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
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

/* --------------------------------------------------------------- Element width */

/** Measured width for the generated streamgraph SVG — geometry is recomputed in real pixels on
 *  resize rather than stretched, so the 2-decimal coordinates stay honest from 1280px to 1920px+. */
export function useElementWidth<T extends HTMLElement>(fallback: number): { ref: RefObject<T | null>; width: number } {
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

/** Same idea as `useElementWidth`, but for the streamgraph plot, which needs both axes in real
 *  pixels so its viewBox maps 1:1 to the rendered box and every coordinate rounds cleanly to 2dp. */
export function useElementSize<T extends HTMLElement>(fallbackW: number, fallbackH: number): { ref: RefObject<T | null>; width: number; height: number } {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: fallbackW, height: fallbackH });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number, h: number) => setSize({ width: Math.max(260, Math.round(w)), height: Math.max(180, Math.round(h)) });
    apply(el.clientWidth || fallbackW, el.clientHeight || fallbackH);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) apply(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallbackW, fallbackH]);
  return { ref, width: size.width, height: size.height };
}
