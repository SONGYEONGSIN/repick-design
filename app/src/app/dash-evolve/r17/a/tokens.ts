/**
 * Backhaul — route-scoped design tokens. Class constants used only within this route.
 *
 * Theme = dark, product-grade (refined, never theatrical — no glow, scanlines, grain or glossy
 * chrome). Canvas zinc-950, cards zinc-900, hairline borders white/10, primary text zinc-50,
 * auxiliary text floors at zinc-400 (zinc-500/600 measure ~3.5-4.1:1 on this canvas and fail AA —
 * the `no-dark-dim-text` floor). That floor applies to EVERY state branch, including text only
 * reachable through the SLA filter, the inspector's second tab, or the command palette.
 *
 * Single UI accent = INDIGO, used in exactly two steps and never to encode a status:
 *   - ACCENT_BRIGHT #818cf8 (indigo-400) for small text, icons, chart strokes and focus outlines.
 *     Measured 6.67:1 on zinc-950 and 5.94:1 on zinc-900 — both clear of the 4.5:1 body floor.
 *   - ACCENT_FILL   #4f46e5 (indigo-600) for text-bearing fills, which carry WHITE text at 6.29:1.
 *     indigo-500 was rejected: white on #6366f1 measures 4.46:1, i.e. it fails outright, and the
 *     catalogue convention is to jump a whole step rather than land on a barely-passing value.
 *     Hover therefore goes DARKER (indigo-700, 7.90:1) instead of brighter — a brighter hover would
 *     have dropped the label under AA in a state the gate never scans.
 * Status meaning (on-track / at-risk / breached) lives in a SEPARATE semantic palette and is always
 * paired with an icon and a word, never carried by colour alone.
 *
 * Focus: the `ring-*`+`ring-offset-*` idiom paints fully transparent in Tailwind v4, and an
 * `outline-none` placed before a `focus-visible:outline` cancels it. Neither appears here. Every
 * interactive element — including ones only reachable after opening the ⌘K palette, the mobile
 * drawer, a dropdown or the inspector's second tab — carries FOCUS or its inset variant.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ Surfaces */

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950/60";
export const SURFACE_MUTED = "bg-zinc-800/60";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/20";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-black/30");

/* ---------------------------------------------------------------- Typography */

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Caption/auxiliary floor on this dark canvas — never zinc-500/600. */
export const TEXT_CAPTION = "text-zinc-400";

/** Numbers, IDs and durations — tabular fixed width on top of the global Pretendard body face. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** 11px uppercase micro-label, one tracking value everywhere it appears. */
export const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.08em]";

/* -------------------------------------------------------------------- Accent */

export const ACCENT_BRIGHT_HEX = "#818cf8"; // indigo-400
export const ACCENT_FILL_HEX = "#4f46e5"; // indigo-600
export const ACCENT_DEEP_HEX = "#312e81"; // indigo-900, non-text flow fill only

export const ACCENT_TEXT = "text-indigo-400";
export const ACCENT_SOLID = "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800";
export const ACCENT_SUBTLE = "bg-indigo-400/10 text-indigo-300";
export const ACCENT_BORDER = "border-indigo-400/40";

/* --------------------------------------------------------------------- Focus */

/** Canonical focus ring for this round. No `outline-none` anywhere before it. */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#818cf8] focus-visible:shadow-[0_0_0_3px_rgba(129,140,248,0.3)]";
/** Same ring, drawn inside the element — for controls flush against a rounded/clipped edge. */
export const FOCUS_INSET =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#818cf8] focus-visible:shadow-[0_0_0_3px_rgba(129,140,248,0.3)]";

/* -------------------------------------------------------------------- Motion */

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/5";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/* --------------------------------------------------------------- Status tone */

export type Tone = "good" | "warn" | "bad" | "neutral" | "accent";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  good: { text: "text-emerald-300", bg: "bg-emerald-400/10", border: "border-emerald-400/30", dot: "bg-emerald-400" },
  warn: { text: "text-orange-300", bg: "bg-orange-400/10", border: "border-orange-400/30", dot: "bg-orange-400" },
  bad: { text: "text-red-300", bg: "bg-red-400/10", border: "border-red-400/30", dot: "bg-red-400" },
  neutral: { text: "text-zinc-300", bg: "bg-zinc-800/70", border: "border-white/10", dot: "bg-zinc-400" },
  accent: { text: "text-indigo-300", bg: "bg-indigo-400/10", border: "border-indigo-400/30", dot: "bg-indigo-400" },
};

/** SLA state of a held unit. Always rendered as icon + word + colour, never colour alone. */
export type SlaState = "on-track" | "at-risk" | "breached";

export const SLA_LABEL: Record<SlaState, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  breached: "Breached",
};

export const SLA_TONE: Record<SlaState, Tone> = {
  "on-track": "good",
  "at-risk": "warn",
  breached: "bad",
};
