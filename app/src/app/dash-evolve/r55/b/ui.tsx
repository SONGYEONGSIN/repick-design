"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import { AlertTriangle, CheckCircle2, AlertCircle, type LucideIcon } from "lucide-react";
import type { ComplianceStatus } from "./data";
import { STATUS_LABEL } from "./data";

// Shared component system for Latch — pure-white light surface, single desaturated-orange brand
// accent. Contrast note: plain orange-600 measures under the 4.5:1 text floor on white, so no
// TEXT color in this candidate uses it; every accent TEXT use is orange-800 (~6.2:1 on white) or
// the orange-700 in FOCUS_RING (outline color, not text, so only the 3:1 non-text floor applies).
// Semantic status color always pairs with an icon + text label, never color alone.

export const FOCUS_RING = "focus-visible:outline-2 outline-offset-2 outline-orange-700";

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

// Renders a <dt> — every current call site is the label half of a dt/dd pair inside a <dl>
// (the KPI stat row and the vendor detail stat row), so this must be a real definition-list
// term, not a plain <span>, or those <dl>s fail the definition-list a11y rule.
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <dt className={`block truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500 ${className}`}>
      {children}
    </dt>
  );
}

type BadgeTone = "neutral" | "accent" | "success" | "danger" | "warning";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-zinc-100 text-zinc-600",
  accent: "bg-orange-50 text-orange-800",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-rose-50 text-rose-700",
  warning: "bg-amber-50 text-amber-800",
};

export function Badge({
  tone = "neutral",
  icon: Icon,
  children,
  className = "",
}: {
  tone?: BadgeTone;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex min-w-0 max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${BADGE_TONES[tone]} ${className}`}>
      {Icon ? <Icon className="h-3 w-3 shrink-0" aria-hidden="true" /> : null}
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

const STATUS_TONE: Record<ComplianceStatus, BadgeTone> = {
  compliant: "success",
  "at-risk": "warning",
  breach: "danger",
};
const STATUS_ICON: Record<ComplianceStatus, LucideIcon> = {
  compliant: CheckCircle2,
  "at-risk": AlertCircle,
  breach: AlertTriangle,
};

export function ComplianceBadge({ status, className = "" }: { status: ComplianceStatus; className?: string }) {
  return (
    <Badge tone={STATUS_TONE[status]} icon={STATUS_ICON[status]} className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: "Critical" | "Major" | "Minor" }) {
  const tone: BadgeTone = severity === "Critical" ? "danger" : severity === "Major" ? "warning" : "neutral";
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
      className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg bg-orange-800 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-900 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
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

/** Small chip-style filter toggle, used by the vendor rail's status filter (wraps, never scrolls). */
export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-7 min-w-0 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px] transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
        active
          ? "border-orange-300 bg-orange-100 font-semibold text-orange-900"
          : "border-transparent bg-zinc-100 font-medium text-zinc-600 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
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
