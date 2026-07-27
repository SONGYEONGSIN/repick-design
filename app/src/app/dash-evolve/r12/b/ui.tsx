"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { RISK_LABEL, RISK_TONE, riskLevel, round2, type ExpiryMonth } from "./data";
import { BORDER, CARD, CARD_BG, FOCUS_RING, SURFACE_INSET, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={cx(CARD, padded && "p-4 sm:p-5", className)}>{children}</div>;
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
  as: Tag = "h2",
  Icon,
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <Tag id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            {title}
          </Tag>
        </div>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone, Icon, children }: { tone: { text: string; bg: string; border: string }; Icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------- Dropdown */

export function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* -------------------------------------------------------- Avatar fallback */

export function InitialsAvatar({ initials, size = 28, className }: { initials: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cx("grid shrink-0 place-items-center rounded-full border text-[10px] font-semibold", BORDER, "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300", className)}
    >
      {initials}
    </span>
  );
}

/* --------------------------------------------------------- Segmented control */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cx("inline-flex h-11 items-center gap-0.5 rounded-lg border p-1", BORDER, SURFACE_INSET)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "flex h-full items-center rounded-md px-3 text-sm font-medium",
              TRANSITION,
              FOCUS_RING,
              active ? cx(CARD_BG, TEXT_PRIMARY, "shadow-sm") : cx(TEXT_CAPTION, "hover:text-zinc-900 dark:hover:text-zinc-100"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------- Risk gauge */

/** Generative SVG radial gauge — decorative only (aria-hidden). The numeric score and risk word
 * must always be rendered as visible text alongside it by the caller; never rely on the gauge alone. */
export function RiskGauge({ score, size = 30, strokeWidth = 3.5 }: { score: number; size?: number; strokeWidth?: number }) {
  const level = riskLevel(score);
  const tone = TONE[RISK_TONE[level]];
  const r = round2(size / 2 - strokeWidth);
  const c = round2(2 * Math.PI * r);
  const clamped = Math.min(100, Math.max(0, score));
  const filled = round2((c * clamped) / 100);
  const offset = round2(c - filled);
  const mid = round2(size / 2);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="-rotate-90 shrink-0">
      <circle cx={mid} cy={mid} r={r} fill="none" strokeWidth={strokeWidth} className="stroke-zinc-200 dark:stroke-white/10" />
      <circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        stroke={tone.stroke}
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export function RiskBadge({ score, size = 30, dense = false }: { score: number; size?: number; dense?: boolean }) {
  const level = riskLevel(score);
  const tone = TONE[RISK_TONE[level]];
  return (
    <span className="inline-flex items-center gap-1.5">
      <RiskGauge score={score} size={size} />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={cx("text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>{score}</span>
        {dense ? null : <span className={cx("text-[10px] font-medium whitespace-nowrap", tone.text)}>{RISK_LABEL[level]}</span>}
      </span>
    </span>
  );
}

/* ------------------------------------------------------- Expiry sparkline */

/** Generative SVG area/line sparkline — decorative only. Always paired with a visible text summary
 * supplied by the caller (never the sole way to learn the underlying counts). */
export function ExpirySparkline({ data, width = 200, height = 40 }: { data: ExpiryMonth[]; width?: number; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? round2(width / (data.length - 1)) : width;
  const pad = 3;
  const points = data.map((d, i) => {
    const x = round2(i * stepX);
    const y = round2(height - pad - (d.count / max) * (height - pad * 2));
    return { x, y };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L${last.x},${height} L${first.x},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="block">
      <path d={areaPath} className="fill-sky-500/10 dark:fill-sky-400/15" />
      <path d={linePath} fill="none" strokeWidth={1.5} className="stroke-sky-600 dark:stroke-sky-400" />
    </svg>
  );
}
