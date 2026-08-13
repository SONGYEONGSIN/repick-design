import type { CSSProperties } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { formatPct, type Swatch } from "./data";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** One focus treatment for every control on the route. */
export const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export const PANEL = "rounded-2xl border border-zinc-800 bg-zinc-900";

/** Diagonal fill, drawn from the element colour so no hex lands in markup. */
export const HATCH: CSSProperties = {
  backgroundImage: "repeating-linear-gradient(135deg, currentColor 0 2px, transparent 2px 6px)",
};

export function isHatched(swatch: Swatch): boolean {
  return swatch === "limeHatch" || swatch === "emeraldHatch";
}

export function swatchTone(swatch: Swatch): string {
  if (swatch === "lime" || swatch === "limeHatch") return "text-lime-300";
  if (swatch === "emerald" || swatch === "emeraldHatch") return "text-emerald-400";
  if (swatch === "zincDim") return "text-zinc-500";
  return "text-zinc-300";
}

export function SwatchDot({ swatch }: { swatch: Swatch }) {
  const hatched = isHatched(swatch);
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-block size-3 shrink-0 rounded-[3px] border",
        swatchTone(swatch),
        hatched ? "border-current" : "border-transparent bg-current",
      )}
      style={hatched ? HATCH : undefined}
    />
  );
}

export function DeltaChip({
  pct,
  goodWhenUp,
  onLime = false,
}: {
  pct: number | null;
  goodWhenUp: boolean;
  onLime?: boolean;
}) {
  if (pct === null) return null;
  const rounded = Math.round(pct * 10) / 10;
  const flat = rounded === 0;
  const up = rounded > 0;
  const good = flat || up === goodWhenUp;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const tone = onLime
    ? good
      ? "border-zinc-950/30 bg-zinc-950/10 text-zinc-950"
      : "border-zinc-950 bg-zinc-950 text-lime-300"
    : good
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
      : "border-zinc-700 bg-zinc-800 text-zinc-200";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs tabular-nums",
        tone,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {`${up ? "+" : rounded < 0 ? "-" : ""}${formatPct(Math.abs(rounded))}`}
    </span>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="10" className="fill-lime-300" />
      <path
        d="M9.5 11.5 16 23l6.5-11.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-950"
      />
      <circle cx="16" cy="9" r="2.1" className="fill-zinc-950" />
    </svg>
  );
}

/** Stands in for the network logo on the reference card. Own geometry, no brand. */
export function CardMark() {
  return (
    <svg viewBox="0 0 52 24" className="h-6 w-13" aria-hidden="true" focusable="false">
      <circle cx="13" cy="12" r="9" className="fill-lime-300" />
      <circle cx="25" cy="12" r="9" className="fill-emerald-400" opacity="0.9" />
      <rect x="38" y="4" width="3.4" height="16" rx="1.7" className="fill-zinc-600" />
      <rect x="44" y="9" width="3.4" height="11" rx="1.7" className="fill-zinc-600" />
    </svg>
  );
}

/** Deterministic geometric stand-in for a photo. Decorative, the name sits beside it. */
export function Avatar({ seed }: { seed: number }) {
  const step = seed % 3;
  const tone = step === 0 ? "text-lime-300" : step === 1 ? "text-emerald-400" : "text-zinc-300";
  const rotation = (seed * 53) % 360;
  return (
    <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden="true" focusable="false">
      <circle cx="18" cy="18" r="18" className="fill-zinc-800" />
      <g transform={`rotate(${rotation} 18 18)`} className={tone}>
        <path
          d="M18 8c5.2 2.8 8 6.4 8 10a8 8 0 0 1-16 0c0-3.6 2.8-7.2 8-10z"
          fill="currentColor"
          opacity="0.92"
        />
        <path
          d="M18 13.5v9.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="text-zinc-900"
        />
      </g>
    </svg>
  );
}
