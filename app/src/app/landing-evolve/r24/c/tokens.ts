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
 *   #0E7490 (cyan-700, FILL) as TEXT on #FAFAFA (bg)     5.13:1   passes AA at every text size —
 *                                                                  used for fills/borders/large text
 *   #155E75 (cyan-800, TEXT TINT) vs #FAFAFA             6.96:1   extra margin for small text/icons/
 *                                                                  focus ring — used where #0E7490's
 *                                                                  5.13:1 leaves the least headroom
 *   #FFFFFF (white) as TEXT on #0E7490 FILL              5.36:1   passes AA at every text size —
 *                                                                  the only text color used on fill
 *   #111114 (ink) as TEXT on #0E7490 FILL                3.52:1   large text (>=24px/19px bold) or
 *                                                                  non-text only — NOT used for body
 *                                                                  text on fill anywhere on this page
 *   #52525B (zinc-600, MUTED) vs #FAFAFA                 7.41:1   safe on near-white surfaces
 *   #52525B (zinc-600, MUTED) vs #F4F4F5 (panel)         7.03:1   safe on tinted/panel surfaces too
 *                                                                  (so muted text never needs to
 *                                                                  track which floor applies)
 *
 * Full derivation (WCAG relative-luminance formula, computed not eyeballed) is repeated in
 * candidates/c.md under "브리프에 없던 것".
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#0E7490"; // fill: buttons, top-match ring, bar fills, large text
// #155E75 (the extra-margin small-text/focus-ring tint referenced in the table above) is applied
// directly as `text-[#155E75]` / `outline-[#155E75]` at each call site rather than re-exported here.

export const INK_TEXT = "text-[#111114]";
export const MUTED_TEXT = "text-[#52525B]";

// Visible-focus idiom: real outline + offset, never bare `ring-*` (transparent fill in Tailwind v4)
// and never preceded by `outline-none`.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";
