"use client";

import { useEffect, type ReactNode, type RefObject } from "react";
import { AlertTriangle } from "lucide-react";
import { FOCUS_RING } from "./data";

export { FOCUS_RING };

/** Joins class fragments, skipping falsy ones. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Closes an open popover/menu on outside pointer-down or Escape. Shared by
 *  every dismissible popover in the shell so they behave identically. */
export function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!active) return;
    function handlePointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [active, ref, onDismiss]);
}

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
      className={cx(
        "rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)]",
        padded && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "amber" | "emerald" | "rose";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-600",
    amber: "bg-amber-100 text-zinc-900",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

/** The bottleneck flag: icon + text label together, never color alone. */
export function BottleneckBadge({ className }: { className?: string }) {
  return (
    <Badge tone="amber" className={cx("border border-amber-300", className)}>
      <AlertTriangle aria-hidden className="h-3 w-3" />
      Bottleneck
    </Badge>
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
      className={cx(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors",
        FOCUS_RING,
        active ? "border-amber-300 bg-amber-50 text-zinc-900" : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap items-center gap-0.5 rounded-lg bg-zinc-100 p-1">
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
              "h-8 whitespace-nowrap rounded-md px-2.5 text-[12.5px] font-medium transition-colors sm:px-3",
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
