// Shared design tokens for r29/b — "Gatelist" (the gate chain).
//
// Theme: light (this round's assignment). Accent hue: green/emerald family, deliberately
// not the catalog's heavily-used violet/rose/teal. Display face: --font-display-wide
// (Archivo Display), per this round's assignment.
//
// ---------------------------------------------------------------------------------------
// CONTRAST ARITHMETIC — computed with the WCAG relative-luminance formula (worked by a
// small Node script, not eyeballed; the formula and script are reproduced in full in
// candidates/b.md). Page background is near-white #FDFDFC; the alternating section/panel
// background is #F3F6F4. Every number below is against one of those two surfaces.
//
//   ACCENT      #059669 vs page bg #FDFDFC   -> 3.70:1
//   ACCENT      #059669 vs panel bg #F3F6F4  -> 3.46:1
//     Both clear the >=3:1 floor for LARGE TEXT (>=24px/19px-bold) and NON-TEXT use
//     (borders, fills, icon glyphs of any size — icons are non-text graphics under the
//     WCAG 1.4.11 floor, not body text). ACCENT is used for: all icon glyphs that signal
//     "pass", decorative fills/bars, thick rule lines, and big bold tabular-nums digits
//     (the live qualifying-count headline, >=24px). It is NEVER used to color small
//     accent-tinted body TEXT (words/numbers below 24px) — that fails the 4.5:1 body
//     floor, so small accent text uses ACCENT_DEEP instead (next row).
//
//   ACCENT_DEEP #047857 vs page bg #FDFDFC   -> 5.39:1
//   ACCENT_DEEP #047857 vs panel bg #F3F6F4  -> 5.04:1
//     Both clear the >=4.5:1 BODY-TEXT floor. ACCENT_DEEP is used for every small
//     accent-colored text run (eyebrow labels, "match %" numbers, links, the deep-fill
//     toggle-on state's icon when drawn directly rather than in white).
//
//   white #FFFFFF text on ACCENT_DEEP #047857 fill -> 5.48:1   CLEARS 4.5:1
//   white #FFFFFF text on ACCENT      #059669 fill -> 3.77:1   FAILS 4.5:1
//     Per the corrected DNA rule, small text on a filled accent background must be
//     white, and must still clear 4.5:1 — so every filled chip/button/toggle-on state
//     that carries small white text or a white icon uses the ACCENT_DEEP fill, never
//     the base ACCENT fill. The base ACCENT fill is reserved for large/non-text contexts
//     (e.g. a progress bar segment with no overlaid small text).
//
//   INK          #15171B vs page bg   -> 17.63:1
//   INK          #15171B vs panel bg  -> 16.49:1
//     Headings and primary body text.
//
//   MUTED        #52525B (zinc-600) vs page bg  -> 7.59:1
//   MUTED        #52525B (zinc-600) vs panel bg -> 7.10:1
//     One muted gray used for ALL secondary/caption text everywhere (page or panel
//     surface) — both clear 4.5:1 with wide margin, which sidesteps the surface-tone-
//     conditional zinc-500-fails-on-tinted-panel trap documented in page-brief-core
//     (zinc-500 measures only 4.44:1 on this round's panel tone and would fail there).
//
//   MUTED_ICON   #71717A (zinc-500) vs page bg  -> 4.75:1
//   MUTED_ICON   #71717A (zinc-500) vs panel bg -> 4.44:1
//     Used ONLY for non-text icon glyphs (the gate-chain "bypassed" / "not yet reached"
//     dash icons) — both clear the 3:1 non-text floor. Never used for actual text, since
//     4.44:1 on the panel surface would fail the 4.5:1 body-text floor.
//
//   STOP         #3F3F46 (zinc-700) vs page bg  -> 10.26:1
//   STOP         #3F3F46 (zinc-700) vs panel bg -> 9.60:1
//     Used for the "stopped at this gate" / "held back" icon + text. Deliberately a
//     neutral dark gray, not a second hue (red) — the brief calls for near-monochrome
//     with a single accent, so pass/fail/bypass/unreached are told apart by icon SHAPE
//     (check / x / minus / dash) and by a text label, never by color alone, and the
//     only hue in the palette stays green.
//
// All four gate-chain states (pass / fail / bypassed / unreached) therefore always pair
// a distinct icon shape with a distinct text label — satisfying "color + text/icon
// together for meaning" even though two of the four share the gray family.
export const BG = "#FDFDFC";
export const PANEL_BG = "#F3F6F4";
export const INK = "#15171B";
export const MUTED = "#52525B"; // zinc-600 — all secondary/caption text, any surface
export const MUTED_ICON = "#71717A"; // zinc-500 — non-text icon glyphs only
export const STOP = "#3F3F46"; // zinc-700 — fail/held-back icon + text
export const BORDER = "#E4E4E1";
export const BORDER_STRONG = "#D4D4D1";

export const ACCENT = "#059669"; // large text (>=24px) and non-text (icons/borders/fills) only
export const ACCENT_DEEP = "#047857"; // small accent text, and fill under small white text
export const ACCENT_TINT = "#ECFDF5"; // decorative wash only, never load-bearing for contrast

export const DISPLAY = { fontFamily: "var(--font-display-wide)" } as const;

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]";

// Body-copy container widths, computed per the brief's 0.44em/glyph rule:
//   chars_per_line = container_px / (0.44 x font_px)   — never CSS `ch` (that is the
//   digit "0" advance, ~35% wider than the mixed-Latin average, and would overstate
//   capacity by roughly a third).
//   17px body -> 524px -> 524 / (0.44 x 17) = 524 / 7.48 = 70.05 chars/line
//   18px lead -> 555px -> 555 / (0.44 x 18) = 555 / 7.92 = 70.08 chars/line
// Both land right at the ~70-char target with slack under the 75-char ceiling.
// One MUTED color works on both page and panel surfaces (see arithmetic above), so
// there is no separate "_PANEL" variant to track.
export const BODY = "max-w-[524px] text-[17px] leading-[1.6] text-[#52525B]";
export const BODY_LG = "max-w-[555px] text-[18px] leading-[1.6] text-[#52525B]";
export const CAPTION = "text-[13px] leading-[1.6] text-[#52525B]";
