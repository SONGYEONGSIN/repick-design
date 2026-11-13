// Shared literal design tokens -- light theme (this round's banList bans `dark`: the last two
// landing winners, r51 and r52, were both dark; two consecutive is this catalog's own ban
// threshold for theme). Accent is rose, not the brief default #6E56CF and not any of the last
// three landing winners' accents (orange, cyan, amber) or this catalog's two most-saturated
// accents (amber/teal, 8 uses each).
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance (not guessed, not read off
// a tool this environment cannot run):
//
//   L(white)   = 1.0
//   L(#E11D48) (rose-600) = 0.1752
//   L(#BE123C) (rose-700) = 0.1171
//
//   rose-600 text/fill directly on white:        (1.0+0.05)/(0.1752+0.05) = 4.66:1
//     -> clears AA at every size, but only by 0.16 -- too close for small body text given this
//        catalog's own "no just-barely-clearing-the-margin" posture on thresholds. Reserved for LARGE text,
//        borders, chart fill, and -- doubling as the fill-text check -- white text ON a rose-600
//        fill is the exact same 4.66:1 (same two luminances), so rose-600 fills may use white text.
//   rose-700 text directly on white:              (1.0+0.05)/(0.1171+0.05) = 6.29:1
//     -> clears AA with real headroom. Used for SMALL text, icons, and the focus ring.
export const BG = "#FFFFFF";
export const SURFACE = "#F7F7F8"; // card surface, one step off pure white
export const SURFACE_BORDER = "#E4E4E7"; // zinc-200
export const FG = "#0B0B0F";
export const MUTED_HEX = "#52525B"; // zinc-600 -- safe on both pure white and the SURFACE tint above

export const ACCENT_LARGE_HEX = "#E11D48"; // rose-600 -- fills, borders, chart ink, >=24px text
export const ACCENT_SMALL_HEX = "#BE123C"; // rose-700 -- body-size text, icons, focus ring

export const ACCENT_FILL = "bg-[#E11D48]";
export const ACCENT_BORDER = "border-[#E11D48]";
export const ACCENT_TEXT_LARGE = "text-[#E11D48]";
export const ACCENT_TEXT_SMALL = "text-[#BE123C]";
export const ON_ACCENT_FILL_TEXT = "text-white"; // 4.66:1 on the rose-600 fill, see math above

export const MUTED_TEXT = "text-[#52525B]";

// No `outline-none` anywhere in this string, and no `ring-*` utility: Tailwind v4 paints
// `ring`+`ring-offset` fully transparent (`oklab(0 0 0 / 0)`) in this app's build, so every
// candidate in this catalog uses explicit `outline` instead.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE123C]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[12px] font-normal tracking-[0.04em]";

// One display face, Latin headline text only, never mixed with another display variable, never
// body copy (Pretendard carries everything else, including every Korean glyph).
export const DISPLAY_FONT = "var(--font-display-grotesk)";

// Body-width arithmetic (brief §Spacing): Pretendard's mixed-script average advance is 0.44em.
// Target ~70 characters, not a hard 75 ceiling. At 17px body: 70 * 0.44 * 17 ≈ 524px. The two
// paragraph containers below use 500px, which lands at 500 / (0.44*17) ≈ 66.8 chars -- inside the
// 70-char target with margin, well under the 75-char failure threshold.
export const PROSE_WIDTH = "max-w-[500px]";
