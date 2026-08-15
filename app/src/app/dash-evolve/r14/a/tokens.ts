/**
 * Harborline — route-scoped design tokens. Class constants used only within this route, without
 * touching the global theme.
 *
 * Theme = light-only, pure-white/zinc-50 canvas (never cream/paper). Single UI accent = teal-600 /
 * teal-400(dark helper, unused by default render but kept for completeness), used only for emphasis
 * (primary button, focus outline, selected rail row, active nav pill, chart line). Semantic status
 * tones (rose=urgent/breached, amber=at-risk, emerald=on-track/resolved, sky=informational channel
 * chip) are a separate palette from the UI accent — every semantic tone is always paired with an
 * icon and/or text label, never color alone.
 *
 * Focus: NOT the v3 `ring-2`+`ring-offset-*` idiom — in Tailwind v4 that combination can paint fully
 * transparent. Every interactive element gets a `focus-visible:outline` (or `focus-within:outline`
 * on the rare wrapper-highlighted control) with no preceding `outline-none` to cancel it.
 *
 * Contrast (checked in every state, not just the default render): secondary/caption text on this
 * light canvas is never lighter than zinc-500 on white/zinc-50, and never lighter than zinc-600 on
 * muted/tinted surfaces (segmented-control tracks, filled badge backgrounds). This includes state
 * branches only reachable via filter/sort (e.g. "Unassigned", empty related-tickets state).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-white";
export const CARD_BG = "bg-white";
export const SURFACE_INSET = "bg-zinc-50";
export const SURFACE_MUTED = "bg-zinc-100";
export const BORDER = "border-zinc-200";
export const BORDER_STRONG = "border-zinc-300";
export const DIVIDE = "divide-zinc-200";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-600";
/** Caption/secondary text on white or zinc-50 — zinc-500 floor per light-surface contrast rule. */
export const TEXT_CAPTION = "text-zinc-500";
/** Caption/secondary text sitting on a muted/tinted surface (segmented track, filled chip) — zinc-600 floor. */
export const TEXT_CAPTION_MUTED = "text-zinc-600";

/** Numbers/IDs/timestamps — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Latin display face for the wordmark and hero headline numerals only — never body/Korean text. */
export const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

/* Brand accent — teal. UI chrome only (buttons, active states, focus outlines, selected rows, chart line). */
export const ACCENT_TEXT = "text-teal-700";
export const ACCENT_SOLID = "bg-teal-700 text-white hover:bg-teal-600 active:bg-teal-800";
export const ACCENT_SUBTLE = "bg-teal-50 text-teal-800";
export const ACCENT_BORDER = "border-teal-200";
export const ACCENT_RING = "ring-1 ring-inset ring-teal-200";

/** Default focus-visible: no preceding `outline-none`, so the outline always paints on real Tab. */
export const FOCUS_VISIBLE = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";
/** Inset variant for controls flush against a clipped/rounded edge (table sort buttons, nav rows). */
export const FOCUS_VISIBLE_INSET = "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600";
/** For a wrapper whose focusable child (an <input>) carries its own `outline-none` — the wrapper shows the signal instead. */
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-teal-600";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

export type Tone = "good" | "warn" | "bad" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  warn: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  bad: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
  info: { text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200", dot: "bg-sky-500" },
  neutral: { text: "text-zinc-600", bg: "bg-zinc-100", border: "border-zinc-200", dot: "bg-zinc-400" },
};

export type Priority = "urgent" | "high" | "normal" | "low";
export const PRIORITY_TONE: Record<Priority, Tone> = { urgent: "bad", high: "warn", normal: "info", low: "neutral" };
export const PRIORITY_LABEL: Record<Priority, string> = { urgent: "Urgent", high: "High", normal: "Normal", low: "Low" };
/** Highest-priority-first ordinal, used for real sorting. */
export const PRIORITY_RANK: Record<Priority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

export type Status = "open" | "pending" | "escalated" | "resolved";
export const STATUS_TONE: Record<Status, Tone> = { open: "info", pending: "neutral", escalated: "bad", resolved: "good" };
export const STATUS_LABEL: Record<Status, string> = { open: "Open", pending: "Pending", escalated: "Escalated", resolved: "Resolved" };
