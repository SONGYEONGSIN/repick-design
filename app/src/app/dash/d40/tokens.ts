/**
 * Cadence — route-scoped design tokens. Class constants used only within this route, without
 * touching the global theme.
 * Theme = Developer-Tool palette (colors.catalog), adapted to the single-accent principle: light
 * default is a pure-white/zinc-50 canvas (never cream/paper), dark `dark:` variants use zinc-950/900
 * surfaces with white/10 borders. Single UI accent = indigo-600/indigo-400, used only for emphasis
 * (buttons, active states, focus rings, selected cells). The heatmap intensity scale reuses the same
 * indigo hue at varying shades (a data encoding, not a second UI accent); incident markers and status
 * badges use a small semantic tone set (emerald/amber/rose), always paired with an icon/text, never
 * color alone. Contrast rule (checked in every state, not just default render): secondary/caption
 * text is never lighter than zinc-500 on light surfaces, never darker than zinc-400 on dark surfaces
 * — this includes filtered/empty states (e.g. "No incidents" days, zero-deploy cells).
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

/** For aligning numbers/IDs/timestamps — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — indigo-600/indigo-400. UI chrome only (buttons, active states, focus rings). */
export const ACCENT_TEXT = "text-indigo-600 dark:text-indigo-400";
export const ACCENT_SOLID =
  "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:active:bg-indigo-600";
export const ACCENT_SUBTLE = "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300";
export const ACCENT_BORDER = "border-indigo-200 dark:border-indigo-500/30";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-white/5 dark:active:bg-white/10";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

/* Status/tone — used on deploy-status badges and incident markers. Always paired with an icon and/or text. */
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
    text: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-50 dark:bg-indigo-500/12",
    border: "border-indigo-200 dark:border-indigo-500/25",
    dot: "bg-indigo-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

/**
 * Sequential intensity scale for the deploy-count heatmap — five buckets of the single indigo hue.
 * `text` is chosen per-bucket so the always-visible numeral stays AA-contrast against its own cell.
 */
export const INTENSITY_SCALE = [
  { min: 0, bg: "bg-zinc-100 dark:bg-white/[0.06]", text: "text-zinc-500 dark:text-zinc-400", border: "border-zinc-200 dark:border-white/10" },
  { min: 1, bg: "bg-indigo-100 dark:bg-indigo-500/20", text: "text-indigo-800 dark:text-indigo-200", border: "border-indigo-200 dark:border-indigo-500/25" },
  { min: 3, bg: "bg-indigo-300 dark:bg-indigo-500/45", text: "text-indigo-900 dark:text-white", border: "border-indigo-300 dark:border-indigo-400/40" },
  { min: 5, bg: "bg-indigo-500 dark:bg-indigo-500/75", text: "text-white", border: "border-indigo-500 dark:border-indigo-400/60" },
  { min: 7, bg: "bg-indigo-700 dark:bg-indigo-400", text: "text-white dark:text-indigo-950", border: "border-indigo-700 dark:border-indigo-300" },
] as const;

export function intensityFor(count: number): (typeof INTENSITY_SCALE)[number] {
  let bucket: (typeof INTENSITY_SCALE)[number] = INTENSITY_SCALE[0];
  for (const b of INTENSITY_SCALE) {
    if (count >= b.min) bucket = b;
  }
  return bucket;
}
