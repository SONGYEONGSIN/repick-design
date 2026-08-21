/**
 * Trussline — route-scoped design tokens (r17 / candidate c).
 *
 * THEME: refined product DARK. Canvas zinc-950 (#09090b), cards zinc-900 (#18181b), hairlines
 * `white/10`, primary text zinc-50, auxiliary text floors at zinc-400 (#a1a1aa — 7.76:1 on the
 * canvas, 6.91:1 on a card). Never zinc-500/600 for text on dark. No glow, scanlines, grain or
 * glossy chrome — the surface reads as a tool, not a stage.
 *
 * ACCENT: a single lime. lime-400 (#a3e635) measures 13.20:1 on zinc-950 and 11.75:1 on zinc-900,
 * so small accent text and accent icons clear the 4.5:1 body floor with real margin. Text-bearing
 * lime fills carry NEAR-BLACK text, not white: zinc-950 on lime-400 is 13.20:1 while white on
 * lime-400 is only 1.51:1. That inverts the usual "white on an accent fill" rule for a reason —
 * the fill here is a bright chroma, not a dark one, so the computed ratio decides, not the habit.
 *
 * DIRECTION IS NEVER COLOR ALONE. A waterfall lives or dies on ±, so every bar, every ledger row
 * and every sub-driver carries a lucide arrow icon AND a signed figure alongside the fill tone.
 * Increases are zinc-300, decreases are lime-400, balances are zinc-50 — but strip the colour out
 * entirely and the arrows plus the signs still tell the whole story.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#a3e635";

/** The exact house focus token. No `outline-none` ever precedes it (that cancels itself), and it
 *  is never the `ring`+`ring-offset` idiom (Tailwind v4 paints that fully transparent). */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3e635] focus-visible:shadow-[0_0_0_3px_rgba(163,230,53,0.3)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const BORDER_SOFT = "border-white/[0.07]";
export const SURFACE_INSET = "bg-white/[0.035]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/40";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Auxiliary floor on dark. Never step below this. */
export const TEXT_AUX = "text-zinc-400";

/** Numbers, IDs, money — fixed-width figures on top of Pretendard. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-lime-400";
export const ACCENT_TEXT_SOFT = "text-lime-300";
/** Lime fill + near-black label — 13.20:1, verified above. */
export const ACCENT_SOLID = "bg-lime-400 text-zinc-950 hover:bg-lime-300 active:bg-lime-500";
export const ACCENT_SUBTLE = "border border-lime-400/35 bg-lime-400/10 text-lime-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/** Chart ink. Non-text marks only — every one of them is paired with an HTML label or icon. */
export const CHART = {
  /** Opening / closing balance columns — the brightest mark on the canvas. */
  balance: "#fafafa",
  /** Cost went UP. Neutral bright zinc, always paired with an up arrow and a leading "+". */
  increase: "#d4d4d8",
  /** Cost came DOWN. The single accent, always paired with a down arrow and a leading "−". */
  decrease: "#a3e635",
  /** Running-total step / connector line (4.12:1 against the canvas — reads as structure). */
  connector: "#71717a",
  grid: "#3f3f46",
  axis: "#52525b",
  label: "#a1a1aa",
  labelStrong: "#fafafa",
  plan: "#a1a1aa",
} as const;

export type Direction = "increase" | "decrease";
