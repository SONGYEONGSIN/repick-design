// Shared literal color tokens + class strings for the "Checkpoint Deck" candidate
// (light theme, white canvas, amber accent). Every pairing's actual WCAG contrast ratio was
// computed with the standard relative-luminance formula (not estimated) — see
// vault/20-generations/2026-11-04-auto-landing-r47/candidates/b.md for the full table and the
// node script used to produce it. The numbers below are the ones that decided every color
// choice in this candidate; nothing here is a guess.

export const BG = "#FFFFFF";
export const BG_CLASS = "bg-white";

// Card/panel surface: a hair off white so panels read as a distinct layer without introducing
// a second hue family. Still "near-white" for the muted-text floor rule below.
export const SURFACE = "#FAFAFA"; // zinc-50
export const SURFACE_CLASS = "bg-zinc-50";
export const BORDER_CLASS = "border-zinc-200";

export const INK = "#18181B"; // zinc-900, the one ink color for headings/body/icons-with-meaning
export const INK_CLASS = "text-zinc-900";
// ink on white -> 17.72:1. Safe for any text at any size.

// ---- Muted text: the floor is surface-tone-conditional (per brief), not one flat value. ----
// zinc-500 (#71717A) on white (#FFFFFF)   -> 4.83:1  (clears 4.5:1 body-text AA)
// zinc-500 (#71717A) on zinc-50 (#FAFAFA) -> 4.63:1  (clears 4.5:1 — still "near-white")
// zinc-500 (#71717A) on zinc-100 (#F4F4F5)-> 4.40:1  (FAILS 4.5:1 — tinted surface)
// zinc-600 (#52525B) on zinc-100 (#F4F4F5)-> 7.03:1  (clears comfortably)
// So: zinc-500 is the floor on white/zinc-50, zinc-600 is the floor on anything zinc-100+
// (pills, tracks, tabs, badge fills). Two constants, used by surface, never mixed up.
export const MUTED_TEXT = "text-zinc-500"; // on white / zinc-50 surfaces only
export const MUTED_TEXT_ON_TINT = "text-zinc-600"; // on zinc-100+ / pill / track surfaces

// ---- The one accent family: amber. ----
// Base fill (buttons, the Confirm action, the live trust-score bar): amber-500 (#F59E0B).
//   - WHITE text on amber-500   -> 2.15:1  (FAILS even the 3:1 large-text floor — never do this)
//   - ink (#18181B) on amber-500 -> 8.25:1 (clears body-text AA at any size)
//   -> every fill below pairs amber-500 with ink text, never white, confirming the brief's
//      prediction that dark ink is the safe pairing for this accent.
export const ACCENT_FILL = "bg-amber-500"; // always paired with ON_ACCENT_TEXT
export const ON_ACCENT_TEXT = "text-zinc-900";

// Accent used as small TEXT directly on white (eyebrows, links, the one accent-colored
// headline word): needs the full 4.5:1 body-text floor because most of these uses are
// caption-sized, not large text.
//   - amber-500 (#F59E0B) on white -> 2.15:1 (fails)
//   - amber-600 (#D97706) on white -> 3.19:1 (clears ONLY the 3:1 large-text floor — usable
//     for the one bold/extrabold headline word at ≥24px, never for captions/body/icons)
//   - amber-700 (#B45309) on white -> 5.02:1 (clears 4.5:1 at any size — the safe default for
//     every small accent text/icon-with-meaning use on this page)
export const ACCENT_TEXT = "text-amber-700"; // eyebrows, links, icons-that-carry-meaning
export const ACCENT_TEXT_LARGE = "text-amber-600"; // ONLY the one large (≥24px) bold headline word
export const ACCENT_BORDER = "border-amber-300"; // decorative border only, never load-bearing alone

// Tinted accent surface for badges where ink text sits ON an amber fill rather than amber text
// sitting on white — this sidesteps the amber-700-on-amber-100 pairing entirely (that pairing
// measures 4.51:1, which clears 4.5:1 but with almost no margin; ink-on-amber-100 measures
// 15.91:1, so every accent badge in this candidate uses ink text on the tint, not amber text).
export const ACCENT_TINT_BG = "bg-amber-100";
export const ACCENT_TINT_TEXT = "text-zinc-900";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 focus-visible:rounded-[3px]";

// Decorative/ghost numerals: must clear 3:1 at their rendered (large) size even though they are
// aria-hidden — axe's color-contrast check does not exempt a visibly-rendered text node just
// because it is aria-hidden. zinc-400 (#A1A1AA) on white only measures 2.56:1 (fails); zinc-500
// (#71717A) on white measures 4.83:1, clearing both the 3:1 large-text floor and the 4.5:1
// normal-text floor, so it is used even though these numerals are large — no lighter gray in
// the zinc scale clears 3:1 on a plain white page.
export const GHOST_TEXT = "text-zinc-500";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// Display face for this candidate: --font-display-mono (JetBrains Mono Display), latin-only,
// large headline/figure text only — fitting for a verification product, it reads like an audit
// terminal readout. Body copy, Korean and every other string on the page stay on --font-sans
// (Pretendard); never two display faces in one piece.
export const DISPLAY = "font-[family-name:var(--font-display-mono)]";

// Exactly three rendered font weights across the whole page, measured by computed style, not
// class name: 400 (font-normal, body copy — Tailwind preflight's own default, never overridden
// to something else), 600 (font-semibold, labels/captions/buttons/UI text) and 800
// (font-extrabold, headline + big figures). font-bold (700) and font-medium (500) are never
// used anywhere in this candidate's classes.

// Body-copy line-length container widths. Pretendard's mixed English/Korean average glyph
// advance is 0.44em (NOT `ch`, which in Pretendard is ~35% too wide — see brief). Formula:
// chars-per-line = container-px / (0.44 * font-size-px); solved here for container-px at a
// 70-character target (ceiling 75):
//   - 12px fine print  -> 370px container  (= 370 / (0.44*12) = 70.08 chars)
//   - 14px caption     -> 431px container  (= 431 / (0.44*14) = 69.96 chars)
//   - 16px body        -> 492px container  (= 492 / (0.44*16) = 69.89 chars)
//   - 18px lede        -> 554px container  (= 554 / (0.44*18) = 69.95 chars)
export const PROSE_WIDTH_12 = "max-w-[23.125rem]"; // 370px
export const PROSE_WIDTH_14 = "max-w-[26.9375rem]"; // 431px
export const PROSE_WIDTH_16 = "max-w-[30.75rem]"; // 492px
export const PROSE_WIDTH_18 = "max-w-[34.625rem]"; // 554px
