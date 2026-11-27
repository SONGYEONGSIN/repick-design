// Shared literal color tokens + class strings for the "Allocation Flow" candidate
// (light theme, near-white surface, single rose accent). Full WCAG relative-luminance
// math behind every pairing is written up in
// vault/20-generations/2026-11-04-auto-landing-r47/candidates/c.md — this file is the
// single place those decisions turn into classes so every component draws from the
// same palette. Near-monochrome by design: the three flow bands are differentiated by
// VALUE (ink / mid-gray / light hatch), not by hue — rose is reserved for the one
// persistently-highlighted "headline" band (Pass-as-is) plus every interactive
// control, so it still "stays visible at rest" per the brief rather than being
// hover-only.

export const BG = "#FFFFFF"; // page surface. Relative luminance L = 1.
export const BG_CLASS = "bg-white";
export const INK = "#171717"; // near-black ink on the white surface. L ≈ 0.00858.
export const INK_CLASS = "text-[#171717]";

// Panel / card surface: one step off white.
export const PANEL_BG = "#F6F4F4";
export const PANEL_BORDER = "border-[#E7E4E3]";

// The one accent family for this candidate: rose. Two scale-dependent tokens, each
// computed against the surface it actually renders on (white = L 1, ink = L ≈
// 0.00858), per the WCAG relative-luminance formula (sRGB channel linearized, then
// L = 0.2126 R + 0.7152 G + 0.0722 B):
//   - rose-600 #E11D48 (R .8824/G .1137/B .2824 -> linearized .7530/.01224/.06487 ->
//     L ≈ 0.1735) is the BASE accent: used only at large scale — fills, borders, the
//     Pass-as-is flow band + node, the CTA button background, and every focus ring
//     (the ring sits on the page surface via outline-offset, not on the fill itself).
//     · White text on this fill              -> (1.05)/(0.1735+0.05) = 4.70:1  (clears
//       4.5:1 AA for ANY text size)
//     · Dark ink (#171717) text on this fill  -> (0.1735+0.05)/(0.00858+0.05)
//       = 3.82:1  (clears only the 3:1 large-text/non-text floor — ink is never
//       paired with this fill below 24px/19px-bold in this candidate)
//   - rose-700 #BE123C (R .7451/G .0706/B .2353 -> linearized .5147/.00608/.04519 ->
//     L ≈ 0.1170) is the SMALL-SCALE tint: every small accent-colored text/icon/label
//     sitting directly on the white/near-white page surface.
//     · On white -> (1.05)/(0.1170+0.05) = 6.29:1  (clears 4.5:1 AA with real margin)
// Focus rings use `outline` + `outline-offset`, which places the ring on the page
// surface just outside the element rather than on top of any fill, so the ring's own
// contrast is checked against the white page bg, not the accent fill: 4.70:1, clears
// the 3:1 non-text floor with margin.
export const ACCENT_HEX = "#E11D48";
export const ACCENT_BG = "bg-[#E11D48]";
export const ACCENT_BORDER = "border-[#E11D48]";
export const ACCENT_TEXT_ON_FILL = "text-white"; // text/icons ON the accent fill, any size

export const ACCENT_SMALL_HEX = "#BE123C";
export const ACCENT_SMALL_TEXT = "text-[#BE123C]"; // small text/icons/standalone labels on page surface
export const ACCENT_SOFT_BG = "bg-[#FFF1F2]"; // very light rose chip surface (L ≈ 0.95+)
export const ACCENT_SOFT_BORDER = "border-[#FFD7DC]";

// Flow-band fills — deliberately near-monochrome (value/texture, not hue):
export const BAND_PASS_FILL = "#E11D48"; // rose accent — the one persistently-highlighted band
export const BAND_REFURBISH_FILL = "#3F3B3B"; // dark warm-gray, distinct from pure ink
export const BAND_FAIL_FILL = "#D8D4D3"; // light neutral, reinforced with a hatch pattern (texture, not color)

// Inactive track / unfilled neutral, distinct from both bg and panel bg.
export const TRACK_BG = "#E7E4E3";
export const TRACK_BG_CLASS = "bg-[#E7E4E3]";

// Muted text floor. #525252 (L ≈ 0.0841) against white -> 7.83:1; against the panel
// surface (#F6F4F4, L ≈ 0.934) -> 7.43:1. Both clear 4.5:1 with margin, so one muted
// token is safe to reuse everywhere, including inside the strictness toggle's
// inactive segment, which per the brief's surface-tone-conditional floor must clear
// zinc-600-equivalent contrast on a tinted surface — 7.4:1+ clears that with room.
export const MUTED_TEXT = "text-[#525252]";
export const MUTED_HEX = "#525252";

// Focus ring: outline-based, no unconditional `outline-none` base class (which, in
// this Tailwind v4 setup, shares a `--tw-outline-style` custom property with
// `focus-visible:outline*` and silently cancels it even though it reads as an
// override). Relying on the browser's own "no outline" at rest and only ever setting
// outline-style via `focus-visible:outline` is what actually lets the ring paint.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// Exactly three rendered font weights across the whole page (verified by what's
// actually applied, not by class name count): 400 (font-normal — body copy, the
// inherited Tailwind-preflight default used nowhere else but still present on plain
// text nodes), 600 (font-semibold — eyebrows/captions/labels/buttons/badges), 800
// (font-extrabold — the H1 and every big stat figure). font-bold (700) and
// font-medium (500) are never used anywhere in this candidate.
export const HEADLINE_FONT = { fontFamily: "var(--font-display-wide)" } as const;
