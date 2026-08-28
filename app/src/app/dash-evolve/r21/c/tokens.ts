/**
 * Flowline — route-scoped design tokens (r21 / candidate c).
 *
 * THEME: dark (n8n/Coinbase-grade). zinc-950 canvas, zinc-900 cards, hairline borders white/10.
 *
 * ACCENT: single teal, split by what sits on it —
 *   teal-400 #2dd4bf → carries text: active nav, links, focus rings, chart line.
 *   teal-800 → solid button fill (white text).
 * No display typeface override this round — Pretendard only throughout, including the wordmark
 * (the brief's own "designation is available, not required" clause, and the safest axis not to
 * repeat after r20 shipped grotesk/wide across its three candidates).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#2dd4bf";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 focus-visible:shadow-[0_0_0_3px_rgba(45,212,191,0.22)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-white/[0.04]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_AUX = "text-zinc-400";
export const TEXT_MUTED = "text-zinc-300";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-teal-400";
export const ACCENT_SOLID = "bg-teal-800 text-white hover:bg-teal-900 active:bg-teal-950";
export const ACCENT_SUBTLE = "border border-teal-800/60 bg-teal-950/40 text-teal-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.035]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type RiskTier = "critical" | "watch" | "healthy";
export const RISK_BADGE: Record<RiskTier, string> = {
  critical: "border-rose-800/60 bg-rose-950/40 text-rose-300",
  watch: "border-amber-800/60 bg-amber-950/30 text-amber-300",
  healthy: "border-teal-800/60 bg-teal-950/40 text-teal-300",
};
export const RISK_LABEL: Record<RiskTier, string> = { critical: "Critical", watch: "Watch", healthy: "Healthy" };
export const RISK_DOT: Record<RiskTier, string> = { critical: "bg-rose-500", watch: "bg-amber-500", healthy: "bg-teal-500" };

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
