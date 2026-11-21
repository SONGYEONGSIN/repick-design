// Shared literal design tokens — light theme, single accent hue: emerald.
// Arbitrary hex values (not the `emerald-600` utility name) because Tailwind v4 in this app paints
// `ring`/`ring-offset` fully transparent and recomputes named palette colors through oklab, which
// has bitten earlier rounds in this catalog — literal hex sidesteps both.
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance (not guessed):
//
//   L(white)            = 1.0
//   L(#059669) emerald-600 = 0.2285
//   L(#047857) emerald-700 = 0.1417
//   L(#71717A) zinc-500    = 0.1673 (muted text, pure-white surfaces only)
//   L(#0B0B0F) ink          = 0.0035
//
//   emerald-600 vs white:      (1.0+0.05)/(0.2285+0.05)  = 3.77:1
//     -> clears the 3:1 floor for LARGE text (>=24px / >=19px bold), chart fills, bars, borders —
//        but NOT 4.5:1 body text. Used only at those large/non-text sizes (ghost score numeral,
//        stacked-bar segments, card borders, divider handles).
//   ink (#0B0B0F) ON emerald-600 fill:  (0.2285+0.05)/(0.0035+0.05) = 5.21:1
//     -> clears body-text AA. This is why CTA/chip text sitting on the emerald-600 fill is dark
//        ink, not white — white-on-emerald-600 is only 3.77:1, which fails at button-label sizes
//        (14–16px, not "large text" even when semibold).
//   emerald-700 vs white:      (1.0+0.05)/(0.1417+0.05)  = 5.48:1
//     -> clears 4.5:1 body-text AA with headroom. Used for small text, links, icons, and the
//        focus ring — anywhere emerald sits at body size directly on white.
//   white ON emerald-700 fill: same two luminances -> 5.48:1, safe for white text at any size.
//   zinc-500 vs white:          (1.0+0.05)/(0.1673+0.05)  = 4.83:1
//     -> clears body AA; zinc-500 is the muted-text floor on pure/near-white surfaces per brief.
//   zinc-600 (#52525B) is used instead wherever the surface is tinted (emerald-50 cards, filled
//     chip tracks) rather than pure white, per the surface-conditional muted-text rule.
export const BG = "#FFFFFF";
export const SURFACE_TINT = "#F7FDFA"; // a hair of emerald in the white, for card surfaces
export const SURFACE_BORDER = "#E4E4E7"; // zinc-200
export const INK = "#0B0B0F";

export const ACCENT_LARGE_HEX = "#059669"; // emerald-600 — fills/bars/borders/>=24px text, 3.77:1 on white
export const ACCENT_SMALL_HEX = "#047857"; // emerald-700 — body-size text/icons/focus ring, 5.48:1 on white
export const ACCENT_TINT_HEX = "#ECFDF5"; // emerald-50 — decorative surface tint only, never a text color
export const ACCENT_MID_HEX = "#34D399"; // emerald-400 — decorative bar segment only, never carries text

// The four stacked-bar segment colors, darkest to lightest, shared by the live allocator and the
// static scenario-preview bars in the value section so the two never drift apart visually.
// Decorative only — every segment is also named by an icon + text label wherever it appears.
export const SEGMENT_COLORS = ["#047857", "#059669", "#10B981", "#34D399"] as const;

export const ACCENT_FILL_LARGE = "bg-[#059669]";
export const ACCENT_BORDER = "border-[#059669]";
export const ACCENT_TEXT_LARGE = "text-[#059669]"; // >=24px / >=19px bold only
export const ACCENT_TEXT_SMALL = "text-[#047857]"; // body-size text, icons, links
export const ON_ACCENT_LARGE_FILL_TEXT = "text-[#0B0B0F]"; // 5.21:1 on the emerald-600 fill — see math above
export const ON_ACCENT_SMALL_FILL_TEXT = "text-white"; // 5.48:1 on the emerald-700 fill

export const MUTED_ON_WHITE = "text-[#71717A]"; // zinc-500, pure-white surfaces only — 4.83:1
export const MUTED_ON_TINT = "text-[#52525B]"; // zinc-600, any tinted/muted surface — floor per brief

// No `outline-none` anywhere in this string and no `ring-*` utility (see header note) — every
// interactive element pairs a visible `focus-visible:outline` with nothing that can cancel it.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";

// One display face, Latin headline text only, never mixed with another display variable, never
// used for body copy or for any Korean glyph (there is none — copy is English-only).
export const DISPLAY_FONT = "var(--font-display-wide)";

// Body-width arithmetic (brief: Pretendard mixed-script average advance is 0.44em/char).
// chars-per-line = container-px / (0.44 * font-size-px). Target ~70 chars, hard ceiling 75.
//   Hero subhead, 18px:  0.44*18 = 7.92px/char -> 70 chars ~= 554px, 75-char ceiling ~= 594px.
//     Container used: 540px -> 540/7.92 = 68.2 chars. Under target, well under ceiling.
//   Section body copy, 16px: 0.44*16 = 7.04px/char -> 70 chars ~= 493px, ceiling ~= 528px.
//     Container used: 480px -> 480/7.04 = 68.2 chars.
//   Testimonial quotes, 14px: 0.44*14 = 6.16px/char -> 70 chars ~= 431px, ceiling ~= 462px.
//     Container used: 420px -> 420/6.16 = 68.2 chars. Under the 75-char ceiling.
// `ch` is never used (Pretendard's "0" advance runs ~35% wide of the script average, so `ch`
// under-counts the real character budget) — all three are literal pixel max-widths instead.
export const PROSE_WIDTH_HERO = "max-w-[540px]";
export const PROSE_WIDTH_BODY = "max-w-[480px]";
export const PROSE_WIDTH_CARD = "max-w-[420px]";
