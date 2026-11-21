// styles.ts — shared color + focus tokens for this candidate only (scoped to this route; the
// shared globals.css is intentionally left untouched).
//
// Accent hue: violet, but NOT the catalogue default #6E56CF — this route uses #7C3AED.
// Contrast arithmetic (relative luminance -> contrast ratio, computed by hand, see candidates/c.md):
//   #7C3AED vs white (#FFFFFF):      ~5.70:1  -> clears body-text AA (4.5:1) AND large-text (3:1)
//   #7C3AED vs ink  (#16151C):       ~3.18:1  -> clears the large-text/non-text floor only
//   white text on #7C3AED fill:      ~5.70:1  -> safe for SMALL text on the fill
//   ink text on #7C3AED fill:        ~3.18:1  -> large/bold text (or non-text) only, per the brief
// #5B21B6 is a darker step of the same hue, used wherever accent-colored text sits directly on a
// near-white or lightly-tinted surface (icons, focus rings, small accent-colored labels) — on
// white it measures ~7.74:1, comfortably past AA even for small text.

export const ACCENT = "#7C3AED";
export const ACCENT_DARK = "#5B21B6";
export const INK = "#16151C";

// outline-none is paired with focus-visible:ring-*, never with focus-visible:outline-* — pairing
// outline-none with a later focus-visible:outline-* on the same element cancels itself out.
export const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] focus-visible:ring-offset-2 focus-visible:ring-offset-white";
