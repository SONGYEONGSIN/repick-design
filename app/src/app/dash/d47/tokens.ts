/**
 * Vela — route-scoped design tokens. Class constants used only within this route.
 *
 * Theme = dark, product-grade (never theatrical). Canvas zinc-950, cards zinc-900, hairline
 * borders white/10 (per dash-brief-v3 "다크: zinc-950/900 표면, 보더 white/10"). Single UI accent =
 * cyan-400 (chrome/brand only: buttons, focus outline, selected picker card, active nav pill,
 * chart line/band). Semantic status tones (emerald=significant positive, rose=significant
 * negative, amber=not yet significant) are a SEPARATE palette from the UI accent — every
 * significance state is always paired with an icon and a text label, never color alone.
 *
 * Focus: NOT the v3 `ring-2`+`ring-offset-*` idiom (paints fully transparent in Tailwind v4).
 * Every interactive element gets `focus-visible:outline` (or `focus-within:outline` on the rare
 * wrapper-highlighted control) with no preceding `outline-none` that could cancel it.
 *
 * Contrast: secondary/caption text on this dark canvas is never darker than zinc-400 (the
 * `no-dark-dim-text` floor — zinc-500/600 measured ~3.5–4.1:1, fails AA). This includes state
 * branches only reachable via filter/toggle (e.g. "Not yet significant" rows, empty filter state).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950/60";
export const SURFACE_MUTED = "bg-zinc-800/70";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-black/20");

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Caption/secondary text — zinc-400 floor per dark-surface contrast rule (no-dark-dim-text). */
export const TEXT_CAPTION = "text-zinc-400";

/** Numbers/IDs/dates — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — cyan. UI chrome only (buttons, active states, focus outlines, selected cards,
   chart line + confidence band). Bright accent + near-black on-accent text: a safer AA pattern on
   a dark canvas than a mid-tone accent fill with white text. */
export const ACCENT_TEXT = "text-cyan-400";
export const ACCENT_SOLID = "bg-cyan-400 text-zinc-950 hover:bg-cyan-300 active:bg-cyan-500";
export const ACCENT_SUBTLE = "bg-cyan-400/10 text-cyan-300";
export const ACCENT_BORDER = "border-cyan-400/30";

/** Default focus-visible: no preceding `outline-none`, so the outline always paints on real Tab. */
export const FOCUS_VISIBLE = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";
/** Inset variant for controls flush against a clipped/rounded edge (table sort buttons, nav rows). */
export const FOCUS_VISIBLE_INSET = "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400";
/** For a wrapper whose focusable child (an <input>) carries its own `outline-none` — the wrapper shows the signal instead. */
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/5";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

export type Tone = "good" | "warn" | "bad" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", dot: "bg-emerald-400" },
  warn: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", dot: "bg-amber-400" },
  bad: { text: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30", dot: "bg-rose-400" },
  neutral: { text: "text-zinc-300", bg: "bg-zinc-800/70", border: "border-white/10", dot: "bg-zinc-400" },
};

export type ExperimentStatus = "running" | "concluded";
export const STATUS_LABEL: Record<ExperimentStatus, string> = { running: "Running", concluded: "Concluded" };
export const STATUS_TONE: Record<ExperimentStatus, Tone> = { running: "neutral", concluded: "good" };

/** Significance state, always rendered with an icon AND a text label — color is never the sole carrier. */
export type SignificanceState = "significant-positive" | "significant-negative" | "not-yet";
export const SIGNIFICANCE_LABEL: Record<SignificanceState, string> = {
  "significant-positive": "Significant",
  "significant-negative": "Significant",
  "not-yet": "Not yet significant",
};
export const SIGNIFICANCE_TONE: Record<SignificanceState, Tone> = {
  "significant-positive": "good",
  "significant-negative": "bad",
  "not-yet": "warn",
};
