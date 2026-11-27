// Shared literal design tokens for this route — light theme, accent hue: cyan. Literal hex
// values, not Tailwind palette-name utilities, because Tailwind v4 in this app paints
// `ring`/`ring-offset` fully transparent via oklab recomputation (a documented failure mode in
// earlier rounds of this catalog) — literal hex plus a real `outline` sidesteps it entirely.
//
// Contrast computed sRGB -> linear -> WCAG relative luminance,
// L = 0.2126R + 0.7152G + 0.0722B, each channel linearized as
// c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4, ratio = (L_light+0.05)/(L_dark+0.05):
//
//   L(#FFFFFF) bg        = 1.0000
//   L(#18181B) ink/fg    = 0.0093  (zinc-900)
//   L(#52525B) muted     = 0.0856  (zinc-600)
//   L(#0E7490) accent    = 0.1569  (cyan-700)
//   L(#0891B2) accent-lg = 0.2144  (cyan-600)
//
//   zinc-900 vs white:   17.72:1 — primary text
//   zinc-600 vs white:    7.73:1 — clears body AA (4.5) on white AND on the zinc-100 tinted
//     segmented-control track (same ratio class, above the brief's tinted-surface 4.5 floor) —
//     one MUTED token is correct on both surfaces, no second token needed.
//   cyan-700 vs white:     5.36:1 — clears body-text AA (4.5). Used for small text, icons,
//     borders-that-carry-meaning, the focus-visible outline, and as a fill with WHITE text
//     (same 5.36:1 applies in reverse, confirmed below).
//   cyan-600 vs white:     3.68:1 — clears the 3:1 large/bold-text and non-text floor only, NOT
//     body AA. Reserved for >=24px bold headline accents and non-text fills (chart stroke,
//     progress-rail fill) — never small body text.
//   white on cyan-700 fill: 5.36:1 — the only text color ever placed on an ACCENT fill.

export const BG = "#FFFFFF";
export const SURFACE = "#FAFAFA"; // zinc-50 — card background
export const SURFACE_TINT = "#F4F4F5"; // zinc-100 — rung-track / segmented-control background
export const BORDER = "#E4E4E7"; // zinc-200
export const BORDER_STRONG = "#D4D4D8"; // zinc-300

export const FG = "#18181B"; // zinc-900 — 17.72:1 on BG
export const MUTED = "#52525B"; // zinc-600 — 7.73:1 on BG and on SURFACE_TINT

export const ACCENT = "#0E7490"; // cyan-700 — 5.36:1 on BG; text/icon/border/focus-ring/fill token
export const ACCENT_LARGE = "#0891B2"; // cyan-600 — 3.68:1 on BG; >=24px bold + non-text only
export const ACCENT_SOFT_BG = "#ECFEFF"; // cyan-50 — decorative tint panel bg, dark text on top
export const ON_ACCENT_TEXT = "#FFFFFF"; // the only text color ever placed on an ACCENT fill

// No `outline-none` anywhere in this route (which would cancel the rule below by setting
// `--tw-outline-style: none`) and no `ring-*`/`ring-offset-*` utility as the sole focus signal —
// every interactive element pairs a real `outline` with nothing that can cancel it.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490] focus-visible:rounded-sm";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.22em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";

// Exactly one display face, Latin headline text only, never body. Assigned: --font-display-grotesk
// (this round's diversity check found no axis forced an avoidance, so a fresh pick was made rather
// than defaulting — grotesk has not been this route's winner's face in the last 3 landing rounds).

// Body-width arithmetic (brief: Pretendard-mixed body text averages 0.44em/glyph, NOT the CSS
// `ch` unit, which runs ~35% wider). chars-per-line = container-px / (0.44 * font-size-px).
// Target ~70 chars, hard ceiling 75.
//   Hero subhead, 16px:      0.44*16 = 7.04 px/char. Container 480px -> 68.2 chars.
//   Checklist item, 14px:    0.44*14 = 6.16 px/char. Container 300px -> 48.7 chars.
//   Value-split copy, 14px:  0.44*14 = 6.16 px/char. Container 290px -> 47.1 chars.
//   Closing CTA sub, 17px:   0.44*17 = 7.48 px/char. Container 460px -> 61.5 chars.
//   Social-proof quote, 14.5px: 0.44*14.5 = 6.38 px/char. Container 360px -> 56.4 chars.
export const PROSE_WIDTH_HERO = "max-w-[480px]";
export const PROSE_WIDTH_LIST = "max-w-[300px]";
export const PROSE_WIDTH_COLUMN = "max-w-[290px]";
export const PROSE_WIDTH_CTA = "max-w-[460px]";
export const PROSE_WIDTH_QUOTE = "max-w-[360px]";
