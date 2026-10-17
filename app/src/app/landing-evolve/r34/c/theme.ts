/**
 * Shared tokens for this route. Dark theme, sky/light-blue accent, no
 * display face anywhere (Tailwind's `sky-500`/`sky-300`/`sky-700` are used
 * because they resolve to the exact hex values this candidate's contrast
 * math was computed against — see the candidate report for the full
 * relative-luminance working).
 *
 * ACCENT (#0EA5E9 / sky-500): against white, 2.77:1 (fails AA — never put
 * white text on an accent fill, and never use accent as text on a white
 * surface). Against this route's ink background (#0B0B0F), 7.09:1 — clears
 * AA for text of any size, so accent text/icons/borders directly on the
 * dark page background are always safe.
 *
 * ACCENT_TINT (#7DD3FC / sky-300): against white, 1.67:1 (fails — same
 * rule, never on white). Against ink, 11.78:1 — the extra headroom this
 * tint exists for: small captions, focus rings and icons where the margin
 * over the 4.5:1 floor should be generous, not just barely-passing.
 *
 * Because neither shade clears AA against white, every accent-on-fill
 * button in this route uses dark ink text on the accent fill, not white —
 * ink-on-accent (#0B0B0F text on #0EA5E9) is the same 7.09:1 pair, just
 * read the other way round, and that direction *does* need to work since
 * it is literal running text on a solid button.
 */
export const ACCENT = "#0EA5E9"; // sky-500
export const ACCENT_TINT = "#7DD3FC"; // sky-300
export const ACCENT_DEEP = "#0369A1"; // sky-700 — third stacked-bar segment, same hue family
export const ACCENT_SOFT_BG = "rgba(14, 165, 233, 0.12)";
export const ACCENT_SOFT_BORDER = "rgba(14, 165, 233, 0.4)";
export const INK = "#0B0B0F";

/**
 * Shared focus style. Never preceded by `outline-none` — an explicit
 * `outline` pair is used instead of `ring-*` utilities so the ring is
 * never accidentally painted transparent by a conflicting ring-color
 * utility elsewhere on the same element.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC]";
