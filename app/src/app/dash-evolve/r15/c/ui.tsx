"use client";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { SignificanceState, Tone } from "./tokens";
import { BORDER, CARD, FOCUS_VISIBLE, SIGNIFICANCE_LABEL, SIGNIFICANCE_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <div id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </div>
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
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
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

export function Badge({ tone, Icon, children }: { tone: { text: string; bg: string; border: string }; Icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const SIGNIFICANCE_ICON: Record<SignificanceState, LucideIcon> = {
  "significant-positive": CheckCircle2,
  "significant-negative": AlertTriangle,
  "not-yet": Clock,
};

/** Significance is always color + icon + text together — never color alone. */
export function SignificanceBadge({ state, className }: { state: SignificanceState; className?: string }) {
  const tone = TONE[SIGNIFICANCE_TONE[state]];
  const Icon = SIGNIFICANCE_ICON[state];
  return (
    <Badge tone={tone} Icon={Icon}>
      <span className={className}>{SIGNIFICANCE_LABEL[state]}</span>
    </Badge>
  );
}

/* ---------------------------------------------------------------- Dot tone */

export function ToneDot({ tone }: { tone: Tone }) {
  return <span aria-hidden="true" className={cx("inline-block h-1.5 w-1.5 shrink-0 rounded-full", TONE[tone].dot)} />;
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
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex flex-wrap items-center gap-0.5 rounded-lg border p-0.5", BORDER, "bg-zinc-950/60")}>
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
              active ? "bg-zinc-800 text-zinc-50 font-semibold" : cx(TEXT_CAPTION, "hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Switch */

export function ToggleSwitch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 select-none">
      <span className={cx("text-xs font-medium", TEXT_CAPTION)}>{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-6 w-11 shrink-0 rounded-full border",
          BORDER,
          TRANSITION,
          FOCUS_VISIBLE,
          checked ? "bg-cyan-400/90" : "bg-zinc-800",
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-0.5 h-4 w-4 rounded-full bg-zinc-950 shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}
