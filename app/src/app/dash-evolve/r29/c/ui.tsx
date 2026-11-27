"use client";

import type { ReactNode } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { TIER_META, type QualityTier } from "./data";

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
    <div className={`rounded-xl border border-white/10 bg-zinc-900 ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{children}</p>;
}

export function TierBadge({ tier }: { tier: QualityTier }) {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.bg} ${meta.text} ${meta.border}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {meta.label}
    </span>
  );
}

export function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-zinc-200"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/** Small deterministic return-rate trend sparkline. Coordinates rounded to 2 decimals. */
export function Sparkline({ values, width = 72, height = 24 }: { values: number[]; width?: number; height?: number }) {
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

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" className="shrink-0">
      <path d={path} fill="none" className="stroke-zinc-500" strokeWidth={1.25} />
      <circle cx={last.x} cy={last.y} r={2} className="fill-sky-400" />
    </svg>
  );
}

export function TrendPill({ pts, compact = false }: { pts: number; compact?: boolean }) {
  const isUp = pts > 0.05;
  const isDown = pts < -0.05;
  const tone = isDown ? "text-emerald-400" : isUp ? "text-rose-400" : "text-zinc-400";
  const Icon = isDown ? TrendingDown : isUp ? TrendingUp : Minus;
  const sign = pts > 0 ? "+" : "";
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-normal tabular-nums ${tone}`}>
      <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
      {sign}
      {pts.toFixed(1)} pts{compact ? "" : " / 30d"}
    </span>
  );
}

/** Compact tier indicator for tight table cells: icon + label, no pill chrome. */
export function TierInline({ tier }: { tier: QualityTier }) {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium ${meta.text}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {meta.label}
    </span>
  );
}
