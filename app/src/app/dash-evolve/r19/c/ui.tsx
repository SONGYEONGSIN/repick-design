"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { BAD_TEXT, BORDER, CARD, FOCUS, GOOD_TEXT, SURFACE_INSET, TEXT_AUX, TEXT_AUX_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/* ------------------------------------------------------------------------------------- Card */

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

export function Eyebrow({ children, className, muted = false }: { children: ReactNode; className?: string; muted?: boolean }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", muted ? TEXT_AUX_MUTED : TEXT_AUX, className)}>{children}</span>;
}

/* ------------------------------------------------------------------------------------ Badge */

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        BORDER,
        SURFACE_INSET,
        TEXT_AUX_MUTED,
        className,
      )}
    >
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------------- Trend marker */

/**
 * The ± marker for percentage-point deltas. Direction is carried by the ARROW plus the signed
 * figure — the tint is only ever the third, redundant channel. Strip colour and this component
 * still reads correctly. `flat` (|pts| < 0.05) gets a dash, not a forced up/down reading.
 */
export function TrendMark({ pts, size = 12, className }: { pts: number; size?: number; className?: string }) {
  const flat = Math.abs(pts) < 0.05;
  const down = pts < 0;
  const Icon = flat ? Minus : down ? ArrowDown : ArrowUp;
  const tone = flat ? TEXT_AUX_MUTED : down ? BAD_TEXT : GOOD_TEXT;
  return (
    <span className={cx("inline-flex shrink-0 items-center", tone, className)}>
      <Icon size={size} strokeWidth={2.5} aria-hidden="true" />
      <span className="sr-only">{flat ? "Unchanged" : down ? "Down" : "Up"}</span>
    </span>
  );
}

/* ------------------------------------------------------------------------------- Segmented */

export function Segmented<T extends string | number>({
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
              active ? cx(TEXT_PRIMARY, "bg-white font-semibold shadow-sm") : cx("font-medium", TEXT_AUX_MUTED, "hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------------------------- Dropdown */

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

/* ----------------------------------------------------------------------------- Element width */

/**
 * Measured width for the generated SVGs. Charts are drawn in 1:1 pixel coordinates instead of a
 * fixed viewBox, so `preserveAspectRatio` never has to stretch a label or squash a marker.
 */
export function useElementWidth<T extends HTMLElement>(fallback: number): {
  ref: RefObject<T | null>;
  width: number;
} {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number) => setWidth(Math.max(200, Math.round(w)));
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

/* ---------------------------------------------------------------------------------- Bullet */

/**
 * Compact "performance vs target" bullet. The filled bar and the target tick are both drawn,
 * AND the exact value/target pair is printed as text beside them — the reading never depends on
 * comparing two pixel lengths by eye alone (catalog: "값+목표% 텍스트, hover 아님").
 */
export function Bullet({
  value,
  target,
  domainMin = 80,
  domainMax = 100,
  good,
  label,
}: {
  value: number;
  target: number;
  domainMin?: number;
  domainMax?: number;
  good: boolean;
  label: string;
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>(220);
  const HEIGHT = 28;
  const span = domainMax - domainMin || 1;
  const toX = (v: number) => r2(((Math.min(domainMax, Math.max(domainMin, v)) - domainMin) / span) * width);
  const fillW = Math.max(2, toX(value));
  const targetX = toX(target);
  const tone = good ? "#059669" : "#e11d48";

  return (
    <div className="min-w-0">
      <div ref={ref} role="img" aria-label={`${label}: ${value.toFixed(1)}% against a ${target.toFixed(1)}% target`} className="relative w-full" style={{ height: HEIGHT }}>
        <svg width={width} height={HEIGHT} viewBox={`0 0 ${width} ${HEIGHT}`} className="block h-full w-full" aria-hidden="true">
          <rect x="0" y="10" width={r2(width)} height="8" rx="4" fill="#e4e4e7" />
          <rect x="0" y="10" width={fillW} height="8" rx="4" fill={tone} />
          <line x1={targetX} y1="2" x2={targetX} y2="26" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className={cx("text-[11px] font-medium", TEXT_AUX_MUTED)}>{`Target ${target.toFixed(1)}%`}</span>
        <span className={cx("text-[11px] font-semibold", good ? GOOD_TEXT : BAD_TEXT)}>{good ? "Above target" : "Below target"}</span>
      </div>
    </div>
  );
}
