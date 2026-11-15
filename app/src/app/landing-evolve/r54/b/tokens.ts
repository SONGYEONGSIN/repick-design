// Shared literal design tokens -- dark theme (zinc-950/900, committed fully, not a muddy
// dark-mode-only graft), single accent family: indigo. No display face: this candidate skips the
// display typeface entirely, so every text node -- headline scale included -- stays on
// `--font-sans` (Pretendard) and hierarchy comes only from size / weight / color / tracking.
//
// Exactly 3 rendered font weights for the whole route, nothing else used anywhere in this folder:
//   font-normal     (400) -- body copy, numbers, captions
//   font-semibold    (600) -- labels, card titles, buttons, eyebrows
//   font-extrabold   (800) -- the h1 and every section h2
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance, L = 0.2126R+0.7152G+0.0722B
// (each channel linearized first: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)^2.4):
//
//   L(zinc-950 #09090b)  = 0.00278   (page background)
//   L(zinc-900 #18181b)  = 0.00927   (card surface)
//   L(zinc-400 #a1a1aa)  = 0.3595    (muted text floor for dark surfaces per brief)
//   L(indigo-600 #4F46E5) = 0.1171
//   L(indigo-400 #818CF8) = 0.3019
//   L(white)             = 1.0
//
//   zinc-400 text on zinc-950 bg:            (0.3595+0.05)/(0.00278+0.05) = 7.76:1  -- clears the
//     dark-theme floor (zinc-400, not 500/600) with room to spare; this is the ONLY muted-text
//     color used anywhere in this route.
//
//   white text on indigo-600 FILL (buttons, active chips):  (1.0+0.05)/(0.1171+0.05) = 6.29:1
//     -- clears body-text AA (4.5:1). This is the one role indigo-600 is used for: a solid fill
//     that always carries white text on top. (indigo-500 was tried first: white-on-#6366F1 comes
//     out to 4.47:1, just under the 4.5 body-text floor -- rejected for that reason, see vault note.)
//
//   indigo-600 fill against the zinc-950 PAGE background (non-text, e.g. a chip's own edge):
//     (0.1171+0.05)/(0.00278+0.05) = 3.17:1 -- clears the 3:1 non-text/large-UI floor.
//
//   indigo-400 as TEXT/ICON/chart-mark/focus-ring color (brighter tint, per brief, for every role
//   that isn't "white text on a solid fill"), on zinc-950: (0.3019+0.05)/(0.00278+0.05) = 6.67:1
//   on zinc-900 surface: (0.3019+0.05)/(0.00927+0.05) = 5.94:1 -- both clear body-text AA.
export const BG_HEX = "#09090B"; // zinc-950
export const SURFACE_HEX = "#18181B"; // zinc-900
export const SURFACE_BORDER_HEX = "#27272A"; // zinc-800
export const FG_HEX = "#FAFAFA"; // zinc-50

export const BG = "bg-[#09090B]";
export const SURFACE = "bg-[#18181B]";
export const SURFACE_BORDER = "border-[#27272A]";
export const FG_TEXT = "text-[#FAFAFA]";

export const MUTED_HEX = "#A1A1AA"; // zinc-400 -- the dark-theme floor, never dimmer
export const MUTED_TEXT = "text-[#A1A1AA]";

export const ACCENT_FILL_HEX = "#4F46E5"; // indigo-600 -- solid fill, always paired with white text
export const ACCENT_FILL = "bg-[#4F46E5]";
export const ON_ACCENT_FILL_TEXT = "text-white";

export const ACCENT_HEX = "#818CF8"; // indigo-400 -- text / icon / chart-mark / border / ring tint
export const ACCENT_TEXT = "text-[#818CF8]";
export const ACCENT_BORDER = "border-[#818CF8]";

// No `ring-*` utility and no bare `outline-none` anywhere in this string -- this build renders
// `ring`+`ring-offset` fully transparent in Tailwind v4, and pairing `outline-none` with a later
// `focus-visible:outline-*` self-cancels via a shared `--tw-outline-style` custom property. Every
// candidate here uses a plain `outline` utility instead, gated on `:focus-visible` only.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#818CF8]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// Body-width arithmetic (brief: Pretendard-mixed-with-Latin averages 0.44em/char, target ~70,
// hard ceiling 75, never the `ch` unit). Two real paragraph-length prose sizes appear in this
// route -- 16px (hero/section lead copy) and 14px (card bodies, testimonial quotes) -- each gets
// its own width rather than reusing one max-width across sizes, because this route's card grids
// sit at `grid-cols-1` up to their `sm`/`lg` breakpoint: at viewport widths just below that
// breakpoint the single column is wide enough that an unconstrained 14px paragraph would overrun
// the ceiling even though the four widths the gate sweeps (390/1280/1440/1920) all land on the
// safe side of that gap -- the sweep testing clean is not the same as the math holding, so both
// get their own computed cap instead of trusting the grid to narrow them:
//   16px: 500 / (0.44 * 16) = 500 / 7.04  = 71.02 chars -- target met, under the 75 ceiling.
//   14px: 430 / (0.44 * 14) = 430 / 6.16  = 69.81 chars -- target met, under the 75 ceiling.
// Anything smaller than 14px in this route (badge chips, AI-match reasoning tags, stat labels) is
// kept under 65 real characters on its own, so it never needs a width cap at all.
export const PROSE_WIDTH = "max-w-[500px]"; // 16px prose
export const PROSE_WIDTH_SM = "max-w-[430px]"; // 14px prose (card bodies, quotes)
