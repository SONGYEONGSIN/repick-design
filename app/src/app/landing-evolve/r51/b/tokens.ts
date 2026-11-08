/**
 * Design tokens for this route — computed, not guessed, and scoped to this
 * route only (globals.css is untouched). Theme: light. Accent: fuchsia, not
 * used anywhere else in this catalog yet.
 *
 * Contrast arithmetic (relative luminance -> WCAG ratio), using the exact
 * pre-computed values the brief supplies rather than re-deriving them:
 *   - ACCENT_TEXT  #A21CAF (fuchsia-700) vs white #FFFFFF -> 6.32:1. Used for
 *     every small/body-sized accent-colored text directly on the near-white
 *     background: eyebrows, links, small labels. Clears the 4.5:1 AA floor
 *     with real margin (the brighter fuchsia-600 is only 4.71:1 — "just
 *     barely passes," which this project treats as a smell, so it is never
 *     used for small text).
 *   - ACCENT_LARGE #C026D3 (fuchsia-600) — reserved for large text (>=24px,
 *     or >=19px bold), borders, chart/bar fills and large headline accents,
 *     where the stricter small-text floor does not apply.
 *   - ACCENT_FILL = the same #A21CAF, used as the fill behind WHITE text on
 *     buttons/chips: white-on-#A21CAF measures the same 6.32:1 (contrast is
 *     symmetric in its two colors) — safe. White on the brighter #C026D3
 *     fill would only be 4.71:1, so filled surfaces that carry real
 *     body-sized text always use the 700 step, never the 600 step.
 *   - INK #18181B (zinc-900) vs white -> ~17.7:1 (hand-computed via the
 *     sRGB -> linear -> relative-luminance -> ratio formula). Headline/body
 *     text color, nowhere near a contrast concern at any size.
 *   - MUTED #52525B (zinc-600) vs white -> ~7.75:1 (hand-computed the same
 *     way). Secondary/caption text, safe well above the 4.5:1 AA floor.
 *   - GHOST #71717A (zinc-500) vs white -> ~4.83:1 (hand-computed). Used
 *     only for the decorative section ghost numerals (01-05), which render
 *     at clamp(2.25rem, 6vw, 4rem) — always >=24px even at the clamp floor —
 *     so this color only ever needs to clear the large-text 3:1 floor, and
 *     it clears it with a wide margin even though it was picked to also be
 *     legible, not just technically passing.
 *   - BORDER #E4E4E7 (zinc-200), SURFACE #FAFAFA (zinc-50): non-text chrome,
 *     no contrast floor applies, chosen only to read as a faint near-white
 *     tint against the pure-white page background.
 */
export const INK = "#18181B";
export const MUTED = "#52525B";
export const GHOST = "#71717A";
export const BORDER = "#E4E4E7";
export const SURFACE = "#FAFAFA";
export const BG = "#FFFFFF";
export const ACCENT_TEXT = "#A21CAF";
export const ACCENT_LARGE = "#C026D3";
export const ACCENT_FILL = "#A21CAF";
export const ACCENT_TINT_BG = "rgba(162,28,175,0.08)";
export const ACCENT_TINT_BORDER = "rgba(162,28,175,0.28)";

/**
 * Body-column widths, computed from the brief's constant — average glyph
 * advance for this project's body font mix is 0.44em — never the `ch` unit.
 * chars = containerPx / (0.44 x fontPx); target ~70 chars/line.
 *   - 16px body copy:  70 x 0.44 x 16 = 492.8px  -> 493px
 *   - 17px intro copy: 70 x 0.44 x 17 = 524.8px  -> 525px
 *   - 15px quote copy: 70 x 0.44 x 15 = 462.0px  -> 462px
 */
export const MEASURE_16 = "493px";
export const MEASURE_17 = "525px";
export const MEASURE_15 = "462px";
