import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Circle, Triangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import type { Severity } from "./data";

/**
 * Shared presentational primitives for the Northbound console. One file so
 * every card / button / badge shares the same radius, border, shadow and
 * focus treatment rather than each component inventing its own.
 *
 * Focus rings use `focus-visible:outline-2 focus-visible:outline-offset-2
 * focus-visible:outline-cyan-400` with no `outline-none` anywhere in the
 * same class list, and never a bare `ring-*` utility — both are invisible
 * in this repo's Tailwind v4 build.
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
      className={`min-w-0 rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 ${className}`}>{children}</p>
  );
}

/** Severity visual vocabulary shared by the chart markers, legend, status badge and table —
 * shape + icon always carries the meaning, color is the reinforcing signal, never the only one. */
export const SEVERITY_STYLE: Record<Severity, { icon: LucideIcon; text: string; ring: string; word: string }> = {
  minor: { icon: Circle, text: "text-cyan-300", ring: "ring-cyan-400/50", word: "Minor" },
  moderate: { icon: Triangle, text: "text-amber-300", ring: "ring-amber-400/50", word: "Moderate" },
  severe: { icon: AlertOctagon, text: "text-rose-300", ring: "ring-rose-400/50", word: "Severe" },
};

export function StatusBadge({ severity, label }: { severity: Severity | null; label: string }) {
  const style = severity
    ? SEVERITY_STYLE[severity]
    : { icon: CheckCircle2, text: "text-emerald-300", ring: "ring-emerald-400/50", word: "Healthy" };
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-semibold ring-1 ${style.ring} ${style.text}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

export function InitialsAvatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-[10px] font-medium text-cyan-300 ${className}`}
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
      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 outline-offset-2 transition-colors hover:bg-zinc-800 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-cyan-400 ${className}`}
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
      className={`inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-zinc-950 outline-offset-2 transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400 ${className}`}
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
    <div role="group" aria-label={ariaLabel} className="inline-flex h-11 items-center gap-0.5 rounded-lg bg-zinc-950 p-1 ring-1 ring-white/10">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`h-full whitespace-nowrap rounded-md px-3 text-sm font-semibold outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 ${
              active ? "bg-cyan-400 text-zinc-950" : "font-normal text-zinc-400 hover:text-zinc-50"
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

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only relative">{children}</span>;
}
