/**
 * Shared tokens for this route. LIGHT theme (near-white page, near-black
 * ink), sky accent family, no display face anywhere — every heading stays
 * on the inherited `--font-sans` (Pretendard) stack.
 *
 * Tailwind's `sky-500` / `sky-600` / `sky-700` / `sky-300` are used by name
 * because they resolve to the exact hex values the contrast math below was
 * computed against (so a Tailwind upgrade that keeps the palette keeps the
 * math valid). Full relative-luminance working is in the candidate report
 * (`candidates/c.md`, `## 브리프에 없던 것`); the headline numbers:
 *
 * ACCENT — #0EA5E9 (sky-500), the (a) fill / border / bar shade:
 *   - vs white (#FFFFFF): 2.77:1 — fails AA for text, which is exactly why
 *     it is never used as *text* on this page's near-white background. It
 *     is fine as a fill/border/bar color paired with a border and a text
 *     legend (color is never the only signal here), and it is the fill a
 *     dark-ink label sits on (see (c) below).
 *   - vs this route's ink (#0B0B0F): 7.09:1 — clears AA for text of any
 *     size. This is the pair that matters for (c): dark ink text set
 *     directly on an ACCENT fill.
 *
 * ACCENT_TINT — #0369A1 (sky-700), the (b) small-text / icon / focus-ring
 * tint derivative:
 *   - vs white: 5.94:1 — clears AA (4.5:1) for small text/icons with
 *     headroom, and clears the 3:1 non-text floor for the focus outline by
 *     a wide margin. This is the one shade used for every small running
 *     label (eyebrows, captions, icons) and for the focus ring itself, so
 *     there is exactly one accent-on-light contrast number to keep safe,
 *     not several.
 *   - sky-300 (#7DD3FC), which did this job in the dark-theme original,
 *     was re-checked for this light flip and rejected: vs white it is only
 *     1.67:1 — it reads fine on a dark ink background but is close to
 *     invisible as text or a focus ring on white, which is exactly why the
 *     theme flip cannot just swap backgrounds and keep every old hex.
 *
 * Text-on-fill, (c): because ACCENT fails AA against white, every solid
 * accent button uses dark INK text, not white, on the ACCENT fill — ink-on-
 * accent is the same 7.09:1 pair as above, just read the other way round.
 * White-on-ACCENT would be 2.77:1 and fails outright, at any size.
 */
export const ACCENT = "#0EA5E9"; // sky-500 — fill / border / bar
export const ACCENT_LIGHT = "#7DD3FC"; // sky-300 — lightest bar segment only, paired with a border + text legend, never used as text or focus color on this light page
export const ACCENT_TINT = "#0369A1"; // sky-700 — small-text / icon / focus-ring tint derivative (also the deepest bar segment)
export const ACCENT_SOFT_BG = "rgba(14, 165, 233, 0.08)";
export const ACCENT_SOFT_BORDER = "rgba(14, 165, 233, 0.35)";
export const INK = "#0B0B0F";

/**
 * Shared focus style. Never preceded by `outline-none` — an explicit
 * `outline` pair is used instead of `ring-*` utilities, so the ring can
 * never be accidentally painted transparent by a conflicting
 * `ring-color`/`ring-opacity` utility elsewhere on the same element (the
 * Tailwind v4 risk the brief calls out). Outline color is ACCENT_TINT
 * (sky-700), 5.94:1 against this page's white/near-white surfaces — well
 * past the 3:1 floor for a non-text focus indicator.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1]";
