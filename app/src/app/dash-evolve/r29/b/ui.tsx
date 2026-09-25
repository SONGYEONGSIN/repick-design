"use client";

import type { ReactNode } from "react";
import {
  ShieldAlert, PlaneTakeoff, DatabaseZap, ShieldOff, Smartphone, UserCog,
  Circle, AlertCircle, CheckCircle2, XCircle, User, Server, AlertTriangle,
} from "lucide-react";
import type { EventType, Severity, EventStatus } from "./data";

/** Explicit, directly-specified focus treatment — never relies on ring utilities alone. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 focus-visible:rounded-md";
export const FOCUS_RING_FULL =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 focus-visible:rounded-full";

export function Card({
  children, className = "", padded = true, id,
}: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <div id={id} className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-5 sm:p-6" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children, as = "p" }: { children: ReactNode; as?: "p" | "h2" | "h3" }) {
  const Tag = as;
  return (
    <Tag className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
      {children}
    </Tag>
  );
}

export function Avatar({ initials, size = 34 }: { initials: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-zinc-900 font-medium text-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------------------
// Event-type icon + severity + status badges
// ---------------------------------------------------------------------------------------

export const EVENT_TYPE_ICON: Record<EventType, typeof ShieldAlert> = {
  "impossible-travel": PlaneTakeoff,
  "permission-escalation": ShieldAlert,
  "bulk-export": DatabaseZap,
  "unusual-login": AlertCircle,
  "mfa-bypass": ShieldOff,
  "role-change": UserCog,
  "new-device": Smartphone,
};

const SEVERITY_TONE: Record<Severity, string> = {
  critical: "bg-red-50 text-red-800 border-red-200",
  high: "bg-orange-50 text-orange-800 border-orange-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  low: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const SEVERITY_ICON: Record<Severity, typeof Circle> = {
  critical: ShieldAlert,
  high: AlertCircle,
  medium: Circle,
  low: Circle,
};

export function SeverityBadge({ severity, label }: { severity: Severity; label: string }) {
  const Icon = SEVERITY_ICON[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${SEVERITY_TONE[severity]}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

const STATUS_ICON: Record<EventStatus, typeof CheckCircle2> = {
  open: AlertCircle,
  investigating: Circle,
  resolved: CheckCircle2,
  dismissed: XCircle,
};

const STATUS_TONE: Record<EventStatus, string> = {
  open: "bg-zinc-100 text-zinc-700 border-zinc-200",
  investigating: "bg-amber-50 text-amber-800 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  dismissed: "bg-zinc-50 text-zinc-500 border-zinc-200",
};

export function StatusBadge({ status, label }: { status: EventStatus; label: string }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_TONE[status]}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------------------
// Node glyphs — shape (not just color) distinguishes account vs. service for the graph.
// ---------------------------------------------------------------------------------------

export function AccountGlyph({ className = "" }: { className?: string }) {
  return <User aria-hidden="true" className={className} />;
}
export function ServiceGlyph({ className = "" }: { className?: string }) {
  return <Server aria-hidden="true" className={className} />;
}
export const NODE_KIND_LABEL: Record<"account" | "service", string> = {
  account: "Account",
  service: "Service",
};

// ---------------------------------------------------------------------------------------
// Bullet-style gauge readout used by the risk strip
// ---------------------------------------------------------------------------------------

export function BulletGauge({
  label, current, target, unit, goodDirection, formattedCurrent, formattedTarget,
}: {
  label: string;
  current: number;
  target: number;
  unit: string;
  goodDirection: "down" | "up";
  formattedCurrent: string;
  formattedTarget: string;
}) {
  const domainMax = Math.max(current, target) * 1.25 || 1;
  const currentPct = Math.min(100, (current / domainMax) * 100);
  const targetPct = Math.min(100, (target / domainMax) * 100);
  const isOffTarget = goodDirection === "down" ? current > target : current < target;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-zinc-600">{label}</span>
        <span className="inline-flex items-baseline gap-1.5">
          {isOffTarget ? (
            <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0 self-center text-red-600" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 self-center text-emerald-600" />
          )}
          <span className="text-right">
            <span className={`text-sm font-bold tabular-nums ${isOffTarget ? "text-red-700" : "text-emerald-700"}`}>
              {formattedCurrent}{unit}
            </span>
            <span className="ml-1.5 text-xs font-normal tabular-nums text-zinc-500">
              target {formattedTarget}{unit}
            </span>
          </span>
        </span>
      </div>
      <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100" role="presentation">
        <div
          className={`h-full rounded-full ${isOffTarget ? "bg-red-500" : "bg-emerald-600"}`}
          style={{ width: `${currentPct}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-zinc-500"
          style={{ left: `${targetPct}%` }}
        />
      </div>
    </div>
  );
}
