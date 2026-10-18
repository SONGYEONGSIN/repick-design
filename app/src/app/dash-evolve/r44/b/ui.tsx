"use client";

import { useEffect, useId, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject } from "react";

/** Closes an open popover/menu on outside pointer-down or Escape. One shared
 * hook so every popover in the shell behaves identically. */
export function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!active) return;
    function handlePointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss();
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

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Explicit painted outline — never a bare `outline-none` + `ring` pairing,
 * which this repo's Tailwind v4 setup renders fully transparent. */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

export function Card({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white shadow-sm", padded && "p-5 sm:p-6", className)}>
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
  tone?: "neutral" | "good" | "watch" | "critical" | "accent";
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-600",
    good: "bg-emerald-50 text-emerald-700",
    watch: "bg-amber-50 text-amber-700",
    critical: "bg-rose-50 text-rose-700",
    accent: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1 overflow-hidden rounded-full px-2.5 py-1 text-xs font-medium", toneClasses[tone], className)}>
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
  size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-100 p-1">
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
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
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
        active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
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
    <span aria-hidden="true" className={cn("inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700", className)}>
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
    accent: "bg-emerald-600",
    warn: "bg-amber-500",
    danger: "bg-rose-500",
  };
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={round2(value)} aria-valuemin={0} aria-valuemax={max} className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
      <div className={cn("h-full rounded-full", toneClasses[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Deterministic CSV download via a Blob URL — no server round trip, no
 * timestamped filename. */
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
    <div role="tablist" aria-label={label} onKeyDown={handleKeyDown} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200">
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
            className={cn("relative -mb-px pb-2.5 text-sm font-medium transition-colors motion-reduce:transition-none", FOCUS_RING, active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900")}
          >
            {item.label}
            <span aria-hidden="true" className={cn("absolute inset-x-0 -bottom-px h-0.5 rounded-full", active ? "bg-emerald-600" : "bg-transparent")} />
          </button>
        );
      })}
    </div>
  );
}
