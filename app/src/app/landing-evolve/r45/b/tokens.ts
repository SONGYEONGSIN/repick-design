// Shared literal color tokens + class strings for the Match Reasoning Tree candidate
// (dark theme, near-monochrome, rose accent). WCAG relative-luminance math for every pairing
// is computed below (sRGB -> linear -> 0.2126/0.7152/0.0722 weighting -> (L1+.05)/(L2+.05)),
// written out here so the numbers in candidates/b.md trace back to one place.

export const BG = "#0B0B0F"; // near-black background (relative luminance L ~= 0.00345)
export const INK = "#F5F5F6"; // near-white primary text on BG

// ---- Accent: rose family ----
// Fill / large-text hex: rose-600 #E11D48 (L ~= 0.1736)
//   - white text on this fill            -> 4.70:1  (passes body-size AA, all sizes)
//   - INK (#F5F5F6, ~white) same as above
//   - dark ink (#0B0B0F) on this fill    -> 4.18:1  (clears large-text/non-text 3:1 floor,
//                                                     NOT small-text AA -> never used for
//                                                     small text on the fill, see below)
//   - this hex directly as TEXT on BG    -> 4.18:1  (same two luminances swapped) -> also
//                                                     short of small-text AA, so it is only
//                                                     ever used as a BACKGROUND fill or at
//                                                     large size, never as small running text
export const ACCENT_FILL_HEX = "#E11D48";
export const ACCENT_FILL = "bg-[#E11D48]";
export const ACCENT_BORDER = "border-[#E11D48]";
export const ON_ACCENT_FILL_TEXT = "text-white"; // 4.70:1 on the fill, see above

// Small text / icons / focus rings: a lighter tint of the same hue, rose-400 #FB7185
// (L ~= 0.3401) against BG (L ~= 0.00345) -> 7.30:1. Comfortably clears AA at any size.
export const ACCENT_TINT_HEX = "#FB7185";
export const ACCENT_TEXT = "text-[#FB7185]";
export const ACCENT_BORDER_TINT = "border-[#FB7185]/50";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FB7185] focus-visible:rounded-[4px]";

// ---- Muted / ghost text ----
// zinc-400 #A1A1AA (L ~= 0.3597) on BG -> 7.67:1. This is the dark-surface floor for this
// candidate's secondary text (never dips to zinc-500/600 for anything that must read as text).
export const MUTED_TEXT = "text-zinc-400";
// zinc-500 #71717A (L ~= 0.1673) on BG -> 4.07:1 -- used ONLY for the large (>=24px) decorative
// ghost numeral, which only needs the 3:1 large-text floor. zinc-600 (#52525B) was measured at
// ~2.5:1 against this same background elsewhere in this catalog and is avoided entirely here.
export const GHOST_TEXT = "text-zinc-500";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// Display face for this candidate: JetBrains Mono Display via --font-display-mono,
// latin headline text only (never body copy, never a second display face in this work).
export const DISPLAY = "font-[family-name:var(--font-display-mono)]";

// Body-copy container widths, derived from the 0.44em Pretendard average-glyph-advance
// formula (chars = width / (0.44 * font-size)), targeted near 70 chars, never over the
// 75-char ceiling. See candidates/b.md for the per-paragraph arithmetic.
export const BODY_WIDTH_BASE = "max-w-[496px]"; // 16px body text, ~70 chars
export const BODY_WIDTH_SM = "max-w-[430px]"; // 14px body text, ~70 chars

// ---- Tree node states (fill/border/weight contrast only -- no box-shadow glow anywhere) ----
export const NODE_LOCKED =
  "border border-dashed border-zinc-700 bg-transparent text-zinc-400";
export const NODE_AVAILABLE =
  "border border-zinc-600 bg-white/[0.03] text-zinc-300 hover:border-[#FB7185]/60 hover:bg-white/[0.06]";
export const NODE_SELECTED = "border-2 border-[#E11D48] bg-[#E11D48] text-white";

// Connector line colors (dim = structure always visible; lit = the path actually taken).
export const LINE_DIM = "#3f3f46"; // zinc-700, decorative non-text -- no text-contrast floor applies
export const LINE_LIT = "#FB7185";
