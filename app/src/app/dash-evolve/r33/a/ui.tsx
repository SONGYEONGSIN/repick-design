import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowUp, Minus, ArrowDown, CircleDot, Clock, Hourglass } from "lucide-react";
import type { Priority, Status } from "./data";
import { PRIORITY_LABEL, STATUS_LABEL } from "./data";

/**
 * Shared presentational primitives for the Census console. Kept in one file,
 * per the component system in the brief: consistent radius / border / shadow /
 * padding across every surface, rather than each card inventing its own.
 */

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
      className={`rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,16,15,0.04)] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600 ${className}`}>{children}</p>
  );
}

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string; icon: LucideIcon }> = {
  urgent: { bg: "bg-rose-50", text: "text-rose-700", icon: AlertTriangle },
  high: { bg: "bg-amber-50", text: "text-amber-800", icon: ArrowUp },
  normal: { bg: "bg-zinc-100", text: "text-zinc-600", icon: Minus },
  low: { bg: "bg-zinc-100", text: "text-zinc-600", icon: ArrowDown },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const style = PRIORITY_STYLE[priority];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${style.bg} ${style.text}`}
    >
      <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{PRIORITY_LABEL[priority]}</span>
    </span>
  );
}

const STATUS_STYLE: Record<Status, { bg: string; text: string; icon: LucideIcon }> = {
  open: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CircleDot },
  pending: { bg: "bg-amber-50", text: "text-amber-800", icon: Clock },
  waiting: { bg: "bg-zinc-100", text: "text-zinc-600", icon: Hourglass },
};

export function StatusBadge({ status }: { status: Status }) {
  const style = STATUS_STYLE[status];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${style.bg} ${style.text}`}
    >
      <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{STATUS_LABEL[status]}</span>
    </span>
  );
}

export function InitialsAvatar({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-amber-50 text-[10px] font-medium text-amber-800 ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function IconButton({
  children,
  label,
  className = "",
  ...rest
}: {
  children: ReactNode;
  label: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 outline-offset-2 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-amber-700 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center gap-2 rounded-lg bg-amber-700 px-4 text-sm font-medium text-white outline-offset-2 transition-colors hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-amber-700 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  getLabel,
  ariaLabel,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (value: T) => string;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="inline-flex h-11 items-center gap-0.5 rounded-lg bg-zinc-100 p-1">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`h-full rounded-md px-3 text-sm font-medium outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-amber-700 ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {getLabel(option)}
          </button>
        );
      })}
    </div>
  );
}

/** Rounds every SVG coordinate to 2 decimal places, per the house rule on hand-authored SVG. */
function toFixed2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function Sparkline({ data, className = "" }: { data: number[]; className?: string }) {
  const width = 72;
  const height = 24;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = (width - pad * 2) / (data.length - 1 || 1);

  const points = data
    .map((value, index) => {
      const x = toFixed2(pad + step * index);
      const y = toFixed2(height - pad - ((value - min) / span) * (height - pad * 2));
      return `${x},${y}`;
    })
    .join(" ");

  const last = data[data.length - 1];
  const lastX = toFixed2(pad + step * (data.length - 1));
  const lastY = toFixed2(height - pad - ((last - min) / span) * (height - pad * 2));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
      role="img"
      aria-label={`Trend sparkline, ${data.length} points, ending at ${last}`}
    >
      <polyline points={points} fill="none" stroke="#d97706" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={2} fill="#d97706" />
    </svg>
  );
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only relative">{children}</span>;
}
