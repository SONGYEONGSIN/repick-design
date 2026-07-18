"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { DealStage } from "../lib/data";
import { avatarUrl, cn, formatPct } from "../lib/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-zinc-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function EyebrowLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] font-semibold uppercase tracking-wide text-zinc-500", className)}>
      {children}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "info" | "danger";
  className?: string;
}) {
  const toneClass: Record<string, string> = {
    neutral: "border-zinc-200 bg-zinc-50 text-zinc-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    info: "border-indigo-200 bg-indigo-50 text-indigo-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const STAGE_META: Record<DealStage, { tone: "neutral" | "info" | "warning" | "success"; label: string }> = {
  Discovery: { tone: "neutral", label: "Discovery" },
  Proposal: { tone: "info", label: "Proposal" },
  Negotiation: { tone: "warning", label: "Negotiation" },
  "Closed Won": { tone: "success", label: "Closed Won" },
};

export function StageBadge({ stage }: { stage: DealStage }) {
  const meta = STAGE_META[stage];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function Avatar({ avatarId, name, size = 32 }: { avatarId: string; name: string; size?: number }) {
  return (
    <Image
      src={avatarUrl(avatarId, size * 2)}
      alt=""
      title={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function IconButton({
  children,
  label,
  onClick,
  active = false,
  className = "",
  size = "h-11 w-11",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  size?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg border outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
        size,
        active
          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
          : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "sm",
  className = "",
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex flex-wrap items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
              size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProgressBar({
  pct,
  className = "",
  trackClassName = "",
}: {
  pct: number;
  className?: string;
  trackClassName?: string;
}) {
  const filled = Math.min(Math.max(pct, 0), 100);
  const over = pct > 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100", trackClassName, className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] motion-reduce:transition-none", over ? "bg-emerald-500" : "bg-indigo-500")}
        style={{ width: `${filled}%` }}
      />
    </div>
  );
}

export function RankChangeIndicator({ delta, className = "" }: { delta: number; className?: string }) {
  if (delta === 0) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-medium tabular-nums text-zinc-500", className)}>
        <Minus className="h-3 w-3" aria-hidden="true" />
        Steady
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold tabular-nums",
        up ? "text-emerald-600" : "text-rose-600",
        className,
      )}
    >
      {up ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
      {Math.abs(delta)}
    </span>
  );
}

export function AttainmentText({ pct, className = "" }: { pct: number; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{formatPct(pct)}</span>;
}
