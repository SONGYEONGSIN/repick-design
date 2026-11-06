/**
 * Quadrant — route-scoped design tokens (r35 / candidate c).
 *
 * THEME: dark (n8n/Coinbase-grade product dark) — zinc-950 canvas, zinc-900 cards,
 * white/10 hairline borders, zinc-50 primary text. Secondary text never drops below
 * zinc-400 on this surface (page-brief-core §2 contrast floor).
 *
 * ACCENT: single orange, restrained — orange-400 #FB923C carries UI chrome only
 * (active nav pill, focus rings, the primary action button, the segmented-control
 * thumb). It is deliberately NOT one of the five channel colors below: the scatter
 * groups campaigns by channel, and reusing the UI accent as a channel color would
 * make "the orange channel" read as privileged over the other four, which is not
 * the intent — no channel outranks another here. Channel color is always paired
 * with a distinct marker SHAPE (circle/square/triangle/diamond/cross), per
 * charts.catalog's scatter/bubble fallback requirement — color is the secondary
 * cue, shape is the primary one.
 *
 * DISPLAY FACE: none assigned. Every weight of hierarchy here comes from size,
 * tracking and the three allowed font-weight classes on var(--font-sans)
 * (Pretendard) — no --font-display-* variable is referenced anywhere in this route.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 focus-visible:shadow-[0_0_0_3px_rgba(251,146,60,0.22)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-zinc-950";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_AUX = "text-zinc-400";
export const TEXT_MUTED = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-orange-400";
export const ACCENT_SOLID = "bg-orange-400 text-zinc-950 hover:bg-orange-300 active:bg-orange-500";
export const ACCENT_SUBTLE = "border border-orange-400/25 bg-orange-400/10 text-orange-300";

export const HOVER_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/** Every channel group gets both a hue AND a marker shape — never hue alone
 * (charts.catalog B-grade scatter fallback: "group-by-shape markers"). None of
 * the five sits in the orange/amber band the UI accent occupies. */
export type ChannelId = "search" | "social" | "display" | "affiliate" | "email";
export type MarkerShape = "circle" | "square" | "triangle" | "diamond" | "cross";

export const CHANNEL_HEX: Record<ChannelId, string> = {
  search: "#4c8fe0",
  social: "#d1538f",
  display: "#8c7ae6",
  affiliate: "#1fae82",
  email: "#3fa3c4",
};
export const CHANNEL_SHAPE: Record<ChannelId, MarkerShape> = {
  search: "circle",
  social: "square",
  display: "triangle",
  affiliate: "diamond",
  email: "cross",
};

export type ObjectiveId = "acquisition" | "retention" | "brand";
export type ObjectiveFilter = ObjectiveId | "all";

export type PeriodId = "7" | "30" | "90";

/** Round to 2dp — required for any SVG coordinate derived from trig, and applied
 * everywhere in this file's geometry helpers for consistency/hydration safety. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Linear interpolation from a value domain into a pixel/viewBox range. */
export function scaleLinear(value: number, domainMin: number, domainMax: number, rangeMin: number, rangeMax: number): number {
  const span = domainMax - domainMin;
  if (span <= 0) return rangeMin;
  const t = clamp((value - domainMin) / span, 0, 1);
  return r2(rangeMin + t * (rangeMax - rangeMin));
}

/** Square-root area scale — bubble AREA should be proportional to the encoded
 * value, not radius, so perceived size doesn't exaggerate differences. */
export function scaleRadius(value: number, domainMax: number, rMin: number, rMax: number): number {
  if (domainMax <= 0) return rMin;
  const t = Math.sqrt(clamp(value / domainMax, 0, 1));
  return r2(rMin + t * (rMax - rMin));
}

/** Genuine Pearson correlation coefficient, computed from whatever point set is
 * passed in — never hand-typed, so it cannot drift from the plotted data. */
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
