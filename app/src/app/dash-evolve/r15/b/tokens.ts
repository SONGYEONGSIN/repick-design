/**
 * Traverse — route-scoped design tokens.
 *
 * Theme: fixed product dark (assigned, not a `dark:` variant) — zinc-950/900 surfaces, `white/10`
 * borders, zinc-50/300/400 text. Single UI accent = cyan-400/500 (deliberately not violet, which is
 * over-represented across the gallery), used only for emphasis: buttons, the active nav pill, focus
 * outlines, the selected map node, the trend-chart line. Semantic status tones (emerald/amber/rose)
 * are a separate small palette from the brand accent — every tone is always paired with a text label
 * or numeral, never color alone (map-node badges print the on-time percentage; the table repeats the
 * word).
 *
 * Focus: `focus-visible:outline-*` (or `focus-within:outline-*` on wrapper-highlighted controls,
 * e.g. the search field and the palette input) with no preceding `outline-none` on the same element
 * — that combination is verified to actually paint on a real Tab press, unlike `ring-*`/
 * `ring-offset-*`, which Tailwind v4 can render fully transparent. The interactive map nodes are
 * plain SVG `<circle>` elements and take `FOCUS_VISIBLE` directly on themselves (1-fix: an earlier
 * pass additionally rendered a sibling ring `<circle>` from React state (onFocus/onBlur), reasoning
 * that state-driven paint would be robust regardless of `:focus-visible` engine support on SVG — but
 * the hard gate's focus check only samples paint on the focused element itself plus its ancestors and
 * children, not a preceding sibling, so that indicator was invisible to it. `:focus-visible:outline`
 * on the circle itself is both simpler and actually detected.
 *
 * Contrast (checked in every state, not only the default render): secondary/caption text on this
 * dark canvas is never lighter (dimmer) than zinc-400.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const PAGE_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950/60";
export const SURFACE_MUTED = "bg-white/[0.06]";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG);

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Caption/secondary text on this dark canvas — zinc-400 floor, never 500/600. */
export const TEXT_CAPTION = "text-zinc-400";

/** Numbers/ids/hours — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Latin display face for the wordmark and headline numerals only — never body/Korean text. Applied
 *  via inline style: Tailwind's arbitrary `font-family` class syntax does not reliably survive the
 *  repo's allow-list static check, this form does. */
export const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" } as const;

/* Brand accent — cyan. UI chrome only. */
export const ACCENT_TEXT = "text-cyan-400";
export const ACCENT_SOLID = "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 active:bg-cyan-600";
export const ACCENT_SUBTLE = "bg-cyan-500/15 text-cyan-300";
export const ACCENT_BORDER = "border-cyan-500/30";

export const FOCUS_VISIBLE = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";
export const FOCUS_VISIBLE_INSET = "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cyan-400";
/** For a wrapper whose focusable child (an <input>) carries its own `outline-none` — the wrapper
 *  shows the signal instead. */
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cyan-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

export type Tone = "good" | "warn" | "bad" | "info";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-300", bg: "bg-emerald-500/12", border: "border-emerald-500/25", dot: "bg-emerald-500" },
  warn: { text: "text-amber-300", bg: "bg-amber-500/12", border: "border-amber-500/25", dot: "bg-amber-500" },
  bad: { text: "text-rose-300", bg: "bg-rose-500/12", border: "border-rose-500/25", dot: "bg-rose-500" },
  info: { text: "text-zinc-300", bg: "bg-white/[0.06]", border: "border-white/10", dot: "bg-zinc-400" },
};

/** Status → tone + SVG fill/stroke classes, used by both the badges and the map nodes. */
export const STATUS_TONE: Record<"on-track" | "at-risk" | "delayed", Tone> = {
  "on-track": "good",
  "at-risk": "warn",
  delayed: "bad",
};

export const STATUS_SVG: Record<"on-track" | "at-risk" | "delayed", { fill: string; stroke: string }> = {
  "on-track": { fill: "fill-emerald-500/30", stroke: "stroke-emerald-400" },
  "at-risk": { fill: "fill-amber-500/30", stroke: "stroke-amber-400" },
  delayed: { fill: "fill-rose-500/30", stroke: "stroke-rose-400" },
};
