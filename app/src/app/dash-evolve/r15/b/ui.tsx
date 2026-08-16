"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BORDER, CARD, FOCUS_VISIBLE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={cx(CARD, padded && "p-4 sm:p-5", className)}>{children}</div>;
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
  as: Tag = "h2",
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <Tag id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
          {title}
        </Tag>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone, children }: { tone: { text: string; bg: string; border: string; dot: string }; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", tone.text, tone.bg, tone.border)}>
      <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
      {children}
    </span>
  );
}

export function TrendPill({ good, direction, label }: { good: boolean; direction: "up" | "down" | "flat"; label: string }) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  return (
    <span className={cx("inline-flex items-center gap-1 text-[11px] font-medium", good ? "text-emerald-400" : "text-rose-400")}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------- Dropdown */

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

/* -------------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex flex-wrap items-center gap-0.5 rounded-lg border p-0.5", BORDER, "bg-white/[0.04]")}>
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
              "h-9 rounded-md px-3 text-xs font-medium",
              TRANSITION,
              FOCUS_VISIBLE,
              active ? "bg-cyan-500/20 text-cyan-200 font-semibold" : cx(TEXT_CAPTION, "hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- Capacity bar */

export function CapacityBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const tone = clamped >= 92 ? "bg-rose-400" : clamped >= 80 ? "bg-amber-400" : "bg-cyan-400";
  return (
    <div role="img" aria-label={`${clamped}% of capacity in use`} className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={cx("h-full rounded-full", tone)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
