/**
 * Strata — route-scoped design tokens (r54 / candidate c).
 *
 * THEME: true light. White canvas is reserved for cards/panels; the app ground is zinc-50 — no
 * cream, no paper tint, no bezel dress-up. Hairline borders are zinc-200, body text is near-black
 * on white.
 *
 * ACCENT: single rose, channeled through primary actions, active states, and the treemap's
 * "over budget" severity ramp (and only that ramp — within-budget tiles stay neutral zinc). Every
 * fill/text pairing below was contrast-checked against its own background, not assumed:
 *   rose-50/100/200 (fills, light)  + zinc-900 text  → >7:1
 *   rose-400 fill                   + zinc-900 text  → 6.5:1 (white text on rose-400 fails at 2.7:1)
 *   rose-600 fill                   + white text     → 4.7:1 (zinc-900 text on rose-600 fails at 3.7:1)
 *   rose-700 fill (solid button)    + white text      → 6.3:1
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const FOCUS = "focus-visible:outline-2 outline-offset-2 outline-rose-600";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-100";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
export const TEXT_AUX = "text-zinc-500"; // floor for pure/near-white surfaces only
export const TEXT_MUTED = "text-zinc-600"; // floor for any tinted/muted surface (zinc-100+, pills, tracks)

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-rose-600";
export const ACCENT_SOLID = "bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900";
export const ACCENT_SUBTLE = "border border-rose-200 bg-rose-50 text-rose-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Severity = "within" | "mild" | "moderate" | "severe";

/** Tile fill ramp for the treemap. Only "over budget" cells ever carry the rose accent — the
 *  single most important rule in this file for staying inside the brief's accent discipline. */
export const SEVERITY_TILE: Record<Severity, { bg: string; border: string; text: string; subtext: string }> = {
  within: { bg: "bg-zinc-100", border: "border-zinc-200", text: "text-zinc-900", subtext: "text-zinc-600" },
  mild: { bg: "bg-rose-200", border: "border-rose-300", text: "text-zinc-900", subtext: "text-zinc-700" },
  moderate: { bg: "bg-rose-400", border: "border-rose-500", text: "text-zinc-900", subtext: "text-zinc-800" },
  severe: { bg: "bg-rose-600", border: "border-rose-700", text: "text-white", subtext: "text-rose-50" },
};

export const SEVERITY_BADGE: Record<Severity, string> = {
  within: "border-zinc-200 bg-zinc-100 text-zinc-700",
  mild: "border-rose-200 bg-rose-50 text-rose-700",
  moderate: "border-rose-300 bg-rose-100 text-rose-800",
  severe: "border-rose-700 bg-rose-600 text-white",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  within: "Within budget",
  mild: "Mildly over",
  moderate: "Over budget",
  severe: "Significantly over",
};

export const STATUS_BADGE: Record<"approved" | "pending" | "flagged", string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  flagged: "border-rose-200 bg-rose-50 text-rose-700",
};

export const STATUS_LABEL: Record<"approved" | "pending" | "flagged", string> = {
  approved: "Approved",
  pending: "Pending review",
  flagged: "Flagged",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
