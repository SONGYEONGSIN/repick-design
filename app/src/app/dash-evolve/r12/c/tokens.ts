/**
 * Nudge — route-scoped design tokens. Class constants used only within this route, without
 * touching the global theme.
 * Theme = Productivity Tool palette (colors.catalog), background corrected to a pure white/zinc-50
 * canvas (never cream/paper). Single-accent principle: blue-600/blue-400 (#2563EB family) is the
 * primary accent used for emphasis (buttons, active states, focus rings, selected question). A
 * second, sparing warm accent — orange-600/orange-300 (#EA580C family) — is reserved for
 * conditional-branch labelling in the logic map only (never on small body text at low contrast).
 * Contrast rule (checked in every state, not just default render): secondary/caption text is never
 * lighter than zinc-500 on light surfaces, never darker than zinc-400 on dark surfaces — this
 * includes every question type's placeholder/caption text in the preview pane and any question
 * added at runtime with "Not live yet" analytics.
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

/** For aligning numbers/IDs/counts — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — blue-600/blue-400 (#2563EB family, the Productivity Tool catalog accent). UI chrome only. */
export const ACCENT_TEXT = "text-blue-600 dark:text-blue-400";
export const ACCENT_SOLID = "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:text-zinc-950 dark:hover:bg-blue-400 dark:active:bg-blue-600";
export const ACCENT_SUBTLE = "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
export const ACCENT_BORDER = "border-blue-200 dark:border-blue-500/30";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-white/5 dark:active:bg-white/10";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

/* Status/tone — used on completion-rate badges, funnel bars, and logic-map branch chips.
   Always paired with text, never color alone. */
export type Tone = "good" | "warn" | "bad" | "info" | "neutral" | "attn";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string; fill: string }> = {
  good: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    fill: "bg-emerald-500 dark:bg-emerald-400",
  },
  warn: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
    fill: "bg-amber-500 dark:bg-amber-400",
  },
  bad: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
    fill: "bg-rose-500 dark:bg-rose-400",
  },
  info: {
    text: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-500/12",
    border: "border-blue-200 dark:border-blue-500/25",
    dot: "bg-blue-500",
    fill: "bg-blue-600 dark:bg-blue-400",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
    fill: "bg-zinc-400 dark:bg-zinc-500",
  },
  attn: {
    text: "text-orange-700 dark:text-orange-300",
    bg: "bg-orange-50 dark:bg-orange-500/12",
    border: "border-orange-200 dark:border-orange-500/25",
    dot: "bg-orange-500",
    fill: "bg-orange-500 dark:bg-orange-400",
  },
};

/** Completion-rate -> tone thresholds, shared between the rail funnel bars and any badge. */
export function rateTone(ratePct: number): Tone {
  if (ratePct >= 90) return "good";
  if (ratePct >= 80) return "warn";
  return "bad";
}
