"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { OrderStatus } from "./data";
import { STATUS_ICON, STATUS_LABEL, STATUS_TONE } from "./data";
import type { Tone } from "./tokens";
import { BORDER, CARD, FOCUS, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";

/* ------------------------------------------------------------------- Card */

export function Card({
  children,
  className,
  id,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  padded?: boolean;
}) {
  return (
    <section id={id} className={cx(CARD, padded && "p-4 sm:p-5", "min-w-0", className)}>
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
  Icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
        {description ? <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, muted, className }: { children: ReactNode; muted?: boolean; className?: string }) {
  return (
    <span className={cx("text-[11px] font-medium uppercase tracking-wider", muted ? TEXT_CAPTION_MUTED : TEXT_CAPTION, className)}>
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- Badges */

export function Badge({ tone, Icon, children }: { tone: Tone; Icon?: LucideIcon; children: ReactNode }) {
  const t = TONE[tone];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4", t.text, t.bg, t.border)}>
      {Icon ? <Icon size={11} aria-hidden="true" className="shrink-0" /> : null}
      {children}
    </span>
  );
}

/** Status always carries colour + icon + text together — never colour alone. */
export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]} Icon={STATUS_ICON[status]}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

/* ------------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx("inline-flex flex-wrap items-center gap-0.5 rounded-xl border p-0.5", BORDER, "bg-zinc-100")}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={cx(
              size === "md" ? "h-10 px-3.5" : "h-9 px-3",
              "rounded-lg text-xs",
              TRANSITION,
              FOCUS,
              active ? "bg-white font-semibold text-zinc-900 shadow-sm shadow-zinc-950/[0.06]" : cx("font-medium", TEXT_CAPTION_MUTED, "hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Stat tile */

export function StatTile({
  label,
  value,
  sub,
  Icon,
  highlighted,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  Icon?: LucideIcon;
  highlighted?: boolean;
}) {
  return (
    <div className={cx(CARD, "min-w-0 p-4", highlighted && "border-blue-300 bg-blue-50/60")}>
      <div className="flex items-center gap-1.5">
        {Icon ? <Icon size={13} aria-hidden="true" className={highlighted ? "text-blue-700" : TEXT_CAPTION} /> : null}
        <span className={cx("truncate text-[11px] font-medium uppercase tracking-wider", highlighted ? "text-blue-800" : TEXT_CAPTION)}>{label}</span>
      </div>
      <p className={cx("mt-1.5 text-2xl font-semibold tabular-nums leading-none tracking-tight", TEXT_PRIMARY)}>{value}</p>
      {sub ? <p className={cx("mt-1.5 truncate text-xs font-normal", TEXT_CAPTION)}>{sub}</p> : null}
    </div>
  );
}

/* ---------------------------------------------------------- Progress meter */

export function LoadBar({ pct, muted }: { pct: number; muted?: boolean }) {
  return (
    <span aria-hidden="true" className="block h-2 w-full overflow-hidden rounded-full bg-zinc-100">
      <span
        className={cx("block h-full rounded-full", muted ? "bg-zinc-300" : "bg-blue-500")}
        style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
      />
    </span>
  );
}

/* ------------------------------------------------------------ Outside close */

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
