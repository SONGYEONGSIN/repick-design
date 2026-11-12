// Shared component system for Nodewatch. Every interactive element carries a real, painting
// focus-visible ring (explicit color, never a bare `ring-2`) so a Tab-key pass has something to
// diff against the resting state. Light theme throughout: white/zinc-50 surfaces, zinc-200
// hairlines, indigo-600 as the one accent.

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Status } from "./data";
import { STATUS_META } from "./icons";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

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
    <div
      className={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm ${
        padded ? "p-4 sm:p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {Icon ? (
          <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <Icon size={15} aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-zinc-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 ${FOCUS_RING} ${className}`}
    >
      {Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  icon: Icon,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 ${FOCUS_RING} ${className}`}
    >
      {Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  label,
  active = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active ? true : undefined}
      className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
        active
          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
          : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
      } ${FOCUS_RING} ${className}`}
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
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex h-9 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-0.5"
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS_RING} ${
              isActive ? "bg-white text-indigo-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {Icon ? <Icon size={13} aria-hidden="true" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.badgeBg} ${meta.badgeBorder} ${meta.text}`}
    >
      <Icon size={12} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function Stat({
  label,
  value,
  caption,
}: {
  label: string;
  value: ReactNode;
  caption?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2.5">
      <p className="text-[11px] font-medium leading-snug text-zinc-600">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-900">{value}</p>
      {caption ? <p className="mt-0.5 text-[11px] text-zinc-500">{caption}</p> : null}
    </div>
  );
}
