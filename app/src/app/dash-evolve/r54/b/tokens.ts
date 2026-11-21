/**
 * Gantry — route-scoped design tokens. True dark product surface, assigned this round: zinc-950
 * page canvas, zinc-900 panels, white/10 hairline borders — never a theatrical dark (no glow,
 * scanlines, grain or glossy sheen anywhere in this route).
 *
 * Single UI accent = cyan, channeled only through primary actions, active nav/board states, focus
 * outlines and the one chart series. Risk level is a *separate* semantic palette (emerald/amber/
 * rose), always paired with an icon, never reusing cyan so the single-accent meaning of cyan (this
 * is the product's interactive affordance) never gets confused with a status meaning.
 *
 * Contrast floor: secondary text on this dark surface is never lighter (lower-contrast) than
 * zinc-400 — zinc-500/600 are banned here, including in states only reachable via filter/search
 * (empty results) or inside the detail modal/command palette.
 *
 * Focus visibility: every focusable element uses `outline` (never `ring`, which this Tailwind v4
 * config can resolve to fully transparent) with no `outline-none` preceding a later
 * `focus-visible:outline` on the same element — pairing those cancels the later one here.
 *
 * Exactly three rendered font weights across the whole route: 400 (default, unset — body copy,
 * secondary text), 500 (`font-medium` — nav items, buttons, pills, card titles, labels), 600
 * (`font-semibold` — h1/h2 headings, the wordmark, emphasized numbers). Weight classes are applied
 * directly on leaf text nodes, never assumed to cascade from a container, and no element in this
 * route ever reaches for `font-bold`/700.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const PANEL_BG_RAISED = "bg-zinc-900/80";
export const SURFACE_INSET = "bg-zinc-950/60";
export const BORDER = "border-white/10";
export const DIVIDE = "divide-white/10";

export const PANEL = cx("rounded-2xl border", BORDER, PANEL_BG);

export const TEXT_PRIMARY = "text-zinc-50";
/** Dark-theme contrast floor — never go lighter (i.e. lower-contrast) than this in this route. */
export const TEXT_CAPTION = "text-zinc-400";

export const NUM = "tabular-nums";

/* Brand accent — cyan. UI chrome only: primary button, active board/nav state, focus outline, the
   funnel chart's single series. Never used for risk semantics. */
export const ACCENT_TEXT = "text-cyan-400";
export const ACCENT_SOLID = "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 active:bg-cyan-500";
export const ACCENT_SUBTLE = "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20";
export const ACCENT_BORDER = "border-cyan-400/30";

export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";
export const FOCUS_RING_INSET = "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-cyan-400";
export const FOCUS_WITHIN = "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cyan-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* Risk level — independent of the cyan UI accent. Always paired with an icon. */
export type RiskTone = { text: string; bg: string; border: string; dot: string };

export const RISK_TONE: Record<"low" | "medium" | "high", RiskTone> = {
  low: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", dot: "bg-emerald-400" },
  medium: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", dot: "bg-amber-400" },
  high: { text: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", dot: "bg-rose-400" },
};

export const RISK_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};
