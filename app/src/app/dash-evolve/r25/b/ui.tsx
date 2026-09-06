"use client";

import { CheckCircle2, Clock3, PauseCircle, TrendingDown, TrendingUp, XCircle, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { STATUS_LABEL, type RunStatus } from "./data";
import { BORDER, CARD, DOWN_TEXT, FOCUS, STATUS_STYLE, SURFACE_INSET, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, UP_TEXT, cx } from "./tokens";

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
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_MUTED} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
        {hint ? <p className={cx("mt-1 max-w-md text-xs font-normal leading-relaxed", TEXT_MUTED)}>{hint}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED, className)}>{children}</span>;
}

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", BORDER, SURFACE_INSET, TEXT_MUTED, className)}>
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const STATUS_ICON: Record<RunStatus, LucideIcon> = { paid: CheckCircle2, processing: Clock3, held: PauseCircle, failed: XCircle };

export function StatusBadge({ status }: { status: RunStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", STATUS_STYLE[status])}>
      <Icon size={11} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Delta chip — icon + sign + value, never color alone. */
export function DeltaChip({ pct }: { pct: number }) {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={cx("inline-flex items-center gap-1 text-sm font-semibold", up ? UP_TEXT : DOWN_TEXT)}>
      <Icon size={15} aria-hidden="true" />
      {`${up ? "+" : ""}${pct.toFixed(1)}% vs prior`}
    </span>
  );
}

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
              "h-9 rounded-lg px-3.5 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-orange-700 font-semibold text-white" : cx("font-medium", TEXT_MUTED, "hover:bg-white hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
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

export function useElementWidth<T extends HTMLElement>(fallback: number): { ref: RefObject<T | null>; width: number } {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number) => setWidth(Math.max(220, Math.round(w)));
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

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
