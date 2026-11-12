// app/src/app/landing-evolve/r38/b/theme.ts
//
// DARK theme (near-black page, white ink), accent hue: CYAN — distinct from
// the default violet (#6E56CF) and from this catalog's most-saturated hues
// (amber/teal/violet-hex/blue). Full relative-luminance working for every
// pair below (vs white, vs this route's own background #0B0B0F) is repeated
// in candidates/b.md under "브리프에 없던 것 — 1".
//
// ACCENT_FILL — #0E7490 (cyan-700), the solid-fill shade (CTA buttons, the
//   confidence bar fill, the "flaw" vs "clear" box border uses a separate
//   amber, see SplitDevice):
//   - vs white text (#FFFFFF): 5.36:1 — clears body-text AA (4.5:1) at every
//     size, so every filled control on this route prints WHITE text, never
//     dark ink, on ACCENT_FILL.
//   - vs this page's background (#0B0B0F): 3.67:1 — clears the 3:1
//     non-text/large-text floor, so it also reads fine as a border/outline
//     directly on the page.
// ACCENT_TINT — #22D3EE (cyan-400), the small-text/icon/focus-ring shade:
//   - vs background (#0B0B0F): 10.88:1 — the shade used for every running
//     caption, icon, focus outline and badge-on-dark-surface text.
//   - vs white: 1.81:1 — recorded per the brief's instruction, but never
//     actually used against a light surface anywhere on this (all-dark)
//     route; it would fail outright if it were.
export const BG = "#0B0B0F";
export const SURFACE = "#14151C"; // card/panel surface, one step up from BG
export const INK = "#FFFFFF";
export const MUTED = "#A1A1AA"; // zinc-400 — 7.66:1 vs BG, 7.10:1 vs SURFACE
export const BORDER = "rgba(255,255,255,0.1)";
export const BORDER_SOFT = "rgba(255,255,255,0.06)";

export const ACCENT_FILL = "#0E7490"; // cyan-700
export const ACCENT_TINT = "#22D3EE"; // cyan-400
export const ACCENT_SOFT_BG = "rgba(34, 211, 238, 0.08)";
export const ACCENT_SOFT_BORDER = "rgba(34, 211, 238, 0.3)";

// Flaw callouts use amber, never color alone — every flaw box also carries
// the ShieldAlert glyph plus the literal word in its label text.
export const FLAW = "#FBBF24"; // amber-400, ~11.9:1 vs BG — icon/border only, never body text

/**
 * Shared focus style. No `outline-none` ever precedes this, and no bare
 * `ring-*`/`ring-offset-*` utility stands in for it anywhere on this route —
 * both are known-dead in this exact Tailwind v4 build (see brief).
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22D3EE]";

export const TOTAL_LISTINGS_LABEL = "4 listings, same read" as const;
