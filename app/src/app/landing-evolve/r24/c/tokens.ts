/**
 * Bubble Match — route-scoped design tokens (r24 / candidate c).
 *
 * THEME: light. Near-white ground (`#FAFAFA`, effectively the zinc-50 tier) rather than pure white,
 * so the bubble-stage and card surfaces (`#FFFFFF`) read as raised panels against the page.
 *
 * ACCENT: single hue, cyan-family, never violet (catalog-overused per this round's brief) and never
 * emerald (the brief's other suggested option — picked cyan instead so this round doesn't converge
 * on whichever the sibling candidates pick). Two tints, chosen by contrast math, not by eye:
 *
 *   Pairing                                             Ratio     Verdict
 *   -------------------------------------------------  --------  --------------------------------
 *   #0E7490 (cyan-700, FILL) vs #FAFAFA (page bg)        5.13:1   large text / icons / borders OK,
 *                                                                  NOT small body text (needs 4.5)
 *   #155E75 (cyan-800, TEXT TINT) vs #FAFAFA             6.96:1   small text/icons/focus ring OK
 *   #FFFFFF (white) vs #0E7490 fill                      5.36:1   small text on fill OK (use this)
 *   #111114 (ink) vs #0E7490 fill                        3.52:1   large text (>=24px/19px bold) or
 *                                                                  non-text only on fill, NOT body
 *   #52525B (zinc-600, MUTED) vs #FAFAFA                 7.41:1   safe on near-white surfaces
 *   #52525B (zinc-600, MUTED) vs #F4F4F5 (panel)         7.03:1   safe on tinted/panel surfaces too
 *                                                                  (so muted text never needs to
 *                                                                  track which floor applies)
 *
 * Full derivation (WCAG relative-luminance formula, computed not eyeballed) is repeated in
 * candidates/c.md under "브리프에 없던 것".
 */

import type { CSSProperties } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const BG = "#FAFAFA";
export const INK = "#111114";
export const PANEL = "#F4F4F5";

export const ACCENT_HEX = "#0E7490"; // fill: buttons, top-match ring, bar fills, large text
export const ACCENT_TINT = "#155E75"; // small text / icon / focus-ring on light backgrounds

export const ACCENT_FILL = "bg-[#0E7490] text-white";
export const ACCENT_FILL_HOVER = "hover:bg-[#0B5E74] active:bg-[#094C5E]";
export const ACCENT_TEXT = "text-[#155E75]";
export const ACCENT_BORDER = "border-[#0E7490]";

export const INK_TEXT = "text-[#111114]";
export const MUTED_TEXT = "text-[#52525B]";

// Visible-focus idiom: real outline + offset, never bare `ring-*` (transparent fill in Tailwind v4)
// and never preceded by `outline-none`.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]";

export const CARD = "rounded-2xl border border-zinc-200 bg-white";
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const DISPLAY_STYLE: CSSProperties = { fontFamily: "var(--font-display-grotesk)" };

export const TRACK_EYEBROW = "tracking-[0.28em]";
export const TRACK_CAPTION = "tracking-[0.16em]";
export const TRACK_STAT = "tracking-[0.12em]";
