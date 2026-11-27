"use client";

import type { ReactNode } from "react";

/** The only verified-visible focus pattern in this repo's Tailwind v4 build: outline-2 +
 *  outline-offset-2 with an explicit color. Never pair with `outline-none`, never a bare
 *  `ring`/`ring-offset` (paints fully transparent here). */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

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
  const classes = `rounded-xl border border-white/10 bg-zinc-900 ${className}`;
  if (as === "section") {
    return (
      <section id={id} aria-labelledby={ariaLabelledBy} className={classes}>
        {children}
      </section>
    );
  }
  return (
    <div id={id} aria-labelledby={ariaLabelledBy} className={classes}>
      {children}
    </div>
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
    <div role="group" aria-label={ariaLabel} className="inline-flex gap-0.5 rounded-lg border border-white/10 bg-zinc-950 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "min-h-7 rounded-md px-2.5 py-1 font-medium text-xs motion-safe:transition-colors",
              FOCUS_RING,
              active ? "bg-teal-500/15 text-teal-400" : "text-zinc-400 hover:text-zinc-50",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Stacked proportional bar for a single row/column — same teal ramp as the Mekko board, so a
 *  reader never has to learn a second color code. Deterministic percentages, rounded to 2
 *  decimals by the caller. Color is always paired with the adjacent text legend, never used
 *  alone to carry meaning. */
export function MiniStack({
  segments,
  className = "",
}: {
  segments: { pct: number; fill: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex h-2.5 w-full overflow-hidden rounded-full bg-white/5", className)} role="img" aria-label={segments.map((s) => `${s.label} ${s.pct}%`).join(", ")}>
      {segments.map((s, i) => (
        <div key={i} className={s.fill} style={{ width: `${s.pct}%` }} />
      ))}
    </div>
  );
}

/** Builds a CSV string deterministically from fixed rows and triggers a real, observable
 *  browser download — the header "Export mix" button's onClick calls this, never a no-op. */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const escapeCell = (cell: string | number) => {
    const text = String(cell);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [header, ...rows].map((row) => row.map(escapeCell).join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
