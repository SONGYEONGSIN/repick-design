"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BORDER, CARD, FOCUS, NUM, PANEL_BG, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TRANSITION, cx } from "./tokens";
import { formatSignedPercent } from "./format";

export function Card({
  children,
  className,
  padded = true,
  as = "section",
  ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "section" | "div";
  ariaLabelledBy?: string;
}) {
  const Tag = as;
  return (
    <Tag className={cx(CARD, padded && "p-4 sm:p-5", className)} {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}>
      {children}
    </Tag>
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
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-xl border p-0.5", BORDER, SURFACE_INSET)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "h-9 whitespace-nowrap rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-rose-700 font-semibold text-white" : cx("font-medium", TEXT_MUTED, "hover:bg-white hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Sparkline({ values, ariaLabel, stroke = "#e11d48" }: { values: number[]; ariaLabel: string; stroke?: string }) {
  const w = 160;
  const h = 40;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = Math.round(((i / (values.length - 1)) * w) * 100) / 100;
      const y = Math.round((h - ((v - min) / range) * (h - 6) - 3) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  const last = points.split(" ").pop()!.split(",").map(Number);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={ariaLabel} className="max-w-full">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke} />
    </svg>
  );
}

export function Delta({ value }: { value: number }) {
  const Icon = value > 0.05 ? TrendingUp : value < -0.05 ? TrendingDown : Minus;
  const tone = value > 0.05 ? "text-rose-600" : value < -0.05 ? "text-emerald-600" : "text-zinc-500";
  return (
    <span className={cx("inline-flex items-center gap-1 text-xs font-semibold", NUM, tone)}>
      <Icon size={13} aria-hidden="true" />
      {formatSignedPercent(value)}
    </span>
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

export { PANEL_BG };
