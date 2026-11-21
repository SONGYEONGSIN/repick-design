// Shared literal color tokens + class strings for the "Live Match Search" candidate
// (dark theme, violet accent, --font-display-grotesk for the H1 only). Full WCAG
// relative-luminance math behind every pairing is written up in
// vault/20-generations/2026-11-06-auto-landing-r49/candidates/a.md — this file is the
// one place those decisions turn into classes so every component draws from the same
// palette. Near-monochrome by design: the page is bg/fg/muted with the violet accent
// reserved for the search device's live state (active chip, focus rings, the
// AI-match badge, the CTA) so it stays visible at rest instead of only on hover.

export const BG = "#0B0B0F"; // page canvas (assigned token)
export const FG = "#FFFFFF"; // primary text on canvas
export const FG_CLASS = "text-white";

// One step up from canvas — card / panel surface. Still near-black, just enough
// separation to read as a distinct plane under the page background.
export const PANEL_BG = "#15141C";
export const PANEL_BORDER = "border-[#28262F]";
export const PANEL_BORDER_HEX = "#28262F";

// Muted text. #A1A1AA (Tailwind zinc-400) against #0B0B0F -> 7.66:1; against the panel
// surface #15141C -> 7.13:1. Both clear AA (4.5:1) with wide margin, and #A1A1AA is
// exactly the dark-surface floor design-principles.md sets (no dark:text-*-500/600) —
// so one muted token is reused everywhere, including inside the result-row meta line.
export const MUTED_TEXT = "text-[#A1A1AA]";
export const MUTED_HEX = "#A1A1AA";

// The one accent family for this candidate: violet, chosen specifically to NOT be the
// literal default (#6E56CF) and to land between the two example shades the brief
// names. Two scale-dependent tokens, each computed against the surface it actually
// renders on, per the WCAG relative-luminance formula (sRGB channel linearized, then
// L = 0.2126 R + 0.7152 G + 0.0722 B):
//   - #7C4FE0 is the BASE accent (L ≈ 0.179), used only at large scale: fills,
//     borders, the active quick-filter chip, the CTA button background, every focus
//     ring (painted via outline-offset on the page surface, never over the fill
//     itself), and the H1 if it ever needed a tint (it doesn't — H1 stays white).
//     Against bg #0B0B0F (L ≈ 0.00345) -> 3.79:1. That clears the 3:1 large-text /
//     non-text floor but NOT the 4.5:1 small-text AA floor, so #7C4FE0 is never used
//     for small running text directly on bg/panel — only as a fill, a border, or at
//     ≥24px / ≥19px-bold.
//   - #BCA7F3 is the SMALL-SCALE tint (L ≈ 0.520), used for every small accent-
//     colored text/icon/standalone label that sits directly on bg or panel (the
//     "Live match search" eyebrow, the match% figure, the active-chip check, etc).
//     On bg -> 9.32:1. On panel -> 8.67:1. Both clear 4.5:1 with wide margin.
export const ACCENT_HEX = "#7C4FE0";
export const ACCENT_BG = "bg-[#7C4FE0]";
export const ACCENT_BORDER = "border-[#7C4FE0]";

export const ACCENT_TINT_HEX = "#BCA7F3";
export const ACCENT_TINT_TEXT = "text-[#BCA7F3]";

// Soft chip surface for the AI-match badge: a dark violet-tinted panel rather than a
// light "soft" tint (this is a dark theme, so "soft" means a slightly lighter near-
// black with a violet cast, not a pale tint). #231A3D (L ≈ 0.0143). The tint text on
// top -> 7.74:1; white on top -> 16.32:1. Both clear AA with room to spare.
export const ACCENT_SOFT_BG = "bg-[#231A3D]";
export const ACCENT_SOFT_BORDER = "border-[#352A57]";

// Text ON the accent fill (buttons, the active quick-filter chip): white, always,
// regardless of size. White on #7C4FE0 -> 5.18:1, which clears 4.5:1 AA even at small
// non-bold sizes — so this candidate never needs the "≥24px / ≥19px-bold only" dark-
// ink carve-out at all. (For the record: dark ink #0B0B0F on #7C4FE0 -> 3.79:1, which
// would only clear the large-text/non-text floor — confirming white is the only safe
// choice for small text on this fill, exactly per the brief's usage rule.)
export const ACCENT_TEXT_ON_FILL = "text-white";

// Focus ring: outline-based, never combined with an unconditional `outline-none` base
// class (which, in this repo's Tailwind v4 setup, shares a `--tw-outline-style`
// custom property with `focus-visible:outline*` and can silently cancel it even
// though it reads as an earlier override). Leaving the browser's own "no outline" at
// rest and only ever setting outline-style via `focus-visible:outline` is what
// actually lets the ring paint. `ring-*` / `ring-offset-*` are avoided entirely.
// The ring color is the BASE accent (#7C4FE0): a focus ring is non-text, so the 3:1
// floor applies, and 3.79:1 on bg clears it.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C4FE0]";

// Exactly three rendered font weights across the whole page (verified by what's
// actually applied, not by class name count): 400 (font-normal — body copy, meta
// lines), 600 (font-semibold — eyebrows, labels, badges, buttons, chips), 800
// (font-extrabold — the H1 and the three live-stat figures). font-bold (700) and
// font-medium (500) are never used anywhere in this candidate.
export const HEADLINE_FONT = { fontFamily: "var(--font-display-grotesk)" } as const;
