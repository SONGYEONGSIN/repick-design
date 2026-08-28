/**
 * Ridge — route-scoped design tokens (r20 / candidate a).
 *
 * Reassigned from the reassign-queue: this is the cohort-triangle-matrix + baseline-row-pin form
 * that lost `auto-dash-r18/c` (as "Trellis") solely to all-Korean copy, not to its design — see
 * `vault/00-principles/reassign-queue.md` item 2. This build re-does the same mechanism in English
 * copy with exactly 3 rendered font weights.
 *
 * THEME: real product DARK (n8n/Coinbase-grade), not the theatrical kind. zinc-950 canvas, zinc-900
 * cards, hairline borders at white/10, no glow/scanline/grain.
 *
 * ACCENT: single rose, split by what sits on it —
 *   rose-400 #fb7185 → 7.39:1 on zinc-950. Carries text: active nav, links, focus rings.
 *   rose-600 #e11d48 → decorative-only (dot marks, thin bars) — well clear of the 3:1 floor, never
 *     asked to carry a letterform.
 * Matrix cell fills are their own small ramp (see below) — every fill is picked so the white percent
 * label sitting on top of it clears 4.5:1 against the *actual* hex, not an assumed Tailwind step.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#fb7185";

/** House focus token — never preceded by a bare `outline-none`, never `ring`+`ring-offset` (fully
 *  transparent in Tailwind v4). */
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 focus-visible:shadow-[0_0_0_3px_rgba(251,113,133,0.25)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const BORDER_SOFT = "border-white/[0.06]";
export const SURFACE_INSET = "bg-white/[0.04]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Dark-surface auxiliary floor — never step below zinc-400 on this theme. */
export const TEXT_AUX = "text-zinc-400";
export const TEXT_MUTED = "text-zinc-300";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-rose-400";
export const ACCENT_MARK = "text-rose-500";
export const ACCENT_SOLID = "bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900";
export const ACCENT_SUBTLE = "border border-rose-800/60 bg-rose-950/40 text-rose-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.035]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

/**
 * Absolute retention ramp (no baseline pinned) — muted zinc for weak cohorts rising to saturated
 * rose for strong ones. Every fill's white-on-it ratio (computed against the literal hex):
 *   zinc-700 10.44 · zinc-600 7.73 · rose-800 8.02 · rose-700 6.29
 */
export const RETENTION_BANDS = [
  { max: 40, fill: "#3f3f46", label: "Weak (<40%)" },
  { max: 65, fill: "#52525b", label: "Watch (40–65%)" },
  { max: 85, fill: "#9f1239", label: "Healthy (65–85%)" },
  { max: Infinity, fill: "#be123c", label: "Excellent (85%+)" },
] as const;

/**
 * Diverging ramp used only once a baseline row is pinned — negative (below baseline) in rose,
 * positive (above baseline) in sky, near-zero in neutral zinc. White-on-it ratios: rose-700 6.29 ·
 * rose-800 8.02 · zinc-700 10.44 · sky-800 7.56 · sky-700 5.93.
 */
export const BASELINE_BANDS = [
  { max: -10, fill: "#be123c", label: "≥10pp below baseline" },
  { max: -3, fill: "#9f1239", label: "3–10pp below baseline" },
  { max: 3, fill: "#3f3f46", label: "Within 3pp of baseline" },
  { max: 10, fill: "#075985", label: "3–10pp above baseline" },
  { max: Infinity, fill: "#0369a1", label: "≥10pp above baseline" },
] as const;
