// Shared literal design tokens for this candidate -- dark theme, amber accent (deliberately not
// the brief default #6E56CF, and not r51's cyan #22D3EE -- see contrast math below, computed by
// hand via sRGB -> linear -> WCAG relative luminance, not guessed).

export const BG = "#0B0B0F";
export const SURFACE = "#13131A"; // panel / card surface, one step up from BG
export const SURFACE_BORDER = "#22222C";
export const FG = "#FFFFFF";
export const MUTED_HEX = "#A1A1AA"; // brief's documented dark-theme muted floor (zinc-400)

// Accent: amber-500, #F59E0B.
//
//   Luminance(#0B0B0F)  = 0.00346
//   Luminance(#F59E0B)  = 0.43883
//   Luminance(#FFFFFF)  = 1.0
//
//   Accent text directly on BG:      (0.43883+0.05)/(0.00346+0.05) = 9.15:1
//     -> clears AA at every size (body included) directly on BG or SURFACE. No separate bright
//        "tint" derivative is needed for small text/icons/focus rings the way the brief's default
//        #6E56CF (3.73:1) requires -- this hex alone is already safe everywhere it sits on BG.
//   White text on an ACCENT FILL:    (1.0+0.05)/(0.43883+0.05)   = 2.15:1  -- FAILS at every size.
//   Dark-ink (#0B0B0F) on an ACCENT FILL: (0.43883+0.05)/(0.00346+0.05) = 9.15:1 -- passes at
//     every size, because amber is a *light* accent (unlike the mid-dark default), so the usual
//     "white on fill" guidance inverts here: fills always carry dark ink, never white.
export const ACCENT_HEX = "#F59E0B";
export const ACCENT_FILL = "bg-[#F59E0B]";
export const ACCENT_BORDER = "border-[#F59E0B]";
export const ACCENT_TEXT = "text-[#F59E0B]"; // safe at any size, directly on BG or SURFACE
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // never white on the amber fill -- see above

export const MUTED_TEXT = "text-[#A1A1AA]";

// Deliberately no `outline-none` anywhere in this string -- the known Tailwind v4 trap is that an
// earlier `outline-none` can cancel a later `focus-visible:outline-*` via cascade order even with
// both classes present. This pair alone is the verified-safe pattern.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F59E0B]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[12px] font-normal tracking-[0.04em]";

// Optional display face: Space Grotesk Display, large Latin headline text only, never mixed with
// another display variable, never body copy (Pretendard carries everything else). Chosen for a
// clean geometric read that fits a data-forward marketplace headline without tipping serif/blueprint.
export const DISPLAY_FONT = "var(--font-display-grotesk)";
