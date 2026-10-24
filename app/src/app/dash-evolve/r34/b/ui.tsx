"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Circle, ShieldCheck, TriangleAlert } from "lucide-react";
import type { VendorStatus } from "./data";

/**
 * Shared, local-only component system for this route. Kept intentionally small: a Card shell,
 * a status Badge, a two-state SegmentedControl, a Progress bar and a Sparkline, plus one hook
 * for dismissable popovers (used by the top bar menus and the workspace switcher).
 *
 * Typography weight budget for the whole page: exactly three rendered weights —
 * 400 (default, unset), 600 (font-semibold: titles, nav, table headers) and 700 (font-bold: the
 * h1 and the big KPI figures). Nothing in this file ever reaches for font-medium.
 */

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Comp = Tag;
  return (
    <Comp
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </Comp>
  );
}

const STATUS_META: Record<
  VendorStatus,
  { label: string; icon: typeof Check; classes: string }
> = {
  preferred: {
    label: "Preferred",
    icon: ShieldCheck,
    classes: "bg-lime-50 text-lime-800 border-lime-200",
  },
  standard: {
    label: "Standard",
    icon: Circle,
    classes: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
  "at-risk": {
    label: "At risk",
    icon: TriangleAlert,
    classes: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

export function StatusBadge({ status }: { status: VendorStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${meta.classes}`}
    >
      <Icon aria-hidden="true" className="h-3 w-3" strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-9 rounded-md px-3 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${
              active
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({
  value,
  color,
  colorClassName = "bg-lime-700",
  trackClassName = "bg-zinc-100",
}: {
  value: number;
  /** Hex color for the fill — takes precedence over colorClassName, for per-series swatches that
   *  come from a palette of raw hex values rather than Tailwind tokens. */
  color?: string;
  colorClassName?: string;
  trackClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className={`h-full rounded-full transition-[width] motion-reduce:transition-none ${color ? "" : colorClassName}`}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function Sparkline({
  values,
  color = "#4D7C0F",
  width = 64,
  height = 22,
  label,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  label: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className="overflow-visible"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r={1.8} fill={color} />
    </svg>
  );
}

/** Dismissable popover state: closes on outside pointerdown and on Escape, and returns focus to
 *  the trigger when it closes via Escape or outside click. Each consumer wires its own trigger
 *  and panel refs so focus-return targets the right button. */
export function useDismissable(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return { panelRef, triggerRef };
}

export function useAnnouncer(timeoutMs = 2600) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function announce(text: string) {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), timeoutMs);
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { message, announce };
}

export function InitialsAvatar({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-full bg-zinc-900 text-[11px] text-white ${className}`}
    >
      {initials}
    </span>
  );
}
