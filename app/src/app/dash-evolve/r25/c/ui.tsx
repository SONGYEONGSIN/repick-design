"use client";

import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BORDER, CARD, FOCUS, PANEL_BG, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

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
        {hint ? <p className={cx("mt-1 max-w-md text-xs font-normal leading-relaxed", TEXT_AUX)}>{hint}</p> : null}
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
              active ? "bg-blue-600 font-semibold text-white" : cx("font-medium", TEXT_MUTED, "hover:bg-white/[0.06] hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<T extends string>({ options, value, onChange, ariaLabel }: { options: { id: T; label: string }[]; value: T; onChange: (id: T) => void; ariaLabel: string }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cx("flex flex-wrap items-center gap-1 border-b", BORDER)}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={cx(
              "relative flex h-10 items-center px-3 text-sm",
              TRANSITION,
              FOCUS,
              active ? cx("font-semibold", TEXT_PRIMARY) : cx("font-medium", TEXT_AUX, "hover:text-zinc-200"),
            )}
          >
            {opt.label}
            <span aria-hidden="true" className={cx("absolute inset-x-2 -bottom-px h-0.5 rounded-full", active ? "bg-blue-400" : "bg-transparent")} />
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, label, colorClass = "bg-blue-400" }: { value: number; label: string; colorClass?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={cx("h-full rounded-full", colorClass)} style={{ width: `${r2(pct)}%` }} />
      </div>
    </div>
  );
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function Sparkline({ values, className, colorClass = "stroke-blue-400" }: { values: number[]; className?: string; colorClass?: string }) {
  const w = 72;
  const h = 24;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = r2((i / (values.length - 1)) * w);
    const y = r2(h - ((v - min) / span) * h);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" className={colorClass} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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

/** Generic single-select dropdown/popover — used by the manifest table's zone filter. */
export function Dropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  ariaLabel,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const current = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium", BORDER, SURFACE_INSET, TEXT_SECONDARY, "hover:bg-white/[0.06]", TRANSITION, FOCUS)}
      >
        <span className={TEXT_AUX}>{label}:</span>
        {current?.label}
        <ChevronDown size={13} aria-hidden="true" className={TEXT_AUX} />
      </button>
      {open ? (
        <div role="listbox" aria-label={ariaLabel} className={cx("absolute left-0 top-full z-40 mt-1.5 min-w-[10rem] rounded-xl border p-1", BORDER, PANEL_BG, "shadow-xl shadow-black/40")}>
          {options.map((opt) => {
            const selected = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                  TRANSITION,
                  FOCUS,
                  selected ? cx("font-semibold", "text-blue-300") : cx("font-normal", TEXT_PRIMARY, "hover:bg-white/[0.06]"),
                )}
              >
                {opt.label}
                {selected ? <Check size={14} aria-hidden="true" className="shrink-0 text-blue-400" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
