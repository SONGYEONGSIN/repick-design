"use client";

import type { ReactNode } from "react";
import { Diamond, Triangle } from "lucide-react";
import type { AnomalyDirection, Severity } from "./data";

export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

export function Card({
  children,
  className = "",
  as = "div",
  id,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  "aria-labelledby"?: string;
}) {
  const cardClassName = `rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`;
  if (as === "section") {
    return (
      <section id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} aria-labelledby={ariaLabelledBy} className={cardClassName}>
      {children}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`min-h-7 rounded-md px-3 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
              active ? "bg-white text-sky-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const SEVERITY_STYLES: Record<Severity, { text: string; soft: string }> = {
  warning: { text: "text-amber-700", soft: "bg-amber-50" },
  critical: { text: "text-red-700", soft: "bg-red-50" },
};

export function SeverityBadge({ severity, className = "" }: { severity: Severity; className?: string }) {
  const s = SEVERITY_STYLES[severity];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[11px] uppercase tracking-[0.03em] ${s.soft} ${s.text} ${className}`}>
      {severity === "critical" ? "Critical" : "Warning"}
    </span>
  );
}

/** Direction marker glyph used consistently in the chart legend, the anomaly strip, and the table —
 *  shape, not color, is what distinguishes an above-range spike from a below-range dip. */
export function DirectionGlyph({ direction, className = "" }: { direction: AnomalyDirection; className?: string }) {
  const Icon = direction === "above" ? Diamond : Triangle;
  return <Icon className={`${className}`} aria-hidden="true" fill="currentColor" strokeWidth={1} />;
}

export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-sky-100 font-medium text-sky-700 ${className}`}>
      {initials}
    </span>
  );
}
