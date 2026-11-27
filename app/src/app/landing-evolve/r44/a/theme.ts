// Shared visual tokens for this route. Dark theme, sky accent, no display
// face (Pretendard only — the repo's font whitelist has no "Inter" variable;
// --font-sans already resolves to Pretendard globally, so "no display face"
// simply means every element here inherits that default).

export const BG = "#0B0B0F";

// Accent — sky family. Both required contrast pairings below are computed
// from WCAG relative luminance (not estimated) against this exact bg hex;
// full math lives in the candidate note (vault/.../candidates/a.md).
//
//   White on #0369a1 (sky-700, the fill color)        = 5.93:1  -> passes AA small text
//   #0B0B0F ink on #0369a1 (same fill)                = 3.31:1  -> fails AA small text,
//                                                                   barely clears the 3:1
//                                                                   large-text/non-text floor
// Decision: fill backgrounds always carry WHITE text, never dark ink — 3.31:1
// is too close to the floor to use safely at any size.
export const ACCENT_FILL = "#0369a1"; // sky-700 — button/badge fill backgrounds
export const ACCENT_BRIGHT = "#38bdf8"; // sky-400 — large stat numbers, icon fills, active borders (9.17:1 on bg)
export const ACCENT_TINT = "#7dd3fc"; // sky-300 — active labels, emphasis spans (11.79:1 on bg)

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

// Body paragraph width — computed per design-principles.md §Spacing, not guessed:
// Pretendard's measured mixed-glyph average advance is 0.44em, not 1ch (ch is the
// advance of the digit "0", ~35% wider than that average in Pretendard).
//   chars-per-line = container-width / (0.44 * font-size)
// 16px paragraphs (hero subhead):      480 / (0.44 * 16) = 480 / 7.04  ≈ 68.2 chars
// 14px paragraphs (cards, testimonials): 430 / (0.44 * 14) = 430 / 6.16 ≈ 69.8 chars
// Both land inside the 65-75 band with headroom under the 75-char ceiling, close to
// the ~70 target rather than right up against it.
export const PROSE_16 = "max-w-[480px]";
export const PROSE_14 = "max-w-[430px]";
