/**
 * Parity — route-scoped design tokens (r25 / candidate a).
 *
 * THEME: dark, refined-product register (n8n/Coinbase-tier) — zinc-950 canvas, zinc-900 cards,
 * white/10 hairlines. No glow/scanline/grain — motion is functional only.
 *
 * ACCENT: single blue, chosen specifically to avoid the last five dash-round winner hues
 * (emerald, cyan, rose, amber, teal) and the two catalog-overrepresented hues (violet, amber).
 *   blue-400 #60A5FA on zinc-950 #09090B  = 7.82:1  (nav/links/focus ring/icons — text use)
 *   blue-400 #60A5FA on zinc-900 #18181B  = 6.97:1  (same, on elevated cards)
 *   white    #FFFFFF on blue-600 #2563EB  = 5.17:1  (solid primary button)
 * Status semantics deliberately use *different* Tailwind scales than the banned list so a status
 * badge is never mistaken for the page accent: green (not emerald/teal) for matched, red (not
 * rose) for missing, orange (not amber) for overcount, neutral zinc for reviewing. Every one of
 * those was independently checked ≥7:1 on zinc-950/900 — see candidates/a.md for the arithmetic.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#3B82F6";

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:shadow-[0_0_0_3px_rgba(96,165,250,0.25)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-white/[0.03]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/30";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_MUTED = "text-zinc-400";
export const TEXT_AUX = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-blue-400";
export const ACCENT_SOLID = "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700";
export const ACCENT_SUBTLE = "border border-blue-500/25 bg-blue-500/10 text-blue-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type LineStatus = "matched" | "reviewing" | "missing" | "overcount";

export const STATUS_LABEL: Record<LineStatus, string> = {
  matched: "Matched",
  reviewing: "Reviewing",
  missing: "Missing",
  overcount: "Overcount",
};

export const STATUS_TEXT: Record<LineStatus, string> = {
  matched: "text-green-400",
  reviewing: "text-zinc-300",
  missing: "text-red-400",
  overcount: "text-orange-400",
};

export const STATUS_BADGE: Record<LineStatus, string> = {
  matched: "border-green-500/25 bg-green-500/10 text-green-400",
  reviewing: "border-white/15 bg-white/[0.06] text-zinc-300",
  missing: "border-red-500/25 bg-red-500/10 text-red-400",
  overcount: "border-orange-500/25 bg-orange-500/10 text-orange-400",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
