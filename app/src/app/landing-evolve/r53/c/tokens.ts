// Shared literal design tokens -- light theme (this round's banList bans `dark`: the last two
// landing winners, r51 and r52, were both dark). Accent is lime, distinct from candidates a
// (rose) and b (indigo) in this same round, and far from this catalog's two most-saturated
// accents (amber/teal, 8 uses each) -- lime has only 2 prior uses catalog-wide.
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance:
//
//   L(white)   = 1.0
//   L(#0B0B0F) (ink) = 0.0035
//   L(#65A30D) (lime-600) = 0.2902
//   L(#4D7C0F) (lime-700) = 0.1604
//
//   White text on a lime-600 fill:        (1.0+0.05)/(0.2902+0.05) = 3.09:1  -- FAILS body AA.
//   Dark ink on a lime-600 fill:           (0.2902+0.05)/(0.0035+0.05) = 6.36:1 -- passes every size.
//     -> lime is a LIGHT accent (like amber in this catalog's own precedent): fills always carry
//        dark ink, never white.
//   lime-600 text directly on white:       (1.0+0.05)/(0.2902+0.05) = 3.09:1 -- only clears the
//     large-text (>=24px) 3:1 floor. Not safe for body-size text.
//   lime-700 text directly on white:       (1.0+0.05)/(0.1604+0.05) = 4.99:1 -- clears body AA.
//     -> lime-600 is reserved for fills, borders, and >=24px display text; lime-700 carries every
//        small text role (labels, icons, focus ring).
export const BG = "#FFFFFF";
export const SURFACE = "#F7F9F2"; // faint lime-tinted card surface
export const SURFACE_BORDER = "#E2E8D5";
export const FG = "#0B0B0F";
export const MUTED_HEX = "#52525B"; // zinc-600

export const ACCENT_LARGE_HEX = "#65A30D"; // lime-600 -- fills, borders, chart ink, >=24px text
export const ACCENT_SMALL_HEX = "#4D7C0F"; // lime-700 -- body-size text, icons, focus ring

export const ACCENT_FILL = "bg-[#65A30D]";
export const ACCENT_BORDER = "border-[#65A30D]";
export const ACCENT_TEXT_LARGE = "text-[#65A30D]";
export const ACCENT_TEXT_SMALL = "text-[#4D7C0F]";
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // dark ink, never white -- see math above

export const MUTED_TEXT = "text-[#52525B]";

// No `outline-none` anywhere in this string, no `ring-*` utility -- this build paints
// `ring`+`ring-offset` fully transparent in Tailwind v4, so every candidate uses `outline`.
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D7C0F]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// One display face, Latin headline text only, never body copy. Different from a (grotesk) and
// b (wide) -- this round assigns a distinct whitelisted face per candidate.
export const DISPLAY_FONT = "var(--font-display-mono)";

// Body-width arithmetic (brief §Spacing): Pretendard's mixed-script average advance is 0.44em.
// Target ~70 characters. At 16px body: 500 / (0.44*16) ≈ 71 chars -- inside the 75-char ceiling.
export const PROSE_WIDTH = "max-w-[500px]";
