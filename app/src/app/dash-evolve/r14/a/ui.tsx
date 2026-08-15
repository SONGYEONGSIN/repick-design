"use client";

import { Check, ChevronDown, Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BORDER, CARD, FOCUS_VISIBLE, FOCUS_VISIBLE_INSET, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

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
  return <span className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({
  tone,
  Icon,
  children,
}: {
  tone: { text: string; bg: string; border: string };
  Icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Trend */

export function TrendPill({ good, direction, label }: { good: boolean; direction: "up" | "down" | "flat"; label: string }) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  return (
    <span className={cx("inline-flex items-center gap-1 text-[11px] font-medium", good ? "text-emerald-700" : "text-rose-700")}>
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

/* -------------------------------------------------------- Avatar fallback */

export function InitialsAvatar({ initials, size = 28, className }: { initials: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cx("grid shrink-0 place-items-center rounded-full border text-[10px] font-semibold", BORDER, "bg-zinc-100 text-zinc-600", className)}
    >
      {initials}
    </span>
  );
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
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex flex-wrap items-center gap-0.5 rounded-lg border p-0.5", BORDER, "bg-zinc-50")}>
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
              active ? cx(CARD, TEXT_PRIMARY, "font-semibold") : cx("text-zinc-600 hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- Listbox menu */

export type MenuOption<T extends string> = { id: T; label: string };

/** Button + popover listbox — used for the rail sort control and the workspace switcher. */
export function ListboxMenu<T extends string>({
  label,
  options,
  value,
  onChange,
  triggerIcon: TriggerIcon,
}: {
  label: string;
  options: MenuOption<T>[];
  value: T;
  onChange: (id: T) => void;
  triggerIcon?: LucideIcon;
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
        className={cx(
          "flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium",
          BORDER,
          "bg-white text-zinc-700",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_VISIBLE,
        )}
      >
        {TriggerIcon ? <TriggerIcon size={13} aria-hidden="true" className={TEXT_CAPTION} /> : null}
        <span className="sr-only">{label}: </span>
        {current?.label}
        <ChevronDown size={13} aria-hidden="true" className={TEXT_CAPTION} />
      </button>
      {open ? (
        <div role="listbox" aria-label={label} className={cx("absolute right-0 top-full z-30 mt-1.5 w-48 overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg")}>
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
                  FOCUS_VISIBLE_INSET,
                  selected ? "bg-teal-50 text-teal-800 font-semibold" : cx(TEXT_PRIMARY, HOVER_ACTIVE_BG),
                )}
              >
                {opt.label}
                {selected ? <Check size={14} aria-hidden="true" className="shrink-0 text-teal-700" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
