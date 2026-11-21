"use client";

import type { ReactNode } from "react";
import type { Severity, IncidentStatus } from "./data";

export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

export function Card({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`min-w-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-sm font-medium text-zinc-900 ${className}`}>{children}</h2>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const toneClass =
    severity === "critical"
      ? "bg-rose-50 text-rose-700"
      : severity === "high"
        ? "bg-amber-50 text-amber-700"
        : severity === "medium"
          ? "bg-sky-50 text-sky-700"
          : "bg-zinc-100 text-zinc-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${toneClass}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const toneClass =
    status === "open"
      ? "bg-rose-50 text-rose-700"
      : status === "investigating"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${toneClass}`}>
      {status}
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
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS} ${
              active ? "bg-emerald-700 text-white" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function KpiTile({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card>
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1.5 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
        {value}
      </p>
      {delta && <p className="mt-1 text-xs font-normal tabular-nums text-zinc-600">{delta}</p>}
    </Card>
  );
}
