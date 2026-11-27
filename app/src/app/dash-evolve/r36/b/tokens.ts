/**
 * Meshwire — route-scoped design tokens (r36 / candidate b).
 *
 * THEME: dark (n8n/Coinbase-grade product dark) — zinc-950 app canvas, zinc-900 panel/card
 * surfaces, white/10 hairline borders, zinc-50 primary text. Secondary/dim text never drops
 * below zinc-400 anywhere on this route, including inside the node inspector popover and the
 * incident timeline (page-brief-core contrast floor — checked in interactive states too).
 *
 * ACCENT: single green, emerald-400 (#34d399), used sparingly for UI chrome only — active nav
 * pill, focus outline, the primary action button, the segmented-control thumb, the "healthy"
 * status signal. Verified against the zinc-950 canvas (#09090b) by hand:
 *   relative luminance of #34d399 ≈ 0.496, of #09090b ≈ 0.0028
 *   contrast ratio = (0.496 + 0.05) / (0.0028 + 0.05) ≈ 10.3:1
 * That clears the 4.5:1 small-text floor with wide margin, so emerald-400 is safe as running
 * text, not just large/graphical elements. "Degraded"/"down" status use amber/rose instead of
 * green — semantic severity, never the brand accent — so "healthy" and "on-brand" are allowed
 * to coincide (a positive-state color reusing the accent hue is a standard, not a collision,
 * unlike an arbitrary non-ranked category grabbing the brand hue).
 *
 * DISPLAY FACE: --font-display-mono (assigned), Latin + large sizes only — the wordmark in the
 * sidebar and the page's single <h1>. Everything else, including all Korean-capable body copy
 * (there is none here; repo language rule keeps this route all-English) and every data label,
 * stays on --font-sans (Pretendard). Genuinely code-like strings (service hostnames) use plain
 * --font-mono, never the display variant, and never for headlines.
 *
 * WEIGHTS: exactly three rendered font-weight classes for the whole route —
 * font-normal (400), font-medium (500), font-semibold (600). Hierarchy otherwise comes from
 * size, tracking and color.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-zinc-950";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/30";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_AUX = "text-zinc-400"; // floor — never lower than this for secondary/dim text
export const TEXT_MUTED = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";
export const CODE = "font-mono text-[12px]";

export const ACCENT_TEXT = "text-emerald-400";
export const ACCENT_SOLID = "bg-emerald-400 text-zinc-950 hover:bg-emerald-300 active:bg-emerald-500";
export const ACCENT_SUBTLE = "border border-emerald-400/25 bg-emerald-400/10 text-emerald-300";

export const HOVER_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Status = "healthy" | "degraded" | "down";
export const STATUS_BADGE: Record<Status, string> = {
  healthy: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  degraded: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  down: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};
export const STATUS_LABEL: Record<Status, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};
export const STATUS_DOT: Record<Status, string> = {
  healthy: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-rose-400",
};
/** Edge stroke colors by status — never the sole signal for status, which is why
 * STATUS_WIDTH below also varies by status (a non-color, grayscale-safe cue) and every
 * edge still carries a text status word in its tooltip/table row. healthy is 40% white
 * over zinc-950, not fainter: on #09090b that resolves to roughly rgb(107,107,109),
 * ≈3.7:1 — still clears the 3:1 graphical-element floor so a "healthy" line stays
 * genuinely visible, not just implied by the absence of a warning color. */
export const STATUS_STROKE: Record<Status, string> = {
  healthy: "rgba(255,255,255,0.4)",
  degraded: "#fbbf24",
  down: "#fb7185",
};
/** Edge stroke WIDTH by status — the non-color pairing for STATUS_STROKE above: a down
 * edge is visibly thicker even in grayscale or for a colorblind viewer, not just redder. */
export const STATUS_WIDTH: Record<Status, number> = { healthy: 1, degraded: 1.75, down: 2.5 };

/** Edge dash pattern by relationship CATEGORY — the non-color, persistent (not
 * hover-only) signal for what kind of call an edge represents: solid = synchronous
 * request/response (http/grpc), dashed = async queue publish, dotted = direct data
 * access (db read/write, cache). This is a separate visual channel from edge color
 * (which carries status) and from node shape (which carries tier), so relationship
 * kind is legible at a glance without opening the inspector, per page-brief-core's
 * single-dominant-visualization completeness requirement. */
export const CATEGORY_DASH: Record<"sync" | "async" | "data", string | undefined> = {
  sync: undefined,
  async: "6 3",
  data: "1.5 2.5",
};

export type Severity = "critical" | "warning" | "info" | "resolved";
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  info: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  resolved: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

/** Round to 2dp — required for every SVG coordinate in this route (node positions, edge line
 * endpoints), applied at the single point where trig produces them in data.ts. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
