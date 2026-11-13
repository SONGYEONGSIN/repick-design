// Shared literal design tokens -- light theme (this round's banList bans `dark`: the last two
// landing winners, r51 and r52, were both dark). Accent is indigo, distinct from candidate a's
// rose in the same round and from the last three landing winners' accents (orange, cyan, amber).
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance:
//
//   L(white)    = 1.0
//   L(#4F46E5) (indigo-600) = 0.1171
//
//   indigo-600 text/fill directly on white: (1.0+0.05)/(0.1171+0.05) = 6.29:1
//     -> clears AA at every size with real headroom. White text on an indigo-600 fill is the
//        same two luminances, so it is also 6.29:1 -- one hex value is safe in every role here,
//        unlike candidate a's rose pair, which needed two shades.
export const BG = "#FFFFFF";
export const SURFACE = "#F6F6FB"; // faint indigo-tinted card surface
export const SURFACE_BORDER = "#E3E3EE";
export const FG = "#0B0B0F";
export const MUTED_HEX = "#52525B"; // zinc-600

export const ACCENT_HEX = "#4F46E5"; // indigo-600 -- safe everywhere, see math above
export const ACCENT_FILL = "bg-[#4F46E5]";
export const ACCENT_TEXT = "text-[#4F46E5]";
export const ON_ACCENT_FILL_TEXT = "text-white";

export const MUTED_TEXT = "text-[#52525B]";

// No `outline-none` anywhere in this string, no `ring-*` utility -- this build paints
// `ring`+`ring-offset` fully transparent in Tailwind v4, so every candidate uses `outline`.
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// One display face, Latin headline text only, never body copy (Pretendard carries the rest).
// Different from candidate a's grotesk, deliberately -- this round assigns a distinct whitelisted
// face per candidate.
export const DISPLAY_FONT = "var(--font-display-wide)";

// Body-width arithmetic (brief §Spacing): Pretendard's mixed-script average advance is 0.44em.
// Target ~70 characters. At 16px body: 500 / (0.44*16) ≈ 71 chars -- inside the 75-char failure
// ceiling with margin.
export const PROSE_WIDTH = "max-w-[500px]";
