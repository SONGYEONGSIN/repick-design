// Local color tokens for this candidate only — never written to the shared globals.css.
// Theme: dark (bg #0B0B0F default-family). Accent: sky/cyan-blue family (not the catalog default
// purple #6E56CF). Contrast is computed with the standard WCAG relative-luminance formula and
// recorded here (and again in the concept note) so the numbers travel with the color.
//
//   ACCENT   #2FB6FF vs white   (#FFFFFF) -> 2.27:1  (fails AA — never used for text on a light fill)
//   ACCENT   #2FB6FF vs ink     (#0B0B0F) -> 8.66:1  (passes AAA — safe for large text / fills / borders on dark bg)
//   ACCENT_TINT #8FD9FF vs ink  (#0B0B0F) -> 12.68:1 (passes AAA — used for small text / icons / focus rings)
//   ACCENT_TINT #8FD9FF vs white(#FFFFFF) -> 1.44:1  (not used against white anywhere on this page)

export const INK = "#0B0B0F";
export const FG = "#FFFFFF";
export const MUTED = "#A1A1AA";

export const ACCENT = "#2FB6FF";
export const ACCENT_TINT = "#8FD9FF";
export const ACCENT_SOFT_BG = "rgba(47, 182, 255, 0.12)";
export const ACCENT_BORDER = "rgba(47, 182, 255, 0.45)";
export const BORDER_SOFT = "rgba(255, 255, 255, 0.10)";
export const PANEL_BG = "rgba(255, 255, 255, 0.03)";
