/**
 * Corridor — route-scoped design tokens (r19 / candidate a).
 *
 * THEME: real light. Canvas is pure white (`bg-white`), inset surfaces are `zinc-50`, hairlines are
 * `zinc-200`, cards are white with `shadow-sm` — no cream/paper tint anywhere. Body text is
 * `zinc-900`; the caption floor is tone-conditional per page-brief-core: `zinc-500` is only safe on
 * a white/zinc-50 surface (measured 4.83:1), `zinc-600` is the floor on any tinted surface (sky
 * tints, status tints) because `zinc-500` on those measures under 4.5:1.
 *
 * ACCENT: a single sky. `sky-700` (#0369a1, 5.93:1 on white) is the only accent used for TEXT/ICONS
 * so it clears small-text AA — `sky-600` alone measures 4.10:1 on white and fails. `sky-700` is also
 * the only accent FILL that carries white text (5.93:1); `sky-600` fails that pairing too (4.10:1).
 * The same hue doubles as the calendar heat scale (charts.catalog treats a single-hue sequential
 * ramp as a legitimate accent use, not a second accent) — heat tiers only ever go from `sky-50` to
 * `sky-300`, which is pale enough that `zinc-900` text over it never needs re-checking.
 *
 * STATUS is a separate semantic channel from the accent, on purpose — reusing sky for booking
 * status would blur "this is the product's interactive color" with "this booking needs review".
 * Every status pairs an icon with the color (never color alone): confirmed = emerald-700 check,
 * pending = amber-700 clock, conflict = rose-700 triangle. All three measured >=5:1 on white.
 *
 * FOCUS: a real `focus-visible:outline` (width + offset + color), never the `ring`/`ring-offset`
 * idiom (Tailwind v4 paints that fully transparent). `outline-none` is deliberately NOT included
 * here at all — this codebase's Tailwind v4 build resolves `outline-style` through a single
 * `--tw-outline-style` custom property, so an `outline-none` class earlier in the same element's
 * class list sets that property to `none` and the later `focus-visible:outline` never overrides it
 * back, leaving the element with a real outline color/width but no visible ring at all (confirmed
 * against this route's actual gate run). The fix is to just not emit `outline-none` in the first
 * place, which is what every focusable element in this route does. Secondary text floors hold in
 * every reachable state, including filter/sort results and the empty day cell, not just the first
 * render.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-white";
export const PANEL_BG = "bg-white";
export const SURFACE_INSET = "bg-zinc-50";
export const BORDER = "border-zinc-200";
export const DIVIDE = "divide-zinc-200";

export const CARD = cx("rounded-2xl border", BORDER, "bg-white shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
/** Safe on pure white / zinc-50 only (4.83:1 measured). */
export const TEXT_CAPTION = "text-zinc-500";
/** Floor for any tinted surface — sky tints, status tints, muted fills (measured requirement). */
export const TEXT_CAPTION_MUTED = "text-zinc-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — sky. Chrome + calendar heat scale only, never a status meaning. */
export const ACCENT_TEXT = "text-sky-700";
export const ACCENT_SOLID = "bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-900";
export const ACCENT_SUBTLE = "border border-sky-200 bg-sky-50 text-sky-700";
export const ACCENT_BORDER = "border-sky-300";
export const ACCENT_FILL = "bg-sky-600";

export const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";
export const FOCUS_WITHIN = "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-600";

export const HOVER_BG = "hover:bg-zinc-50 active:bg-zinc-100";
export const HOVER_ROW = "hover:bg-zinc-50/70";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_SIZE = "transition-[width,height] duration-200 ease-out motion-reduce:transition-none";

export type BookingStatus = "confirmed" | "pending" | "conflict";

export type StatusTone = { text: string; bg: string; border: string; dot: string };

export const STATUS_TONE: Record<BookingStatus, StatusTone> = {
  confirmed: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-600" },
  pending: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-600" },
  conflict: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-600" },
};

export const STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  conflict: "Conflict",
};

/** Sequential heat scale for the calendar's own value (never used for status). Pale end first —
 *  all five tiers keep `zinc-900` text well above AA, so no per-tier contrast check is needed. */
export const HEAT_TIERS = ["bg-white", "bg-sky-50", "bg-sky-100", "bg-sky-200", "bg-sky-300"] as const;

export function heatTier(pct: number): string {
  if (pct <= 0) return HEAT_TIERS[0];
  if (pct < 34) return HEAT_TIERS[1];
  if (pct < 67) return HEAT_TIERS[2];
  if (pct < 100) return HEAT_TIERS[3];
  return HEAT_TIERS[4];
}

/** Rounds generated coordinates to 2 decimals — determinism gate requirement. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
