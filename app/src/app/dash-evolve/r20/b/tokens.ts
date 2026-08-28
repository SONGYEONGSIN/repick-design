/**
 * Fathom — route-scoped design tokens (r20 / candidate b).
 *
 * THEME: dark (n8n/Coinbase-grade). zinc-950 canvas, zinc-900 cards, hairline borders white/10.
 *
 * ACCENT: single blue, split by what sits on it —
 *   blue-400 #60a5fa → 7.83:1 on zinc-950. Carries text: active nav, links, focus rings.
 *   blue-600 #2563eb → decorative-only (chart line stroke, hover marks).
 * Up/down price semantics are graphical objects (candle bodies, arrows), not carried text, so they
 * only need the 3:1 non-text floor — both emerald-500/rose-500 clear it by a wide margin against
 * zinc-950. Every place an up/down reading is carried as small on-fill TEXT uses the same verified
 * 700-step hexes as the bullet/status system below (white-on-it ≥4.5:1 against the literal hex).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#60a5fa";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:shadow-[0_0_0_3px_rgba(96,165,250,0.25)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-white/[0.04]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_AUX = "text-zinc-400";
export const TEXT_MUTED = "text-zinc-300";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-blue-400";
export const ACCENT_SOLID = "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900";
export const ACCENT_SUBTLE = "border border-blue-800/60 bg-blue-950/40 text-blue-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.035]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/** Up/down — color + icon direction, never color alone (ux-guidelines "색만으로 전달 금지"). */
export const UP_TEXT = "text-emerald-400";
export const DOWN_TEXT = "text-rose-400";
export const UP_FILL = "#059669"; // candle body stroke/fill, graphical (3:1 floor)
export const DOWN_FILL = "#e11d48";
