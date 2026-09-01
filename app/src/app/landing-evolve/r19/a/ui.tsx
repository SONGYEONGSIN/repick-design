"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { COLOR, FOCUS_RING, TRACK, W } from "./tokens";

// Small folio number in a section's corner — the safe alternative to a giant ghost numeral the
// brief calls out explicitly: same editorial "case file" numbering device, but sized and colored
// so it reads as a label, never a competitor to the heading next to it. mutedOnBg clears 5.05:1
// against bg regardless of size, so this is compliant even though it sits well under the 24px
// large-text threshold that would otherwise require only 3:1.
export function Folio({ n, of }: { n: number; of: number }) {
  return (
    <span
      className={`${W.label} block text-[11px] leading-none tabular-nums`}
      style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
    >
      § {String(n).padStart(2, "0")} / {String(of).padStart(2, "0")}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className={`${W.label} inline-flex items-center gap-2 text-[11px] uppercase`}
      style={{ color: COLOR.accentDark, letterSpacing: TRACK.eyebrow }}
    >
      {children}
    </span>
  );
}

export function FigCaption({ children }: { children: ReactNode }) {
  return (
    <p
      className={`${W.body} text-[12px] leading-snug`}
      style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
    >
      {children}
    </p>
  );
}

// Decorative quote glyph. Rendered, therefore contrast-checked like any visible text — mutedOnBg
// clears 5.05:1 against bg at any size, well past the 3:1 large-text floor `aria-hidden` does not
// exempt it from.
export function QuoteGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${W.heavy} block leading-none select-none ${className}`}
      style={{ color: COLOR.mutedOnBg, fontSize: "48px" }}
    >
      &ldquo;
    </span>
  );
}

export type PillVariant = "accent" | "outline" | "flag";

export function Pill({
  icon: Icon,
  children,
  variant = "outline",
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  children: ReactNode;
  variant?: PillVariant;
}) {
  const base = `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] ${W.label}`;
  if (variant === "accent") {
    return (
      <span className={base} style={{ background: COLOR.accent, color: COLOR.white, letterSpacing: TRACK.caption }}>
        <Icon className="size-3.5 shrink-0" />
        {children}
      </span>
    );
  }
  if (variant === "flag") {
    return (
      <span
        className={base}
        style={{
          background: COLOR.bg,
          color: COLOR.ink,
          letterSpacing: TRACK.caption,
          border: `1px solid ${COLOR.accentDark}`,
        }}
      >
        <Icon className="size-3.5 shrink-0" style={{ color: COLOR.accentDark }} />
        {children}
      </span>
    );
  }
  return (
    <span
      className={base}
      style={{ color: COLOR.ink, letterSpacing: TRACK.caption, border: `1px solid ${COLOR.ink}33` }}
    >
      <Icon className="size-3.5 shrink-0" />
      {children}
    </span>
  );
}

// Segmented assumption control. Selection state is never color-only: the selected option also
// gets a filled background (vs. the resting outline) and a leading check glyph, so shape + icon +
// text all move together with the color change.
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div role="group" aria-label={legend} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={`${W.label} ${FOCUS_RING} inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] transition-colors`}
            style={
              selected
                ? { background: COLOR.accent, color: COLOR.white }
                : { background: COLOR.bg, color: COLOR.ink, border: `1px solid ${COLOR.ink}3D` }
            }
          >
            {selected && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatBlock({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <p className={`${W.label} text-[11px] uppercase`} style={{ color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}>
        {label}
      </p>
      <p className={`${W.heavy} tabular-nums leading-tight`} style={{ color: COLOR.ink, fontSize: "26px", letterSpacing: "-0.01em" }}>
        {value}
      </p>
      {sub ? (
        <p className={`${W.body} text-[12px] leading-snug mt-0.5`} style={{ color: COLOR.mutedOnSurf }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}
