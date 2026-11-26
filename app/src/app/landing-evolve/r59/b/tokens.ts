// Shared literal design tokens for this route — dark theme, accent hue: rose. Literal hex
// values, not Tailwind palette-name utilities (Tailwind v4 paints `ring`/`ring-offset` fully
// transparent via oklab recomputation in this app — a documented failure mode in this catalog).
//
// Contrast computed sRGB -> linear -> WCAG relative luminance,
// L = 0.2126R + 0.7152G + 0.0722B, ratio = (L_light+0.05)/(L_dark+0.05):
//
//   L(#09090B) bg        = 0.0006  (zinc-950)
//   L(#FFFFFF) fg        = 1.0000
//   L(#A1A1AA) muted     = 0.3376  (zinc-400 — the brief's floor for dark secondary text; this
//     route uses the floor value itself, which is permitted — the static rule bans 500/600, not
//     400)
//   L(#FB7185) accent    = 0.3954  (rose-400)
//   L(#F43F5E) accent-lg = 0.2543  (rose-500)
//
//   white vs zinc-950:        19.90:1 — primary text
//   zinc-400 vs zinc-950:      7.76:1 — clears body AA (4.5) with large headroom
//   rose-400 vs zinc-950:      7.39:1 — clears body AA. Used for small text, icons, borders, the
//     focus-visible outline, AND as a fill (see below for the fill's text color).
//   rose-500 vs zinc-950:      5.42:1 — also clears body AA; reserved for large/bold decorative
//     headline-word emphasis (never a fill — see white-on-fill failure below).
//
//   Fill text color is NOT symmetric here, unlike a light-theme route — the dark-theme brief's own
//   worked example on this exact failure mode ([[design-principles]] §Color Tokens, Q29 — the
//   loop's hard-gate reversed the brief's originally-written guidance) says to check both:
//     white text ON a rose-400 fill:        2.69:1 — FAILS even the 3:1 large floor. Never use.
//     dark ink (#09090B) ON a rose-400 fill: 7.39:1 — clears body AA. The only text color ever
//       placed on an ACCENT fill on this route.

export const BG = "#09090B"; // zinc-950
export const SURFACE = "#18181B"; // zinc-900 — card background
export const SURFACE_TINT = "#27272A"; // zinc-800 — scrubber track / toggle-off background
export const BORDER = "#3F3F46"; // zinc-700
export const BORDER_STRONG = "#52525B"; // zinc-600

export const FG = "#FFFFFF"; // 19.90:1 on BG
export const MUTED = "#A1A1AA"; // zinc-400 — 7.76:1 on BG

export const ACCENT = "#FB7185"; // rose-400 — 7.39:1 on BG; text/icon/border/focus-ring/fill token
export const ACCENT_LARGE = "#F43F5E"; // rose-500 — 5.42:1 on BG; large/bold text only, never a fill
export const ACCENT_SOFT_BG = "#4C0519"; // rose-950 — decorative tint panel bg, light text on top
export const ON_ACCENT_TEXT = "#09090B"; // dark ink — the only text color ever placed on an ACCENT fill

// No `outline-none` anywhere (would cancel the rule below via `--tw-outline-style: none`) and no
// `ring-*`/`ring-offset-*` utility as the sole focus signal.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FB7185] focus-visible:rounded-sm";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.22em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";

// Exactly one display face, Latin headline text only, never body. Assigned: --font-display-mono
// (frame-index readouts and tabular-nums deltas are this route's dominant motif — a monospaced
// display face reinforces that the scrubber is reading a log, not writing prose). Not used by
// either of the last 2 landing winners.

// Body-width arithmetic (0.44em/glyph average, not `ch`). chars-per-line = px / (0.44*font-px).
//   Hero subhead, 16px:       7.04 px/char. Container 470px -> 66.8 chars.
//   Deduction-row note, 13px: 5.72 px/char. Container 310px -> 54.2 chars.
//   Value-split copy, 14px:   6.16 px/char. Container 290px -> 47.1 chars.
//   Closing CTA sub, 17px:    7.48 px/char. Container 450px -> 60.2 chars.
//   Social-proof quote, 14.5px: 6.38 px/char. Container 360px -> 56.4 chars.
export const PROSE_WIDTH_HERO = "max-w-[470px]";
export const PROSE_WIDTH_ROW = "max-w-[310px]";
export const PROSE_WIDTH_COLUMN = "max-w-[290px]";
export const PROSE_WIDTH_CTA = "max-w-[450px]";
export const PROSE_WIDTH_QUOTE = "max-w-[360px]";
