"use client";

/**
 * Trellis component system — the small, strict set every surface in this console is built from.
 * Radius 10px on cards / 6px on controls, one hairline (zinc-200), one shadow, 4px spacing rhythm.
 *
 * Focus: `FOCUS_RING` deliberately avoids both dead idioms — no ring offset utility (Tailwind v4
 * paints that ring fully transparent) and no bare outline reset in front of a focus-visible
 * outline (it sets --tw-outline-style to none and cancels the very rule that follows).
 */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

export const LABEL =
  "text-[11px] font-medium uppercase tracking-[0.09em] text-zinc-600";

export function Card({
  children,
  className = "",
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`min-w-0 rounded-[10px] border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "cool";
}) {
  const tones: Record<string, string> = {
    neutral: "border-zinc-200 bg-zinc-50 text-zinc-700",
    accent: "border-orange-200 bg-orange-50 text-orange-800",
    cool: "border-slate-200 bg-slate-50 text-slate-700",
  };
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full border px-2 text-[11px] font-medium tracking-[0.02em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-11 items-center gap-[3px] rounded-[8px] border border-zinc-200 bg-zinc-50 p-[3px]"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`h-9 rounded-[6px] px-3 text-[13px] font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
              active
                ? "bg-white text-zinc-900 shadow-[0_1px_2px_rgba(24,24,27,0.08)] ring-1 ring-zinc-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
        active
          ? "border-orange-300 bg-orange-50 text-orange-800"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
      }`}
    >
      {active ? <Check aria-hidden="true" className="size-3.5" /> : null}
      <span>{children}</span>
      {count ? <span className="tabular-nums text-zinc-600">{count}</span> : null}
    </button>
  );
}

export function Popover({
  triggerContent,
  triggerClassName = "",
  panelClassName = "",
  align = "start",
  children,
}: {
  triggerContent: ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
  align?: "start" | "end";
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={`${FOCUS_RING} ${triggerClassName}`}
      >
        {triggerContent}
      </button>
      {open ? (
        <div
          id={panelId}
          className={`absolute top-[calc(100%+6px)] z-40 rounded-[10px] border border-zinc-200 bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(24,24,27,0.28)] animate-[rise_.14s_ease-out] motion-reduce:animate-none ${
            align === "end" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

export function PopoverItem({
  onClick,
  selected = false,
  children,
  meta,
}: {
  onClick: () => void;
  selected?: boolean;
  children: ReactNode;
  meta?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-2 rounded-[6px] px-2.5 py-2 text-left text-[13px] transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
        selected ? "bg-orange-50 text-orange-900" : "text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      <span className="flex-1 truncate">{children}</span>
      {meta ? <span className="shrink-0 text-[11px] tabular-nums text-zinc-600">{meta}</span> : null}
      {selected ? <Check aria-hidden="true" className="size-4 shrink-0 text-orange-700" /> : null}
    </button>
  );
}

export function Avatar({
  initials,
  name,
  size = 32,
  tone = "accent",
}: {
  initials: string;
  name: string;
  size?: number;
  tone?: "accent" | "cool" | "ink";
}) {
  const tones: Record<string, { bg: string; fg: string }> = {
    accent: { bg: "#FFEDD5", fg: "#7C2D12" },
    cool: { bg: "#E2E8F0", fg: "#1E293B" },
    ink: { bg: "#27272A", fg: "#FAFAFA" },
  };
  const palette = tones[tone];
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        backgroundColor: palette.bg,
        color: palette.fg,
        fontSize: Math.round(size * 0.4),
      }}
    >
      <span aria-hidden="true">{initials}</span>
      <span className="sr-only">{name}</span>
    </span>
  );
}

/** Deterministic sparkline. Coordinates are rounded to 2 decimals so SSR and CSR agree exactly. */
export function Sparkline({
  values,
  className = "block h-[22px] w-full",
  stroke = "#C2410C",
  fill = "#FFEDD5",
}: {
  values: number[];
  className?: string;
  stroke?: string;
  fill?: string;
}) {
  const width = 100;
  const height = 24;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((value, index) => {
    const x = Math.round(index * step * 100) / 100;
    const y =
      Math.round((height - 2 - (Math.max(0, Math.min(100, value)) / 100) * (height - 4)) * 100) / 100;
    return `${x},${y}`;
  });
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <polygon points={`0,${height} ${points.join(" ")} ${width},${height}`} fill={fill} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function SortIndicator({ state }: { state: "none" | "asc" | "desc" }) {
  return (
    <ChevronDown
      aria-hidden="true"
      className={`size-3.5 shrink-0 transition-transform duration-150 motion-reduce:transition-none ${
        state === "none" ? "text-zinc-500" : "text-orange-700"
      } ${state === "asc" ? "rotate-180" : ""}`}
    />
  );
}
