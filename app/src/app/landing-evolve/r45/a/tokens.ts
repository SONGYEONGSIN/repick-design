// Shared literal color tokens + class strings for the Live Payout Receipt candidate
// (dark theme, near-black surface, sky/cyan accent). Exact hex values and the WCAG
// relative-luminance math behind every pairing below are written up in full in
// vault/20-generations/2026-11-02-auto-landing-r45/candidates/a.md — this file is the single
// place those decisions turn into classes so every component draws from the same palette.

export const BG = "#0B0B0F"; // near-black page surface. Relative luminance L ≈ 0.00345.
export const BG_CLASS = "bg-[#0B0B0F]";
export const INK = "#F5F5F7"; // near-white default body/ink text on the dark surface.

// Card / receipt surface: one step lighter than the page so cards read as elevated paper,
// without introducing a second hue family.
export const CARD_BG = "#14141B";
export const CARD_BORDER = "border-white/10";

// The one accent family for this candidate: sky/cyan. Three pairings, each computed against
// the surface it actually renders on (white = L 1, BG = L 0.00345):
//   - sky-400 (#38bdf8, L ≈ 0.4401) text directly on BG         -> 9.17:1  (clears small text AA)
//   - dark ink (#0B0B0F) text on a sky-400 fill (large text/non-text only) -> 9.17:1 (same pair, reversed)
//   - white text on a sky-400 fill                               -> 2.14:1  (FAILS even 3:1 — never do this)
//   - white text on a sky-700 fill (#0369a1, L ≈ 0.1269)         -> 5.94:1  (clears small text AA)
export const ACCENT_TEXT = "text-sky-400"; // eyebrows, icons, links, selected-state copy on BG/CARD_BG
export const ACCENT_FILL_LARGE = "bg-sky-400"; // large filled chips/bars/borders — pair with dark ink text only
export const ON_ACCENT_LARGE_TEXT = "text-[#0B0B0F]"; // dark ink, for text ON the sky-400 fill (large/non-text only)
export const ACCENT_FILL_BUTTON = "bg-sky-700 hover:bg-sky-800"; // buttons — small white text needs the darker fill
export const ON_ACCENT_BUTTON_TEXT = "text-white";
export const ACCENT_BORDER = "border-sky-400/40";
export const ACCENT_HEX = "#38bdf8";

// Focus rings use a lighter tint of the same hue than the full-saturation fill, per the
// usage-tier rule (full saturation for fills/large text; small-scale UI like a ring gets the
// lighter tint). sky-300 (#7dd3fc) against BG measures well above 10:1 — easily visible on
// every surface this page uses, including directly on CARD_BG.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 focus-visible:rounded-[3px]";

// Muted text floor kept at zinc-400 everywhere on this dark surface (never 500/600, which the
// brief reserves for light surfaces). zinc-400 (#a1a1aa) against BG measures ≈7.6:1 — well
// clear of the 4.5:1 body-text floor with margin to spare.
export const MUTED_TEXT = "text-zinc-400";
// Decorative, aria-hidden-only ghost marks (never conveys information on its own).
export const GHOST_TEXT = "text-zinc-800";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const FIG_CAPTION = "text-[11px] font-normal tracking-[0.04em]";

// Display face for this candidate (documented choice): Space Grotesk Display via
// --font-display-grotesk, latin-only, large headline/figure text only. Body and all other
// copy stay on --font-sans (Pretendard).
export const DISPLAY = "font-[family-name:var(--font-display-grotesk)]";

// Exactly three rendered font weights across the whole page: 400 (font-normal, body copy),
// 600 (font-semibold, labels/captions/emphasis), 800 (font-extrabold, headline + receipt
// figures). font-bold (700) and font-medium (500) are never used anywhere in this candidate.
