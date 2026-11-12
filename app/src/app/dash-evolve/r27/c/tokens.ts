/**
 * Vantage — route-scoped design tokens (r27 / candidate c).
 *
 * THEME: dark (n8n/Coinbase-grade product dark) — zinc-950 canvas, zinc-900 cards,
 * white/10 hairline borders, zinc-50 primary text. Secondary text never drops below
 * zinc-400 on this surface (page-brief-core §2 contrast floor).
 *
 * ACCENT: single amber, restrained — amber-400 #FBBF24 carries UI chrome only (active
 * nav pill, focus rings, the primary action button, the segmented-control thumb). It is
 * deliberately NOT reused as a chart series color: the radar/bar compare three vendors
 * at once, and a validated three-slot categorical set (dataviz skill, dark-surface order:
 * blue/orange/aqua) is what actually needs to stay distinguishable under color-vision
 * deficiency. Mixing the UI accent into that set would make "the amber vendor" read as
 * "the important one," which is not the intent — no vendor is privileged over another.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 focus-visible:shadow-[0_0_0_3px_rgba(251,191,36,0.22)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-zinc-950";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_AUX = "text-zinc-400";
export const TEXT_MUTED = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-amber-400";
export const ACCENT_SOLID = "bg-amber-400 text-zinc-950 hover:bg-amber-300 active:bg-amber-500";
export const ACCENT_SUBTLE = "border border-amber-400/25 bg-amber-400/10 text-amber-300";

export const HOVER_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/** Validated three-slot categorical set for chart series (dataviz skill, dark-surface order). */
export type VendorSeriesId = "s1" | "s2" | "s3";
export const SERIES_HEX: Record<VendorSeriesId, string> = {
  s1: "#3987e5", // blue
  s2: "#d95926", // orange
  s3: "#199e70", // aqua
};
/** Stroke style is the colorblind-safe secondary channel — never hue alone. */
export const SERIES_DASH: Record<VendorSeriesId, string | undefined> = {
  s1: undefined, // solid
  s2: "6 4", // dashed
  s3: "1.5 3.5", // dotted
};

export type RiskBand = "strong" | "watch" | "weak";
export const BAND_LABEL: Record<RiskBand, string> = { strong: "Strong", watch: "Watch", weak: "At risk" };
export const BAND_BADGE: Record<RiskBand, string> = {
  strong: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  watch: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  weak: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};
export const BAND_DOT: Record<RiskBand, string> = { strong: "bg-emerald-400", watch: "bg-amber-400", weak: "bg-rose-400" };

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
