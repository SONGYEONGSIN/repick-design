/**
 * Outlay — route-scoped design tokens (r57 / candidate b).
 *
 * CONCEPT: a cloud cost-allocation console for an engineering org. The dominant surface is a
 * sunburst — org total at the center, one ring of cost-center teams, one outer ring of the
 * services each team spends on. See SunburstChart.tsx + HierarchyTree.tsx for the chart and its
 * required keyboard-reachable fallback.
 *
 * THEME: dark, zinc-950/900 based (never pure black, never navy) — Mercury/Coinbase-grade.
 * ACCENT: cyan, one hue family only (no rainbow-categorical palette), split by role, contrast
 * computed against the exact surfaces it sits on (not eyeballed):
 *   cyan-400 #22d3ee → text-on-dark (links, active nav label, "spend decreased" numerals).
 *     Contrast on zinc-950 (#09090b) = 11.01:1, on zinc-900 (#18181b) = 9.80:1 — both AAA.
 *   zinc-950 on cyan-400 → solid button fill (dark text on bright cyan). Same 11.01:1 pair,
 *     read the other way round — comfortably AAA for a filled action.
 *   cyan-300 #67e8f9 → the brightest numerals (sunburst center headline, active chip text).
 *     13.73:1 on zinc-950.
 *   cyan-200/300/400/500/600/700 → the sunburst's own ramp, one per cost-center team, lightest
 *     to darkest. Every stop was checked against zinc-950 and the floor is cyan-700 at 3.71:1 —
 *     clears the 3:1 WCAG 1.4.11 floor for graphical objects. No stop darker than cyan-700 is
 *     used as a fill for exactly this reason (cyan-800 measured 2.74:1, cyan-900 2.18:1 — both
 *     rejected).
 * Spend DIRECTION is a second, small semantic channel, never confused with the team ramp above:
 * a cost going up is framed as the thing to watch (amber-300, 13.80:1 on zinc-950) and a cost
 * going down as the good outcome (cyan-300). Direction is always paired with an arrow icon and a
 * signed number — never color alone — exactly like the budget-overage treatment below.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 focus-visible:shadow-[0_0_0_3px_rgba(34,211,238,0.22)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const RAIL_BG = "bg-zinc-950";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const SURFACE_INSET = "bg-white/5";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-200";
export const TEXT_AUX = "text-zinc-400"; // floor for dark surfaces — never lower than this
export const TEXT_MUTED = "text-zinc-300";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";
export const DISPLAY = "font-[family-name:var(--font-display-wide)]";

export const ACCENT_TEXT = "text-cyan-400";
export const ACCENT_BRIGHT_TEXT = "text-cyan-300";
export const ACCENT_SOLID = "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 active:bg-cyan-500";
export const ACCENT_SUBTLE = "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300";

export const UP_TEXT = "text-amber-300"; // spend increased — the thing to watch
export const DOWN_TEXT = "text-cyan-300"; // spend decreased — the good outcome
export const WARN_SUBTLE = "border border-amber-400/30 bg-amber-400/10 text-amber-300";

export const HOVER_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/5";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";
export const MOTION_SAFE = "motion-reduce:transition-none motion-reduce:transform-none";

export type Direction = "up" | "down" | "flat";

/** Round to 2 decimals — every SVG coordinate from a trig function goes through this. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** One ramp, lightest → darkest, used for the sunburst's cost-center teams. Every stop is
 * ≥3:1 against zinc-950 (see module comment); nothing darker is ever used as a fill. */
export const TEAM_RAMP = ["#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"] as const;
export const TEAM_RAMP_CLASS = ["text-cyan-200", "text-cyan-300", "text-cyan-400", "text-cyan-500", "text-cyan-600", "text-cyan-700"] as const;
