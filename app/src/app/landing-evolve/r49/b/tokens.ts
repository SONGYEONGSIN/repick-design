// Shared literal color tokens + class strings for the "Week Scrubber" candidate (dark theme,
// near-black surface, blue accent, no display face — Pretendard only this round).
//
// Every ratio below is the real WCAG relative-luminance contrast (standard sRGB formula:
// linearize each channel, L = 0.2126 R + 0.7152 G + 0.0722 B, contrast = (L1+0.05)/(L2+0.05)
// with L1 the lighter of the pair) — computed by hand, not estimated. The full derivation is
// written out in vault/20-generations/2026-11-06-auto-landing-r49/candidates/b.md.

export const BG = "#0B0B0F"; // near-black page surface (assigned).
export const BG_CLASS = "bg-[#0B0B0F]";

export const INK = "#FFFFFF"; // pure white fg, per this round's assignment.
export const INK_CLASS = "text-white";
// INK vs BG -> 19.65:1 (pure white vs near-black). Safe for any text at any size.

// Card/panel surface: one step lighter than the page so cards/the scrubber panel read as a
// raised layer without introducing a second hue family.
export const CARD_BG = "#14141B";
export const CARD_BG_CLASS = "bg-[#14141B]";
export const CARD_BORDER = "border-white/10";

// ---- Muted text: a single flat zinc-400 value on this dark surface. The repo's conditional
// floor (zinc-500 on near-white, zinc-600 on tinted) is a LIGHT-surface rule; on a dark surface
// the floor is zinc-400 (`no-dark-dim-text` bans 500/600 here) and BOTH this page's surfaces
// clear it with real margin, so one value covers both: ----
// zinc-400 (#A1A1AA) vs BG (#0B0B0F)       -> 7.67:1
// zinc-400 (#A1A1AA) vs CARD_BG (#14141B)  -> 7.16:1
export const MUTED_TEXT = "text-zinc-400";

// ============================================================================================
// ACCENT — required contrast calculations (blue, own shade, not the literal #6E56CF default)
// ============================================================================================
//
// Base accent hex chosen: #2563EB (a specific blue — Tailwind's "blue-600" value, picked
// deliberately from the family the brief itself names as an example, not the default purple).
//
// 1) ACCENT_HEX (#2563EB) vs BG (#0B0B0F) — fill/border/bar/large-text usage test:
//      R=37/255=0.1451  -> linearized 0.01852
//      G=99/255=0.3882  -> linearized 0.12464
//      B=235/255=0.9216 -> linearized 0.83185
//      L_accent = 0.2126*0.01852 + 0.7152*0.12464 + 0.0722*0.83185 = 0.15313
//      L_bg (#0B0B0F)  = 0.00345  (R=G=11/255=0.0431 -> 0.003345 lin; B=15/255=0.0588 -> 0.00479 lin)
//      contrast = (0.15313+0.05) / (0.00345+0.05) = 0.20313 / 0.05345 = 3.80:1
//    -> Clears the 3:1 non-text/large-text floor, but FAILS small body-text AA (4.5:1). Per the
//       usage-tier rule, #2563EB is used ONLY as: filled background (buttons/badges), border,
//       chart bars/line stroke, and large text (>=24px or >=19px bold headline word) — never as
//       small/body-size colored text.
//
// 2) Small text / icons / focus rings need a lighter TINT of the same hue (#2563EB itself fails
//    4.5:1 at small sizes, so it cannot be reused there) — derived as Tailwind's blue-400:
//      ACCENT_TINT_HEX = #60A5FA
//      R=96/255=0.3765 -> lin 0.11694 | G=165/255=0.6471 -> lin 0.37593 | B=250/255=0.9804 -> lin 0.95595
//      L_tint = 0.2126*0.11694 + 0.7152*0.37593 + 0.0722*0.95595 = 0.36305
//      vs BG:       (0.36305+0.05)/(0.00345+0.05) = 0.41305/0.05345 = 7.73:1
//      vs CARD_BG:  L_card(#14141B)=0.00726 -> (0.36305+0.05)/(0.00726+0.05) = 0.41305/0.05726 = 7.21:1
//    -> Both clear 4.5:1 with real margin, so #60A5FA (blue-400) is the color for the eyebrow,
//       the focus ring, the trend-line dot stroke-on-text, and any small accent icon.
//
// 3) Text ON a filled accent surface (ACCENT_HEX = #2563EB as the button/badge fill):
//      WHITE text on #2563EB:    (1.0+0.05) / (0.15313+0.05) = 1.05/0.20313 = 5.17:1 (precise: 5.16:1)
//        -> Clears full-size AA (>=4.5:1). White is used for ALL text on a filled accent
//           surface at any size <=19px non-bold, per the brief's required rule.
//      DARK-INK (#0B0B0F) text on #2563EB: (0.15313+0.05) / (0.00345+0.05) = 0.20313/0.05345 = 3.80:1
//        -> Only clears the 3:1 LARGE-text floor, fails 4.5:1 body AA. Dark ink on a filled
//           accent surface is therefore never used for small text here — only for non-text
//           marks (a border/bar on an accent fill) or >=24px/>=19px-bold numerals, and this
//           candidate in fact never needs that combination (every accent-fill label uses white).
//
// Net usage map:
//   ACCENT_HEX #2563EB  -> fills, borders, bars, the trend-line stroke, large accent numerals
//   ACCENT_TINT #60A5FA -> eyebrows/captions/small icons/focus ring color
//   WHITE on ACCENT_HEX fill -> all button/badge text on a filled accent surface
export const ACCENT_HEX = "#2563EB";
export const ACCENT_TINT_HEX = "#60A5FA";

export const ACCENT_TINT_TEXT = "text-blue-400"; // small text/icons (7.72:1 / 7.23:1 — see above)
export const ACCENT_FILL = "bg-blue-600"; // #2563EB fill, always paired with white text
export const ACCENT_FILL_HOVER = "hover:bg-blue-500";
export const ON_ACCENT_TEXT = "text-white"; // 5.17:1 on the blue-600 fill
export const ACCENT_BORDER = "border-blue-600/70"; // non-text use of the saturated value is fine at 3.80:1
export const ACCENT_LARGE_TEXT = "text-blue-600"; // reserved for >=24px/>=19px-bold only (3.80:1)

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:rounded-[3px]";

// Decorative/ghost numerals: must clear 3:1 at their rendered size even though aria-hidden —
// axe's color-contrast check does not exempt a visibly-rendered node just because it is
// aria-hidden. #6B6B78 vs BG -> 3.74:1, vs CARD_BG -> 3.49:1 — both clear the 3:1 large-text
// floor, so every ghost numeral on this page stays >=24px (rendered at text-3xl/36px here).
export const GHOST_TEXT = "text-[#6B6B78]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// No display face this round (assigned: Pretendard only). Every string on this page — including
// the H1 — stays on the global --font-sans stack; nothing references --font-display-grotesk/
// -wide/-mono.

// Exactly three rendered font weights across the whole page, measured by computed style:
// 400 (font-normal — body copy, Tailwind preflight default), 600 (font-semibold — labels,
// captions, buttons, badges, stat values) and 800 (font-extrabold — H1, H2s, the hero/closing
// headline numerals). font-bold (700) and font-medium (500) are never used in this candidate.

// ---- Body-copy line-length container widths (required calculation) ----
// Pretendard's mixed-glyph average advance is 0.44em (NOT `ch`, which in Pretendard renders
// ~35% wider than the true average — `ch` is the width of the digit "0"). Formula:
//   chars-per-line = container-px / (0.44 * font-size-px)
// Solved here for container-px at a ~70-character target (hard ceiling 75, margin kept):
//   - 12px fine print  -> 370px container  = 370 / (0.44*12) = 370/5.28  = 70.08 chars
//   - 14px caption     -> 431px container  = 431 / (0.44*14) = 431/6.16  = 69.97 chars
//   - 16px body        -> 493px container  = 493 / (0.44*16) = 493/7.04  = 70.03 chars
//   - 18px lede        -> 554px container  = 554 / (0.44*18) = 554/7.92  = 69.95 chars
export const PROSE_WIDTH_12 = "max-w-[23.125rem]"; // 370px
export const PROSE_WIDTH_14 = "max-w-[26.9375rem]"; // 431px
export const PROSE_WIDTH_16 = "max-w-[30.8125rem]"; // 493px
export const PROSE_WIDTH_18 = "max-w-[34.625rem]"; // 554px
