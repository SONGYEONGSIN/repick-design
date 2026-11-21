"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  CircleDot,
  Eye,
  Info,
  Siren,
} from "lucide-react";
import type { IncidentStatus, Severity } from "./data";

/** The one verified-visible focus pattern used across this route: `ring-2`+`ring-offset-*` can
 *  render fully transparent under this app's Tailwind v4 dark setup, and this utility must never
 *  follow `outline-none` (that combination cancels itself). Rose is the sole interactive accent,
 *  so the focus outline carries it through every focusable element, including inside the command
 *  palette, every dropdown, and every focusable heatmap cell. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

export function Card({
  children,
  className = "",
  as = "div",
  ariaLabelledBy,
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  ariaLabelledBy?: string;
  id?: string;
}) {
  const cardClassName = `rounded-xl border border-white/10 bg-zinc-900 ${className}`;
  if (as === "section") {
    return (
      <section id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} className={cardClassName}>
      {children}
    </div>
  );
}

const SEVERITY_STYLES: Record<Severity, { icon: typeof Siren; label: string; text: string; bg: string; ring: string }> = {
  critical: { icon: Siren, label: "Critical", text: "text-rose-300", bg: "bg-rose-950", ring: "ring-rose-800/60" },
  major: { icon: AlertTriangle, label: "Major", text: "text-amber-300", bg: "bg-amber-950", ring: "ring-amber-800/60" },
  minor: { icon: Info, label: "Minor", text: "text-zinc-300", bg: "bg-zinc-800", ring: "ring-white/10" },
};

export function SeverityBadge({ severity, className = "" }: { severity: Severity; className?: string }) {
  const s = SEVERITY_STYLES[severity];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[11px] ring-1 ring-inset ${s.bg} ${s.text} ${s.ring} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{s.label}</span>
    </span>
  );
}

const STATUS_STYLES: Record<IncidentStatus, { icon: typeof CircleDot; label: string; text: string; bg: string; ring: string }> = {
  open: { icon: CircleDot, label: "Open", text: "text-rose-300", bg: "bg-rose-950", ring: "ring-rose-800/60" },
  acknowledged: { icon: Eye, label: "Acknowledged", text: "text-amber-300", bg: "bg-amber-950", ring: "ring-amber-800/60" },
  resolved: { icon: CheckCircle2, label: "Resolved", text: "text-emerald-300", bg: "bg-emerald-950", ring: "ring-emerald-800/60" },
};

export function StatusBadge({ status, className = "" }: { status: IncidentStatus; className?: string }) {
  const s = STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[11px] ring-1 ring-inset ${s.bg} ${s.text} ${s.ring} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{s.label}</span>
    </span>
  );
}

export function ProgressBar({
  pct,
  className = "",
  trackClassName = "bg-white/10",
  fillClassName = "bg-rose-500",
  ariaLabel,
}: {
  pct: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  ariaLabel?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
    >
      <div
        className={`h-full rounded-full ${fillClassName} motion-safe:transition-[width] motion-safe:duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function Avatar({
  name,
  avatarId,
  size = 24,
}: {
  name: string;
  avatarId: string | null;
  size?: number;
}) {
  if (!avatarId) {
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center rounded-full bg-zinc-800 font-medium text-[10px] text-zinc-300 ring-1 ring-inset ring-white/10"
        style={{ width: size, height: size }}
      >
        {initials || "?"}
      </span>
    );
  }
  return (
    <Image
      src={`https://images.unsplash.com/photo-${avatarId}?w=96&h=96&fit=crop&crop=faces`}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-zinc-800 object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex flex-wrap gap-1 rounded-lg border border-white/10 bg-zinc-950 p-1 ${className}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-zinc-800 text-rose-300" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-60" aria-hidden="true" />;
  return dir === "asc" ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />;
}

export function SortHeader({
  label,
  active,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onSort: () => void;
  align?: "left" | "right";
}) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className="px-2 py-2">
      <button
        type="button"
        onClick={onSort}
        className={`inline-flex min-h-7 w-full items-center gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          align === "right" ? "justify-end" : "justify-start"
        } ${active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"}`}
      >
        {align === "right" ? null : <span>{label}</span>}
        <SortIcon active={active} dir={dir} />
        {align === "right" ? <span>{label}</span> : null}
      </button>
    </th>
  );
}

export function SectionCaption({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">{children}</p>;
}
