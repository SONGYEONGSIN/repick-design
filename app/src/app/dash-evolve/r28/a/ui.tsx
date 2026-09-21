"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle, CheckCircle2, Clock3, XCircle, TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import type { RiskLevel, Status } from "./data";

/** Explicit, directly-specified focus treatment — never relies on ring utilities alone. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 focus-visible:rounded-md";
export const FOCUS_RING_FULL =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 focus-visible:rounded-full";

export function Card({
  children, className = "", padded = true, id,
}: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <div id={id} className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-5 sm:p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  title, id, action,
}: { title: string; id?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 id={id} className="text-sm font-bold tracking-wide text-zinc-900">{title}</h2>
      {action}
    </div>
  );
}

const STATUS_ICON: Record<Status, typeof CheckCircle2> = {
  confirmed: Clock3,
  completed: CheckCircle2,
  cancelled: XCircle,
  "no-show": AlertTriangle,
};

const STATUS_LABEL: Record<Status, string> = {
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No-show",
};

export function StatusBadge({ status }: { status: Status }) {
  const Icon = STATUS_ICON[status];
  const tone =
    status === "completed" ? "bg-zinc-900 text-white" :
    status === "confirmed" ? "bg-zinc-100 text-zinc-700 border border-zinc-200" :
    status === "cancelled" ? "bg-white text-zinc-500 border border-zinc-300" :
    "bg-orange-50 text-orange-800 border border-orange-200";
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  if (level === "low") return null;
  const label = level === "high" ? "At risk" : "Watch";
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-orange-300 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-800">
      <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

export function TrendDelta({ value, unit = "pts" }: { value: number; unit?: string }) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const sign = value > 0 ? "+" : "";
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {sign}{value}{unit} vs. last month
    </span>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100" role="presentation">
      <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Avatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-zinc-900 font-medium text-white"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
