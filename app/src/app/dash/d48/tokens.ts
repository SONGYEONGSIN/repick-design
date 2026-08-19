/**
 * Parhelion — route-scoped design tokens. Class constants used only within this route.
 *
 * Theme = light, product-grade (真 라이트: white/zinc-50 canvas, never cream/paper). Canvas
 * zinc-50, cards white + border-zinc-200 + shadow-sm, hairline borders zinc-200 (per dash-brief-v3
 * "라이트: 흰 캔버스, 카드 white + border-zinc-200 + shadow-sm"). Single UI accent = teal-600
 * (chrome/brand only: buttons, focus outline, selected picker row, active nav pill, chart line,
 * focused-metric highlight). Semantic status tones (emerald=operational, amber=degraded,
 * rose=outage) are a SEPARATE palette from the UI accent — every status is always paired with an
 * icon and a text label, never color alone. Teal chosen deliberately over indigo/violet — violet
 * is the single most overrepresented catalog accent and is banned for this round.
 *
 * Focus: NOT the `ring-2`+`ring-offset-*` idiom (paints fully transparent in Tailwind v4). Every
 * interactive element gets `focus-visible:outline` with no preceding `outline-none` that could
 * cancel it, including controls only reachable after opening the ⌘K palette or a dropdown.
 *
 * Contrast floors (state-branch aware): on white/zinc-50 surfaces, caption text floors at
 * zinc-500 (AA at that tone is only safe on near-white). On muted/tinted surfaces — segmented
 * control tracks, table header row, filter chips — caption text floors at zinc-600 instead
 * (zinc-500 on zinc-100 measures ~4.34:1, under the 4.5:1 body floor). This applies to every
 * state branch, including text only reachable via the status filter or metric-focus toggle.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50";
export const CARD_BG = "bg-white";
export const SURFACE_MUTED = "bg-zinc-100";
export const SURFACE_INSET = "bg-zinc-50";
export const BORDER = "border-zinc-200";
export const BORDER_STRONG = "border-zinc-300";
export const DIVIDE = "divide-zinc-200";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-zinc-950/[0.03]");

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
/** Caption/secondary text on near-white surfaces — zinc-500 floor (no-dark-dim-text's light-mode counterpart). */
export const TEXT_CAPTION = "text-zinc-500";
/** Caption text on muted/tinted surfaces (segment tracks, table header, filter chips) — zinc-600 floor. */
export const TEXT_CAPTION_MUTED = "text-zinc-600";

/** Numbers/IDs/timestamps — tabular fixed width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — teal. UI chrome only (buttons, active states, focus outlines, selected rows,
   chart line, focused-metric highlight ring). Never used to encode status — status uses the
   separate semantic TONE palette below, always paired with an icon and a text label. */
export const ACCENT_TEXT = "text-teal-700";
/* Resting fill is teal-700, not teal-600: white-on-teal-600 measures ~3.74:1 (fails the 4.5:1 body
   floor) while white-on-teal-700 measures ~5.47:1 with real margin — the same "jump a full step,
   not to a barely-passing 4.53" fix already used for rose fills elsewhere in the catalog. */
export const ACCENT_SOLID = "bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900";
export const ACCENT_SUBTLE = "bg-teal-50 text-teal-800 border border-teal-200";
export const ACCENT_RING = "ring-2 ring-teal-500/40 border-teal-300";
export const ACCENT_LINE = "#0d9488"; // teal-600, used directly in generated SVG strokes

/** Default focus-visible: no preceding `outline-none`, so the outline always paints on real Tab. */
export const FOCUS_VISIBLE = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";
/** Inset variant for controls flush against a clipped/rounded edge (table sort buttons, nav rows, list rows). */
export const FOCUS_VISIBLE_INSET = "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600";
/** For a wrapper whose focusable child (an <input>) carries its own `outline-none` — the wrapper shows the signal instead. */
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-teal-600";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_TRANSFORM = "transition-transform duration-200 ease-out motion-reduce:transition-none";

export type Tone = "good" | "warn" | "bad" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  warn: { text: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  bad: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
  neutral: { text: "text-zinc-600", bg: "bg-zinc-100", border: "border-zinc-200", dot: "bg-zinc-400" },
};

export type ServiceStatus = "operational" | "degraded" | "outage";
export const STATUS_LABEL: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
};
export const STATUS_TONE: Record<ServiceStatus, Tone> = {
  operational: "good",
  degraded: "warn",
  outage: "bad",
};
