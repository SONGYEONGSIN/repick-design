/**
 * Trestle — route-scoped design tokens.
 *
 * Theme is assigned DARK for this round and stays dark unconditionally (no `dark:` variants, no
 * light fallback) — this is a product-dark console (n8n/Coinbase register), not a `dark:` skin on
 * a light default. Surfaces are zinc-950/900, borders are `white/10`, and the single UI accent is
 * cyan (cyan-400 for text/icons/rings on dark surfaces, cyan-400 fill + near-black text for solid
 * buttons — cyan-400/500 are bright enough that white-on-cyan fails AA, so solid accent buttons use
 * zinc-950 text instead, mirroring the gold/dark-text pattern in colors.catalog).
 *
 * Secondary/caption text never goes below zinc-400 on this dark surface, in every state branch —
 * including filtered-empty and non-default toggle views, not just the first paint (page-brief-core
 * §2, dash-brief-v3 §상태 분기 대비).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950";
export const SURFACE_RAISED = "bg-zinc-800";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-black/20");

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_CAPTION = "text-zinc-400";

/** For numbers/IDs/timestamps/hashes — tabular figures on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";
/** Code-shaped data only (commit sha, log lines) — the house monospace stack, never a body face. */
export const MONO = "font-mono";

/* Brand accent — cyan, single hue. UI chrome + selection state only (buttons, active nav, focus
   rings, selected rows). Never reused for status/severity semantics — those are a separate tone set
   below so "selected" and "this failed" never collide on the same hue. */
export const ACCENT_TEXT = "text-cyan-400";
export const ACCENT_SOLID = "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 active:bg-cyan-500";
export const ACCENT_SUBTLE = "bg-cyan-500/12 text-cyan-300";
export const ACCENT_BORDER = "border-cyan-500/30";
export const ACCENT_RING = "ring-cyan-400";

export const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

/* Status/severity tone set — always paired with an icon and/or text label, never color alone.
   Deliberately distinct from the cyan accent hue so "selected" (accent) and "this is bad" (rose)
   never read as the same signal. */
export type Tone = "good" | "warn" | "bad" | "pending" | "altered" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-300", bg: "bg-emerald-500/12", border: "border-emerald-500/25", dot: "bg-emerald-400" },
  warn: { text: "text-amber-300", bg: "bg-amber-500/12", border: "border-amber-500/25", dot: "bg-amber-400" },
  bad: { text: "text-rose-300", bg: "bg-rose-500/12", border: "border-rose-500/25", dot: "bg-rose-400" },
  pending: { text: "text-amber-300", bg: "bg-amber-500/12", border: "border-amber-500/25", dot: "bg-amber-400" },
  altered: { text: "text-violet-300", bg: "bg-violet-500/12", border: "border-violet-500/25", dot: "bg-violet-400" },
  neutral: { text: "text-zinc-300", bg: "bg-zinc-500/12", border: "border-zinc-500/20", dot: "bg-zinc-400" },
};
