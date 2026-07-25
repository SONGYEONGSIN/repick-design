import Image from "next/image";
import type { ReactNode } from "react";
import { clampPercent } from "./format";
import { healthMeta, type Health } from "./data";

/* ── Card ─────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  "aria-labelledby"?: string;
}) {
  const Comp = as;
  return (
    <Comp className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`} {...rest}>
      {children}
    </Comp>
  );
}

/* ── Badge ────────────────────────────────────────────── */

export function Badge({
  children,
  className = "",
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function HealthBadge({ health }: { health: Health }) {
  const meta = healthMeta[health];
  return (
    <Badge
      className={meta.badgeClass}
      icon={<span className={`h-1.5 w-1.5 rounded-full ${meta.barClass}`} aria-hidden="true" />}
    >
      {meta.label}
    </Badge>
  );
}

/* ── Avatar ───────────────────────────────────────────── */

const SIZE_MAP = { xs: 20, sm: 24, md: 32 } as const;

export function Avatar({
  src,
  name,
  size = "sm",
  className = "",
}: {
  src: string;
  name: string;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}) {
  const px = SIZE_MAP[size];
  return (
    <Image
      src={src}
      alt={`${name} profile photo`}
      width={px}
      height={px}
      sizes={`${px}px`}
      className={`shrink-0 rounded-full border border-zinc-200 object-cover ${className}`}
      style={{ width: px, height: px }}
    />
  );
}

/* ── Progress ─────────────────────────────────────────── */

export function ProgressBar({
  value,
  label,
  barClassName = "bg-blue-600",
  trackClassName = "bg-zinc-100",
  className = "",
}: {
  value: number;
  label: string;
  barClassName?: string;
  trackClassName?: string;
  className?: string;
}) {
  const pct = clampPercent(value);
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${barClassName} motion-safe:transition-[width] motion-safe:duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
