// Shared literal tokens for "Point Select" (r49/c) -- light theme, rose accent, Archivo Display
// (--font-display-wide) on headline/large text only, Pretendard everywhere else.
//
// Full WCAG relative-luminance math behind every pairing is written up in
// vault/20-generations/2026-11-06-auto-landing-r49/candidates/c.md -- this file only turns those
// computed decisions into reusable classes/hexes so every component draws from one source.

export const BG = "#FFFFFF"; // true white page background -- not cream ("genuine light", per the brief's own distinction)
export const BG_CLASS = "bg-white";
export const SURFACE = "#F5F3F3"; // one step off white -- panel/card surfaces, the pin-field plate
export const SURFACE_CLASS = "bg-[#F5F3F3]";
export const SURFACE_BORDER = "border-[#E7E3E3]";
export const INK = "#171717"; // near-black ink body/heading color
export const INK_CLASS = "text-[#171717]";

// Accent: rose. Chosen hex is #F43F5E (rose-500), a different point on the brief's named family
// than the repo's own rose-600 (#E11D48) precedent, computed independently rather than assumed:
//   relative luminance L(#F43F5E) ~= 0.2316 (sRGB->linear->WCAG per channel, then
//   L = 0.2126 R + 0.7152 G + 0.0722 B).
//   contrast vs BG (#FFFFFF, L=1): (1.05)/(0.2316+0.05) = 3.73:1 -- clears the LARGE-text /
//   non-text floor (3:1) but NOT body-size AA (4.5:1). Used directly only for fills, borders,
//   pin markers, and >=24px (or >=19px bold) text, per the brief's tiering.
export const ACCENT_HEX = "#F43F5E";
export const ACCENT_FILL = "bg-[#F43F5E]";
export const ACCENT_BORDER = "border-[#F43F5E]";
export const ACCENT_LARGE_TEXT = "text-[#F43F5E]"; // only on >=24px / >=19px-bold text, or non-text (icons, bars)

// Small text / icons / focus ring on a LIGHT bg: lightening the base rose (the dark-theme move)
// only approaches white and *loses* contrast -- the usable derivative here is a darker SHADE,
// verified by direct computation, not assumed:
//   #BE123C (rose-700): L ~= 0.1171. Contrast vs BG (#FFFFFF) = (1.05)/(0.1171+0.05) = 6.28:1.
//   Contrast vs SURFACE (#F5F3F3, L ~= 0.900) = (0.95)/(0.1671) = 5.69:1.
// Both clear body-size AA (4.5:1) on both surfaces this page actually uses.
export const ACCENT_SMALL_HEX = "#BE123C";
export const ACCENT_TEXT = "text-[#BE123C]";

// Text ON the accent fill (#F43F5E) -- computed both ways, not assumed:
//   white (#FFFFFF) on #F43F5E -> 3.73:1 (same two luminances as above) -- FAILS body-size AA,
//     large-text/non-text only.
//   dark ink (#171717, L ~= 0.00858) on #F43F5E -> (0.2316+0.05)/(0.00858+0.05) = 4.81:1 --
//     CLEARS body-size AA at every size.
// So every filled-accent surface on this page (selected pin, match-% chip, CTA pill) carries
// dark ink, never white -- the reverse of this repo's generic default, verified per-hue rather
// than assumed to carry over (the catalog's documented lime/emerald precedents made the same
// reversal for their own hues).
export const ON_ACCENT_FILL_TEXT = "text-[#171717]";
export const ON_ACCENT_FILL_HEX = "#171717";

// Muted / de-emphasized text. zinc-600 (#52525B, L ~= 0.0857) clears AA on BOTH surfaces used
// on this page: 7.74:1 on BG (#FFFFFF), 7.00:1 on SURFACE (#F5F3F3) -- one token safe everywhere,
// so no surface-conditional floor switch is needed here (zinc-500 would clear only on pure white
// -- 4.83:1 -- and drop to 4.37:1 on SURFACE, under AA, so it is reserved for >=24px ghost text
// below, never for regular muted body/caption text).
export const MUTED_TEXT = "text-zinc-600";

// Ghost / decorative large numerals (>=24px only). zinc-400 fails the 3:1 large-text floor on
// white; zinc-500 (#71717A, L ~= 0.1674) is the floor that actually clears it: (1.05)/(0.2174)
// = 4.83:1. Never used below 24px (or 19px bold).
export const GHOST_TEXT = "text-zinc-500";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE123C]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[11px] font-normal tracking-[0.04em]";

// Exactly three rendered font weights across the whole page: 400 (font-normal -- body copy),
// 600 (font-semibold -- eyebrows/captions/labels/buttons/chips), 800 (font-extrabold -- the H1
// and every big stat figure). font-bold/font-medium/font-light are never used anywhere here.
export const HEADLINE_FONT = { fontFamily: "var(--font-display-wide)" } as const;
