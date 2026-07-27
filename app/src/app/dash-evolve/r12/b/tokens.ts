/**
 * Covenant — route-scoped design tokens for the contract review & redlining console.
 * Theme = B2B Service palette: light default is a pure-white/zinc-50 canvas (never cream/paper),
 * navy-adjacent neutral text; `dark:` variants use zinc-950/900 surfaces with white/10 borders.
 * Single-accent principle: sky-700/sky-400 (#0369A1 family) is the ONLY color used for emphasis
 * (buttons, active states, focus rings, selected rows); every other surface is neutral zinc/slate.
 * Risk tones (rose/amber/emerald) are reserved for risk badges/gauges and always paired with text.
 * Contrast rule (checked in every state, including states only reachable via filter/sort/toggle):
 * secondary/caption text is never lighter than zinc-500 on light surfaces, never darker than
 * zinc-400 on dark surfaces.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-white dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-50 dark:bg-zinc-950";
export const SURFACE_RAISED = "bg-zinc-100 dark:bg-zinc-800";
export const BORDER = "border-zinc-200 dark:border-white/10";
export const BORDER_STRONG = "border-zinc-300 dark:border-white/15";
export const DIVIDE = "divide-zinc-200 dark:divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** For aligning numbers/IDs/dates — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — sky-700/sky-400 (#0369A1 family, the B2B Service catalog accent). UI chrome only. */
export const ACCENT_TEXT = "text-sky-700 dark:text-sky-400";
export const ACCENT_SOLID =
  "bg-sky-700 text-white hover:bg-sky-600 active:bg-sky-800 dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400 dark:active:bg-sky-600";
export const ACCENT_SUBTLE = "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
export const ACCENT_BORDER = "border-sky-200 dark:border-sky-500/30";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-700 dark:focus-visible:ring-sky-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-white/5 dark:active:bg-white/10";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

/* Status/tone — used on contract-status badges and risk indicators. Always paired with text/icon. */
export type Tone = "good" | "warn" | "bad" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string; stroke: string }> = {
  good: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    stroke: "#10b981",
  },
  warn: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
    stroke: "#d97706",
  },
  bad: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
    stroke: "#e11d48",
  },
  info: {
    text: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-50 dark:bg-sky-500/12",
    border: "border-sky-200 dark:border-sky-500/25",
    dot: "bg-sky-500",
    stroke: "#0369a1",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
    stroke: "#a1a1aa",
  },
};
