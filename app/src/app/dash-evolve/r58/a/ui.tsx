"use client";

import type { ReactNode } from "react";

// Shared focus-visible treatment. Tailwind v4's default `ring` utility paints at zero alpha, so
// this project's own catalog has already learned to use the `outline` utilities directly instead
// (see dash-evolve/r57/a/CommandPalette.tsx for the documented precedent) — reused here as a
// verified-safe idiom, not as a differentiation axis.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

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
    <div id={id} className={`min-w-0 rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-sm font-medium text-slate-100 ${className}`}>{children}</h2>;
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "confirmed" | "tentative" | "completed";
  children: ReactNode;
}) {
  const toneClass =
    tone === "confirmed"
      ? "bg-indigo-500/15 text-indigo-300"
      : tone === "tentative"
        ? "bg-amber-500/15 text-amber-300"
        : tone === "completed"
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-white/10 text-slate-300";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${toneClass}`}>
      {children}
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
    <div role="group" aria-label={label} className="inline-flex min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS} ${
              active ? "bg-indigo-500 text-white" : "text-slate-300 hover:text-slate-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function KpiTile({
  label,
  value,
  delta,
  deltaGood,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaGood?: boolean;
}) {
  return (
    <Card>
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1.5 font-[family-name:var(--font-display-wide)] text-2xl font-semibold tabular-nums text-slate-50">
        {value}
      </p>
      {delta && (
        <p className={`mt-1 text-xs font-normal tabular-nums ${deltaGood ? "text-emerald-400" : "text-amber-400"}`}>
          {delta}
        </p>
      )}
    </Card>
  );
}
