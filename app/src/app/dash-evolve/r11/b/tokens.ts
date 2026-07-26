/**
 * Amberline — route-scoped design tokens. Class constants used only within this route, without
 * touching the global theme.
 * Assigned theme = Banking / Finance (colors.catalog): light = pure-white canvas (white/zinc-50) +
 * zinc-200 hairline + shadow-sm, navy (#0F172A) primary, premium gold (#A16207) as the single UI
 * accent. Dark = zinc-950/900 surfaces + white/10 borders (production dark, not theatrical).
 * Contrast rule: secondary text on light surfaces stays zinc-500 or darker; on dark surfaces,
 * zinc-400 or lighter only — in every state, including filter/toggle-only branches.
 * Single accent principle: gold (accent) is the only color used for UI emphasis (buttons, active
 * nav, focus rings). The bridge chart's up/down/total tones are a separate data-encoding palette
 * (emerald/rose/navy), always paired with an icon and text label, never color alone.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-50 dark:bg-zinc-950";
export const BORDER = "border-zinc-200 dark:border-white/10";
export const BORDER_STRONG = "border-zinc-300 dark:border-white/15";
export const DIVIDE = "divide-zinc-200 dark:divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** Aligns numbers/IDs — tabular fixed-width, layered on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — premium gold (Banking/Finance). UI chrome only: buttons, focus rings, active nav. */
export const ACCENT_TEXT = "text-amber-700 dark:text-amber-400";
export const ACCENT_SOLID = "bg-[#A16207] text-white hover:bg-[#8a5306] active:bg-[#794807] dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400";
export const ACCENT_SUBTLE = "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300";
export const ACCENT_BORDER = "border-amber-300 dark:border-amber-400/40";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A16207] dark:focus-visible:ring-amber-400";
/** For SVG/HTML overlay shapes — outline-based; renders more reliably than the ring utility over an svg background. */
export const SVG_FOCUS =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:focus-visible:outline-amber-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-white/5 dark:active:bg-white/10";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* Status/tone palette — badges, table signals, hero deltas. Always paired with icon/text. */
export type Tone = "good" | "warn" | "bad" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  warn: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
  },
  bad: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
  },
  info: {
    text: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-500/12",
    border: "border-slate-200 dark:border-slate-500/25",
    dot: "bg-slate-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

/**
 * Bridge chart data encoding — separate from the single UI accent (gold). Increase/decrease/total
 * are a fixed categorical palette; every use is paired with an arrow/equals icon and a text label.
 */
export const BRIDGE_TONE = {
  positive: {
    text: "text-emerald-700 dark:text-emerald-300",
    chipBg: "bg-emerald-50 dark:bg-emerald-500/15",
    chipBorder: "border-emerald-200 dark:border-emerald-500/30",
    bar: "#059669",
    barDark: "#34d399",
  },
  negative: {
    text: "text-rose-700 dark:text-rose-300",
    chipBg: "bg-rose-50 dark:bg-rose-500/15",
    chipBorder: "border-rose-200 dark:border-rose-500/30",
    bar: "#e11d48",
    barDark: "#fb7185",
  },
  anchor: {
    text: "text-slate-900 dark:text-slate-50",
    chipBg: "bg-slate-100 dark:bg-white/10",
    chipBorder: "border-slate-300 dark:border-white/20",
    bar: "#0F172A",
    barDark: "#cbd5e1",
  },
} as const;
