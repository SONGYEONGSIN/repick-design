/**
 * Shared design tokens for "The Bracket" (r42 candidate c).
 *
 * Contrast arithmetic (WCAG relative luminance), computed by hand for the
 * record — see candidates/c.md for the full numbers:
 *   ACCENT (#1D5FE0) vs #FFFFFF  → 5.58:1
 *   ACCENT (#1D5FE0) vs INK      → 3.53:1
 * 5.58:1 clears the 4.5:1 small-text floor, so the single accent hex is
 * used everywhere (filled buttons, borders, bracket lines, small text/
 * icons on the white/near-white background) — no separate tint needed.
 */

export const BG = "#FFFFFF";
export const INK = "#0A0A0C";
export const ACCENT = "#1D5FE0"; // 5.58:1 on #FFFFFF, 3.53:1 on #0A0A0C

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D5FE0]";

// text-zinc-600 ≈ 7.1:1 on #FFFFFF — safe default muted color on the page bg.
export const MUTED = "text-zinc-600";
// text-zinc-700 ≈ 9.9:1 — used on tinted/card surfaces instead of zinc-500.
export const MUTED_ON_TINT = "text-zinc-700";
