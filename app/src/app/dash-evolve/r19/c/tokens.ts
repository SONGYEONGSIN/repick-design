/**
 * Threshold — route-scoped design tokens (r19 / candidate c).
 *
 * THEME: genuine product LIGHT. Canvas zinc-50 (#fafafa), cards pure white, hairlines
 * zinc-200, primary text zinc-900. Auxiliary text floors at zinc-500 ON WHITE/ZINC-50 ONLY —
 * any auxiliary text sitting on a muted/tinted surface (zinc-100+, the segmented track, the
 * table header rule, badges) steps up to zinc-600 instead (see TEXT_AUX_MUTED). No cream,
 * no paper, no stamped/skeuomorphic chrome — the surface reads as a tool, not a stage.
 *
 * ACCENT: a single indigo. indigo-600 (#4f46e5) measures 5.4:1 white-on-fill and reads as text
 * at 5.9:1 on white — comfortably past the 4.5:1 body floor. It is the ONLY chroma used for
 * interactive/brand emphasis; queue severity uses a separate, narrower emerald/amber/rose
 * vocabulary that never doubles as the page accent.
 *
 * DIRECTION IS NEVER COLOR ALONE. Every trend, delta and status pairs an arrow/check/alert
 * icon and a signed or worded label with its tint — strip the colour and the icon plus text
 * still carry the meaning.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#4f46e5";

/** The exact house focus token. No `outline-none` ever precedes it (that cancels itself), and
 *  it is never the `ring`+`ring-offset` idiom (Tailwind v4 paints that fully transparent). */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5] focus-visible:shadow-[0_0_0_3px_rgba(79,70,229,0.25)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
/** Muted/tinted surface — segmented tracks, badge fills, table foot rows. Text on top of this
 *  must use TEXT_AUX_MUTED (zinc-600), never TEXT_AUX (zinc-500). */
export const SURFACE_INSET = "bg-zinc-100";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.04]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-600";
/** Auxiliary floor — pure white / zinc-50 surfaces ONLY. */
export const TEXT_AUX = "text-zinc-500";
/** Auxiliary floor on muted/tinted surfaces (zinc-100 and above). */
export const TEXT_AUX_MUTED = "text-zinc-600";

/** Numbers, IDs, minutes, percentages — fixed-width figures on top of Pretendard. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-indigo-600";
export const ACCENT_TEXT_STRONG = "text-indigo-700";
export const ACCENT_SOLID = "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700";
export const ACCENT_SUBTLE = "border border-indigo-200 bg-indigo-50 text-indigo-700";
export const ACCENT_RING_SELECTED = "border-indigo-300 bg-indigo-50/70 ring-1 ring-inset ring-indigo-200";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/** Severity vocabulary — deliberately distinct from the single page accent so "this needs
 *  attention" never competes visually with "this is interactive/branded". Every use pairs an
 *  icon and a word with the tint (no colour-only signalling). Values chosen with margin above
 *  the 4.5:1 text floor on white (emerald-700 ≈ 5.6:1, amber-700 ≈ 4.9:1, rose-700 ≈ 6.0:1). */
export const GOOD_TEXT = "text-emerald-700";
export const GOOD_SUBTLE = "border border-emerald-200 bg-emerald-50 text-emerald-700";
export const WARN_TEXT = "text-amber-700";
export const WARN_SUBTLE = "border border-amber-200 bg-amber-50 text-amber-700";
export const BAD_TEXT = "text-rose-700";
export const BAD_SUBTLE = "border border-rose-200 bg-rose-50 text-rose-700";

/** Chart ink. Non-text marks only — every one is paired with an HTML label, legend or readout
 *  printed alongside it, never left to hover alone. */
export const CHART = {
  line: "#4f46e5",
  area: "#4f46e5",
  target: "#71717a",
  grid: "#e4e4e7",
  axis: "#a1a1aa",
  label: "#71717a",
  labelStrong: "#18181b",
  good: "#059669",
  bad: "#e11d48",
  track: "#e4e4e7",
} as const;

export type Direction = "up" | "down" | "flat";
