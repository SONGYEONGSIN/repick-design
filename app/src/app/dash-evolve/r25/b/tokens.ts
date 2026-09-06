/**
 * Payline — route-scoped design tokens (r25 / candidate b).
 *
 * THEME: light (real white-based canvas — Mercury/Monarch-grade, not cream/paper).
 * Canvas = zinc-50, cards = white + zinc-200 hairline + shadow-sm.
 *
 * ACCENT: single orange, split by what sits on it (both verified against their actual background,
 * not assumed) —
 *   orange-700 #c2410c → 5.18:1 on white. Carries small/body text: active nav, links, focus rings,
 *     "held" emphasis text.
 *   orange-600 #ea580c → 3.56:1 on white — fails the 4.5:1 body floor, so it is NEVER used for
 *     normal-size text. Reserved for decorative/graphical use only (chart bars, large ≥19px bold
 *     numerals, icon fills) where the 3:1 non-text/large-text floor applies.
 *   Solid buttons use orange-700→900 (white text 5.18:1+), never orange-600, because white-on-600
 *     only clears 3.56:1.
 * Status semantics (paid/processing/held/failed) deliberately do NOT reuse the accent — they use
 * conventional green/blue/zinc/red so the single accent stays legible as "this is the brand", per
 * the single-accent principle. Every status/delta pairs an icon with the color; color never carries
 * meaning alone.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#c2410c";
export const ACCENT_DECORATIVE_HEX = "#ea580c";

export const FOCUS =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 focus-visible:shadow-[0_0_0_3px_rgba(194,65,12,0.22)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-100";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
/** For text on a plain white/zinc-50 ground only (zinc-500 ≈ 4.83:1 on white). */
export const TEXT_AUX = "text-zinc-500";
/** For text on a tinted/muted surface (zinc-100+) — zinc-500 fails there (4.34:1); zinc-600 clears 7.18:1. */
export const TEXT_MUTED = "text-zinc-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-orange-700";
export const ACCENT_SOLID = "bg-orange-700 text-white hover:bg-orange-800 active:bg-orange-900";
export const ACCENT_SUBTLE = "border border-orange-200 bg-orange-50 text-orange-800";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";
export const MOTION = "transition-all duration-200 motion-reduce:transition-none motion-reduce:transform-none";

/** Up/down — always paired with an icon; color is never the only signal. */
export const UP_TEXT = "text-green-700";
export const DOWN_TEXT = "text-red-700";

export const STATUS_STYLE: Record<string, string> = {
  paid: "border border-green-200 bg-green-50 text-green-800",
  processing: "border border-blue-200 bg-blue-50 text-blue-800",
  held: "border border-zinc-300 bg-zinc-100 text-zinc-700",
  failed: "border border-red-200 bg-red-50 text-red-800",
};
