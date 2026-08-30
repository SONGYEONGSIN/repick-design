"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

/**
 * Focus-visible utilities, box-shadow based on purpose.
 *
 * Two known-dead idioms are avoided project-wide: `ring-2`/`ring-offset-*` render fully transparent
 * in this Tailwind v4 setup, and `outline-none` paired with a later `focus-visible:outline-*` cancels
 * the later rule via a custom property. Neither is used here — the focus indicator is a literal
 * `box-shadow` arbitrary value, which Tailwind v4 does paint, and `outline-none` appears alone (never
 * followed by `outline-*`) purely to suppress the default ring underneath our own.
 */
export const FOCUS_LIGHT =
  "outline-none focus-visible:[box-shadow:0_0_0_2px_#ffffff,0_0_0_4.5px_#B45309]";
export const FOCUS_DARK =
  "outline-none focus-visible:[box-shadow:0_0_0_2px_#18181b,0_0_0_4.5px_#FBBF24]";

export function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({
  children,
  className,
  padded = true,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "div" | "section";
}) {
  return (
    <As
      className={cx(
        "rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)]",
        padded && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </As>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
const BADGE_TONE: Record<string, string> = {
  neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: "neutral" | "amber" | "red" | "emerald";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-tight whitespace-normal",
        BADGE_TONE[tone],
        className,
      )}
    >
      {icon}
      <span className="break-words">{children}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// ProgressBar
// ---------------------------------------------------------------------------
export function ProgressBar({
  value,
  max = 100,
  tone = "amber",
  label,
}: {
  value: number;
  max?: number;
  tone?: "amber" | "emerald" | "zinc";
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const fill = tone === "amber" ? "bg-amber-600" : tone === "emerald" ? "bg-emerald-600" : "bg-zinc-500";
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "progress"}
      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
    >
      {/* Animates `transform: scaleX(...)` rather than `width` — width/height/top/left are layout
          properties and off-limits for animation per this project's dash motion rules; transform is
          compositor-only and never triggers reflow. */}
      <div
        className={cx("h-full w-full origin-left rounded-full transition-transform duration-200 motion-reduce:transition-none", fill)}
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline — deterministic linear-scale polyline, coordinates rounded to 2 decimals.
// ---------------------------------------------------------------------------
export function Sparkline({
  values,
  width = 120,
  height = 32,
  tone = "#B45309",
  strokeWidth = 1.75,
  fill = true,
}: {
  values: number[];
  width?: number;
  height?: number;
  tone?: string;
  strokeWidth?: number;
  fill?: boolean;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1 || 1);
  const pad = strokeWidth;
  const points = values.map((v, i) => {
    const x = Math.round(i * stepX * 100) / 100;
    const y = Math.round((height - pad - ((v - min) / span) * (height - pad * 2)) * 100) / 100;
    return { x, y };
  });
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const last = points[points.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden="true">
      {fill && <polygon points={area} fill={tone} opacity={0.08} />}
      <polyline points={line} fill="none" stroke={tone} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={strokeWidth + 1} fill={tone} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SegmentedControl
// ---------------------------------------------------------------------------
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        "inline-flex items-center gap-0.5 rounded-lg bg-zinc-100 p-0.5",
        size === "sm" ? "text-[11px]" : "text-[12px]",
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md font-medium transition-colors motion-reduce:transition-none",
              size === "sm" ? "px-2 py-1" : "px-2.5 py-1.5",
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
              FOCUS_LIGHT,
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex items-center gap-5 border-b border-zinc-200">
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.value)}
            className={cx(
              "relative -mb-px py-2.5 text-[13px] font-medium transition-colors motion-reduce:transition-none",
              isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700",
              FOCUS_LIGHT,
            )}
          >
            {t.label}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-amber-700" />}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popover — minimal dropdown used by the workspace switcher, avatar menu, notifications.
// ---------------------------------------------------------------------------
interface PopoverButtonProps {
  "aria-expanded": boolean;
  "aria-haspopup": "menu";
  "aria-controls": string;
}

export function Popover({
  trigger,
  children,
  align = "left",
  panelClassName,
}: {
  trigger: (props: { open: boolean; toggle: () => void; buttonProps: PopoverButtonProps }) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {trigger({
        open,
        toggle: () => setOpen((o) => !o),
        buttonProps: { "aria-expanded": open, "aria-haspopup": "menu", "aria-controls": id },
      })}
      {open && (
        <div
          id={id}
          role="menu"
          className={cx(
            "absolute z-30 mt-2 min-w-[220px] rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            "motion-safe:animate-[rise_120ms_ease-out]",
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function PopoverItem({
  children,
  onSelect,
  selected,
}: {
  children: ReactNode;
  onSelect?: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cx(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50",
        FOCUS_LIGHT,
      )}
    >
      <span>{children}</span>
      {selected && <Check className="h-3.5 w-3.5 text-amber-700" strokeWidth={2.5} />}
    </button>
  );
}

export function ChevronToggle({ open }: { open: boolean }) {
  return <ChevronDown className={cx("h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform motion-reduce:transition-none", open && "rotate-180")} />;
}
