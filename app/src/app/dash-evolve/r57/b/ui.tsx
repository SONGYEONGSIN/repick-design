"use client";

import { ArrowDown, ArrowUp, Minus, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  ACCENT_SOLID,
  BORDER,
  CARD,
  type Direction,
  DOWN_TEXT,
  FOCUS,
  NUM,
  r2,
  SURFACE_INSET,
  TEXT_AUX,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TRANSITION,
  UP_TEXT,
  cx,
} from "./tokens";
import { formatMultiplier, formatSignedCurrency, formatSignedPercent } from "./data";

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <section id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </section>
  );
}

export function CardHead({ title, hint, action, Icon, level = 2 }: { title: ReactNode; hint?: ReactNode; action?: ReactNode; Icon?: LucideIcon; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_AUX} /> : null}
          <Heading className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</Heading>
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

export function Badge({ children, className, Icon }: { children: ReactNode; className?: string; Icon?: LucideIcon }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap", BORDER, SURFACE_INSET, TEXT_MUTED, className)}>
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
              active ? cx(ACCENT_SOLID, "font-semibold") : cx("font-medium", TEXT_MUTED, "hover:bg-white/10 hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Direction is always paired with an icon AND a signed number — never color alone. For a cost
 * console, "up" (spend grew) is the thing to watch (amber) and "down" (spend shrank) is the good
 * outcome (cyan) — the inverse of a score dashboard, and never mixed up with the sunburst's own
 * cyan team ramp in tokens.ts. */
export function DeltaTag({ delta, direction, className, format = "currency" }: { delta: number; direction: Direction; className?: string; format?: "currency" | "percent" }) {
  const Icon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  const tone = direction === "up" ? UP_TEXT : direction === "down" ? DOWN_TEXT : TEXT_AUX;
  const text = format === "currency" ? formatSignedCurrency(delta) : formatSignedPercent(delta);
  return (
    <span className={cx("inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium", NUM, tone, className)}>
      <Icon size={12} aria-hidden="true" />
      {text}
    </span>
  );
}

/** Visually caps at 100%, but a ratio over 100% is never shown as ONLY that capped bar — the
 * explicit multiplier + an escalating (amber, icon) treatment always rides alongside it. */
export function BudgetBar({ spend, budget, label }: { spend: number; budget: number; label: string }) {
  const pct = (spend / budget) * 100;
  const clamped = Math.max(0, Math.min(100, pct));
  const over = pct > 100;
  return (
    <div>
      <div
        className={cx("h-2 w-full overflow-hidden rounded-full", SURFACE_INSET)}
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={Math.max(100, Math.round(pct))}
      >
        <div className={cx("h-full rounded-full", over ? "bg-amber-400" : "bg-cyan-400")} style={{ width: `${r2(clamped)}%` }} />
      </div>
      {over ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-300">
          <TriangleAlert size={12} aria-hidden="true" />
          {formatMultiplier(spend / budget)} over budget
        </p>
      ) : null}
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

export { r2 };
