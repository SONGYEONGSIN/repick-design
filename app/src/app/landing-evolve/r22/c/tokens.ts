/**
 * Compare Console — route-scoped design tokens (auto-landing-r22 / candidate c,
 * "Side-by-Side Compare Console").
 *
 * THEME: dark (the brief's default). Ground #0B0B0F, foreground white, muted #A1A1AA (= Tailwind
 * zinc-400, the exact floor the brief sets for muted text on a dark ground) throughout — this route
 * never mixes in a light surface, so there is only one contrast floor to track, not two.
 *
 * ACCENT: a deep rose/crimson, picked to sit outside both the three most recent landing winners'
 * hues (sky r21, teal r20, amber r19) and this catalogue's own default violet (#6E56CF, already
 * reused across a dozen routes). Contrast arithmetic below is WCAG relative luminance against this
 * route's actual background (#0B0B0F, L = 0.00345) — see candidates/c.md for the full derivation:
 *
 *   #CC1641 vs #0B0B0F   = 3.52:1   → large text (≥24px, or ≥19px bold) and big filled areas only
 *                                      (buttons, selected-chip fill, winner-cell border) — the same
 *                                      "large-only" tier the brief's own default (#6E56CF) sits in
 *                                      at 3.73:1; this rose is slightly better-margined, not worse.
 *   #FFFFFF vs #CC1641   = 5.59:1   → clears AA at body size, so any small/non-bold text painted on
 *                                      an accent FILL (button labels, selected-chip captions) is
 *                                      white, never the accent hue itself or a dark ink.
 *   #FDA4AF vs #0B0B0F   = 10.39:1  → the bright tint. Every small (≤19px) accent-colored label,
 *                                      icon, "Best" tag and the focus ring itself use this, never
 *                                      the base hex directly on the dark ground.
 */

import type { CSSProperties } from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#CC1641";
export const ACCENT_BRIGHT_HEX = "#FDA4AF";

export const BG = "#0B0B0F";
export const CARD_BG = "#111116";
export const BORDER_HEX = "#1C1C22";
export const BORDER_SOFT_HEX = "#27272E";

export const MUTED = "text-zinc-400";
export const BORDER = "border-[#1C1C22]";

/**
 * Visible-focus idiom used on every interactive element in this route, including ones sitting
 * behind an `sr-only` native input (the compare checkboxes) via a `peer-focus-visible:` variant of
 * the same classes. Outline-based, never bare `ring-*` (Tailwind v4 renders that fully transparent),
 * and never preceded anywhere by `outline-none`.
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDA4AF] focus-visible:rounded-sm";
export const PEER_FOCUS =
  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FDA4AF]";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/**
 * The one allowed display face for this route, applied via inline style — `--font-display-mono`
 * is declared in a plain `:root`, outside the `@theme inline` block, so Tailwind never generates a
 * utility class for it (see globals.css). JetBrains Mono Display doubles as the thematic anchor: a
 * comparison matrix is fundamentally tabular, and a monospaced display face reads as "console/ledger"
 * without needing any extra decoration to sell the metaphor.
 */
export const DISPLAY_STYLE: CSSProperties = { fontFamily: "var(--font-display-mono)" };

export const TRACK_EYEBROW = "tracking-[0.28em]";
export const TRACK_CAPTION = "tracking-[0.16em]";
export const TRACK_STAT = "tracking-[0.12em]";

/**
 * Body-copy max-widths, computed in px per the brief's constant rather than guessed in `ch`
 * (`ch` is a zero-width glyph's advance and runs ~35% too wide for mixed Latin body text).
 * chars-per-line = containerPx / (0.44 * fontSizePx)  →  containerPx = chars * 0.44 * fontSizePx.
 * Target 70 characters:
 *   16px body copy →  70 * 0.44 * 16 = 492.8px  → max-w-[493px]
 *   14px body copy →  70 * 0.44 * 14 = 431.2px  → max-w-[431px]
 */
export const PARA_WIDTH_16 = "max-w-[493px]";
export const PARA_WIDTH_14 = "max-w-[431px]";
