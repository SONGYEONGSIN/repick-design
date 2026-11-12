// Design tokens for the Transit Path candidate — light theme, single violet accent.
//
// Contrast ratios computed with the standard WCAG relative-luminance formula (not assumed):
//   white #FFFFFF on accent #7C3AED (violet-600)      -> 5.70:1  (passes AA for any text size)
//   zinc-900 #18181B on accent #7C3AED (violet-600)   -> 3.11:1  (large-text/3:1 floor only — never used for body text)
//   accent #7C3AED text on white #FFFFFF              -> 5.70:1  (same pair, text role instead of fill — passes AA)
//   accent-strong #6D28D9 (violet-700) on white       -> 7.10:1
//   accent-strong #6D28D9 on tint #EDE9FE (violet-100)-> 5.98:1
//   muted #71717A (zinc-500) on white                 -> 4.83:1  (AA floor for near-white surfaces, per brief)
//   muted-on-tint #52525B (zinc-600) on tint #F5F3FF  -> 7.05:1
//   muted-on-tint #52525B (zinc-600) on tint #EDE9FE  -> 6.51:1  (AA floor for any tinted/muted surface, per brief)
//   zinc-500 (muted) on tint #F5F3FF                   -> 4.41:1  (FAILS small-text AA — this is why muted text never
//                                                          sits directly on a tinted surface; mutedOnTint is used there instead)
//
// Rule of thumb confirmed by these numbers: a filled accent surface (accent as background) needs
// white text to clear AA for normal text; accent as a text color on white/near-white clears AA on
// its own at any size, so labels/links can be set directly in accent without a fill behind them.
export const COLORS = {
  bg: "#FFFFFF",
  bgTint: "#F5F3FF", // violet-50 — tinted section backgrounds only
  bgTintStrong: "#EDE9FE", // violet-100 — pill / badge fills
  fg: "#18181B", // zinc-900
  muted: "#71717A", // zinc-500 — body/caption text on white or near-white surfaces only
  mutedOnTint: "#52525B", // zinc-600 — required floor once the surface is tinted (pills, tracks, tinted panels)
  line: "#E4E4E7", // zinc-200 — borders, non-text
  accent: "#7C3AED", // violet-600 — fills (always paired with white text), or as a text color on white
  accentStrong: "#6D28D9", // violet-700 — text on white/tint, hover state of accent fills
  accentSoft: "#C4B5FD", // violet-300 — decorative stroke only, never text
} as const;

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600";

// Display face for this candidate: Space Grotesk Display via --font-display-grotesk, latin-only,
// large headline/figure text only. Body, labels and every other string stay on --font-sans (Pretendard).
export const DISPLAY_FONT = "var(--font-display-grotesk)";

// Exactly three rendered font weights across the whole page: 400 (default, body copy), 600
// (font-semibold — eyebrows/captions/labels/buttons/nav), 800 (font-extrabold — headline + big
// figures). No font-medium / font-bold / font-black / numeric fontWeight anywhere else.
export const EYEBROW = "text-[12px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[12px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[12px] font-semibold uppercase tracking-[0.12em]";
