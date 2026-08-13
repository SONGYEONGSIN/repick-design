/**
 * Runsheet — route-scoped design tokens. Dark-only surface (product dark, per this round's
 * assignment) — no `dark:` variants because there is no light mode to vary from. Single UI accent
 * = orange-400/500, used only for emphasis (buttons, active states, focus rings, the "scheduled"
 * status, and the calendar's filter-matched state). Channel identity on the calendar is carried by
 * icon shape, never by hue, so the one accent stays singular.
 * Contrast floor (checked in every state, not just the default render): secondary/caption text on
 * this dark surface is never lighter than zinc-400 — including filter-dimmed and empty states.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950";
export const SURFACE_RAISED = "bg-zinc-800";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_CAPTION = "text-zinc-400";

/** For numbers/counts/times — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Headline/wordmark-scale latin text only — the one whitelisted display face this round.
 * Applied via inline style (not a Tailwind arbitrary class) so `var(--font-display-mono)` — declared
 * on plain `:root` outside `@theme inline` — resolves at runtime instead of being inlined away. */
export const DISPLAY_FONT_STYLE = { fontFamily: "var(--font-display-mono)" };

/* Brand accent — orange-400/500. UI chrome + the "scheduled" domain status only. */
export const ACCENT_TEXT = "text-orange-400";
export const ACCENT_SOLID = "bg-orange-500 text-zinc-950 hover:bg-orange-400 active:bg-orange-600";
export const ACCENT_SUBTLE = "bg-orange-500/12 text-orange-300";
export const ACCENT_BORDER = "border-orange-500/30";

export const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

/** Status tone — deliberately neutral for every status except "scheduled" (single-accent principle).
 * Always paired with an icon + label, never color alone. */
export const STATUS_TONE: Record<string, { text: string; bg: string; border: string }> = {
  idea: { text: "text-zinc-400", bg: "bg-white/[0.04]", border: "border-white/10" },
  draft: { text: "text-zinc-300", bg: "bg-white/[0.05]", border: "border-white/10" },
  review: { text: "text-zinc-100", bg: "bg-white/[0.07]", border: "border-white/15" },
  scheduled: { text: "text-orange-300", bg: "bg-orange-500/12", border: "border-orange-500/25" },
  published: { text: "text-zinc-100", bg: "bg-white/[0.09]", border: "border-white/15" },
};
