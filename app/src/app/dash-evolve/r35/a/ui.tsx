"use client";

import type { ReactNode } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { CARD, cx, FOCUS, NUM, SEVERITY_DOT, SEVERITY_LABEL, SEVERITY_TEXT, TEXT_AUX, TEXT_PRIMARY, TRANSITION, type Severity } from "./tokens";
import { formatPercent } from "./data";

export function Card({
  id,
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  id?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section aria-labelledby={title && id ? `${id}-title` : undefined} className={cx("flex flex-col", CARD, className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-5">
          <div className="min-w-0">
            {title && (
              <h2 id={id ? `${id}-title` : undefined} title={title} className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>
                {title}
              </h2>
            )}
            {description && (
              <p title={description} className={cx("mt-0.5 truncate text-xs", TEXT_AUX)}>
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cx("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_AUX, className)}>{children}</p>;
}

export function ChangeBadge({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const isZero = Math.abs(value) < 0.05;
  const isPositive = value > 0;
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-md font-medium",
        NUM,
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs",
        isZero ? "bg-zinc-500/10 text-zinc-400" : isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
      )}
    >
      <Icon aria-hidden="true" className="size-3" />
      {formatPercent(value)}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[11px] font-medium", SEVERITY_TEXT[severity])}>
      <span aria-hidden="true" className={cx("size-1.5 shrink-0 rounded-full", SEVERITY_DOT[severity])} />
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md font-medium",
              TRANSITION,
              FOCUS,
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
              active ? "bg-violet-500/15 text-violet-300" : cx(TEXT_AUX, "hover:text-zinc-200"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Sparkline({ values, color, width = 56, height = 22 }: { values: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || Math.max(max * 0.01, 1);
  const points = values
    .map((v, i) => {
      const x = Math.round(((i / (values.length - 1)) * width) * 100) / 100;
      const y = Math.round((height - ((v - min) / range) * height) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="presentation" aria-hidden="true" className="shrink-0 overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-500">{icon}</span>
      <div className="max-w-xs">
        <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>{title}</p>
        <p className={cx("mt-1 text-[13px] leading-relaxed", TEXT_AUX)}>{description}</p>
      </div>
    </div>
  );
}
