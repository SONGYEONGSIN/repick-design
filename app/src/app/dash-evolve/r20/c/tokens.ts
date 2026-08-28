/**
 * Lockstep — route-scoped design tokens (r20 / candidate c).
 *
 * THEME: dark (n8n/Coinbase-grade). zinc-950 canvas, zinc-900 cards, hairline borders white/10.
 *
 * ACCENT: single emerald, split by what sits on it —
 *   emerald-400 #4ade80 → 11.42:1 on zinc-950. Carries text: active nav, links, focus rings.
 *   emerald-600 #16a34a → decorative-only (dot marks).
 * SLO bullet fills use their own small 3-band status ramp — every fill's white-on-it ratio computed
 * against the literal hex: emerald-800 7.68 · amber-800 7.09 · rose-800 8.02. Status is never color
 * alone — every bullet also carries an icon and its exact percentage as text.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#4ade80";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 focus-visible:shadow-[0_0_0_3px_rgba(74,222,128,0.25)]";

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

export const ACCENT_TEXT = "text-emerald-400";
export const ACCENT_SOLID = "bg-emerald-800 text-white hover:bg-emerald-900 active:bg-emerald-950";
export const ACCENT_SUBTLE = "border border-emerald-800/60 bg-emerald-950/40 text-emerald-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.035]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type SloStatus = "good" | "warn" | "bad";
export const SLO_FILL: Record<SloStatus, string> = { good: "#065f46", warn: "#92400e", bad: "#9f1239" };
export const SLO_BADGE: Record<SloStatus, string> = {
  good: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
  warn: "border-amber-800/60 bg-amber-950/30 text-amber-300",
  bad: "border-rose-800/60 bg-rose-950/40 text-rose-300",
};
export const SLO_LABEL: Record<SloStatus, string> = { good: "Healthy", warn: "Watch", bad: "Burning" };
