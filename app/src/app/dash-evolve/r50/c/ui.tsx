"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { SortDirection } from "./types";

/**
 * Shared primitives for the Flagline console.
 *
 * Font-weight budget (exactly 3, enforced by convention across every file in this folder):
 *   font-normal (400) — body copy, table cells, secondary labels
 *   font-semibold (600) — card/column titles, badges, buttons, emphasis
 *   font-bold (700) — the wordmark and the page's key numbers (stat values, chart endpoint values)
 * font-medium / font-light / font-extrabold are never used anywhere in this folder.
 *
 * Focus ring: Tailwind v4's `ring-2` + `ring-offset-*` combination paints fully transparent
 * (`oklab(0 0 0 / 0)`) on this stack, and `outline-none` paired with a later `focus-visible:outline`
 * cancels itself via the shared `--tw-outline-style` variable. So every focusable element here uses
 * a plain `outline` utility on `:focus-visible` and never sets `outline-none` anywhere.
 */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

export function Card({
  children,
  className = "",
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  "aria-labelledby"?: string;
  style?: React.CSSProperties;
}) {
  const Comp = as;
  return (
    <Comp className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`} {...rest}>
      {children}
    </Comp>
  );
}

export function CardHeader({
  icon,
  title,
  titleId,
  action,
}: {
  icon: ReactNode;
  title: string;
  titleId: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 py-3 sm:px-5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        {icon}
      </span>
      <h2 id={titleId} className="min-w-0 flex-1 truncate text-[13px] font-semibold text-zinc-900">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function Badge({
  children,
  className = "",
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-semibold whitespace-nowrap ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  label,
  barClassName = "bg-emerald-600",
  trackClassName = "bg-zinc-100",
}: {
  value: number;
  label: string;
  barClassName?: string;
  trackClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${barClassName} motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SegmentedControl<T extends string>({
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
    <div role="group" aria-label={ariaLabel} className="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-8 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap transition-colors duration-150 ease-out ${FOCUS_RING} ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortButton({
  active,
  direction,
  onClick,
  children,
  align = "left",
}: {
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sort by ${children}, ${active ? (direction === "asc" ? "ascending" : "descending") : "not sorted"}`}
      className={`group inline-flex items-center gap-1 rounded text-[11px] font-semibold tracking-wide text-zinc-500 uppercase transition-colors duration-150 ease-out hover:text-zinc-900 ${FOCUS_RING} ${
        align === "right" ? "flex-row-reverse" : ""
      } ${active ? "text-zinc-900" : ""}`}
    >
      <span>{children}</span>
      <Icon className={`h-3 w-3 shrink-0 ${active ? "text-emerald-700" : "text-zinc-400 group-hover:text-zinc-500"}`} aria-hidden="true" />
    </button>
  );
}

/** Closes an open popover/menu/drawer on outside pointerdown or Escape. */
export function useOutsideClose<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!open) return;
    function handlePointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);
  return ref;
}

export function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="col-span-6 p-4 sm:col-span-3 sm:p-5">
      <div className="flex items-center gap-2 text-zinc-500">
        <span aria-hidden="true">{icon}</span>
        <span className="text-[11px] font-semibold tracking-wide uppercase">{label}</span>
      </div>
      <p className="mt-2 text-[26px] font-bold text-zinc-900 tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] font-normal text-zinc-500">{hint}</p>}
    </Card>
  );
}

function subscribeReducedMotion(onChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/** Reads `prefers-reduced-motion` via useSyncExternalStore — the recommended way to subscribe to an
 * external browser API, instead of setState-in-effect (which only cascades an extra render here). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}
