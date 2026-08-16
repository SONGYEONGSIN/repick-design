/**
 * Nodal — route-scoped design tokens. Class constants used only within this route.
 *
 * Theme = dark-only, product dark (never theatrical): zinc-950/900 surfaces, `border-white/10`,
 * body text zinc-50, secondary text zinc-400 (the dark-theme floor — never zinc-500/600, per
 * `no-dark-dim-text`). Single UI accent = sky-400 (text/outline/links) / sky-700 (solid button
 * fill, chosen over sky-600 for contrast headroom: sky-700 on white ≈ 5.9:1 vs sky-600's ≈ 3.4:1).
 *
 * Node/edge HEALTH is a separate semantic palette (emerald=healthy, amber=degraded, rose=critical),
 * always paired with an icon and a text word — never color alone — and never reusing sky, so the
 * single accent meaning (this is the product's interactive affordance) never collides with a health
 * meaning.
 *
 * Focus: every focusable element gets `focus-visible:outline` (never `ring`, which Tailwind v4 can
 * paint fully transparent) with no preceding `outline-none` on the same element to cancel it.
 *
 * Contrast: secondary/caption text is never lighter than zinc-400 on this dark canvas, in every
 * state — including filter-only branches (empty search results, cleared selection) and inside the
 * SVG topology (rendered as real HTML text, not canvas pixels, so it is audited like any other text).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-900/60";
export const SURFACE_MUTED = "bg-zinc-800/70";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Dark-surface floor (this app is dark-only, so this is the single caption token used everywhere). */
export const TEXT_CAPTION = "text-zinc-400";

/** Numbers/IDs/latencies — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Latin display face for the wordmark and page H1 only — never body/Korean text, never a second weight. */
export const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

/* Brand accent — sky. UI chrome only (buttons, active states, focus outline, selection, graph highlight). */
export const ACCENT_TEXT = "text-sky-400";
export const ACCENT_SOLID = "bg-sky-700 text-white hover:bg-sky-600 active:bg-sky-800";
export const ACCENT_SUBTLE = "bg-sky-500/10 text-sky-300";
export const ACCENT_BORDER = "border-sky-500/30";

export const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";
export const FOCUS_RING_INSET = "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400";
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";
export const TRANSITION_ALL = "transition-[color,background-color,border-color,opacity,transform] duration-200 ease-out motion-reduce:transition-none";

/* ---------------------------------------------------------- Health tone (nodes + edges) */

export type Health = "healthy" | "degraded" | "critical";

export const HEALTH_TONE: Record<Health, { text: string; bg: string; border: string; dot: string; stroke: string }> = {
  healthy: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", dot: "bg-emerald-400", stroke: "#34d399" },
  degraded: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25", dot: "bg-amber-400", stroke: "#fbbf24" },
  critical: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/25", dot: "bg-rose-400", stroke: "#fb7185" },
};

export const HEALTH_LABEL: Record<Health, string> = { healthy: "Healthy", degraded: "Degraded", critical: "Critical" };
/** Worst-first ordinal, used for real sorting/filter ordering. */
export const HEALTH_RANK: Record<Health, number> = { critical: 0, degraded: 1, healthy: 2 };
export const HEALTH_ORDER: Health[] = ["critical", "degraded", "healthy"];
