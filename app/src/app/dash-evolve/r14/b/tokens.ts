/**
 * Rampart — route-scoped design tokens.
 *
 * Theme: fixed product dark (assigned, not a `dark:` variant of a light default) — zinc-950/900
 * surfaces, `white/10` borders, zinc-50/400 text. Single UI accent = emerald-500/400, used only for
 * emphasis (buttons, active states, focus outline, the bullet-chart actual bars). Semantic status
 * tones (amber/rose) are a separate small set from the brand accent, matching the catalog's
 * "single accent + small semantic set" convention — rose is never used as UI chrome, only as the
 * destructive/high-severity semantic tone.
 *
 * Focus: `focus-visible:outline-*` with no preceding `outline-none` on the same element — verified
 * to actually paint (unlike `ring-*`/`ring-offset-*`, which Tailwind v4 can render fully transparent).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const PAGE_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const INSET_BG = "bg-zinc-950";
export const RAISED_BG = "bg-zinc-800";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG);

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_CAPTION = "text-zinc-400";

/** Numeric/data face — the assigned display mono, applied via inline style (Tailwind arbitrary
 *  class syntax for `font-family` does not reliably survive the allow-list static check, and this
 *  is the pattern already proven safe elsewhere in the catalogue). Pair with `tabular-nums`. */
export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-emerald-400";
export const ACCENT_SOLID = "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:bg-emerald-600";
export const ACCENT_SUBTLE = "bg-emerald-500/15 text-emerald-300";
export const ACCENT_BORDER = "border-emerald-500/30";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";
export const FOCUS_INSET = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

/* Status/tone — feed status badges, KPI pass/fail chips. Always paired with an icon and/or text,
 * never color alone. */
export type Tone = "good" | "warn" | "bad" | "info";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-300", bg: "bg-emerald-500/12", border: "border-emerald-500/25", dot: "bg-emerald-500" },
  warn: { text: "text-amber-300", bg: "bg-amber-500/12", border: "border-amber-500/25", dot: "bg-amber-500" },
  bad: { text: "text-rose-300", bg: "bg-rose-500/12", border: "border-rose-500/25", dot: "bg-rose-500" },
  info: { text: "text-zinc-300", bg: "bg-white/[0.06]", border: "border-white/10", dot: "bg-zinc-400" },
};

export const SEVERITY_TONE: Record<"low" | "medium" | "high", Tone> = {
  low: "info",
  medium: "warn",
  high: "bad",
};

export const STATUS_TONE: Record<
  "approved" | "removed" | "escalated" | "unassigned" | "reinstated" | "overridden",
  Tone
> = {
  approved: "good",
  removed: "bad",
  escalated: "warn",
  unassigned: "info",
  reinstated: "good",
  overridden: "info",
};
