/**
 * Ledger — route-scoped design tokens (r19 / candidate b, "Reverse Auction Ledger").
 *
 * THEME: light, mandatory this round. Paper-toned near-white ground rather than pure white so the
 * order-book card (true white) reads as a distinct raised surface against the page.
 *
 * ACCENT: single hue, a deep ink-amber ("ledger stamp"), never violet. Contrast measured against
 * both white and the near-black ink (full arithmetic lives in the concept file):
 *   #92400E vs #FFFFFF  = 7.09:1  (passes AA for body text AND for white-on-fill buttons)
 *   #92400E vs #FAFAFA  = 6.79:1  (passes AA on the page ground)
 *   #92400E vs #18181B  = 2.50:1  (not used ink-on-ink; fills always pair with white or paper, never
 *                                   with the dark ink token)
 * Rank movement is signalled with emerald/rose, but never alone — every delta carries an icon and a
 * signed number as text, and the hue is purely reinforcing, never the sole channel.
 *
 * MUTED TEXT: zinc-600 only, everywhere, on every surface in this page (never zinc-500) — the page
 * mixes near-white (paper, white) and tinted (zinc-100 stripes, chip tracks) surfaces throughout,
 * and zinc-600 clears the stricter 4.5:1 floor on both (7.4:1 / 7.0:1) rather than tracking which
 * floor applies tile by tile.
 */

import type { CSSProperties } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#92400E";
export const ACCENT_TEXT = "text-[#92400E]";
export const ACCENT_BORDER = "border-[#92400E]";
export const ACCENT_SOLID = "bg-[#92400E] text-white hover:bg-[#7A3509] active:bg-[#65290A]";
export const ACCENT_SUBTLE = "border border-amber-200 bg-amber-50 text-[#92400E]";
export const ACCENT_DOT = "bg-[#92400E]";

// Visible-focus idiom: a real outline + a solid, colour-explicit box-shadow. Never bare `ring-*`
// (transparent in Tailwind v4) and never preceded by `outline-none` anywhere in this route.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#92400E] focus-visible:shadow-[0_0_0_4px_rgba(146,64,14,0.16)] focus-visible:rounded-sm";

export const PAGE_BG = "bg-[#FAFAF8]";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";
export const CARD_INSET = "bg-zinc-50";
export const STRIPE = "bg-zinc-100";
export const BORDER = "border-zinc-200";

export const INK = "text-zinc-900";
export const MUTED = "text-zinc-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";
/** The one allowed display face for this route — applied via inline style (not a Tailwind
 * arbitrary class) since `--font-display-mono` is declared in a plain `:root`, outside the
 * `@theme inline` block, so Tailwind never generates a utility for it. */
export const DISPLAY_STYLE: CSSProperties = { fontFamily: "var(--font-display-mono)" };

export const TRACK_EYEBROW = "tracking-[0.28em]";
export const TRACK_CAPTION = "tracking-[0.16em]";
export const TRACK_STAT = "tracking-[0.12em]";

export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
