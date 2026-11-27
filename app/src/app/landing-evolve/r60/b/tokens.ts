// Shared literal design tokens for this route — light theme, accent hue: lime. Literal hex
// values, not Tailwind palette-name utilities (Tailwind v4 paints `ring`/`ring-offset` fully
// transparent via oklab recomputation in this app — a documented failure mode in this catalog).
// These exact lime values were already computed and WCAG-verified for this hue on a white
// background by a prior route in this catalog (auto-landing-r59/c) — reused rather than
// recomputed, since the underlying math does not change when the route does.
//
// Contrast computed sRGB -> linear -> WCAG relative luminance,
// L = 0.2126R + 0.7152G + 0.0722B, ratio = (L_light+0.05)/(L_dark+0.05):
//
//   L(#FFFFFF) bg        = 1.0000
//   L(#18181B) ink/fg    = 0.0093  (zinc-900)
//   L(#52525B) muted     = 0.0856  (zinc-600)
//   L(#3F6212) accent    = 0.0737  (lime-800)
//   L(#4D7C0F) accent-lg = 0.1130  (lime-700)
//
//   zinc-900 vs white:   17.72:1 — primary text
//   zinc-600 vs white:    7.73:1 — clears body AA (4.5) on white and on the zinc-100 tinted
//     segmented track
//   lime-800 vs white:     7.08:1 — clears body AA with comfortable margin. This route's one
//     small-text/icon/border/focus-ring/fill token.
//   lime-700 vs white:     4.99:1 — clears body AA with 0.49 of margin above the 4.5 floor;
//     reserved for large/bold decorative emphasis only, never a fill.
//   white on lime-800 fill: 7.08:1 — the only text color placed on an ACCENT fill.

export const BG = "#FFFFFF";
export const SURFACE = "#FAFAFA"; // zinc-50
export const SURFACE_TINT = "#F4F4F5"; // zinc-100 — toggle-off / segmented track background
export const BORDER = "#E4E4E7"; // zinc-200
export const BORDER_STRONG = "#D4D4D8"; // zinc-300

export const FG = "#18181B"; // zinc-900 — 17.72:1 on BG
export const MUTED = "#52525B"; // zinc-600 — 7.73:1 on BG and on SURFACE_TINT

export const ACCENT = "#3F6212"; // lime-800 — 7.08:1 on BG; text/icon/border/focus-ring/fill token
export const ACCENT_LARGE = "#4D7C0F"; // lime-700 — 4.99:1 on BG; >=24px bold only, never a fill
export const ACCENT_SOFT_BG = "#F7FEE7"; // lime-50 — decorative tint panel bg, dark text on top
export const ON_ACCENT_TEXT = "#FFFFFF"; // the only text color ever placed on an ACCENT fill

// No `outline-none` anywhere (would cancel the rule below via `--tw-outline-style: none`) and no
// `ring-*`/`ring-offset-*` utility as the sole focus signal.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F6212] focus-visible:rounded-sm";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.22em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";

// Exactly one display face, Latin headline text only, never body: --font-display-wide.
// Distinct from both of the last 2 landing winners (r58 pretendard-only, r59 display-mono) and
// from this round's other two candidates (a = display-grotesk, c = none).

// Body-width arithmetic (0.44em/glyph average, not `ch`). chars-per-line = px / (0.44*font-px).
//   Hero subhead, 16px:        7.04 px/char. Container 475px -> 67.5 chars.
//   Node-tooltip detail, 13px: 5.72 px/char. Container 300px -> 52.4 chars.
//   Value-split copy, 14px:    6.16 px/char. Container 285px -> 46.3 chars.
//   Closing CTA sub, 17px:     7.48 px/char. Container 455px -> 60.8 chars.
//   Social-proof quote, 14.5px: 6.38 px/char. Container 355px -> 55.6 chars.
export const PROSE_WIDTH_HERO = "max-w-[475px]";
export const PROSE_WIDTH_ROW = "max-w-[300px]";
export const PROSE_WIDTH_COLUMN = "max-w-[285px]";
export const PROSE_WIDTH_CTA = "max-w-[455px]";
export const PROSE_WIDTH_QUOTE = "max-w-[355px]";
