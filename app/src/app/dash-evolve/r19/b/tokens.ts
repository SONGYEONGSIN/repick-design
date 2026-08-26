/**
 * Cadence — route-scoped design tokens (r19 / candidate b).
 *
 * THEME: real product LIGHT. Canvas zinc-50 (#fafafa), cards pure white, hairlines zinc-200,
 * shadows barely-there. No cream/paper/sepia tint anywhere — every "warm" surface in this file is
 * still a neutral zinc. Text floors at zinc-500 for auxiliary copy on the white/zinc-50 canvas and
 * zinc-600 for auxiliary copy sitting on a tinted (muted) surface, per the house contrast floor.
 *
 * ACCENT: a single cyan, split into two depths by what sits on it, not by habit —
 *   cyan-700 #0e7490 → 5.36:1 on white. Carries text: buttons, labels, focus rings, white-on-fill.
 *   cyan-600 #0891b2 → 3.69:1 on white. Decorative-only (hover rings, thin accent bars) — clears
 *     the 3:1 non-text floor but not 4.5:1, so it is never asked to carry a letterform.
 * Used for the brand mark, active nav, primary buttons, focus rings and exactly one schedule status
 * ("on track") — reusing the brand hue for the "healthy" status instead of inventing a second blue
 * keeps the single-accent rule intact even though the Gantt itself carries a small semantic ramp.
 *
 * STATUS RAMP IS NEVER COLOR ALONE. Every bar carries a status ICON, and every bar wide enough to
 * hold a glyph also prints its own id and percent complete as real white text INSIDE the fill —
 * which is why every fill below sits a shade darker than the usual UI tone: each one clears BOTH
 * the 3:1 graphical-object floor against the zinc-50/white canvas AND 4.5:1 for the small white
 * text on top of it (computed against the actual hex, not assumed from the Tailwind step number):
 *   cyan-700 #0e7490 → 5.36:1 · emerald-700 #047857 → 5.85:1 · amber-800 #92400e → 7.09:1 ·
 *   rose-800 #9f1239 → 7.44:1 · zinc-600 #52525b → 7.74:1 (hold — dashed border, never presented as
 *   a confident solid, so "paused" survives greyscale via the dash pattern, not the tone alone).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#0e7490";

/** The exact house focus token. Never preceded by a bare `outline-none`, never the `ring` +
 *  `ring-offset` idiom (Tailwind v4 renders that combination fully transparent). */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 focus-visible:shadow-[0_0_0_3px_rgba(14,116,144,0.25)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const BORDER_SOFT = "border-zinc-100";
export const SURFACE_INSET = "bg-zinc-100/70";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
/** Auxiliary floor on the white/zinc-50 canvas. Never step below this. */
export const TEXT_AUX = "text-zinc-500";
/** Auxiliary floor on a tinted / muted surface (badges, inset panels). */
export const TEXT_MUTED = "text-zinc-600";

/** Numbers, dates, IDs, quantities — fixed-width figures on top of Pretendard. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Text-weight accent — 5.36:1 on white, clears the 4.5:1 text floor. */
export const ACCENT_TEXT = "text-cyan-700";
/** Decorative-only accent (hover rings, thin marks, a left border bar) — 3.69:1; never text. */
export const ACCENT_MARK = "text-cyan-600";
export const ACCENT_SOLID = "bg-cyan-700 text-white hover:bg-cyan-800 active:bg-cyan-900";
export const ACCENT_SUBTLE = "border border-cyan-200 bg-cyan-50 text-cyan-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200/70";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type OrderStatus = "complete" | "on-track" | "at-risk" | "delayed" | "hold";

/** Schedule status ramp. Every fill carries white text at a verified ≥4.5:1 (see file header). */
export const STATUS_CHART: Record<OrderStatus, { fill: string; stroke: string; dashed?: boolean }> = {
  complete: { fill: "#047857", stroke: "#065f46" },
  "on-track": { fill: "#0e7490", stroke: "#155e75" },
  "at-risk": { fill: "#92400e", stroke: "#78350f" },
  delayed: { fill: "#9f1239", stroke: "#881337" },
  hold: { fill: "#52525b", stroke: "#27272a", dashed: true },
};

export const STATUS_BADGE: Record<OrderStatus, string> = {
  complete: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "on-track": "border border-cyan-200 bg-cyan-50 text-cyan-700",
  "at-risk": "border border-amber-200 bg-amber-50 text-amber-800",
  delayed: "border border-rose-200 bg-rose-50 text-rose-700",
  hold: "border border-zinc-300 bg-zinc-100 text-zinc-700",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  complete: "Complete",
  "on-track": "On track",
  "at-risk": "At risk",
  delayed: "Delayed",
  hold: "On hold",
};

/** The time-alignment band drawn behind every line when a bar is hovered or focused. */
export const CHART = {
  band: "rgba(14,116,144,0.07)",
  bandLine: "#0e7490",
} as const;
