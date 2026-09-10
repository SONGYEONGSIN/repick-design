/**
 * Design tokens — r21 / candidate a, "Provenance Scrubber".
 *
 * THEME: light (assigned this round). Paper-toned near-white ground (`#FAFAF9`) with true-white
 * card surfaces on top, so the console card reads as a distinct raised layer — the same separation
 * technique used elsewhere in this catalogue (r19/b), just with this route's own accent.
 *
 * ACCENT: lime (assigned this round, for catalogue-hue variety). A stock Tailwind lime reads too
 * bright to carry small text reliably — lime-500 `#84CC16` on white is only 1.98:1, lime-600
 * `#65A30D` only 3.09:1 — so this route uses one custom, slightly deepened lime, `#467410`,
 * everywhere the accent needs to hold text, a fill, or a non-text UI boundary. Computed with the
 * WCAG relative-luminance formula (not eyeballed):
 *
 *   #467410 vs #FFFFFF (white)      = 5.58:1  → passes AA for BODY-SIZED text in both directions
 *                                                (white text on an accent fill, or accent-colored
 *                                                text directly on the white/paper page)
 *   #467410 vs #FAFAF9 (page paper) = 5.34:1  → passes AA body text on the page ground
 *   #467410 vs #18181B (dark ink)   = 3.18:1  → clears the LARGE-text-only floor (3:1), not body AA
 *                                                — dark ink on an accent fill is used only for
 *                                                ≥24px/≥19px-bold text or non-text (never small
 *                                                text), matching the house rule for accent-on-fill.
 *   #467410 vs #E4E4E7 (zinc-200)   = 4.39:1  → clears the 3:1 non-text UI-boundary floor for the
 *                                                progress-fill-vs-track edge on the scrubber.
 *
 * Because the white-on-fill number above (5.58:1) already clears body-text AA with real margin, this
 * route uses exactly ONE accent hex everywhere (fills, borders, focus rings, small accent-colored
 * text on the page) rather than needing a separate light "text-safe tint" the way the violet default
 * does — the arithmetic happens to work out that way for this particular lime, it isn't a shortcut.
 * Full numbers are repeated in candidates/a.md.
 */

import type { CSSProperties } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#467410";
export const ACCENT_TEXT = "text-[#467410]";
export const ACCENT_BORDER = "border-[#467410]";
/** Fill + WHITE text — verified 5.58:1, the only accent-on-fill text color this route uses. */
export const ACCENT_SOLID = "bg-[#467410] text-white hover:bg-[#3B600D] active:bg-[#325009]";
export const ACCENT_TINT = "border border-[#DCE9C7] bg-[#F1F7E6] text-[#467410]";
export const ACCENT_DOT = "bg-[#467410]";

export const PAGE_BG = "#FAFAF9";
export const CARD_BG = "#FFFFFF";
export const TRACK_BG = "#E4E4E7"; // zinc-200
export const BORDER = "border-zinc-200";

export const INK = "text-zinc-900";
export const BODY_TXT = "text-zinc-700";
/** zinc-600 only, on every surface (never zinc-500) — this route mixes near-white and tinted
 * (zinc-100/badge-track) surfaces throughout, and zinc-600 clears the stricter 4.5:1 floor on both
 * (7.73:1 on white, 7.40:1 on the page paper) rather than tracking which floor applies tile by tile
 * — the same simplification r19/b's tokens file used, and for the same reason. */
export const MUTED = "text-zinc-600";

// Visible-focus idiom: a real painted outline + a solid, colour-explicit box-shadow. Never bare
// `ring-*` (transparent fill in Tailwind v4) and never preceded anywhere by a self-cancelling
// `outline-none`.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#467410] focus-visible:shadow-[0_0_0_4px_rgba(70,116,16,0.18)] focus-visible:rounded-sm";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";
/** The one allowed display face for this route, assigned: `--font-display-wide` (Archivo Display).
 * Declared in a plain `:root` outside `@theme inline` in globals.css, so Tailwind never generates a
 * utility for it — applied via inline style, large Latin headline text only, never body/Korean. */
export const DISPLAY_STYLE: CSSProperties = { fontFamily: "var(--font-display-wide)" };

export const TRACK_EYEBROW = "tracking-[0.28em]";
export const TRACK_CAPTION = "tracking-[0.16em]";
export const TRACK_STAT = "tracking-[0.12em]";

export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export const SKIP_LINK =
  "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-white";

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
