/**
 * Shared tokens for this route. LIGHT theme (pure-white page, near-black
 * ink) — see the candidate report for why this round's three candidates
 * are all light. Accent is a royal blue, distinct from both the brief's
 * default violet (`#6E56CF`) and this catalog's earlier sky-blue
 * candidate (`r35/c`).
 *
 * Tailwind's `blue-600` / `blue-700` / `blue-300` are used by name because
 * they resolve to the exact hex values the contrast math below was
 * computed against. Full relative-luminance working is in
 * `candidates/c.md` under "브리프에 없던 것"; the headline numbers:
 *
 * ACCENT — #2563EB (blue-600), the fill / border / bar shade:
 *   - vs white (#FFFFFF): 5.16:1 — clears AA (4.5:1) for text of any size.
 *     This is the pair used for white text set directly on an ACCENT fill
 *     (buttons, pressed chips).
 *   - vs this route's ink (#09090B, Tailwind zinc-950): 3.85:1 — clears
 *     the 3:1 large-text/non-text floor but not small-text AA, so dark
 *     ink is only ever used on an ACCENT fill at ≥24px (or ≥19px bold),
 *     mirroring the brief's own rule for the default violet.
 *
 * ACCENT_TINT — #1D4ED8 (blue-700), the small-text / icon / focus-ring
 * tint derivative:
 *   - vs white: 6.70:1 — clears AA with real headroom, and clears the
 *     3:1 non-text floor for the focus outline by a wide margin. Every
 *     small running label (eyebrows, captions, icons) and the focus ring
 *     itself all use this one shade, so there is exactly one
 *     accent-on-light contrast number to keep safe.
 *
 * Text-on-fill: every solid ACCENT button in this route uses WHITE text
 * (5.16:1, safe at any size), never dark ink — dark ink is reserved for
 * the one ≥24px/bold use (the bubble cluster's "fastest" badge text,
 * which also lives on an ACCENT fill, sized well above the 19px-bold
 * floor).
 */
export const ACCENT = "#2563EB"; // blue-600 — fill / border / bar
export const ACCENT_LIGHT = "#93C5FD"; // blue-300 — lightest fill only, always paired with a border + text legend, never used as text or focus color
export const ACCENT_TINT = "#1D4ED8"; // blue-700 — small-text / icon / focus-ring tint derivative
export const ACCENT_SOFT_BG = "rgba(37, 99, 235, 0.08)";
export const ACCENT_SOFT_BORDER = "rgba(37, 99, 235, 0.35)";
export const INK = "#09090B"; // Tailwind zinc-950

/**
 * Shared focus style. Never preceded by `outline-none`, and never a bare
 * `ring-*` utility — an explicit `outline` pair is used instead, so the
 * ring can never be silently painted transparent by a conflicting
 * `ring-color`/`ring-opacity` utility elsewhere on the same element.
 * Outline color is ACCENT_TINT (blue-700), 6.70:1 against this page's
 * white/near-white surfaces — well past the 3:1 floor for a non-text
 * focus indicator.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]";
