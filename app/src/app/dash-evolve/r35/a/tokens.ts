/**
 * Fluxgate — route-scoped design tokens (r35 / candidate a).
 *
 * THEME: dark, production-grade (n8n/Coinbase-grade), not "concept art" dark. zinc-950 canvas,
 * zinc-900 cards, hairline borders at white/10. No glow, scanlines or grain.
 *
 * ACCENT: single violet, used sparingly for interactive/brand elements only —
 *   violet-400 carries text: active nav, links, focus outlines, the pin affordance.
 *   violet-600 is the solid button fill (white text).
 * Up/down price direction is intentionally NOT the accent — it is a separate semantic channel
 * (emerald/rose) so the single-accent rule and the "color is never the only signal" rule don't
 * collide: direction is read first from fill pattern (solid=up / hollow=down), second from hue,
 * third from an explicit +/- percentage in text.
 *
 * DISPLAY FACE: --font-display-mono, applied only to the wordmark, the page <h1> and the large
 * hero/price numerals (latin + digits only — never body copy, table cells or Korean).
 *
 * FONT WEIGHTS (exactly 3, everywhere in this route): font-normal(400) / font-medium(500) /
 * font-semibold(600). No font-bold anywhere, including <th> (explicitly set font-medium so the
 * UA default bold never leaks in) and inline SVG/CSS fontWeight values.
 *
 * FOCUS: the only safe pattern in this Tailwind v4 setup is `focus-visible:outline-2
 * focus-visible:outline-offset-2 focus-visible:outline-<color>` with no bare `outline-none`,
 * `ring`, or `ring-offset` anywhere — those cancel themselves or paint fully transparent here.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export const DISPLAY_MONO = { fontFamily: "var(--font-display-mono)" } as const;

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export const APP_BG = "bg-zinc-950";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900/60 shadow-sm shadow-black/20";
export const BORDER = "border-white/10";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_AUX = "text-zinc-400"; // dark-theme floor — never go below this (no-dark-dim-text)

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-violet-400";
export const ACCENT_SOLID = "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700";
export const ACCENT_SUBTLE = "border border-violet-500/30 bg-violet-500/10 text-violet-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export const UP_HEX = "#34d399"; // emerald-400 — filled candle body (up)
export const DOWN_HEX = "#fb7185"; // rose-400 — hollow candle outline (down)
export const GRID_HEX = "rgba(255,255,255,0.08)";
export const CROSSHAIR_HEX = "#a78bfa"; // violet-400

export type Severity = "high" | "medium" | "low";

export const SEVERITY_DOT: Record<Severity, string> = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-zinc-400",
};
export const SEVERITY_TEXT: Record<Severity, string> = {
  high: "text-rose-300",
  medium: "text-amber-300",
  low: "text-zinc-300",
};
export const SEVERITY_LABEL: Record<Severity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
