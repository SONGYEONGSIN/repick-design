/**
 * Fluxgraph — route-scoped design tokens (r37 / candidate c).
 *
 * THEME: dark (assigned, non-negotiable this round) — n8n/Coinbase-grade product dark.
 * zinc-950 app canvas, zinc-900 panel/card surfaces, white/10 hairline borders, zinc-50 primary
 * text. Secondary/dim text never drops below zinc-400 anywhere on this route, including inside
 * the node-inspector popover, the incident timeline and any open dropdown (page-brief-core
 * contrast floor, checked in interactive states too, not just the resting page).
 *
 * ACCENT: single amber, amber-400 (#fbbf24, assigned). Verified by hand against the zinc-950
 * canvas (#09090b):
 *   relative luminance of #fbbf24 ≈ 0.579, of #09090b ≈ 0.0028
 *   contrast ratio = (0.579 + 0.05) / (0.0028 + 0.05) ≈ 11.9:1
 * That clears the 4.5:1 small-text floor with a wide margin, so amber-400 is safe as running
 * text and UI chrome, not just large/graphical elements. "Degraded" status reuses the same
 * amber-400 hue — a standard pairing (amber conventionally already means "caution"), not an
 * arbitrary category grabbing the brand color, the same reasoning this catalog's prior
 * green-accent attempt used for its "healthy" status.
 *
 * DISPLAY FACE: --font-display-mono (assigned), Latin + large sizes only — the wordmark in the
 * sidebar and the page's single <h1>. Everything else, including every data label and the
 * one-line stat sentence under the h1, stays on --font-sans (Pretendard). Genuinely code-like
 * strings (service hostnames) use plain --font-mono, never the display variant.
 *
 * WEIGHTS: exactly three rendered font-weight classes for the whole route — font-normal (400),
 * font-medium (500), font-semibold (600). Hierarchy otherwise comes from size, tracking and color.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// No `outline-none` anywhere in this route, and never a bare `ring`/`ring-offset` alone (both
// are fully transparent on this Tailwind v4 config) — every focusable element gets this exact
// pair, with an explicit min-height already set on the element itself.
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

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

export const ACCENT_TEXT = "text-amber-400";
export const ACCENT_SOLID = "bg-amber-400 text-zinc-950 hover:bg-amber-300 active:bg-amber-500";
export const ACCENT_SUBTLE = "border border-amber-400/25 bg-amber-400/10 text-amber-300";

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

/**
 * Edge stroke colors by status — never the sole signal: STATUS_WIDTH below is the non-color,
 * grayscale-safe companion (a down edge is visibly thicker even for a colorblind viewer, not
 * just redder), and every edge's status word is always available in the hover tooltip, the
 * inspector and the adjacency table's Status column. "healthy" is 42% white over zinc-950, not
 * fainter, so a healthy line stays genuinely visible (≈3.9:1 on #09090b) rather than implied by
 * the absence of a warning color.
 */
export const STATUS_STROKE: Record<Status, string> = {
  healthy: "rgba(255,255,255,0.42)",
  degraded: "#fbbf24",
  down: "#fb7185",
};
export const STATUS_WIDTH: Record<Status, number> = { healthy: 1, degraded: 1.75, down: 2.5 };

/**
 * Edge dash pattern by relationship CATEGORY — the persistent, non-color, non-hover-only signal
 * for what kind of call an edge represents: solid = synchronous request/response (http/grpc),
 * dashed = async queue publish, dotted = direct data access (db read/write, cache). A separate
 * visual channel from edge color (status) and node shape (tier), so relationship kind is legible
 * at a glance without opening anything.
 */
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
