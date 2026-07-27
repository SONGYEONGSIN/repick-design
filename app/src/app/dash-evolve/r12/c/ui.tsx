"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BORDER, CARD, FOCUS_RING_INSET, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx, rateTone, type Tone } from "./tokens";

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
  Icon,
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <Tag id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            {title}
          </Tag>
        </div>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone, Icon, children }: { tone: { text: string; bg: string; border: string }; Icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={11} aria-hidden="true" /> : null}
      {children}
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
  options: { value: T; label: string; Icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-lg border p-0.5", BORDER, "bg-zinc-50 dark:bg-zinc-900")}>
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
              "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
              TRANSITION,
              FOCUS_RING_INSET,
              active ? cx(CARD, "shadow-sm", TEXT_PRIMARY) : cx(TEXT_CAPTION, "hover:text-zinc-900 dark:hover:text-zinc-100"),
            )}
          >
            {opt.Icon ? <opt.Icon size={13} aria-hidden="true" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------- Switch */

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border",
        TRANSITION,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-950",
        checked ? "border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500" : cx(BORDER, "bg-zinc-100 dark:bg-zinc-800"),
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cx(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150 ease-out motion-reduce:transition-none dark:bg-zinc-950",
          checked ? "translate-x-[22px]" : "translate-x-[3px]",
        )}
      />
    </button>
  );
}

/* -------------------------------------------------------------------- Funnel bar */

/** Always-visible-as-text completion bar for a single survey question. Pure CSS, no chart library. */
export function FunnelBar({ ratePct }: { ratePct: number | undefined }) {
  if (ratePct === undefined) {
    return <div className={cx("h-1.5 w-full rounded-full", "bg-zinc-100 dark:bg-zinc-800")} aria-hidden="true" />;
  }
  const tone: Tone = rateTone(ratePct);
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(ratePct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Completion rate"
      className={cx("h-1.5 w-full overflow-hidden rounded-full", "bg-zinc-100 dark:bg-zinc-800")}
    >
      <div className={cx("h-full rounded-full", TONE[tone].fill, TRANSITION)} style={{ width: `${Math.max(2, Math.min(100, ratePct))}%` }} />
    </div>
  );
}

/* -------------------------------------------------------------------- Selected check */

export function SelectedCheck({ className }: { className?: string }) {
  return <Check size={14} aria-hidden="true" className={className} />;
}
