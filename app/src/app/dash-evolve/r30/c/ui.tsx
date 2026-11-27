"use client";

import type { ReactNode } from "react";
import { STATUS_META, type HealthStatus } from "./data";

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
    <div className={`rounded-xl border border-zinc-200 bg-white ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{children}</p>;
}

export function StatusBadge({ status }: { status: HealthStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.bg} ${meta.textTint} ${meta.border}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {meta.label}
    </span>
  );
}

export function StatusDotInline({ status }: { status: HealthStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium ${meta.text}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/** Small deterministic trend sparkline. Every coordinate is rounded to 2 decimals. */
export function Sparkline({
  values,
  width = 72,
  height = 24,
  status = "healthy",
}: {
  values: number[];
  width?: number;
  height?: number;
  status?: HealthStatus;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;
  const stepX = (width - pad * 2) / (values.length - 1);

  const coords = values.map((v, i) => {
    const x = Math.round((pad + i * stepX) * 100) / 100;
    const y = Math.round((height - pad - ((v - min) / span) * (height - pad * 2)) * 100) / 100;
    return { x, y };
  });

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const last = coords[coords.length - 1];
  const meta = STATUS_META[status];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" className="shrink-0">
      <path d={path} fill="none" className="stroke-zinc-300" strokeWidth={1.25} />
      <circle cx={last.x} cy={last.y} r={2.25} className={meta.stroke.replace("stroke-", "fill-")} />
    </svg>
  );
}

export function Divider() {
  return <div aria-hidden="true" className="hidden h-9 w-px bg-zinc-200 sm:block" />;
}

export function InlineStat({
  label,
  value,
  tone = "text-zinc-900",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-0.5 truncate text-lg font-semibold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}
