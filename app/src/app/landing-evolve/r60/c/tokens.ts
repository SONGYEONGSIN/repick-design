// Shared literal design tokens for this route — dark theme, accent hue: orange. Literal hex
// values, not Tailwind palette-name utilities (Tailwind v4 paints `ring`/`ring-offset` fully
// transparent via oklab recomputation in this app — a documented failure mode in this catalog).
//
// Contrast computed sRGB -> linear -> WCAG relative luminance,
// L = 0.2126R + 0.7152G + 0.0722B, ratio = (L_light+0.05)/(L_dark+0.05):
//
//   L(#09090B) bg        = 0.0006  (zinc-950)
//   L(#FFFFFF) fg        = 1.0000
//   L(#A1A1AA) muted     = 0.3376  (zinc-400 — the brief's dark-secondary-text floor, used at the
//     floor value itself; the static rule bans 500/600, not 400)
//   L(#F97316) accent    = 0.3783  (orange-500)
//   L(#EA580C) accent-lg = 0.2903  (orange-600)
//
//   white vs zinc-950:        19.90:1 — primary text
//   zinc-400 vs zinc-950:      7.76:1 — clears body AA (4.5) with large headroom
//   orange-500 vs zinc-950:    7.10:1 — clears body AA. Used for small text, icons, borders, the
//     focus-visible outline, AND as a fill (see below for the fill's text color).
//   orange-600 vs zinc-950:    5.59:1 — also clears body AA; reserved for large/bold decorative
//     headline-word emphasis only (never a fill).
//
//   Fill text color is NOT symmetric — checked both ways per the brief's own worked example
//   ([[design-principles]] §Color Tokens, Q29):
//     white text ON an orange-500 fill:        2.80:1 — FAILS even the 3:1 large floor. Never use.
//     dark ink (#09090B) ON an orange-500 fill: 7.10:1 — clears body AA. The only text color ever
//       placed on an ACCENT fill on this route.

export const BG = "#09090B"; // zinc-950
export const SURFACE = "#18181B"; // zinc-900 — card background
export const SURFACE_TINT = "#27272A"; // zinc-800 — chip-off / track background
export const BORDER = "#3F3F46"; // zinc-700
export const BORDER_STRONG = "#52525B"; // zinc-600

export const FG = "#FFFFFF"; // 19.90:1 on BG
export const MUTED = "#A1A1AA"; // zinc-400 — 7.76:1 on BG

export const ACCENT = "#F97316"; // orange-500 — 7.10:1 on BG; text/icon/border/focus-ring/fill token
export const ACCENT_LARGE = "#EA580C"; // orange-600 — 5.59:1 on BG; large/bold text only, never a fill
export const ACCENT_SOFT_BG = "#431407"; // orange-950 — decorative tint panel bg, light text on top
export const ON_ACCENT_TEXT = "#09090B"; // dark ink — the only text color ever placed on an ACCENT fill

// No `outline-none` anywhere (would cancel the rule below via `--tw-outline-style: none`) and no
// `ring-*`/`ring-offset-*` utility as the sole focus signal.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] focus-visible:rounded-sm";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.22em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";

// Display face: NONE. This route keeps headings on --font-sans (Pretendard) and carries hierarchy
// through size/tracking/color alone — a deliberate counterpoint to this round's other two
// candidates (a = display-grotesk, b = display-wide), both of which use a display face.

// Body-width arithmetic (0.44em/glyph average, not `ch`). chars-per-line = px / (0.44*font-px).
//   Hero subhead, 16px:        7.04 px/char. Container 470px -> 66.8 chars.
//   Ledger-row note, 13px:     5.72 px/char. Container 300px -> 52.4 chars.
//   Value-split copy, 14px:    6.16 px/char. Container 290px -> 47.1 chars.
//   Closing CTA sub, 17px:     7.48 px/char. Container 450px -> 60.2 chars.
//   Social-proof quote, 14.5px: 6.38 px/char. Container 360px -> 56.4 chars.
export const PROSE_WIDTH_HERO = "max-w-[470px]";
export const PROSE_WIDTH_ROW = "max-w-[300px]";
export const PROSE_WIDTH_COLUMN = "max-w-[290px]";
export const PROSE_WIDTH_CTA = "max-w-[450px]";
export const PROSE_WIDTH_QUOTE = "max-w-[360px]";
