// Color tokens — Handoff Timeline (r19 candidate c). Light theme, single accent hue.
// Every pair below was checked with a WCAG relative-luminance contrast calculator before use;
// the exact numbers are written up in candidates/c.md, section 1 ("what the brief left open").

export const BG = "#FFFFFF"; // page ground
export const SURFACE = "#F4F4F5"; // zinc-100 — console/panel/rail-track surface, card photo placeholder
export const SURFACE_SOFT = "#FAFAFA"; // zinc-50 — closing-CTA panel, alternates with SURFACE

export const INK = "#18181B"; // zinc-900 — headings, strong labels (17.72:1 on BG)
export const BODY = "#3F3F46"; // zinc-700 — paragraph copy (10.44:1 on BG)
export const MUTED = "#71717A"; // zinc-500 — captions/eyebrows/ghost numbers on BG or SURFACE_SOFT (4.83:1 on BG) — near-white-surface floor
export const MUTED_STRONG = "#52525B"; // zinc-600 — muted text specifically on SURFACE / accent-tint (7.03:1 on SURFACE) — muted-surface floor
export const BORDER = "#E4E4E7"; // zinc-200 — hairline rules, non-text structural dividers

export const ACCENT = "#1D4ED8"; // blue-700 — the one accent hue (6.70:1 on BG; 6.70:1 for white-on-fill)
export const ACCENT_TINT = "#EFF6FF"; // blue-50 — background wash only, never carries text on its own
export const ERROR = "#B91C1C"; // red-700 — form validation only (6.47:1 on BG), the sole exception to monochrome+accent
