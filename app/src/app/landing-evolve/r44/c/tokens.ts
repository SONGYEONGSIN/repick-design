// Shared literal color tokens + class strings for the Sell-Through Simulator (light theme,
// near-monochrome, emerald accent). Exact hex values and the WCAG relative-luminance math
// behind every pairing below are written up in candidates/c.md — this file is the single
// place those decisions turn into classes so every component draws from the same palette.

export const BG = "#FAFAFA"; // near-white "paper" background (Tailwind zinc-50)
export const INK = "#121212"; // near-black ink, 17.94:1 against BG (body-text safe)

// The one accent family for this candidate: emerald-700 (#047857). Three pairings, each
// computed against the surface it actually renders on:
//   - emerald-700 text directly on BG            -> 5.25:1  (passes body-size AA)
//   - white text on an emerald-700 fill           -> 5.48:1  (passes body-size AA, all sizes)
//   - INK (#121212) text on an emerald-700 fill    -> 3.42:1  (large-text/non-text floor only)
export const ACCENT_TEXT = "text-emerald-700"; // small text/icons/links directly on BG
export const ACCENT_FILL = "bg-emerald-700"; // CTA buttons, filled badges, chart accent stroke
export const ACCENT_BORDER = "border-emerald-700";
export const ACCENT_HEX = "#047857";
export const ON_ACCENT_FILL_TEXT = "text-white"; // always white on the emerald-700 fill — see above

// Muted text floor kept at zinc-600 everywhere on this near-white surface (never 500, so the
// one borderline AA case — 500 on near-white measuring 4.63:1 against the 4.5:1 line — never
// has to be relied on). Ghost/decorative numbers are large (>=24px) so the lighter 3:1 floor
// applies and zinc-500 (4.63:1 here) is used deliberately for those only.
export const MUTED_TEXT = "text-zinc-600";
export const GHOST_TEXT = "text-zinc-500";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] focus-visible:rounded-[3px]";

export const EYEBROW = "text-[11px] font-bold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-bold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-bold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[11px] font-normal tracking-[0.04em]";

// Display face for this candidate (documented choice): Archivo Display via
// --font-display-wide, latin-only, large headline text only.
export const DISPLAY = "font-[family-name:var(--font-display-wide)]";
