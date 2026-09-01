// Shared visual constants for r19/a — "Editorial Data-Room".
//
// Palette (light theme, mandatory this round). Every pair below was measured with the WCAG
// relative-luminance formula, not eyeballed — the exact numbers are written into
// vault/20-generations/2026-09-01-auto-landing-r19/candidates/a.md under "브리프에 없던 것".
//
//   ink        vs bg        16.78:1
//   mutedOnBg  vs bg         5.05:1   (near-white surface floor, needs >=4.5)
//   mutedOnSurf vs surface   5.61:1   (muted-tone surface floor, needs >=4.5)
//   accent     vs bg         6.10:1   (fills / borders / large text)
//   accentDark vs bg         9.08:1   (small text / links / focus ring)
//   white      vs accent     6.70:1   (fill-background rule: white text on accent fill is safe)
//   ink        vs accent     2.75:1   (FAILS even the 3:1 large-text floor — never put ink text
//                                      on an accent fill, white only)
export const COLOR = {
  bg: "#F6F4EF",
  surface: "#E3DECE",
  ink: "#15140F",
  mutedOnBg: "#6B6862",
  mutedOnSurf: "#57544D",
  accent: "#A6341F",
  accentDark: "#7A2515",
  white: "#FFFFFF",
} as const;

// Tracking three-tier scale mandated by the brief.
export const TRACK = {
  eyebrow: "0.28em",
  caption: "0.16em",
  stat: "0.12em",
} as const;

// Focus ring: a real box-shadow, never Tailwind's `ring-*` pipeline (transparent in v4 when paired
// with ring-offset) and never `outline-none` + `focus-visible:outline` on the same element (the
// reset cancels the later utility because both live on `--tw-outline-style`). This is a single,
// separate CSS property (box-shadow) applied only on `:focus-visible`, so nothing to cancel.
export const FOCUS_RING =
  "focus-visible:shadow-[0_0_0_3px_#7A2515] focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A2515]";

// Exactly 3 rendered font weights across the whole page: 400 (body, inherited/explicit),
// 600 (labels/buttons/nav), 800 (headings/big stats). Never use font-medium/font-bold/font-light.
export const W = {
  body: "font-normal",
  label: "font-semibold",
  heavy: "font-extrabold",
} as const;

// Reference value only — every actual call site inlines this exact string literally as
// `style={{ fontFamily: "var(--font-display-wide), var(--font-sans)" }}` rather than importing
// this constant. The static `no-unlisted-font` checker matches a literal `var(--font-display-*)`
// string at the `fontFamily:` site and can't resolve an identifier reference, so routing every
// site through this constant was flagging all 8 as unlisted fonts even though the resolved value
// is on the allow-list. Kept here as documentation of the exact value, not as an import target.
// Large Latin display text only (h1 + section h2), per the brief; body copy, card titles and
// Korean-adjacent strings never use this.
export const DISPLAY_FONT = "var(--font-display-wide), var(--font-sans)";
