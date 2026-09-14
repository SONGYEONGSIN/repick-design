/**
 * Ledgerline — route-scoped design tokens (r26 / candidate c).
 *
 * THEME: light (Mercury/Ramp-grade). White canvas (zinc-50 app ground, white cards),
 * hairline borders zinc-200, near-black text on white — the brief's "진짜 라이트": no
 * cream/paper tint anywhere, no registration-mark/bezel dress-up.
 *
 * ACCENT: single violet, split by what sits on it —
 *   violet-600 #7c3aed → carries text on white: active nav, links, focus rings, the
 *     sunburst's primary hue family. Contrast on #ffffff = 6.2:1 (AA for body text).
 *   violet-700 #6d28d9 → solid button fill, white text on top = 7.1:1 (AAA even at
 *     body-text size), because a filled action needs more headroom than a text label does.
 * Status colors (emerald/rose/amber/sky) are semantic badges, not the page accent — kept
 * distinct from the violet brand hue on purpose, same convention prior rounds used for
 * risk/status badges next to a single decorative accent.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#7c3aed"; // violet-600
export const ACCENT_HEX_700 = "#6d28d9"; // violet-700, solid-fill contrast target

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus-visible:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-100";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
export const TEXT_AUX = "text-zinc-500"; // hairline: white/zinc-50 surface floor per brief
export const TEXT_MUTED = "text-zinc-600"; // muted-tone surfaces (segment tracks, pills) floor

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-violet-600";
export const ACCENT_SOLID = "bg-violet-700 text-white hover:bg-violet-800 active:bg-violet-900";
export const ACCENT_SUBTLE = "border border-violet-200 bg-violet-50 text-violet-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Tone = "positive" | "negative" | "warning" | "neutral";
export const TONE_BADGE: Record<Tone, string> = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  negative: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-sky-200 bg-sky-50 text-sky-700",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
