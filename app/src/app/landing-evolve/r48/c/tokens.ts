// Shared literal tokens for "Sell-Through Window" -- light theme, emerald accent, no display
// face (Pretendard / --font-sans carries every weight, headline included).
//
// Full contrast math (sRGB -> linear -> WCAG relative luminance) lives in
// vault/20-generations/2026-11-05-auto-landing-r48/candidates/c.md -- this file only turns those
// computed decisions into reusable classes/hexes so every component draws from one source.

export const BG = "#FFFFFF"; // true white page background -- not cream/paper ("genuine light")
export const SURFACE = "#F4F4F5"; // zinc-100 -- card surfaces, chip tracks, the chart's base line
export const SURFACE_BORDER = "#E4E4E7"; // zinc-200 -- hairline borders on white/zinc-100
export const INK = "#09090B"; // zinc-950 body/heading ink -- 19.9:1 on BG

// Accent: emerald-600 (#059669), the hue assigned for this round. Computed against BG (#FFFFFF):
//   emerald-600 relative luminance 0.396 -> TEXT-on-white contrast 3.77:1.
//   That clears the LARGE-text/non-text floor (3:1) but NOT body-size AA (4.5:1), so emerald-600
//   is used directly only for fills/borders/bars/graph strokes and >=24px (or >=19px bold) text --
//   exactly the brief's "safe" tier.
export const ACCENT_HEX = "#059669"; // emerald-600 -- fills, borders, bars, large text only
export const ACCENT_FILL = "bg-[#059669]";
export const ACCENT_BORDER = "border-[#059669]";
export const ACCENT_LARGE_TEXT = "text-[#059669]"; // only on >=24px / >=19px-bold text

// Small text / icons / focus ring: on a LIGHT background the dark-theme move (lighten to a tint)
// is backwards -- a lighter emerald only gets closer to white and loses contrast. The usable
// derivation here is a SHADE, not a tint: emerald-700 (#047857), relative luminance 0.1786 ->
// 5.48:1 on BG (#FFFFFF) and 4.99:1 on SURFACE (#F4F4F5). Both clear body-size AA (4.5:1).
export const ACCENT_SMALL_HEX = "#047857"; // emerald-700 -- small text, icons, focus ring
export const ACCENT_TEXT = "text-[#047857]";

// Text ON a filled accent background: emerald-600 is a mid-saturation fill, not a very light
// tint, so the repo's generic default ("small text on a filled accent is white") does NOT hold
// here -- verified by direct computation, not assumed:
//   white (#FFFFFF) on #059669   -> 3.77:1  (fails body-size AA 4.5:1; large-text/non-text only)
//   dark ink (#09090B) on #059669 -> 5.28:1 (clears AA at EVERY size, including small text)
// So every emerald fill on this page carries dark-ink text, never white -- the reverse of the
// repo default, mirroring the documented r45/c (lime) precedent that the default white-on-fill
// rule is a starting assumption to verify per hue, not a constant.
export const ON_ACCENT_FILL_TEXT = "text-[#09090B]";

// Muted / de-emphasized text. zinc-600 (#52525B) clears AA (4.5:1) on BOTH surfaces used on this
// page -- 7.73:1 on BG (#FFFFFF) and 7.03:1 on SURFACE (#F4F4F5) -- so one token is safe
// everywhere rather than switching floors per surface.
export const MUTED_TEXT = "text-zinc-600";

// Ghost / decorative large numerals (>=24px) only. zinc-400 fails the 3:1 large-text floor on
// white (2.56:1) -- zinc-500 (#71717A) is the floor that actually clears it, at 4.83:1. Never
// used below 24px (or 19px bold); hierarchy below that size is built with size/weight/tracking,
// not by pushing this color down further.
export const GHOST_TEXT = "text-zinc-500";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[11px] font-normal tracking-[0.04em]";

// No display typeface for this candidate -- Pretendard (the house `--font-sans` default) carries
// every weight on this page, headline included, per this round's assignment.
