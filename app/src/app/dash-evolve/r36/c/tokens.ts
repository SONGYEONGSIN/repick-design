/**
 * Quadrant — route-scoped design tokens (r36 / candidate c).
 *
 * THEME: dark, refined-product grade — zinc-950 canvas, zinc-900 panels, white/10
 * hairline borders, zinc-50 primary text. Secondary/dim text never drops below
 * zinc-400 on this surface anywhere on the route, including inside open dropdowns
 * and the chart's own pinned-point annotation.
 *
 * ACCENT: a single orange (orange-400, #fb923c) carries UI chrome only — focus
 * rings, the active nav pill, the primary action, the pinned-point ring. It is
 * deliberately NOT reused as a channel color below, so no channel reads as
 * "the accent channel". orange-400 on zinc-950 measures well above 4.5:1, so it is
 * used for small text too, not restricted to large/graphical-only.
 *
 * DISPLAY FACE: none. Every weight of hierarchy comes from size, tracking and the
 * three allowed font-weight classes on var(--font-sans) — no --font-display-*
 * variable is referenced anywhere in this route, including the wordmark/headline.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** No `outline-none` anywhere paired with this — the earlier-outline-none-cancels-
 * later-focus-visible trap is avoided by never setting `outline-none` on any
 * element that also carries this token. */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const INSET_BG = "bg-zinc-950";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_DIM = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-orange-400";
export const ACCENT_SOLID = "bg-orange-400 text-zinc-950 hover:bg-orange-300 active:bg-orange-500";
export const ACCENT_SUBTLE = "border border-orange-400/25 bg-orange-400/10 text-orange-300";

export const HOVER_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type ChannelId = "search" | "social" | "display" | "affiliate" | "email";
export type MarkerShape = "circle" | "square" | "triangle" | "diamond" | "cross";

/** Every channel group is keyed to a hue AND a marker shape, never hue alone —
 * this catalog's scatter/bubble entries require a non-color grouping cue. None of
 * the five sits in the orange/amber band the UI accent occupies. */
export const CHANNEL_HEX: Record<ChannelId, string> = {
  search: "#60a5fa",
  social: "#f472b6",
  display: "#a78bfa",
  affiliate: "#34d399",
  email: "#22d3ee",
};
export const CHANNEL_SHAPE: Record<ChannelId, MarkerShape> = {
  search: "circle",
  social: "square",
  display: "triangle",
  affiliate: "diamond",
  email: "cross",
};

export type GoalId = "acquisition" | "retention" | "brand";
export type GoalFilter = GoalId | "all";

export type PeriodId = "7" | "30" | "90";

export type QuadrantId = "scale-up" | "optimize" | "monitor" | "pause";

export const QUADRANTS: Record<QuadrantId, { label: string; hint: string }> = {
  "scale-up": { label: "Scale up", hint: "High spend, high rate — proven, worth more budget" },
  optimize: { label: "Optimize", hint: "Low spend, high rate — efficient, has room to grow" },
  monitor: { label: "Monitor", hint: "High spend, low rate — watch closely before adding budget" },
  pause: { label: "Pause", hint: "Low spend, low rate — weak and small, candidate to cut" },
};

export function quadrantFor(spend: number, rate: number, spendMid: number, rateMid: number): QuadrantId {
  const highSpend = spend >= spendMid;
  const highRate = rate >= rateMid;
  if (highSpend && highRate) return "scale-up";
  if (!highSpend && highRate) return "optimize";
  if (highSpend && !highRate) return "monitor";
  return "pause";
}

/** Round to 2dp — applied to every SVG coordinate this route computes. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function scaleLinear(value: number, domainMin: number, domainMax: number, rangeMin: number, rangeMax: number): number {
  const span = domainMax - domainMin;
  if (span <= 0) return rangeMin;
  const t = clamp((value - domainMin) / span, 0, 1);
  return r2(rangeMin + t * (rangeMax - rangeMin));
}

/** Square-root AREA scale — perceived bubble size should track the encoded value
 * linearly in area, not radius. */
export function scaleRadius(value: number, domainMax: number, rMin: number, rMax: number): number {
  if (domainMax <= 0) return rMin;
  const t = Math.sqrt(clamp(value / domainMax, 0, 1));
  return r2(rMin + t * (rMax - rMin));
}

/** Genuine Pearson correlation coefficient computed from the point set handed in —
 * never a hand-typed figure, so it cannot drift from what is actually plotted. */
export function pearsonR(points: { x: number; y: number }[]): number | null {
  const n = points.length;
  if (n < 2) return null;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (const p of points) {
    const dx = p.x - mx;
    const dy = p.y - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  if (denom === 0) return 0;
  return num / denom;
}

export function correlationLabel(r: number): string {
  const a = Math.abs(r);
  const strength = a < 0.1 ? "negligible" : a < 0.3 ? "weak" : a < 0.5 ? "moderate" : a < 0.7 ? "strong" : "very strong";
  if (a < 0.1) return strength;
  return `${strength} ${r > 0 ? "positive" : "negative"}`;
}
