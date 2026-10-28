/**
 * Inboxline — route-scoped design tokens (auto-dash-r50 / candidate b).
 *
 * THEME: refined product DARK. Canvas zinc-950 (#09090b), raised surfaces zinc-900 (#18181b),
 * hairlines white/10, body text zinc-50, auxiliary text floors at zinc-400 — never zinc-500/600,
 * which is the exact pair `no-dark-dim-text` forbids, and the house rule applies that same floor to
 * every base class here (not only a `dark:` variant) because the whole route is dark. No glow, no
 * scanlines, no grain — shadows are omitted almost entirely in favour of 1px white/10 borders, the
 * way n8n and Coinbase's own consoles separate surfaces.
 *
 * ACCENT: a single lime, split by what sits on it —
 *   lime-400 #a3e635 solid fill + zinc-950 text → 13.3:1. Primary button, focus ring, the one
 *     "healthy" ribbon (Gmail, the best-performing provider — reusing the brand hue for the best
 *     status keeps the single-accent rule intact instead of inventing a second green).
 *   lime-400 as TEXT on zinc-900/950 → 10–11:1. Active nav pill, links, the pinned-provider tag.
 * Used sparingly: one primary button, one active nav state, one focus ring colour, one ribbon out
 * of four. Everything else in the chart is a neutral categorical ramp (sky / amber / zinc) because
 * a dominant trend chart needs real hue separation between series and a single accent cannot carry
 * four categories — see candidate concept doc, "Brief gaps" §1.
 *
 * PATTERN-CODING (not colour alone): every ribbon also carries a distinct SVG hatch fill (angle +
 * density) and a distinct top-edge stroke-dasharray, defined in StreamGraph.tsx next to the paths
 * that use them — kept out of this token file because they are geometry, not colour.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#a3e635";

/** The exact house focus token — never preceded by a bare `outline-none` that could cancel it,
 *  never `ring` + `ring-offset` (fully transparent in Tailwind v4). */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 focus-visible:shadow-[0_0_0_3px_rgba(163,230,53,0.25)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const BORDER_SOFT = "border-white/[0.06]";
export const SURFACE_INSET = "bg-white/[0.04]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-200";
/** Auxiliary floor, dark surface. Never step below this — page-brief-core §2. */
export const TEXT_AUX = "text-zinc-400";
/** Same floor; used on inset / tinted surfaces for parity with TEXT_AUX. */
export const TEXT_MUTED = "text-zinc-400";

/** Numbers, dates, rates, volumes — fixed-width figures on top of Pretendard. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-lime-400";
export const ACCENT_SOLID = "bg-lime-400 text-zinc-950 hover:bg-lime-300 active:bg-lime-500";
export const ACCENT_SUBTLE = "border border-lime-400/30 bg-lime-400/10 text-lime-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";
export const TRANSITION_ALL = "transition-all duration-200 ease-out motion-reduce:transition-none";

/** Deliverability letter grade — one function feeds every badge, so a rate and its grade can never
 *  be hand-typed out of sync (page-brief-core §3: "numbers that imply a relationship must agree"). */
export type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

export function gradeForRate(rate: number): Grade {
  if (rate >= 97) return "A+";
  if (rate >= 93) return "A";
  if (rate >= 88) return "B";
  if (rate >= 80) return "C";
  if (rate >= 70) return "D";
  return "F";
}

export const GRADE_BADGE: Record<Grade, string> = {
  "A+": "border border-lime-400/30 bg-lime-400/10 text-lime-300",
  A: "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  B: "border border-sky-400/30 bg-sky-400/10 text-sky-300",
  C: "border border-amber-400/30 bg-amber-400/10 text-amber-300",
  D: "border border-orange-400/30 bg-orange-400/10 text-orange-300",
  F: "border border-rose-400/30 bg-rose-400/10 text-rose-300",
};
