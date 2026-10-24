// Shared literal color tokens + class strings for candidate A (light theme, emerald accent).
// Exact hex values and the contrast math behind each are written up in candidates/a.md.

export const BG = "#FAFAF8"; // near-white "paper" background
export const INK = "#15140E"; // near-black warm ink (18.45:1 against BG)

// Emerald usages, chosen so every text/icon pairing below clears WCAG AA on the surface it
// actually sits on (see candidates/a.md for the full contrast table):
export const ACCENT_TEXT_ON_LIGHT = "text-emerald-700"; // 5.48:1 on #FAFAF8 — small text/icons/links on paper
export const ACCENT_TEXT_ON_DARK = "text-emerald-400"; // 9.61:1 on #15140E — small text/icons on ink-dark chips
export const ACCENT_FILL = "bg-emerald-600"; // 3.77:1 non-text fill/border use (badges, bars, large stamps)
export const ACCENT_BORDER = "border-emerald-700";
export const ACCENT_RING = "#047857"; // emerald-700, used literally in focus-visible outline color

// Text placed ON an emerald-600 fill: ink clears AA (4.90:1), white does not (3.77:1) — so every
// "chip" below uses dark ink text on the emerald fill, never white.
export const ON_ACCENT_FILL_TEXT = "text-[#15140E]";

export const MUTED_TEXT = "text-zinc-600"; // floor kept at 600 everywhere, never 500, per brief

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] focus-visible:rounded-[3px]";

export const EYEBROW = "text-[11px] font-bold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-bold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-bold uppercase tracking-[0.12em]";
