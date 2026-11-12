// Shared literal tokens for "Meet in the Middle" -- dark theme, lime/chartreuse accent.
// Full contrast math (sRGB -> linear -> WCAG relative luminance, by hand) lives in
// vault/20-generations/2026-11-02-auto-landing-r45/candidates/c.md -- this file only turns those
// computed decisions into reusable classes/hexes so every component draws from one source.

export const BG = "#0B0B0F"; // near-black page background
export const SURFACE = "#15151B"; // neutral dark card surface -- "Buying new" panel, chips, quotes
export const SURFACE_ACCENT = "#15190F"; // faint lime-tinted dark surface -- "On repick" panel only
export const INK = "#F4F4F5"; // near-white body text (zinc-50) on BG/SURFACE

// Accent: lime-500 (#84CC16) -- the lime/chartreuse family assigned to this candidate.
// Computed against BG (#0B0B0F, relative luminance 0.00345): lime-500's own relative luminance is
// 0.4811, giving a TEXT-on-BG contrast of 9.93:1 -- comfortably clears AA at any size, so it is
// used directly for the eyebrow label, icons, and the divider line/rail.
//
// As a FILLED background (the CTA button, the "Save $X" handle badge, the on-repick wash), lime is
// unusually bright even at the "500" shade, so this repo's documented default -- "small text on a
// filled accent defaults to white, verified >=4.5:1" -- does NOT hold for this hue family:
//   white (#FFFFFF) on #84CC16  -> 1.98:1  (fails even the 3:1 large-text/non-text floor)
//   dark ink (#0B0B0F) on #84CC16 -> 9.93:1 (clears AA at every size)
// Every lime fill on this page therefore carries dark-ink text, never white. See the concept note
// for the full per-shade table (lime-400 and lime-300 were also computed and rejected/kept).
export const ACCENT_HEX = "#84CC16"; // lime-500 -- fills only, always paired with dark-ink text
export const ACCENT_TINT_HEX = "#BEF264"; // lime-300 -- small text/icons/focus ring directly on BG (15.04:1 on BG)
export const ACCENT_FILL = "bg-[#84CC16]";
export const ACCENT_BORDER = "border-[#84CC16]";
export const ACCENT_TEXT = "text-[#BEF264]"; // non-fill small text/icons directly on a dark surface
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // dark ink -- the required override, see above

export const MUTED_TEXT = "text-zinc-400"; // dark-surface floor (7.66:1 on BG, ~7.5:1 on SURFACE_ACCENT -- never zinc-500/600, this is a dark theme)
export const GHOST_TEXT = "text-zinc-500"; // decorative large (>=24px) numerals only -- 4.07:1 on BG, large-text floor only, never on small text

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BEF264] focus-visible:rounded-[3px]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[11px] font-normal tracking-[0.04em]";

// No display typeface for this candidate -- Pretendard (the house `--font-sans` default) carries
// every weight on this page, headline included. Documented choice, not an oversight: the catalog
// treats "0 display faces" as a valid outcome, and this candidate's headline leans on tracking +
// the live two-panel device for impact rather than a second typeface.
