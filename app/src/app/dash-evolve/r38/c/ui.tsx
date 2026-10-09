"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ACCENT_SOLID, BORDER, CARD, FOCUS, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <section id={id} className={cx(CARD, padded && "p-4 sm:p-5", "min-w-0", className)}>
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
              "h-8 whitespace-nowrap rounded-lg px-3 text-xs",
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

/** Tabs — visually similar footprint to Segmented but a distinct ARIA pattern (tablist/tab) used
 * where the choice swaps the content's underlying metric rather than a view-wide filter. */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  panelId,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  /** Id of the single shared panel all tabs control — its content swaps in place as `value`
   * changes, rather than each tab owning a separate panel subtree. */
  panelId?: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-xl border p-0.5", BORDER, SURFACE_INSET)}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            onClick={() => onChange(opt.id)}
            className={cx(
              "h-8 whitespace-nowrap rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-white/10 font-semibold text-zinc-50" : cx("font-medium", TEXT_MUTED, "hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className={cx("h-1.5 w-full overflow-hidden rounded-full", SURFACE_INSET)}>
        <div className="h-full rounded-full bg-sky-400" style={{ width: `${pct}%` }} />
      </div>
      <p className={cx("mt-1.5 text-[11px] font-normal", TEXT_AUX)}>{label}</p>
    </div>
  );
}

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const w = 72;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = Math.round(i * step * 100) / 100;
    const y = Math.round((h - ((v - min) / span) * h) * 100) / 100;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function StatValue({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(NUM, "text-right", className)}>{children}</span>;
}

/** Closes `onClose` on Escape or on a pointerdown outside the returned ref's element. */
export function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current && ref.current.contains(target)) return;
      onClose();
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

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
