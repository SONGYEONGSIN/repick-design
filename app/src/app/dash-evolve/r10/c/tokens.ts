/**
 * Quorum — route-scoped design tokens. Assigned theme = real light (white/zinc-50 canvas,
 * zinc-200 hairlines, shadow-sm). No cream/paper/sepia surfaces, no skeuomorphic dressing.
 * Contrast rule: secondary/caption text on these light surfaces is always zinc-500 or darker —
 * never zinc-400 — in every state (default, filtered, empty, selected).
 * One restrained brand accent = indigo. Quadrant/status tones stay semantic (emerald/rose/amber)
 * and are always paired with a text label or icon, never color alone.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50";
export const CARD_BG = "bg-white";
export const SURFACE_INSET = "bg-zinc-50";
export const BORDER = "border-zinc-200";
export const BORDER_STRONG = "border-zinc-300";
export const DIVIDE = "divide-zinc-200";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-600";
export const TEXT_CAPTION = "text-zinc-500";

/** Numeric/id alignment — tabular figures on top of the global Pretendard font-sans. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — indigo (restrained, single accent per brief). */
export const ACCENT_TEXT = "text-indigo-600";
export const ACCENT_SOLID = "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700";
export const ACCENT_SUBTLE = "bg-indigo-50 text-indigo-700";
export const ACCENT_RING = "ring-indigo-600";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600";
/** SVG shapes (rect/circle/path) — outline based, renders more reliably than ring utilities on SVG. */
export const SVG_FOCUS = "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* Semantic tone — always paired with an icon or text label, never color-only. */
export type Tone = "up" | "down" | "warn" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  up: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  down: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
  warn: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  info: { text: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500" },
  neutral: { text: "text-zinc-600", bg: "bg-zinc-100", border: "border-zinc-200", dot: "bg-zinc-400" },
};

/** Health×ARR quadrant identity — fixed color + label pairing (never color alone). */
export type QuadrantId = "champions" | "at_risk" | "nurture" | "stable";

export const QUADRANT: Record<
  QuadrantId,
  { label: string; short: string; tone: Tone; dotClass: string; textClass: string; strokeClass: string; tintClass: string; description: string }
> = {
  champions: {
    label: "Champions",
    short: "Champion",
    tone: "up",
    dotClass: "fill-emerald-500",
    textClass: "text-emerald-700",
    strokeClass: "stroke-emerald-500",
    tintClass: "fill-emerald-50",
    description: "High health, high ARR — expansion candidates",
  },
  at_risk: {
    label: "At Risk",
    short: "At risk",
    tone: "down",
    dotClass: "fill-rose-500",
    textClass: "text-rose-700",
    strokeClass: "stroke-rose-500",
    tintClass: "fill-rose-50",
    description: "Low health, high ARR — needs a save plan now",
  },
  nurture: {
    label: "Nurture",
    short: "Nurture",
    tone: "warn",
    dotClass: "fill-amber-500",
    textClass: "text-amber-700",
    strokeClass: "stroke-amber-500",
    tintClass: "fill-amber-50",
    description: "Low health, low ARR — lightweight monitoring",
  },
  stable: {
    label: "Stable",
    short: "Stable",
    tone: "info",
    dotClass: "fill-indigo-500",
    textClass: "text-indigo-700",
    strokeClass: "stroke-indigo-500",
    tintClass: "fill-indigo-50",
    description: "High health, low ARR — steady, low-touch",
  },
};
