"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Shared focus style: a real, visible outline (never ring-2/ring-offset —
// both render fully transparent in this project's Tailwind v4 setup) with a
// generous 2px width + 3px offset so it reads clearly even on compact
// controls like table sort headers or segmented-control options.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-teal-700";

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-[13px] font-semibold text-zinc-900">{title}</h2>
        {subtitle ? <p className="mt-0.5 truncate text-[12px] text-zinc-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
const BADGE_TONES = {
  neutral: "bg-zinc-100 text-zinc-700",
  teal: "bg-teal-50 text-teal-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  green: "bg-emerald-50 text-emerald-700",
  blue: "bg-sky-50 text-sky-700",
} as const;

export function Badge({
  children,
  tone = "neutral",
  dotClassName,
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
  dotClassName?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${BADGE_TONES[tone]}`}
    >
      {dotClassName ? <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}`} aria-hidden /> : null}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Avatar — generated initials-on-color badge. Replaces what were previously
// picsum.photos URLs (banned: uncontrolled/off-topic image content). Fully
// deterministic (a simple string hash, no Math.random) and needs no network
// request. Colors are drawn from hues already used elsewhere on the page so
// this doesn't introduce a new part of the palette.
// ---------------------------------------------------------------------------
const AVATAR_PALETTE = ["#0f766e", "#0d9488", "#3f3f46", "#27272a", "#52525b"];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  size = 32,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const bg = AVATAR_PALETTE[hashName(name) % AVATAR_PALETTE.length];
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ width: size, height: size, backgroundColor: bg, fontSize: Math.round(size * 0.38) }}
    >
      {initialsFor(name)}
    </span>
  );
}

export function statusTone(status: string): keyof typeof BADGE_TONES {
  switch (status) {
    case "Graded":
      return "green";
    case "Inspecting":
      return "blue";
    case "In Transit":
      return "amber";
    case "Flagged":
      return "red";
    default:
      return "neutral";
  }
}

export function riskTone(risk: string): keyof typeof BADGE_TONES {
  if (risk === "High") return "red";
  if (risk === "Medium") return "amber";
  return "neutral";
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
export function Progress({
  value,
  max,
  label,
  className = "",
  barClassName = "bg-teal-700",
  trackClassName = "bg-zinc-100",
}: {
  value: number;
  max: number;
  label?: string;
  className?: string;
  barClassName?: string;
  trackClassName?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
    >
      <div className={`h-full rounded-full transition-[width] duration-200 ${barClassName}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Segmented control
// ---------------------------------------------------------------------------
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex h-11 items-center gap-0.5 rounded-lg bg-zinc-100 p-1"
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
            className={`h-full rounded-md px-3.5 text-[13px] font-medium transition-colors ${FOCUS} ${
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

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`relative -mb-px h-9 rounded-t-md px-3 text-[12.5px] font-medium transition-colors ${FOCUS} ${
              active ? "text-teal-700" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {tab.label}
            <span
              className={`absolute inset-x-1.5 bottom-0 h-[2px] rounded-full transition-colors ${
                active ? "bg-teal-700" : "bg-transparent"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popover / dropdown — shared by workspace switcher, notifications, avatar
// menu and the table's status filter.
// ---------------------------------------------------------------------------
export function Popover({
  trigger,
  children,
  align = "left",
  width = "w-64",
}: {
  trigger: (opts: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open ? (
        <div
          className={`absolute z-30 mt-2 ${width} rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg motion-safe:animate-[rise_150ms_ease-out] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
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
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 ${FOCUS}`}
    >
      {icon ? <span className="text-zinc-500">{icon}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}
