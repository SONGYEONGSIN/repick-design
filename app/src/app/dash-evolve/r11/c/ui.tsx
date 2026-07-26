"use client";

import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BORDER, CARD, FOCUS_RING, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

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

/* -------------------------------------------------------- Facet checkbox */

export function FacetCheckbox({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className={cx("flex min-h-9 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm", TRANSITION, "hover:bg-zinc-100 dark:hover:bg-white/5")}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={cx("h-4 w-4 shrink-0 rounded border-zinc-300 text-blue-600 accent-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:accent-blue-500", FOCUS_RING)}
      />
      <span className={cx("min-w-0 flex-1 truncate", TEXT_PRIMARY)}>{label}</span>
      {count !== undefined ? <span className={cx("shrink-0 text-xs", NUM, TEXT_CAPTION)}>{count}</span> : null}
    </label>
  );
}

/* ------------------------------------------------------------ Toggle chip
 * Used for capability tags (multi-select, aria-pressed) and rating thresholds
 * (single-select, role=radio within a radiogroup — see FacetPanel). */

export function ToggleChip({
  pressed,
  onClick,
  children,
  size = "md",
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" ? "min-h-7 px-2.5 py-1 text-[11px]" : "min-h-8 px-3 py-1 text-xs",
        TRANSITION,
        FOCUS_RING,
        pressed ? cx("border-blue-600 bg-blue-50 text-blue-700", "dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-300") : cx(BORDER, "bg-white text-zinc-600 hover:bg-zinc-50", "dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5"),
      )}
    >
      {pressed ? <Check size={11} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- Badges */

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300">
        Verified
      </span>
    );
  }
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", BORDER, TEXT_CAPTION)}>
      Unverified
    </span>
  );
}

/* ------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { id: T; label: string; Icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + options.length) % options.length;
    onChange(options[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex rounded-lg border p-0.5", BORDER, "bg-zinc-100 dark:bg-zinc-950")}>
      {options.map((opt, idx) => {
        const checked = value === opt.id;
        return (
          <button
            key={opt.id}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={opt.label}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cx(
              "flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold",
              TRANSITION,
              FOCUS_RING,
              checked ? cx("bg-white shadow-sm", TEXT_PRIMARY, "dark:bg-zinc-800") : cx(TEXT_CAPTION, "hover:text-zinc-900 dark:hover:text-zinc-100"),
            )}
          >
            {opt.Icon ? <opt.Icon size={14} aria-hidden="true" /> : null}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
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

export function Dropdown<T extends string>({
  label,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
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
          "bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-white/5",
          TEXT_CAPTION,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <span className={TEXT_CAPTION}>{label}:</span>
        <span className={TEXT_PRIMARY}>{current?.label ?? "All"}</span>
        <ChevronDown size={12} aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={cx("absolute right-0 top-full z-30 mt-1.5 min-w-[12rem] overflow-hidden rounded-xl border p-1 shadow-lg", BORDER, "bg-white shadow-zinc-900/10 dark:bg-zinc-900 dark:shadow-black/40")}
        >
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
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs",
                  TRANSITION,
                  FOCUS_RING_INSET,
                  selected ? cx("bg-blue-50", TEXT_PRIMARY, "dark:bg-blue-500/15") : cx(TEXT_CAPTION, "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100"),
                )}
              >
                {opt.label}
                {selected && <Check size={13} aria-hidden="true" className="shrink-0 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export { NUM };
