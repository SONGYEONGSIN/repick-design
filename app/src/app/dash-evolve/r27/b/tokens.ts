/**
 * Fathom — route-scoped design tokens (r27 / candidate b).
 *
 * THEME: light (Mercury/Asana-grade "true light" — zinc-50 canvas, white cards, zinc-200 hairlines,
 * shadow-sm only — no cream/paper/sepia anywhere).
 *
 * ACCENT: single blue, split by what sits on it —
 *   blue-700 #1D4ED8 on white ≈ 6.70:1 (computed by hand via the standard WCAG relative-luminance
 *   formula, not assumed). Carries ALL text/icons/links/focus rings and the decomposition tree's
 *   connector lines and contribution bars.
 *   blue-600 #2563EB solid fill + white text ≈ 5.17:1 (also hand-computed). Used only for the
 *   primary-action button fill, never for body text on white.
 *   blue-50/100 = tint-only surfaces, always paired with blue-700 text, never accent-on-accent.
 * Cost-direction semantics (spend up/down) are a SEPARATE rose/emerald pair, deliberately not the
 * brand blue, so "this is Fathom" (blue) never collides with "this got worse/better" (rose/emerald)
 * on the same row. Every direction is carried by an icon (TrendingUp/TrendingDown) plus a +/- sign
 * in the text itself, never by color alone.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#1D4ED8";

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 focus-visible:shadow-[0_0_0_3px_rgba(29,78,216,0.18)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-50";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
export const TEXT_AUX = "text-zinc-500"; // pure-white/zinc-50 surfaces only (contrast floor for that tone)
export const TEXT_MUTED = "text-zinc-600"; // zinc-100+ tinted surfaces (tab tracks, segmented tracks)

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Latin display face — headline / wordmark / eyebrow ONLY. Never body copy, never Korean, never numbers. */
type DisplayFontStyle = { fontFamily: string };
export const DISPLAY_FONT: DisplayFontStyle = { fontFamily: "var(--font-display-mono)" };

export const ACCENT_TEXT = "text-blue-700";
export const ACCENT_SOLID = "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800";
export const ACCENT_SUBTLE = "border border-blue-200 bg-blue-50 text-blue-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/** Cost-direction — never color alone; always paired with an icon and an explicit sign in the text. */
export const UP_TEXT = "text-rose-700"; // spend increased — bad
export const DOWN_TEXT = "text-emerald-700"; // spend decreased — good
export const UP_BADGE = "border-rose-200 bg-rose-50 text-rose-700";
export const DOWN_BADGE = "border-emerald-200 bg-emerald-50 text-emerald-700";
export const FLAT_BADGE = "border-zinc-200 bg-zinc-50 text-zinc-600";

export type LevelName = "Region" | "Service" | "Resource type" | "SKU";
export const LEVELS: LevelName[] = ["Region", "Service", "Resource type", "SKU"];
export const LEVEL_BADGE: Record<LevelName, string> = {
  Region: "border-blue-200 bg-blue-50 text-blue-700",
  Service: "border-violet-200 bg-violet-50 text-violet-700",
  "Resource type": "border-amber-200 bg-amber-50 text-amber-800",
  SKU: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export function r1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
