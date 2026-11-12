"use client";

import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";

// Shared component system for Firebreak — pure-white light surface, single orange brand accent.
// Contrast: orange-600 (#EA580C) measures ~3.56:1 on white, below the 4.5:1 floor for normal text,
// so no TEXT in this candidate sets orange-600 as its color. orange-700 (#C2410C) measures ~5.18:1
// on white and is used for every accent text/icon use. orange-600/500 are reserved for non-text
// fills (bars, chart strokes, active-pill backgrounds behind dark text) where only the 3:1
// non-text floor applies. Severity/status badges use a second, conventional semantic scale
// (emerald/rose/amber) alongside the single brand accent, and every one of them pairs its color
// with an icon and a text label — never color alone.

// FOCUS RING — safe pattern for this repo's Tailwind v4 setup: `outline-none` paired with
// `focus-visible:outline` renders nothing (the later declaration's --tw-outline-style gets
// cancelled by the earlier `none`), and a bare `ring-2`/`ring-offset-*` resolves to a transparent
// color here too. The pattern that actually paints: never set `outline-none`, set the offset and
// color unconditionally (harmless with no outline width), and gate only the width behind
// `focus-visible`.
export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-orange-600";

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
    <div className={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm ${padded ? "p-4 sm:p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500 ${className}`}>
      {children}
    </span>
  );
}

type BadgeTone = "neutral" | "accent" | "success" | "danger" | "warning";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-zinc-100 text-zinc-600",
  accent: "bg-orange-50 text-orange-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-rose-50 text-rose-700",
  warning: "bg-amber-50 text-amber-800",
};

export function Badge({
  tone = "neutral",
  icon: Icon,
  children,
}: {
  tone?: BadgeTone;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]}`}>
      {Icon ? <Icon className="h-3 w-3 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

export function SlaBadge({ withinSla }: { withinSla: boolean }) {
  return withinSla ? (
    <Badge tone="success" icon={CheckCircle2}>
      Within SLA
    </Badge>
  ) : (
    <Badge tone="danger" icon={AlertTriangle}>
      SLA breach
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: "P1" | "P2" | "P3" }) {
  const tone: BadgeTone = severity === "P1" ? "danger" : severity === "P2" ? "warning" : "neutral";
  return <Badge tone={tone}>{severity}</Badge>;
}

export function IconButton({
  children,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; "aria-label": string }) {
  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg bg-orange-700 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-800 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
    >
      {children}
    </button>
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
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex h-11 min-w-0 shrink-0 items-center rounded-lg bg-zinc-100 p-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`h-9 min-w-0 shrink-0 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
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

export function Avatar({ name, photoId, size = 28 }: { name: string; photoId: string; size?: number }) {
  return (
    <Image
      src={`https://images.unsplash.com/photo-${photoId}?w=${size * 2}&h=${size * 2}&fit=crop&crop=faces&q=80`}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-zinc-200 object-cover"
    />
  );
}

/**
 * Sparkline with a real, always-reachable crosshair: every weekly point is an invisible focusable
 * button layered over the SVG line, so hover AND keyboard focus (Tab) both reveal the exact value
 * in a text tooltip. The polyline itself is decorative (aria-hidden); the buttons carry the real
 * accessible numbers via aria-label, so no information is hover-only. The drawing box is capped
 * well under the 390px safety margin (max 148px) and the tooltip's own width is capped + truncated
 * so it can never push past its own relative, non-clipping parent even at the viewport edge.
 */
export function Sparkline({
  points,
  width = 140,
  height = 34,
  unit = "",
  colorClass = "text-orange-600",
}: {
  points: { label: string; value: number }[];
  width?: number;
  height?: number;
  unit?: string;
  colorClass?: string;
}) {
  const uid = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const max = Math.max(...points.map((p) => p.value), 1);
  const min = Math.min(...points.map((p) => p.value), 0);
  const range = max - min || 1;
  const stepX = points.length > 1 ? width / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = Number((i * stepX).toFixed(2));
    const y = Number((height - 4 - ((p.value - min) / range) * (height - 8)).toFixed(2));
    return { x, y };
  });

  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const active = activeIndex !== null ? points[activeIndex] : null;
  const activeCoord = activeIndex !== null ? coords[activeIndex] : null;
  const tooltipLeft = Math.min(Math.max((activeCoord?.x ?? 0) - 20, 0), Math.max(width - 60, 0));

  return (
    <div className="relative inline-block max-w-full" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className={`${colorClass} max-w-full`}>
        <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        {activeCoord ? (
          <>
            <line x1={activeCoord.x} x2={activeCoord.x} y1={0} y2={height} stroke="currentColor" strokeWidth={1} strokeDasharray="2,2" opacity={0.4} />
            <circle cx={activeCoord.x} cy={activeCoord.y} r={2.5} fill="currentColor" />
          </>
        ) : null}
      </svg>
      <div className="absolute inset-0 flex">
        {points.map((p, i) => (
          <button
            key={`${uid}-${p.label}`}
            type="button"
            tabIndex={0}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
            aria-label={`${p.label}: ${p.value}${unit}`}
            className={`h-full flex-1 rounded-sm bg-transparent ${FOCUS_RING}`}
          />
        ))}
      </div>
      {active ? (
        <div
          role="status"
          className="pointer-events-none absolute -top-7 z-10 max-w-[120px] truncate whitespace-nowrap rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-900 shadow-sm"
          style={{ left: tooltipLeft }}
        >
          {active.label}: {active.value}
          {unit}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Bullet chart: a filled bar for the current value against a track, with a vertical tick marking
 * the target. The numeric value and target are always printed as real text next to this bar
 * (never hover-only) — the bar is a supporting visual, not the sole source of the number. Always
 * `w-full` (no literal pixel width), so it scales with whatever tile width it is given.
 */
export function BulletBar({
  value,
  target,
  max,
  onTarget,
  higherIsBetter = false,
}: {
  value: number;
  target: number;
  max: number;
  onTarget: boolean;
  higherIsBetter?: boolean;
}) {
  const valuePct = Math.min((value / max) * 100, 100);
  const targetPct = Math.min((target / max) * 100, 100);
  const fillColor = onTarget ? "bg-orange-600" : "bg-rose-500";
  return (
    <div className="relative h-2 w-full min-w-0 rounded-full bg-zinc-100" aria-hidden="true">
      <div className={`absolute inset-y-0 left-0 rounded-full ${fillColor}`} style={{ width: `${valuePct}%` }} />
      <div
        className="absolute inset-y-[-3px] w-[2px] rounded-full bg-zinc-500"
        style={{ left: `${targetPct}%` }}
        title={higherIsBetter ? "Floor" : "Target"}
      />
    </div>
  );
}
