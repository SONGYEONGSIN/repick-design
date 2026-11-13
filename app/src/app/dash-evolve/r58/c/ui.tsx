"use client";

import type { ReactNode } from "react";

export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

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
              active ? "bg-rose-700 text-white" : "text-slate-300 hover:text-slate-100"
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
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1.5 font-[family-name:var(--font-display-mono)] text-2xl font-semibold tabular-nums text-slate-50">
        {value}
      </p>
      {delta && <p className="mt-1 text-xs font-normal tabular-nums text-emerald-400">{delta}</p>}
    </Card>
  );
}

export function MethodBadge({ method }: { method: "GET" | "POST" | "PATCH" }) {
  const toneClass =
    method === "GET" ? "bg-sky-500/15 text-sky-300" : method === "POST" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300";
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide ${toneClass}`}>
      {method}
    </span>
  );
}
