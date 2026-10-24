/**
 * Route-scoped design tokens -- r36 / candidate a.
 *
 * THEME: light, per this round's assignment (3 consecutive dark winners before this round).
 * Ground is true pure white, not an off-white "paper" tone.
 *
 * ACCENT: teal family. Every ratio below is the real WCAG relative-luminance formula, computed in
 * Node (sRGB -> linear per channel, L = 0.2126 R + 0.7152 G + 0.0722 B; contrast =
 * (L_lighter + 0.05) / (L_darker + 0.05)) -- not eyeballed. Reproduced in candidates/a.md.
 *
 *   Pairing                                                          Ratio     Verdict
 *   --------------------------------------------------------------------------------------------
 *   teal-700 #0F766E (ACCENT_TEXT) vs #FFFFFF page bg                5.47:1    passes AA at EVERY
 *                                                                              text size -- used for
 *                                                                              small text/icons/links
 *                                                                              directly on white
 *   teal-600 #0D9488 (ACCENT_FILL) vs #FFFFFF page bg                3.74:1    passes the 3:1 large-
 *                                                                              text/non-text floor
 *                                                                              only -- used for fills
 *                                                                              (buttons, chips, the
 *                                                                              highlighted slope line
 *                                                                              and dot), never as
 *                                                                              small text on white
 *   WHITE text on teal-600 FILL                                      3.74:1    fails small-text AA
 *                                                                              (needs 4.5:1) -- never
 *                                                                              used
 *   zinc-950 #09090B ink as TEXT on teal-600 FILL                     5.31:1    clears AA at every
 *                                                                              size -- the only text
 *                                                                              color used on an
 *                                                                              accent-filled surface
 *                                                                              on this route
 *   This is the OPPOSITE split from the repo default accent (#6E56CF on #0B0B0F, where white-on-
 *   fill passes and dark-ink-on-fill only clears the large-text floor). Confirms the brief's
 *   warning not to assume the same split holds for a different hue/background pair.
 *   zinc-600 #52525B (MUTED_TEXT) vs #FFFFFF                          7.73:1    body/caption floor on
 *                                                                              pure white is zinc-500
 *                                                                              (4.83:1); zinc-600 is
 *                                                                              used everywhere here so
 *                                                                              the same token is safe
 *                                                                              on muted zinc-50/100
 *                                                                              surfaces too
 *   zinc-950 #09090B (INK) vs #FFFFFF                                19.90:1
 *   teal-700 #0F766E vs teal-50 #F0FDFA (chip text on soft chip bg)   5.25:1    AA at every size
 *   teal-800 #115E59 vs #FFFFFF (large-text-only alt, unused here)    7.58:1
 */

export const BG = "#FFFFFF";
export const INK = "#09090b"; // zinc-950
export const MUTED_TEXT = "text-zinc-600"; // 7.73:1 on #FFFFFF
export const BORDER = "border-zinc-200";
export const SURFACE = "bg-zinc-50";

export const ACCENT_TEXT = "text-teal-700"; // 5.47:1 on white -- small text/icons/links
export const ACCENT_FILL = "bg-teal-600"; // 3.74:1 on white -- fills/bars/highlighted line only
export const ACCENT_FILL_HEX = "#0D9488";
export const ACCENT_ON_FILL_TEXT = "text-zinc-950"; // 5.31:1 on teal-600 fill
export const ACCENT_CHIP_BG = "bg-teal-50";
export const ACCENT_BORDER = "border-teal-700/30";
export const ACCENT_MUTED_LINE = "#a1a1aa"; // zinc-400, decorative/non-text slope lines only

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] focus-visible:rounded-sm";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
