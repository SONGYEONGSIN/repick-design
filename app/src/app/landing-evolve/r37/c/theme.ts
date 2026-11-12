/**
 * Shared tokens for this route. Dark theme (`#0B0B0F` page, near-white
 * ink), accent is emerald — deliberately not teal/orange/violet/rose
 * (all used in the last four winning rounds) and not the brief's default
 * violet (`#6E56CF`). Emerald also does double duty here: this candidate's
 * device is literally about verification checkmarks, and green-for-verified
 * is read correctly without relying on color alone (every checkmark pairs
 * the color with a `Check`/`BadgeCheck` glyph and a text label, never color
 * alone).
 *
 * Full relative-luminance arithmetic (WCAG formula, computed, not eyeballed)
 * lives in `candidates/c.md` under "브리프에 없던 것". Headline numbers:
 *
 * ACCENT_FILL — #047857 (emerald-700), used wherever the accent is a SOLID
 * FILL (primary CTA button, the "found" badge chip, the confidence-meter
 * bar's filled track):
 *   - WHITE text on this fill: 4.99:1 — clears AA (4.5:1) at any text size,
 *     including the small (~14px) button/badge labels actually set on it.
 *     Every accent-fill surface in this route uses white text, never dark
 *     ink, because white is the pair that was verified to clear small text.
 *
 * ACCENT_TINT — #34D399 (emerald-400), used wherever the accent is text,
 * an icon, or a focus ring directly on the dark PAGE background (never on
 * a fill):
 *   - vs page bg (#0B0B0F): 10.22:1 — clears AA with wide headroom, so the
 *     lens-affordance icon, the "found" checkmarks drawn on the
 *     illustration, small captions, and the focus-ring color are all safe
 *     at any size.
 *
 * ACCENT_DEEP — #065F46 (emerald-800), a quieter shade used only for
 * non-text decoration (unfilled meter track, card borders) — never carries
 * text, so it is exempt from the contrast floor by construction.
 *
 * MUTED — Tailwind's zinc-400 (#A1A1AA), this route's secondary-text
 * color: 7.66:1 against the page background, comfortably above both the
 * repo's dark-surface floor (zinc-400 minimum) and AA. zinc-500/600 are
 * never used for text in this route.
 */
export const ACCENT_FILL = "#047857"; // emerald-700 — solid fill + white text
export const ACCENT_TINT = "#34D399"; // emerald-400 — text/icon/focus on dark bg
export const ACCENT_DEEP = "#065F46"; // emerald-800 — non-text decoration only
export const ACCENT_SOFT_BG = "rgba(52, 211, 153, 0.10)";
export const ACCENT_SOFT_BORDER = "rgba(52, 211, 153, 0.35)";
export const INK = "#0B0B0F";
export const CARD_BG = "#15151B";

/**
 * Shared focus style. Never preceded by `outline-none`, and never a bare
 * `ring-*` utility — an explicit `outline` pair instead, so the ring can
 * never be silently painted transparent by a conflicting `ring-color`/
 * `ring-opacity` utility elsewhere on the same element. Outline color is
 * ACCENT_TINT (emerald-400), 10.22:1 against this page's dark background —
 * far past the 3:1 floor for a non-text focus indicator.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34D399]";
