"use client";

import type { LucideIcon } from "lucide-react";
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
              active ? "bg-blue-600 font-semibold text-white" : cx("font-medium", TEXT_MUTED, "hover:bg-white/[0.06] hover:text-zinc-50"),
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
    <div role="tablist" aria-label={ariaLabel} className={cx("flex items-center gap-1 border-b", BORDER)}>
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
            <span aria-hidden="true" className={cx("absolute inset-x-2 -bottom-px h-0.5 rounded-full", active ? "bg-blue-500" : "bg-transparent")} />
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, label, tone = "accent" }: { value: number; label: string; tone?: "accent" | "danger" | "ok" }) {
  const pct = Math.max(0, Math.min(100, value));
  const fill = tone === "danger" ? "bg-red-500" : tone === "ok" ? "bg-green-500" : "bg-blue-500";
  return (
    <div className="w-full min-w-0">
      <div role="progressbar" aria-label={label} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} className="h-1.5 w-full min-w-[3.5rem] overflow-hidden rounded-full bg-white/10">
        <div className={cx("h-full rounded-full", fill)} style={{ width: `${r2(pct)}%` }} />
      </div>
    </div>
  );
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function Sparkline({ values, className, colorClass = "stroke-blue-400" }: { values: number[]; className?: string; colorClass?: string }) {
  const w = 64;
  const h = 22;
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
