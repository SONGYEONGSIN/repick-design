// app/src/app/landing-evolve/r37/b/theme.ts
//
// LIGHT theme (pure white page, near-black ink), BLUE accent — a fresh hue
// for this catalog (not teal/orange/violet/rose, and not the emerald the
// immediately preceding round used). Full relative-luminance working is in
// candidates/b.md under "브리프에 없던 것"; the headline numbers:
//
// ACCENT — #2563EB (Tailwind blue-600), the fill/border/chain-node shade:
//   - vs white text (#FFFFFF): 5.17:1 — clears body-text AA (4.5:1) at
//     every size, so white text is always safe on an ACCENT fill, small or
//     large, bold or not. This is why every solid-fill control on this
//     route (CTA buttons, the active chain node, the resolved trust-score
//     badge) prints WHITE text on ACCENT, never dark ink.
//   - vs dark ink (#09090b, zinc-950): 3.85:1 — clears the 3:1 non-text /
//     large-text floor only, misses body-text AA. Dark ink is therefore
//     never set on an ACCENT fill at small sizes anywhere on this route.
//   - ACCENT as a stroke/fill against the page's white background (chain
//     connector dots, borders, the discount chip's accent text) reads as
//     the same pair the other way around — comfortably past the 3:1
//     non-text floor for a graphical object.
// ACCENT_TINT — #1E40AF (Tailwind blue-800), the small-text/icon/focus-ring
// shade used on the plain white page background:
//   - vs white: 8.72:1 — clears body-text AA with heavy headroom. This is
//     the one shade used for every small running label, eyebrow, the
//     "LIVE" tag and the focus outline, so there is exactly one
//     accent-on-white number to keep safe, not several.
export const ACCENT = "#2563EB"; // blue-600 — fill / border / chain node
export const ACCENT_TINT = "#1E40AF"; // blue-800 — small text / icon / focus ring
export const ACCENT_SOFT_BG = "rgba(37, 99, 235, 0.08)";
export const ACCENT_SOFT_BORDER = "rgba(37, 99, 235, 0.35)";
export const INK = "#09090b"; // zinc-950

/**
 * Shared focus style. No `outline-none` precedes it anywhere this is used,
 * and no bare `ring-*` utility stands in for it, so the ring can never be
 * silently painted transparent by a conflicting ring-color utility.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]";

/** Shared page container width/gutter, reused by every section. */
export const CONTAINER = "mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8";
