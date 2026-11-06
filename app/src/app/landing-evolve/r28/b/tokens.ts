// Shared design tokens for r28/b — The Funnel.
//
// Theme: light (this round's lean per brief). Accent hue: a cobalt/royal blue,
// deliberately not one of the catalog's three most-used hues (amber/teal/violet-hex).
// It is paired with the mono display face rather than grotesk, so the page does not
// reproduce the two most-recent winners' exact combos (light/blue-hex/grotesk or
// dark/emerald/wide).
//
// Contrast, computed with the WCAG relative-luminance formula (worked by hand, not
// eyeballed — see candidates/b.md for the full derivation):
//   ACCENT #3454D1 vs white bg (#FFFFFF)         → 6.30:1 — clears body-text AA (4.5:1),
//            so the raw accent is safe as small text directly on the page background.
//   ACCENT #3454D1 vs near-black ink (#000000)   → 3.34:1 — clears only the large-text/
//            non-text floor (3:1). Used for that ratio only (borders, big bold numerals,
//            non-text fills); never for small dark-ink text.
//   white   on ACCENT fill                        → 6.30:1 — small text on a solid accent
//            button/chip fill is always white, per the corrected canon rule.
//   ACCENT #3454D1 vs tinted panel bg (#F4F4F2)   → 5.73:1 — still clears body AA, so the
//            raw accent also works as text/icon color on the funnel card's panel surface.
//   MUTED zinc-500 (#71717A) vs white bg          → 4.83:1 — clears AA on near-white.
//   MUTED zinc-500 (#71717A) vs tinted panel bg   → 4.39:1 — FAILS the 4.5:1 body floor,
//            which is why the panel/chip surfaces below use MUTED_STRONG instead.
//   MUTED_STRONG zinc-600 (#52525B) vs panel bg   → 7.02:1 — safe floor for muted text
//            sitting on a tinted/tab-strip/chip surface.
//   INK (#15161B) vs white bg                     → ~19.6:1 — headings/primary body.
export const BG = "#FDFDFC";
export const PANEL_BG = "#F4F4F2";
export const INK = "#15161B";
export const MUTED = "#71717A"; // zinc-500 — near-white surfaces only
export const MUTED_STRONG = "#52525B"; // zinc-600 — tinted/panel surfaces
export const BORDER = "#E4E4E1";
export const BORDER_STRONG = "#D4D4D1";

export const ACCENT = "#3454D1";
// A deeper shade of the same hue, used for small outlined-chip text/icons (condition
// grade, verified-seller badge) on both white and panel surfaces — 9.03:1 against white,
// well clear of the 4.5:1 body floor with margin to spare on either surface tone.
export const ACCENT_DEEP = "#28409F";

export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28409F]";

// Body-copy container widths, computed per the brief's 0.44em/glyph rule —
// chars = container px ÷ (0.44 × font px), never CSS `ch`:
//   17px body → 524px → 524 / (0.44 × 17) ≈ 70.05 chars/line
//   18px lead → 555px → 555 / (0.44 × 18) ≈ 70.08 chars/line
// Class strings are written out literally (not template-interpolated) so Tailwind's
// static scanner can see and generate them.
//
// Two color variants of each, per the surface-tone-conditional floor: the plain
// versions use zinc-500 (#71717A, 4.83:1 on the page's near-white bg) for copy that
// sits directly on the page background or a white card; the "_PANEL" versions use
// zinc-600 (#52525B, 7.02:1 on the #F4F4F2 panel) for copy that sits on a tinted
// section or chip background, where zinc-500 measures only 4.39:1 and fails AA.
export const BODY = "max-w-[524px] text-[17px] leading-[1.6] text-[#71717A]";
export const BODY_LG = "max-w-[555px] text-[18px] leading-[1.6] text-[#71717A]";
export const BODY_PANEL = "max-w-[524px] text-[17px] leading-[1.6] text-[#52525B]";
export const BODY_LG_PANEL = "max-w-[555px] text-[18px] leading-[1.6] text-[#52525B]";
