/**
 * Crewline — route-scoped design tokens. Light theme only (assigned this round): pure white/zinc-50
 * canvas, never cream/paper. Single UI accent = amber-700 (solid fills) / amber-600 (focus outline,
 * bar fill) — used only for emphasis (primary button, active nav pill, focus ring, selection state).
 * amber-600 on white text fails small-text AA (~3.9:1, see colors.catalog "3:1 보정" note), so solid
 * filled buttons use amber-700 for the fill, not amber-600.
 *
 * Job status is a *separate* semantic palette from the UI accent (zinc/teal/emerald/red), always
 * paired with an icon, never color alone, and never reusing amber so the single-accent meaning of
 * amber (this is the product's brand color / interactive affordance) never gets confused with a
 * status meaning.
 *
 * Contrast rule enforced everywhere, including states only reachable via filter/toggle (empty
 * results, "no jobs" cells): secondary text is never lighter than zinc-500 on a white/zinc-50
 * surface, and never lighter than zinc-600 on a tinted surface (zinc-100+, amber-50, status tints).
 *
 * Focus visibility: every focusable element uses `outline` (never `ring`) with no preceding
 * `outline-none` on the same element — Tailwind v4 can paint `ring` fully transparent, and a later
 * `outline-none` cancels an earlier `focus-visible:outline`. This file never emits either footgun.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-white";
export const CARD_BG = "bg-white";
export const SURFACE_INSET = "bg-zinc-50";
export const BORDER = "border-zinc-200";
export const DIVIDE = "divide-zinc-200";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900";
/** Safe on pure white / zinc-50 surfaces only (AA-verified floor for that surface tone). */
export const TEXT_CAPTION = "text-zinc-500";
/** Safe on tinted surfaces (zinc-100+, amber-50, status tints) — the higher floor those require. */
export const TEXT_CAPTION_MUTED = "text-zinc-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — amber. UI chrome only (button, active states, focus outline, selection). */
export const ACCENT_TEXT = "text-amber-700";
export const ACCENT_SOLID = "bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-800";
export const ACCENT_SUBTLE = "bg-amber-50 text-amber-800";
export const ACCENT_BORDER = "border-amber-200";
export const ACCENT_FILL = "bg-amber-500";

export const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600";
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-amber-600";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100";
export const HOVER_ROW = "hover:bg-zinc-50/70";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-[width] duration-200 ease-out motion-reduce:transition-none";

/* Job-status tone — independent of the amber UI accent. Always paired with an icon. */
export type StatusTone = { text: string; bg: string; border: string; dot: string };

export const STATUS_TONE: Record<"scheduled" | "in-progress" | "completed" | "unassigned", StatusTone> = {
  scheduled: { text: "text-zinc-700", bg: "bg-zinc-100", border: "border-zinc-200", dot: "bg-zinc-500" },
  "in-progress": { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-500" },
  completed: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  unassigned: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
};
