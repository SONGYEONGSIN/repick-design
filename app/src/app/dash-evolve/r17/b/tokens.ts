/**
 * Bayline — route-scoped design tokens (r17 / b).
 *
 * THEME: genuine light. Canvas `zinc-50`, cards `white` + `border-zinc-200` + `shadow-sm`,
 * hairlines `zinc-200`. No cream/paper/sepia anywhere — that is the banned fake light.
 *
 * ACCENT: a single blue. Text-bearing accent is blue-700 `#1d4ed8` (6.70:1 on white; white text on
 * a blue-700 fill is the same 6.70:1). blue-600 was rejected for text fills — white on `#2563eb`
 * measures 4.55:1, a "just barely passing" ratio the house rule tells us to step past.
 *
 * HEATMAP RAMP: the whole ramp was computed BEFORE picking a text colour, because white text does
 * not clear AA over most of a blue ramp and intensity-conditional text colour is what killed an
 * earlier catalog heatmap. The ramp is deliberately kept light and tops out at blue-400 so ONE dark
 * token can sit on every step:
 *   L0 #ffffff · L1 #eff6ff · L2 #dbeafe · L3 #bfdbfe · L4 #93c5fd · L5 #60a5fa
 *   zinc-900 (#18181b) on the darkest step (#60a5fa) = 6.97:1 — passes with real margin.
 *   zinc-600 (#52525b) on that same step would be 3.04:1, which is exactly why empty (L0) cells —
 *   and only those, on pure white — are the sole users of zinc-600.
 * Intensity is never the only channel: every cell prints its own value as text.
 *
 * FOCUS: the mandated token verbatim, no `outline-none` anywhere before it (that cancels itself)
 * and never `ring` + `ring-offset` (Tailwind v4 paints that fully transparent).
 *
 * WEIGHTS: exactly three computed weights on the route — 400 / 500 / 600. No `font-bold`, no
 * `<b>`/`<strong>`; every `<th>` carries an explicit weight class because Tailwind's preflight does
 * not reset the UA `bold` on table headers. There is NO display face on this route: hierarchy is
 * built from size, tracking, weight and colour only.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50";
export const CARD_BG = "bg-white";
export const SURFACE_MUTED = "bg-zinc-100";
export const SURFACE_INSET = "bg-zinc-50";
export const BORDER = "border-zinc-200";
export const DIVIDE = "divide-zinc-200";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-zinc-950/[0.04]");

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
/** Caption on pure/near-white surfaces only (<= zinc-50). */
export const TEXT_CAPTION = "text-zinc-500";
/** Caption on tinted surfaces (zinc-100+, segment tracks, pills, table header rows). */
export const TEXT_CAPTION_MUTED = "text-zinc-600";

/** Numbers, IDs and clock times — tabular figures on top of Pretendard. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_HEX = "#1d4ed8";
export const ACCENT_TEXT = "text-blue-700";
export const ACCENT_SOLID = "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900";
export const ACCENT_SUBTLE = "bg-blue-50 text-blue-800 border border-blue-200";
export const ACCENT_LINE = "#1d4ed8";
export const ACCENT_BAR = "#93c5fd";

/** The mandated focus token, used verbatim on every interactive element on the route. */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8] focus-visible:shadow-[0_0_0_3px_rgba(29,78,216,0.3)]";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
/**
 * Deliberately NOT `transition-colors`: in Tailwind v4 that keyword includes `outline-color`, so a
 * focus outline fades in from the element's `currentColor` and a keyboard user (and any instrument
 * that samples the frame right after Tab) sees a half-mixed colour instead of the accent. Only the
 * three surface colours animate here.
 */
export const TRANSITION = "transition-[color,background-color,border-color] duration-150 ease-out motion-reduce:transition-none";

/** Heatmap intensity ramp — see the module note for the contrast arithmetic. */
export const RAMP = ["#ffffff", "#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa"] as const;
export const RAMP_BORDER = ["#e4e4e7", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6"] as const;

export type Tone = "good" | "warn" | "bad" | "neutral" | "accent";

export const TONE: Record<Tone, { text: string; bg: string; border: string }> = {
  good: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  warn: { text: "text-orange-800", bg: "bg-orange-50", border: "border-orange-200" },
  bad: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  neutral: { text: "text-zinc-600", bg: "bg-zinc-100", border: "border-zinc-200" },
  accent: { text: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200" },
};
