// Shared component system for Outpost. Every interactive element here carries a real, painting
// focus-visible ring (explicit color, not a bare `ring-2`) so Tab-key auditing finds something to
// diff against the unfocused state.

import type { ReactNode } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, type LucideIcon } from "lucide-react";
import type { RiskTier, Status } from "./data";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

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
      className={`min-w-0 rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${
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
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-zinc-50">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p> : null}
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
      className={`inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${FOCUS_RING} ${className}`}
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
          ? "border-blue-500/40 bg-blue-500/15 text-blue-400"
          : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-zinc-50"
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
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex h-9 items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-950 p-0.5"
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS_RING} ${
              isActive ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-4 border-b border-white/10">
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`-mb-px border-b-2 px-0.5 py-2 text-xs font-medium transition-colors ${FOCUS_RING} ${
              isActive ? "border-blue-500 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

const TIER_META: Record<RiskTier, { label: string; icon: LucideIcon; classes: string; iconClasses: string }> = {
  low: { label: "Low", icon: ShieldCheck, classes: "bg-zinc-800 text-zinc-300", iconClasses: "text-zinc-400" },
  medium: { label: "Medium", icon: ShieldAlert, classes: "bg-amber-500/15 text-amber-400", iconClasses: "text-amber-400" },
  high: { label: "High", icon: ShieldX, classes: "bg-red-500/15 text-red-400", iconClasses: "text-red-400" },
};

export function TierBadge({ tier }: { tier: RiskTier }) {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.classes}`}>
      <Icon size={12} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// Compact icon-only form of the same tier mapping, used where a full pill badge would not fit
// (e.g. a narrow table cell) but color still must be paired with a shape, not stand alone.
export function TierIcon({ tier, size = 13 }: { tier: RiskTier; size?: number }) {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return <Icon size={size} className={meta.iconClasses} aria-hidden="true" />;
}

const STATUS_META: Record<Status, { classes: string }> = {
  open: { classes: "bg-blue-500/15 text-blue-400" },
  escalated: { classes: "bg-red-500/15 text-red-400" },
  resolved: { classes: "bg-emerald-500/15 text-emerald-400" },
  hold: { classes: "bg-zinc-700 text-zinc-300" },
};

export function StatusBadge({ status, label }: { status: Status; label: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_META[status].classes}`}>
      {label}
    </span>
  );
}

export function InitialsAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-300"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-10 flex-shrink-0 rounded-full transition-colors ${FOCUS_RING} ${
        checked ? "bg-blue-600" : "bg-zinc-700"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform motion-reduce:transition-none ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded border-white/20 bg-zinc-950 accent-blue-600 ${FOCUS_RING}`}
      />
      {label}
    </label>
  );
}

export function BulletGauge({ value, target, max = 100 }: { value: number; target: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const targetPct = Math.min(100, (target / max) * 100);
  const tone = value >= 70 ? "bg-red-500" : value >= 40 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-wide text-zinc-400">Risk score</span>
        <span className="text-2xl font-semibold tabular-nums text-zinc-50">{value}</span>
      </div>
      <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full transition-[width] motion-reduce:transition-none ${tone}`} style={{ width: `${pct}%` }} />
        <div
          className="absolute top-0 h-full w-0.5 bg-zinc-50"
          style={{ left: `${targetPct}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-zinc-400">
        <span>0</span>
        <span>Review threshold {target}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
