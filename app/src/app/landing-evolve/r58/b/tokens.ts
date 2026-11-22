// Shared literal design tokens for this route — light theme, accent hue: sky. Literal hex values,
// not Tailwind palette-name utilities, because Tailwind v4 in this app paints `ring`/`ring-offset`
// fully transparent and recomputes named palette colors through oklab (a known failure mode in
// earlier rounds of this catalog) — literal hex sidesteps both.
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance, L = 0.2126R+0.7152G+0.0722B
// with each channel linearized as c<=0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4 :
//
//   L(white)              = 1.0000
//   L(#FFFFFF) bg          = 1.0000
//   L(#18181B) ink/fg      = 0.0093  (zinc-900)
//   L(#52525B) muted       = 0.0856  (zinc-600, the brief's stated floor for TINTED surfaces —
//     used uniformly so one MUTED constant is correct on both the near-white page bg and the
//     zinc-100 tinted panels, instead of switching tokens per surface)
//   L(#0284C7) accent-600  = 0.2063  (sky-600)
//   L(#0369A1) accent-700  = 0.1270  (sky-700)
//
//   #18181B vs #FFFFFF:        (1.0+0.05)/(0.0093+0.05) = 17.73:1 — primary text, huge headroom
//   #52525B vs #FFFFFF:        (1.0+0.05)/(0.0856+0.05) =  7.75:1 — clears body AA (4.5:1) on the
//     near-white bg AND on the zinc-100 tinted panels (same ratio-class math, well above the 4.5
//     tinted-surface floor the brief calls out), so MUTED needs no second surface-dependent token.
//
//   accent-600 (#0284C7) vs #FFFFFF: (1.05)/(0.2063+0.05) = 4.10:1 — clears the 3:1 LARGE/bold-text
//     and non-text floor, but NOT the 4.5:1 body-text floor. Used only for large/bold accents,
//     decorative icon strokes at larger sizes, and non-text fills (progress bars, chip borders) —
//     never for small body-size text.
//   accent-700 (#0369A1) vs #FFFFFF: (1.05)/(0.1270+0.05) = 5.93:1 — this is the darker-shade-of-
//     the-same-hue "small text / icon / focus ring" tone the brief calls for (the brief's own
//     phrasing assumes a dark background where you LIGHTEN the accent for small text; on this
//     light background the equivalent move is to DARKEN it instead — same intent, inverted
//     direction, noted in candidates/b.md). Clears body AA with room; used for small text, icons,
//     borders-that-carry-meaning, and the focus-visible outline.
//
//   white text ON an accent-700 FILL:  (1.0+0.05)/(0.1270+0.05) = 5.93:1 — clears AA for small text.
//   dark ink (#18181B) ON the SAME accent-700 fill: (0.1270+0.05)/(0.0093+0.05) = 2.99:1 — fails
//     even the 3:1 large-text floor. So every accent-filled button/chip/badge on this route uses
//     WHITE text, never dark ink, confirmed by the numbers above rather than assumed.
//
// Net rule for this route: accent-700 is the one hue token used for text/icons/borders/focus-ring
// at any size, and as a fill with WHITE text on top. accent-600 is reserved for large/bold
// headline accents and non-text elements only.

export const BG = "#FFFFFF";
export const SURFACE = "#FAFAFA"; // zinc-50 — card / alternating-section background
export const SURFACE_TINT = "#F4F4F5"; // zinc-100 — pill / segmented-control / toggle-off background
export const BORDER = "#E4E4E7"; // zinc-200
export const BORDER_STRONG = "#D4D4D8"; // zinc-300 — table rules

export const FG = "#18181B"; // zinc-900 — 17.73:1 on BG
export const MUTED = "#52525B"; // zinc-600 — 7.75:1 on BG, same ratio-class on tinted panels

export const ACCENT = "#0369A1"; // sky-700 — 5.93:1 on BG; text/icon/border/focus-ring/fill token
export const ACCENT_LARGE = "#0284C7"; // sky-600 — 4.10:1 on BG; large/bold-only + non-text uses
export const ACCENT_SOFT_BG = "#E0F2FE"; // sky-100 — decorative tint panel bg, dark text sits on top
export const ON_ACCENT_TEXT = "#FFFFFF"; // white — the only text color ever placed on an ACCENT fill

// No `outline-none` anywhere in this route (which would cancel the rule below via
// `--tw-outline-style: none`) and no `ring-*`/`ring-offset-*` utility as the sole focus signal —
// every interactive element pairs a real `outline` with nothing that can cancel it.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1] focus-visible:rounded-sm";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.22em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";

// Exactly one display face, for large Latin headline text only, never body, never on this
// English-only page's few numeral-heavy moments either. `--font-display-grotesk` and
// `--font-display-wide` are banned for this round (last 2 landing winners); this round's menu is
// `--font-display-mono` or no display face at all. This route is assigned Pretendard-only — no
// display face anywhere, headings use `--font-sans` (Pretendard/Inter stack) like body text, with
// hierarchy carried by size/tracking/color instead.

// Body-width arithmetic (brief: Pretendard-mixed body text averages 0.44em/glyph, NOT the CSS
// `ch` unit, which runs ~35% wider). chars-per-line = container-px / (0.44 * font-size-px).
// Target ~70 chars, hard ceiling 75.
//   Hero subhead, 16px:        0.44*16 = 7.04 px/char. Container 480px -> 480/7.04 = 68.2 chars.
//     75-char ceiling at this size is 528px; 480px is 48px (6.8 chars) under it.
//   Value-split column copy, 14px: 0.44*14 = 6.16 px/char. Container 280px -> 280/6.16 = 45.5
//     chars. Well under target.
//   Tier blurb / card copy, 13px: 0.44*13 = 5.72 px/char. Container 320px -> 320/5.72 = 56.0
//     chars. Under target.
//   Closing CTA subhead, 17px: 0.44*17 = 7.48 px/char. Container 460px -> 460/7.48 = 61.5 chars.
//     75-char ceiling at this size is 561px; 460px is 101px (13.5 chars) under it.
//   Social-proof quotes, 14.5px: 0.44*14.5 = 6.38 px/char. Container 360px -> 360/6.38 = 56.4
//     chars. Under target.
export const PROSE_WIDTH_HERO = "max-w-[480px]";
export const PROSE_WIDTH_COLUMN = "max-w-[280px]";
export const PROSE_WIDTH_CARD = "max-w-[320px]";
export const PROSE_WIDTH_CTA = "max-w-[460px]";
export const PROSE_WIDTH_QUOTE = "max-w-[360px]";
