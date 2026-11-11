"use client";

import type { ReactNode } from "react";

/**
 * Shared visual primitives for the Trestle console.
 *
 * Font-weight budget for the whole route is exactly three rendered weights: 400 (regular body,
 * captions, data), 500 (field labels, nav, secondary headers) and 600 (page title, card titles,
 * headline numbers, primary buttons). `font-bold`/700 is never used anywhere, including on
 * elements with a UA-default bold (headings, <th>, <strong>) — every leaf text node below carries
 * an explicit weight class instead of relying on inheritance.
 */

// A real, opaque, visible focus outline — never `ring-*`/`ring-offset-*` (paints transparent in
// this Tailwind v4 setup) and never paired with `outline-none` anywhere in this route.
export const FOCUS_RING_CLASS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export function Card({
  children,
  className = "",
  padded = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-white/10 bg-zinc-900/60 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${
        padded ? "p-5 sm:p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  /** "amber" for a warning-context label; never combine with an arbitrary color className — two
   * conflicting Tailwind color utilities in one className string race on generation order, not
   * source order, so color is a prop here instead of a free-form class override. */
  tone?: "neutral" | "amber";
}) {
  return (
    <span
      className={`text-[11px] font-medium uppercase tracking-[0.08em] ${
        tone === "amber" ? "text-amber-400/90" : "text-zinc-400"
      }`}
    >
      {children}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-zinc-950/60 p-1"
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.key)}
            className={`${FOCUS_RING_CLASS} h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors ${
              active ? "bg-violet-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function IconButton({
  children,
  label,
  onClick,
  active = false,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${FOCUS_RING_CLASS} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
        active
          ? "border-violet-400/30 bg-violet-400/10 text-violet-400"
          : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

export function Popover({
  open,
  onClose,
  anchorLabel,
  children,
  widthClass = "w-72",
  role = "menu",
}: {
  open: boolean;
  onClose: () => void;
  anchorLabel: string;
  children: ReactNode;
  widthClass?: string;
  /** "menu" for action lists (use PopoverItem children); "region" for read-only content. */
  role?: "menu" | "region";
}) {
  if (!open) return null;
  return (
    <>
      <button
        type="button"
        aria-label={`Close ${anchorLabel}`}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />
      <div
        role={role}
        aria-label={anchorLabel}
        className={`absolute right-0 top-full z-50 mt-2 ${widthClass} rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl shadow-black/50`}
      >
        {children}
      </div>
    </>
  );
}

export function PopoverItem({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`${FOCUS_RING_CLASS} flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-normal text-zinc-400 hover:bg-white/5 hover:text-zinc-50`}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}
