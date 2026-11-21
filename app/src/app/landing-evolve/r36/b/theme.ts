// app/src/app/landing-evolve/r36/b/theme.ts
//
// LIGHT theme (pure white page, near-black ink), emerald accent family.
// Full relative-luminance working for the accent (vs white text, vs dark
// ink, vs the page's white background) is in candidates/b.md under
// "브리프에 없던 것" — the headline numbers:
//
// ACCENT — #059669 (emerald-600), the fill/border/ring-arc shade:
//   - vs white text (#FFFFFF): 3.77:1 — clears the 3:1 non-text/large-text
//     floor but misses body-text AA (4.5:1). Never used as small text.
//   - vs dark ink (#09090b, zinc-950): 6.23:1 — clears AA at every size.
//     This is why every solid-fill control on this route (CTA buttons, the
//     "selected" chip fill) prints dark ink text, not white, on ACCENT.
//   - ACCENT as a stroke/fill *against the page's white background*
//     (the ring arcs, borders) is the same 3.77:1 pair read the other way —
//     comfortably past the 3:1 non-text floor that applies to a graphical
//     object conveying information.
// ACCENT_TINT — #047857 (emerald-700), the small-text/icon/focus-ring shade:
//   - vs white: 5.49:1 — clears body-text AA with headroom. This is the
//     one shade used for every small running label, eyebrow and the focus
//     outline, so there is exactly one accent-on-white number to keep safe.
export const ACCENT = "#059669"; // emerald-600 — fill / border / ring arc
export const ACCENT_TINT = "#047857"; // emerald-700 — small text / icon / focus ring
export const ACCENT_SOFT_BG = "rgba(5, 150, 105, 0.08)";
export const ACCENT_SOFT_BORDER = "rgba(5, 150, 105, 0.35)";
export const INK = "#09090b"; // zinc-950

/**
 * Shared focus style. No `outline-none` precedes it anywhere this is used,
 * and no bare `ring-*` utility stands in for it, so the ring can never be
 * silently painted transparent by a conflicting ring-color utility.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]";
