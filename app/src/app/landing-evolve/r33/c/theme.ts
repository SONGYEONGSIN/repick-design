// Local color tokens for this candidate only — never written to the shared globals.css.
// Theme: dark (bg #0B0B0F default-family). Accent: sky/cyan-blue family (not the catalog default
// purple #6E56CF). Contrast is computed with the standard WCAG relative-luminance formula and
// recorded here (and again in the concept note) so the numbers travel with the color.
//
//   ACCENT   #2FB6FF vs white   (#FFFFFF) -> 2.27:1  (fails AA — never used for text on a light fill,
//                                                      and NOT strong enough as a fill behind small
//                                                      white text either — see ACCENT_BUTTON_FILL)
//   ACCENT   #2FB6FF vs ink     (#0B0B0F) -> 8.66:1  (passes AAA — safe for large text / fills / borders / the
//                                                      waveform stroke on dark bg — all non-text or large-text use)
//   ACCENT_TINT #8FD9FF vs ink  (#0B0B0F) -> 12.68:1 (passes AAA — used for small text / icons / focus rings)
//   ACCENT_TINT #8FD9FF vs white(#FFFFFF) -> 1.44:1  (not used against white anywhere on this page)
//
//   ACCENT_BUTTON_FILL #1478AE vs white (#FFFFFF) -> 4.85:1 (passes AA — the only fill with body-size
//                                                      (14px, not bold) white text on top: the two
//                                                      solid CTA buttons. #2FB6FF measured 2.26:1 here
//                                                      and failed axe's color-contrast check, so this
//                                                      darker/less-saturated shade of the same sky-blue
//                                                      hue (~201°) replaces it for fills with small text only)
//   ACCENT_BUTTON_FILL #1478AE vs ink   (#0B0B0F) -> 4.05:1 (for reference only; this token is never used
//                                                      as text color against ink, only as a button fill)

export const INK = "#0B0B0F";
export const FG = "#FFFFFF";
export const MUTED = "#A1A1AA";

export const ACCENT = "#2FB6FF";
export const ACCENT_TINT = "#8FD9FF";
/** Darker/desaturated accent used ONLY as a fill behind small (<19px, non-bold) white text — see note above. */
export const ACCENT_BUTTON_FILL = "#1478AE";
export const ACCENT_SOFT_BG = "rgba(47, 182, 255, 0.12)";
export const ACCENT_BORDER = "rgba(47, 182, 255, 0.45)";
export const BORDER_SOFT = "rgba(255, 255, 255, 0.10)";
export const PANEL_BG = "rgba(255, 255, 255, 0.03)";
