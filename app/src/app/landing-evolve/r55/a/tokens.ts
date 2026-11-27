// Shared literal design tokens — dark theme (default per design-principles §Color tokens),
// single accent hue: violet, assigned per this round's brief (not the canon default #6E56CF).
// Literal hex values rather than Tailwind palette names: this app's Tailwind v4 build paints
// `ring`/`ring-offset` utilities fully transparent and remaps named palette colors through oklab,
// both of which have bitten earlier rounds in this catalog. Literal hex sidesteps both failure modes.
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance (not guessed, not read off a
// palette chart):
//
//   linearize(c) = c/12.92                       if c <= 0.04045   (c = channel / 255)
//                = ((c + 0.055) / 1.055) ^ 2.4    otherwise
//   L = 0.2126*R + 0.7152*G + 0.0722*B
//   contrast(a, b) = (L_lighter + 0.05) / (L_darker + 0.05)
//
//   L(#FFFFFF) white                      = 1.0
//   L(#0B0B0F) bg / ink                   = 0.003448
//   L(#7C3AED) accent-large (violet-600)  = 0.1343
//   L(#C4B5FD) accent-small (violet-300)  = 0.5189
//   L(#A1A1AA) muted (zinc-400)           = 0.3596
//
//   accent-large (#7C3AED) vs bg (#0B0B0F):     (0.1343+0.05)/(0.003448+0.05) = 3.45:1
//     -> clears the 3:1 floor for LARGE text (>=24px / >=19px bold), buttons, borders, bars, chip
//        fills — but NOT 4.5:1 body text. Matches the canon default's own pattern (#6E56CF = 3.73:1)
//        almost exactly, so the same usage split applies: full accent fill is for large/non-text only.
//   white ON accent-large fill:                 (1.0+0.05)/(0.1343+0.05)      = 5.70:1
//     -> clears body-text AA (4.5:1) with headroom. This is why every label sitting on the
//        accent-large fill (CTA button, grade chip) is set in white, never dark ink.
//   dark ink (#0B0B0F) ON accent-large fill:    (0.1343+0.05)/(0.003448+0.05) = 3.45:1
//     -> only clears the large-text/non-text floor (same arithmetic as accent-vs-bg, since ink IS
//        the bg hex). Dark ink is therefore never used for small on-fill text here — white is used
//        for every accent-fill label regardless of size, since it clears AA at all sizes anyway.
//   accent-small (#C4B5FD) vs bg (#0B0B0F):     (0.5189+0.05)/(0.003448+0.05) = 10.65:1
//     -> the small-text/icon/focus-ring tint. Used anywhere accent sits directly on the background
//        at body size: captions, icons, links, the focus ring, the stepper's active dot/labels.
//   muted (#A1A1AA, zinc-400) vs bg:             (0.3596+0.05)/(0.003448+0.05) = 7.66:1
//     -> clears body AA with headroom; this is the brief's default muted token, unchanged — the
//        brief only asks the *accent* hue to be recalculated, not muted.
export const BG = "#0B0B0F";
export const SURFACE = "#141319"; // card surface, a hair lighter than bg — never used for text
export const SURFACE_TINT = "#1B1730"; // faint violet-tinted surface (stat chips, active cards)
export const SURFACE_BORDER = "#28262F"; // hairline border, dark-mode zinc-800 analog
export const FG = "#FFFFFF";
export const FG_SOFT = "#D4D4D8"; // near-white body copy, 13.3:1 on bg — one step down from FG, still far above AA
export const INK = "#0B0B0F"; // = BG, named separately for on-fill-text contrast math/readability

export const ACCENT_LARGE_HEX = "#7C3AED"; // violet-600 — fills/buttons/borders/bars/>=24px text, 3.45:1 on bg
export const ACCENT_SMALL_HEX = "#C4B5FD"; // violet-300 — body-size text/icons/focus ring, 10.65:1 on bg
export const ACCENT_TINT_HEX = "#2A1F52"; // decorative deep-violet surface tint only, never carries text alone

export const ACCENT_FILL_LARGE = "bg-[#7C3AED]";
export const ACCENT_BORDER = "border-[#7C3AED]";
export const ACCENT_TEXT_SMALL = "text-[#C4B5FD]"; // body-size text, icons, links — 10.65:1 on bg
export const ON_ACCENT_FILL_TEXT = "text-white"; // 5.70:1 on the violet-600 fill, safe at any size

export const MUTED_HEX = "#A1A1AA"; // zinc-400 — 7.66:1 on #0B0B0F, see math above
export const MUTED = "text-[#A1A1AA]"; // zinc-400, 7.66:1 on #0B0B0F — brief default, unchanged

// No `outline-none` anywhere in this string and no `ring-*` utility (see header note) — every
// interactive element pairs a visible `focus-visible:outline` with nothing that can cancel it.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4B5FD]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";
export const STAT_TRACKING = "tracking-[0.12em]";

// One display face, Latin headline text only (assigned: --font-display-wide), never mixed with
// another display variable, never used for body copy — there is no Korean copy on this page
// (page-brief-repo §1: English only), but the rule holds regardless.
export const DISPLAY_FONT = "var(--font-display-wide)";

// Body-column width arithmetic (design-principles §Typography): Pretendard's Latin+Korean-mixed
// average glyph advance is 0.44em/char — NOT CSS `ch` (the digit "0"'s advance, ~35% wider, which
// silently blows the character budget if used as the sizing unit). Target ~70 chars/line, hard
// ceiling 75. chars-per-line = container-px / (0.44 * font-size-px).
//   Hero subhead, 18px:    0.44*18 = 7.92 px/char -> 70-char ~= 554px, 75-char ceiling ~= 594px.
//     Container used: 550px -> 550 / 7.92 = 69.4 chars. At target, under ceiling.
//   Section body copy, 16px: 0.44*16 = 7.04 px/char -> 70-char ~= 493px, ceiling ~= 528px.
//     Container used: 492px -> 492 / 7.04 = 69.9 chars. At target, under ceiling.
//   Testimonial quotes, 14px: 0.44*14 = 6.16 px/char -> 70-char ~= 431px, ceiling ~= 462px.
//     Container used: 430px -> 430 / 6.16 = 69.8 chars. At target, under ceiling.
// `ch` is never used as a width unit anywhere on this page — all three are literal pixel
// max-widths computed from the formula above.
export const PROSE_WIDTH_HERO = "max-w-[550px]";
export const PROSE_WIDTH_BODY = "max-w-[492px]";
export const PROSE_WIDTH_CARD = "max-w-[430px]";
