/**
 * Waymark — route-scoped design tokens (r27 / candidate a).
 *
 * THEME: dark (n8n/Coinbase-grade). zinc-950 canvas, zinc-900 cards, hairline borders white/10.
 *
 * ACCENT: single teal, split by what sits on it —
 *   teal-400 #2dd4bf → carries text: active nav, links, focus rings, "on track" status.
 *   teal-800 → solid button fill (white text).
 * "On track" reuses the brand accent (teal) rather than a fourth hue — same pattern as prior dark
 * rounds (r21/c RISK_DOT "healthy" = teal-500): the accent doubles as the positive status color, so
 * the page still reads as a single restrained accent rather than a four-color traffic light.
 *
 * DISPLAY FACE: --font-display-grotesk, applied only to the wordmark, the page <h1> and the Eyebrow
 * micro-label component (all latin, never Korean, never body/table copy — see DISPLAY_STYLE below).
 *
 * FONT WEIGHTS (exactly 3, both faces): font-normal(400) / font-medium(500) / font-semibold(600).
 * No font-bold/extrabold anywhere in this route, including inline SVG/CSS fontWeight values.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#2dd4bf";

// Latin-only display face — never applied to body copy, table cells or anything that could carry
// Korean. See tokens.ts header note.
export const DISPLAY_STYLE = { fontFamily: "var(--font-display-grotesk)" } as const;

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

// Qualitative band / confidence tone — used by the bullet grid, its status badges and the check-ins
// table. Color is always paired with an icon + text label (never the sole signal).
export type BandTone = "poor" | "satisfactory" | "good";
export const STATUS_LABEL: Record<BandTone, string> = { poor: "Off track", satisfactory: "At risk", good: "On track" };
export const STATUS_BADGE: Record<BandTone, string> = {
  poor: "border-rose-800/60 bg-rose-950/40 text-rose-300",
  satisfactory: "border-amber-800/60 bg-amber-950/30 text-amber-300",
  good: "border-teal-800/60 bg-teal-950/40 text-teal-300",
};
// Band fill for the bullet chart's background range (translucent, sits behind the value bar).
export const BAND_FILL: Record<BandTone, string> = {
  poor: "bg-rose-500/20",
  satisfactory: "bg-amber-500/20",
  good: "bg-teal-500/[0.16]",
};
// Solid value-bar fill, keyed by the tone the *current* value lands in.
export const VALUE_BAR_FILL: Record<BandTone, string> = {
  poor: "bg-rose-400",
  satisfactory: "bg-amber-400",
  good: "bg-teal-400",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
