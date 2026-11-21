// Shared literal color tokens + class strings for the "Sorting Yield" candidate
// (light theme, near-white surface, single rose accent, --font-display-wide for the
// headline). Full WCAG relative-luminance math behind every pairing is written up in
// vault/20-generations/2026-11-05-auto-landing-r48/candidates/a.md — this file is the
// one place those decisions turn into classes so every component draws from the same
// palette. Near-monochrome by design: the three flow bands are told apart by VALUE
// (ink / warm dark-gray / light hatch) rather than hue — rose is reserved for the
// persistently-highlighted "headline" band (Pass as-is) plus every interactive
// control, so the accent stays visible at rest instead of only appearing on hover.

export const INK = "#171717"; // near-black ink on the white surface.
export const INK_CLASS = "text-[#171717]";

// Panel / card surface: one step off white.
export const PANEL_BG = "#F5F3F3";
export const PANEL_BORDER = "border-[#E5E2E1]";

// The one accent family for this candidate: rose. Two scale-dependent tokens, each
// computed against the surface it actually renders on, per the WCAG relative-
// luminance formula (sRGB channel linearized, then L = 0.2126 R + 0.7152 G + 0.0722 B):
//   - #E11D48 is the BASE accent, used only at large scale: fills, borders, the Pass
//     as-is flow band + node, the CTA button background, and every focus ring (the
//     ring sits on the page surface via outline-offset, never on the fill itself).
//     L ≈ 0.1735. White text on this fill -> 4.70:1 (clears 4.5:1 AA at any size).
//     Dark ink (#171717, L ≈ 0.00858) on this fill -> 3.82:1 (clears only the 3:1
//     large-text/non-text floor — ink is never paired with this fill below 24px /
//     19px-bold anywhere in this candidate).
//   - #BE123C is the SMALL-SCALE tint, used for every small accent-colored
//     text/icon/standalone label sitting directly on the white/near-white page
//     surface. L ≈ 0.1171. On white -> 6.29:1 (clears 4.5:1 AA with real margin).
// Focus rings use `outline` + `outline-offset`, which paints the ring on the page
// surface just outside the element rather than over any fill, so the ring itself is
// checked against the page background (white, L = 1): 4.70:1, clears the 3:1
// non-text floor with margin.
export const ACCENT_HEX = "#E11D48";
export const ACCENT_BG = "bg-[#E11D48]";
export const ACCENT_TEXT_ON_FILL = "text-white"; // text/icons ON the accent fill, any size

export const ACCENT_TINT_HEX = "#BE123C";
export const ACCENT_TINT_TEXT = "text-[#BE123C]"; // small text/icons/labels on the page surface
export const ACCENT_SOFT_BG = "bg-[#FFF1F2]"; // very light rose chip surface
export const ACCENT_SOFT_BORDER = "border-[#FFD7DC]";

// Flow-band fills — near-monochrome (value/texture, not hue):
export const BAND_PASS_FILL = "#E11D48"; // rose accent — the one persistently-highlighted band
export const BAND_REFURBISH_FILL = "#3F3B3B"; // warm dark-gray, distinct from pure ink
export const BAND_FAIL_FILL = "#D8D4D3"; // light neutral, reinforced with a hatch pattern

// Muted text floor. #525252 (L ≈ 0.0841) against white -> 7.83:1; against the panel
// surface (#F5F3F3, L ≈ 0.903) -> 7.11:1. Both clear 4.5:1 with margin, so one muted
// token is reused everywhere, including inside the strictness toggle's inactive
// segment.
export const MUTED_TEXT = "text-[#525252]";

// Focus ring: outline-based, never combined with an unconditional `outline-none`
// base class (which, in this repo's Tailwind v4 setup, shares a `--tw-outline-style`
// custom property with `focus-visible:outline*` and can silently cancel it even
// though it reads as an earlier override). Leaving the browser's own "no outline" at
// rest and only ever setting outline-style via `focus-visible:outline` is what
// actually lets the ring paint. `ring-*` / `ring-offset-*` are avoided entirely.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]";

// Exactly three rendered font weights across the whole page (verified by what's
// actually applied, not by class name count): 400 (font-normal / the Tailwind-
// preflight inherited default on plain text nodes), 600 (font-semibold — eyebrows,
// captions, labels, buttons, badges), 800 (font-extrabold — the H1 and every large
// stat figure). font-bold (700) and font-medium (500) are never used.
export const HEADLINE_FONT = { fontFamily: "var(--font-display-wide)" } as const;
