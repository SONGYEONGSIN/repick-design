/**
 * Currents — route-scoped design tokens. Class constants used only within this route, without touching the global theme.
 * Light = pure-white canvas (white/zinc-50) + zinc-200 hairline + shadow-sm.
 * Dark = zinc-950/900 surface + white/10 border. No theatrical glow or scanlines.
 * Contrast rule: secondary text on light surfaces uses zinc-500 or darker; on dark surfaces, zinc-400 or lighter only (in every state, including behind filters/toggles).
 * Single accent color = sky (brand, "current/stream" concept). Flow direction/performance tone is owned by TONE (below) — color is always paired with text.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-50 dark:bg-zinc-950";
export const BORDER = "border-zinc-200 dark:border-zinc-800";
export const BORDER_STRONG = "border-zinc-300 dark:border-zinc-700";
export const DIVIDE = "divide-zinc-200 dark:divide-zinc-800";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** For aligning numbers/IDs — tabular fixed-width layered on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — sky (flow/current concept) */
export const ACCENT_TEXT = "text-sky-600 dark:text-sky-400";
export const ACCENT_SOLID = "bg-sky-700 text-white hover:bg-sky-700 active:bg-sky-800";
export const ACCENT_SUBTLE = "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
export const ACCENT_RING = "ring-sky-600 dark:ring-sky-400";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400";
/** For SVG shapes (rect/path) — outline-based; outline renders more reliably than the ring utility inside SVG. */
export const SVG_FOCUS =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* Direction/performance tone — used on flow-outcome badges (retained/expanded/downgraded/churned) etc. Never color-only; always paired with icon/text. */
export type Tone = "up" | "down" | "flat" | "info" | "warn" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  up: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  down: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
  },
  flat: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
  info: {
    text: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-50 dark:bg-sky-500/12",
    border: "border-sky-200 dark:border-sky-500/25",
    dot: "bg-sky-500",
  },
  warn: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

/** Fixed palette per flow-node column (channel/tier/outcome) — always paired with a label, so it marks a category rather than decorating. */
export const COLUMN_FILL: Record<0 | 1 | 2, { fill: string; stroke: string; ribbon: string }> = {
  0: { fill: "fill-sky-500", stroke: "stroke-sky-600", ribbon: "fill-sky-400/40 dark:fill-sky-500/25" },
  1: { fill: "fill-indigo-500", stroke: "stroke-indigo-600", ribbon: "fill-indigo-400/40 dark:fill-indigo-500/25" },
  2: { fill: "fill-zinc-400", stroke: "stroke-zinc-500", ribbon: "fill-zinc-400/30 dark:fill-zinc-500/20" },
};

export const OUTCOME_TONE: Record<string, Tone> = {
  retained: "up",
  expanded: "info",
  downgraded: "warn",
  churned: "down",
};

/** Outcome (90-day) node color — a desaturated semantic palette. Color is always paired with label/badge text. */
export const OUTCOME_FILL: Record<string, string> = {
  retained: "fill-emerald-500",
  expanded: "fill-sky-500",
  downgraded: "fill-amber-500",
  churned: "fill-rose-500",
};

/** Tier→outcome ribbon color — layers the destination node's (outcome's) semantic tone at low opacity so churn/retention flows read at a glance. */
export const OUTCOME_RIBBON_FILL: Record<string, string> = {
  retained: "fill-emerald-400/45 dark:fill-emerald-500/30",
  expanded: "fill-sky-400/45 dark:fill-sky-500/30",
  downgraded: "fill-amber-400/45 dark:fill-amber-500/30",
  churned: "fill-rose-400/45 dark:fill-rose-500/30",
};
