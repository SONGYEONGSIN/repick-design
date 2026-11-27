/**
 * Arbor — route-scoped design tokens (r56 / candidate a).
 *
 * CONCEPT: a rail-less ESG scorecard for repick's secondhand-goods facility network. The
 * dominant surface is a full-width slope chart — one horizontal track per facility, a dot for
 * last quarter's score and a dot for this quarter's score, joined by a line. See SlopeChart.tsx
 * for the target-size fix this route exists to prove out: the two dots are NOT separately
 * interactive. The whole row is one button.
 *
 * THEME: light, pure-white-based (Mercury/Asana-grade), never cream/paper. White cards on a
 * zinc-50 canvas, zinc-200 hairline borders, near-black text on white.
 *
 * ACCENT: lime, split by what sits on it, same discipline as this repo's other single-accent
 * routes (contrast computed by hand, not eyeballed):
 *   lime-700 #4d7c0f → text on white (links, active nav label, "improving" numerals). Contrast
 *     on #ffffff = 4.99:1 — clears AA body text (4.5:1).
 *   lime-800 #3f6212 → solid button fill; white text on top = 7.08:1 (comfortably AAA, the
 *     extra headroom a filled action needs over a text label).
 *   lime-600 #65a30d → decorative only (chart stroke/dot for the "improving" direction, badge
 *     dot). Contrast on white = 3.09:1, which clears the 3:1 floor WCAG 1.4.11 sets for
 *     graphical objects — and it is never the only signal: every improving/declining value is
 *     also paired with an arrow icon and a +/- numeral, never color alone.
 *   lime-50 / lime-100 → subtle fills for "certified" and "improving" badges.
 * Declining and flat stay on plain zinc (no red) — this concept is "near-monochrome, lime used
 * sparingly for the improving direction," not a traffic-light palette.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#65a30d"; // lime-600, decorative stroke/dot
export const ACCENT_HEX_700 = "#4d7c0f"; // lime-700, text-on-white
export const ACCENT_HEX_800 = "#3f6212"; // lime-800, solid-fill contrast target

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 focus-visible:shadow-[0_0_0_3px_rgba(77,124,15,0.18)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-100";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
export const TEXT_AUX = "text-zinc-500"; // floor for white/zinc-50 surfaces
export const TEXT_MUTED = "text-zinc-600"; // floor for tinted surfaces (segment tracks, pills)

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-lime-700";
export const ACCENT_SOLID = "bg-lime-800 text-white hover:bg-lime-900 active:bg-lime-950";
export const ACCENT_SUBTLE = "border border-lime-200 bg-lime-50 text-lime-800";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Direction = "up" | "down" | "flat";

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
