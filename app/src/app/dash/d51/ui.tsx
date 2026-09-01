"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BORDER, CARD, FOCUS, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

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

export function Eyebrow({ children, className, mono = false }: { children: ReactNode; className?: string; mono?: boolean }) {
  return (
    <span
      className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX, className)}
      style={mono ? { fontFamily: "var(--font-display-mono)" } : undefined}
    >
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
              active ? "bg-rose-600 font-semibold text-white" : cx("font-medium", TEXT_MUTED, "hover:bg-white/[0.08] hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Multi-select toggle chip — used for severity / event-type filters. `aria-pressed` carries state
 *  since several can be active at once (a radiogroup would be wrong here). */
export function Chip({ active, onClick, children, tone = "neutral" }: { active: boolean; onClick: () => void; children: ReactNode; tone?: "neutral" | "rose" }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium",
        TRANSITION,
        FOCUS,
        active
          ? tone === "rose"
            ? "border-rose-700 bg-rose-950/60 text-rose-200"
            : "border-zinc-200/80 bg-white text-zinc-900"
          : cx(BORDER, SURFACE_INSET, TEXT_MUTED, "hover:bg-white/[0.08] hover:text-zinc-50"),
      )}
    >
      {active ? <Check size={12} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const tone = pct >= 70 ? "bg-rose-500" : pct >= 40 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div className={cx("h-full rounded-full", tone)} style={{ width: `${r2(pct)}%` }} />
    </div>
  );
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
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

export function SortHeader({ label, active, dir, onClick, className }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void; className?: string }) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={cx("py-2 text-left align-bottom", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cx("inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX, "hover:text-zinc-50", TRANSITION, FOCUS, "rounded")}
      >
        {label}
        <span aria-hidden="true" className={cx("text-[9px] leading-none", active ? "text-rose-400" : "text-zinc-600")}>
          {active ? (dir === "asc" ? "▲" : "▼") : "▼"}
        </span>
      </button>
    </th>
  );
}
