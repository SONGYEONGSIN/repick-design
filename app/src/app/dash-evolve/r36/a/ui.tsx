import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import type { GoalStatus } from "./data";
import { STATUS_LABEL } from "./data";

/**
 * Shared presentational primitives for the Setpoint console. Kept in one
 * file so every surface shares the same radius / border / shadow / padding
 * system rather than each component inventing its own.
 *
 * Focus rings use `focus-visible:outline-2 focus-visible:outline-offset-2
 * focus-visible:outline-violet-700` with no `outline-none` anywhere in the
 * same class list, and never bare `ring-*` — both are invisible in this
 * repo's Tailwind v4 build, so every interactive element below uses the
 * outline idiom instead.
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
      className={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,16,15,0.04)] ${
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

const STATUS_STYLE: Record<GoalStatus, { bg: string; text: string; icon: LucideIcon }> = {
  "on-track": { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  "at-risk": { bg: "bg-amber-50", text: "text-amber-800", icon: AlertTriangle },
  behind: { bg: "bg-rose-50", text: "text-rose-700", icon: AlertOctagon },
};

/** Status is always paired with an icon and the written label — color is never the only signal. */
export function StatusPill({ status, className = "" }: { status: GoalStatus; className?: string }) {
  const style = STATUS_STYLE[status];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none ${style.bg} ${style.text} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{STATUS_LABEL[status]}</span>
    </span>
  );
}

export function InitialsAvatar({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-medium text-violet-700 ${className}`}
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
      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 outline-offset-2 transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-violet-700 ${className}`}
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
      className={`inline-flex h-11 items-center gap-2 rounded-lg bg-violet-700 px-4 text-sm font-medium text-white outline-offset-2 transition-colors hover:bg-violet-800 focus-visible:outline-2 focus-visible:outline-violet-700 ${className}`}
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
            className={`h-full rounded-md px-3 text-sm font-medium outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-violet-700 ${
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

/** Rounds an SVG coordinate to 2 decimal places, per the house rule on hand-authored SVG. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function Sparkline({
  data,
  className = "",
  label,
}: {
  data: readonly number[];
  className?: string;
  label: string;
}) {
  const width = 160;
  const height = 40;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = (width - pad * 2) / (data.length - 1 || 1);

  const points = data
    .map((value, index) => {
      const x = round2(pad + step * index);
      const y = round2(height - pad - ((value - min) / span) * (height - pad * 2));
      return `${x},${y}`;
    })
    .join(" ");

  const lastX = round2(pad + step * (data.length - 1));
  const lastY = round2(height - pad - ((data[data.length - 1] - min) / span) * (height - pad * 2));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`overflow-visible ${className}`} role="img" aria-label={label}>
      <polyline
        points={points}
        fill="none"
        stroke="#6d28d9"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r={2.25} fill="#6d28d9" />
    </svg>
  );
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only relative">{children}</span>;
}
