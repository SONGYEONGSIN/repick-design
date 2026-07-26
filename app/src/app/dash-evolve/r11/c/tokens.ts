/**
 * Sourcemark — route-scoped design tokens. Class constants used only within this route,
 * without touching the global theme.
 *
 * Assigned palette: CRM & Client (colors.catalog) — real light (white/zinc-50 canvas, zinc-200
 * hairline borders, zinc-900/600/500 text) with a refined product-dark variant (zinc-950/900
 * surfaces, white/10 borders, zinc-50/300/400 text). No cream/paper/sepia, no skeuomorphic
 * ornamentation.
 *
 * Single-accent principle:
 * - `primary` (blue #2563EB) is UI chrome ONLY — buttons, links, focus rings, active nav/toggle
 *   states, checked selection controls. It never signals a domain value judgement.
 * - `accent` (emerald #059669, the catalog's "deal green") is the ONE emphasis color, reserved
 *   for a single domain signal: supplier trust/quality (the "Verified" badge and top-rated score).
 *   It is always paired with an icon + text label, never color alone.
 * Everything else is neutral zinc/slate.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------- Surfaces */
export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const SIDEBAR_BG = "bg-white dark:bg-zinc-950";
export const TOPBAR_BG = "bg-white dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-50 dark:bg-zinc-950";
export const SURFACE_RAISED = "bg-zinc-100 dark:bg-zinc-800";

export const BORDER = "border-zinc-200 dark:border-white/10";
export const BORDER_STRONG = "border-zinc-300 dark:border-white/15";
export const DIVIDE = "divide-zinc-200 dark:divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-zinc-900/5 dark:shadow-black/30");

/* ------------------------------------------------------------------ Text
 * Caption/secondary tokens hold the floor at zinc-500 (light) / zinc-400 (dark) in every state
 * branch — including filter-only-reachable states (empty results, unverified, disabled) — per
 * the recurring AA-contrast defect called out in ux-guidelines.catalog. */
export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** For aligning numbers/IDs — fixed tabular width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* -------------------------------------------------- Primary (blue chrome) */
export const PRIMARY_SOLID = cx(
  "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700",
  "dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 dark:active:bg-blue-600",
);
export const PRIMARY_SUBTLE = "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
export const PRIMARY_TEXT = "text-blue-600 dark:text-blue-400";
export const PRIMARY_BORDER = "border-blue-600 dark:border-blue-400";

/* --------------------------------------------- Accent (emerald emphasis) */
export const ACCENT_TEXT = "text-emerald-700 dark:text-emerald-400";
export const ACCENT_SUBTLE = "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
export const ACCENT_SOLID = "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950";
export const ACCENT_BORDER = "border-emerald-200 dark:border-emerald-500/25";

export const FOCUS_RING = cx(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
);
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-white/5 dark:active:bg-white/10";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_MOTION = "transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none";
