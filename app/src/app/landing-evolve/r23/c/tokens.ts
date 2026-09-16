/**
 * Price Lab — route-scoped design tokens (auto-landing-r23 / candidate c, "Type Your Ask").
 *
 * THEME: dark (the brief's default). Ground #0B0B0F, card surface #111116, borders #1C1C22 /
 * #27272E, muted text at the zinc-400 floor throughout.
 *
 * ACCENT: a desaturated antique gold / brass — chosen because this round's brief explicitly asks
 * candidate c to avoid every hue this catalogue's recent rounds already spent (sky r21, teal r20,
 * amber r19, rose r22-a/b/c, violet — the default). A *muted* gold sits at H~45 deg, S~42%, far
 * enough from saturated amber (H~38, S~92%, L~50%) in saturation/lightness that it reads as
 * "brass/bronze", not "amber orange" — the brief names this exact direction as an acceptable
 * "neutral-leaning" axis. Full derivation (WCAG relative luminance, sRGB, against this route's
 * real background) lives in candidates/c.md; the headline numbers:
 *
 *   ACCENT (#7F6C34) vs #0B0B0F     = 3.83:1   -> large text (>=24px, or >=19px bold) and big
 *                                                 filled areas ONLY (buttons, active-bucket fill).
 *   white  vs ACCENT fill           = 5.13:1   -> clears AA at body size. Any small (<=19px,
 *                                                 non-bold) text painted on an ACCENT fill is
 *                                                 white — never the accent hue itself, never a
 *                                                 dark ink (dark ink on this fill is 3.83:1, which
 *                                                 fails small text).
 *   ACCENT_BRIGHT (#D2C089) vs bg    = 10.90:1  -> the bright tint. Every small accent-colored
 *                                                 label, icon and the focus ring itself use this,
 *                                                 never the base hex directly on the dark ground.
 */

import type { CSSProperties } from "react";

export const ACCENT = "#7F6C34";
export const ACCENT_BRIGHT = "#D2C089";

export const BG = "#0B0B0F";
export const CARD_BG = "#111116";
export const CARD_BG_SOFT = "#15151B";
export const BORDER = "#1C1C22";
export const BORDER_SOFT = "#27272E";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Visible-focus idiom used on every interactive element in this route. Outline-based, never bare
 * `ring-*` (Tailwind v4 renders that fully transparent) and never preceded by `outline-none`
 * (which would cancel a later `focus-visible:outline`).
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D2C089]";

export const NUM = "tabular-nums";

/** The one allowed display face for this route: Archivo Display, applied via inline style so no
 * Tailwind utility (and no `next/font` import) is needed — `--font-display-wide` is declared on a
 * plain `:root` in globals.css and already registered as a global `@font-face`. Latin/numerals
 * only; Korean and body copy stay on `--font-sans` (Pretendard). */
export const DISPLAY_FONT: CSSProperties = {
  fontFamily: "var(--font-display-wide)",
  fontWeight: 800,
};
