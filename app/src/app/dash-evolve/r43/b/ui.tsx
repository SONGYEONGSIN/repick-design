"use client";

import { useEffect, useId, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject } from "react";

/** Closes an open popover/menu on outside pointer-down or Escape. One
 * shared hook so every popover in the shell (workspace switcher,
 * notifications, avatar menu, command palette) behaves identically. */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) return;
    function handlePointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss();
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [active, ref, onDismiss]);
}

/** Joins class-name fragments, skipping falsy ones. Local, no dependency. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Shared focus treatment — an explicit painted outline, never a bare
 * `outline-none` + `ring` pairing (which Tailwind v4 renders fully
 * transparent in this setup), so focus is visible regardless of what
 * else is stacked on the element. */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        padded && "p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "up" | "down" | "accent" | "watch";
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-white/5 text-zinc-300",
    up: "bg-emerald-400/10 text-emerald-300",
    down: "bg-rose-400/10 text-rose-300",
    accent: "bg-teal-400/10 text-teal-300",
    watch: "bg-amber-400/10 text-amber-300",
  };
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
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
  size = "md",
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  /** "sm" fits a control into a tight card (e.g. a KPI tile) without
   * shrinking below the 24px target-size floor; "md" (default) is the
   * standard toolbar size used everywhere else. */
  size?: "sm" | "md";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-1"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-md font-medium transition-colors motion-reduce:transition-none",
              size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm",
              FOCUS_RING,
              active ? "bg-zinc-800 text-zinc-50" : "text-zinc-400 hover:text-zinc-100",
            )}
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
  className,
  type = "button",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors motion-reduce:transition-none",
        FOCUS_RING,
        active
          ? "border-teal-400/30 bg-teal-400/10 text-teal-300"
          : "border-white/10 bg-zinc-900 text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-medium text-zinc-200",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function Progress({
  value,
  max = 100,
  tone = "accent",
  label,
}: {
  value: number;
  max?: number;
  tone?: "accent" | "warn" | "danger";
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, round2((value / max) * 100)));
  const toneClasses: Record<string, string> = {
    accent: "bg-teal-400",
    warn: "bg-amber-400",
    danger: "bg-rose-400",
  };
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={round2(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
    >
      <div
        className={cn("h-full rounded-full", toneClasses[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Builds a CSV from headers + rows and triggers a browser download via
 * a Blob URL — a real, working client-side export with no server round
 * trip and a fully static, deterministic filename (no timestamp). */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface TabItem {
  id: string;
  label: string;
}

/** Accessible tab list: roving tabindex, arrow-key navigation, and a
 * single active `tabpanel` per selection — a structurally distinct
 * widget from `SegmentedControl` (which is a `radiogroup`, not tabs). */
export function Tabs({
  items,
  value,
  onChange,
  panelId,
  label,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  panelId: string;
  label: string;
}) {
  const baseId = useId();

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((i) => i.id === value);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(items[(index + 1) % items.length].id);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(items[(index - 1 + items.length) % items.length].id);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="inline-flex items-center gap-4 border-b border-white/10"
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            id={`${baseId}-${item.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative -mb-px pb-2.5 text-sm font-medium transition-colors motion-reduce:transition-none",
              FOCUS_RING,
              active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-px h-0.5 rounded-full",
                active ? "bg-teal-400" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
