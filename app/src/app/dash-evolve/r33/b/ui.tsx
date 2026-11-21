"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { ZoneStatus } from "./data";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

const STATUS_STYLES: Record<ZoneStatus, string> = {
  "on-track": "bg-[#3f9c90]/15 text-[#8fcdc2] border-[#3f9c90]/30",
  watch: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  "at-risk": "bg-rose-400/10 text-rose-300 border-rose-400/25",
};

const STATUS_DOT: Record<ZoneStatus, string> = {
  "on-track": "bg-[#8fcdc2]",
  watch: "bg-amber-300",
  "at-risk": "bg-rose-300",
};

export function StatusBadge({ status, label }: { status: ZoneStatus; label: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 tracking-tight",
        STATUS_STYLES[status]
      )}
    >
      <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[status])} aria-hidden="true" />
      {label}
    </span>
  );
}

export function InitialsAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-zinc-50",
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-900 p-0.5"
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md px-3 py-1.5 text-[12.5px] font-medium leading-4 transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]",
              selected ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:text-zinc-50"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortIcon({ direction }: { direction: "ascending" | "descending" | "none" }) {
  if (direction === "ascending") return <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />;
  if (direction === "descending") return <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />;
  return <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />;
}

/** Deterministic inline sparkline. Coordinates are derived once per render from fixed array
 *  indices (not randomized or time-based) and rounded to 2 decimals before being written into the
 *  `points` attribute, so server and client markup always match byte-for-byte. */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  stroke = "currentColor",
}: {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1);
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const points = data
    .map((v, i) => {
      const x = round2(i * stepX);
      const y = round2(height - ((v - min) / span) * height);
      return `${x},${y}`;
    })
    .join(" ");
  const last = data[data.length - 1];
  const lastX = round2((data.length - 1) * stepX);
  const lastY = round2(height - ((last - min) / span) * height);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true" className="overflow-visible">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.2} fill={stroke} />
    </svg>
  );
}

/** Closes on outside click or Escape. Shared by the command palette and any popover-style surface. */
export function useDismissable(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && e.target instanceof Node && !ref.current.contains(e.target)) onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, ref]);
}

export function useFocusTrapReturn(open: boolean) {
  const lastActive = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      lastActive.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (lastActive.current && document.contains(lastActive.current)) {
      lastActive.current.focus();
    }
  }, [open]);
}
