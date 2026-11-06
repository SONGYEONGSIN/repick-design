// Shared literal color tokens + class strings for the "Trade Path Simulator" candidate
// (dark theme, near-black surface, blue accent, no display face — Pretendard only this round).
// Every pairing's real WCAG contrast ratio was computed with the standard relative-luminance
// formula (not estimated) — the numbers in the comments below are the ones that decided every
// color choice in this candidate. Full table + the node script used to produce it is written up
// in vault/20-generations/2026-11-05-auto-landing-r48/candidates/b.md.

export const BG = "#0B0B0F"; // near-black page surface.
export const BG_CLASS = "bg-[#0B0B0F]";

export const INK = "#F5F5F7"; // near-white default body/ink text on the dark surface.
export const INK_CLASS = "text-[#F5F5F7]";
// INK vs BG -> 18.04:1. Safe for any text at any size, on the page background.

// Card/panel surface: one step lighter than the page so cards/panels read as a raised layer
// without introducing a second hue family.
export const CARD_BG = "#15151C";
export const CARD_BG_CLASS = "bg-[#15151C]";
export const CARD_BORDER = "border-white/10";

// ---- Muted text: one flat value on this dark surface (brief's conditional floor collapses to
// a single safe value here because both BG and CARD_BG are already near-black). ----
// zinc-400 (#A1A1AA) vs BG (#0B0B0F)       -> 7.66:1
// zinc-400 (#A1A1AA) vs CARD_BG (#15151C)  -> 7.09:1
// Both clear 4.5:1 body-text AA with real margin. zinc-500/600 are never used in dark mode
// here (they are the repo's disallowed `dark:text-{zinc,...}-{500,600}` tier).
export const MUTED_TEXT = "text-zinc-400";

// ---- The one accent family for this candidate: blue (assigned this round). ----
// Base accent hex: #3B82F6 (Tailwind blue-500).
//   - blue-500 vs BG (#0B0B0F)       -> 5.34:1  (clears body-text AA directly on the page bg)
//   - blue-500 vs CARD_BG (#15151C)  -> 4.94:1  (clears body-text AA on the card surface too)
//   - WHITE text ON a blue-500 fill   -> 3.68:1  (FAILS small/body AA; clears only the 3:1
//     large-text floor — never pair white body-size text with a raw blue-500 fill)
//   - dark-ink (#0B0B0F) text ON a blue-500 fill -> 5.34:1 (clears body-text AA at any size)
// Because blue-500 itself already clears 4.5:1 directly on both BG and CARD_BG, it is used
// as the direct accent TEXT color (eyebrows, captions, icons-with-meaning, links, the one
// accent headline word) at any size — no separate "large-only" variant is needed for this hue.
export const ACCENT_HEX = "#3B82F6";
export const ACCENT_TEXT = "text-blue-500"; // eyebrows/captions/icons/links/accent headline word

// Filled surfaces (buttons, chips, the lit tree edges/nodes, bars) use a darker step of the
// same family so that WHITE text — required by the brief for any small (≤19px non-bold)
// text on a filled accent background — actually clears full-size AA, not just the large-text
// floor:
//   - blue-600 (#2563EB) vs BG (non-text, fill-surface-vs-page-bg)      -> 3.80:1 (clears the
//     3:1 non-text/large-text floor, so the filled surface itself reads as distinct from the
//     page even where it isn't carrying a border)
//   - WHITE text ON a blue-600 fill                                     -> 5.17:1 (clears body
//     AA at any size — this is the pairing used everywhere a fill carries text)
export const ACCENT_FILL = "bg-blue-600"; // always paired with ON_ACCENT_TEXT (white)
export const ON_ACCENT_TEXT = "text-white";
export const ACCENT_FILL_HOVER = "hover:bg-blue-500";

// Decorative border accent (not load-bearing alone — always paired with a non-color signal:
// stroke weight, icon, or the "Your path" text label on the chosen node).
export const ACCENT_BORDER = "border-blue-500/60";

// Small text / icons / focus rings get a brighter TINT of the same hue rather than the base
// accent, per the usage-tier rule, so they keep extra headroom even at 1px strokes:
//   - blue-300 (#93C5FD) vs BG       -> 10.89:1
//   - blue-300 (#93C5FD) vs CARD_BG  -> 10.07:1
export const ACCENT_TINT_HEX = "#93C5FD";
export const ACCENT_TINT_TEXT = "text-blue-300";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 focus-visible:rounded-[3px]";

// Decorative/ghost numerals: must clear 3:1 at their rendered size even though they are
// aria-hidden — axe's color-contrast check does not exempt a visibly-rendered text node just
// because it is aria-hidden. #6B6B78 vs BG -> 3.74:1, vs CARD_BG -> 3.46:1 — both clear the
// 3:1 large-text/non-text floor, so every ghost numeral on this page stays ≥24px.
export const GHOST_TEXT = "text-[#6B6B78]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// No display face this round (assigned: Pretendard only). Every string on this page — headline
// included — stays on the global --font-sans stack; nothing imports or references
// --font-display-grotesk/-wide/-mono.

// Exactly three rendered font weights across the whole page, measured by computed style, not
// class name: 400 (font-normal, body copy — Tailwind preflight's default), 600 (font-semibold,
// labels/captions/buttons/node text) and 800 (font-extrabold, headline + big figures). font-bold
// (700) and font-medium (500) are never used anywhere in this candidate's classes.

// Body-copy line-length container widths. Pretendard's mixed-glyph average advance is 0.44em
// (NOT `ch`, which in Pretendard is ~35% too wide). Formula:
// chars-per-line = container-px / (0.44 * font-size-px); solved here for container-px at a
// 70-character target (ceiling 75):
//   - 12px fine print  -> 370px container  (= 370 / (0.44*12) = 70.08 chars)
//   - 14px caption     -> 431px container  (= 431 / (0.44*14) = 69.96 chars)
//   - 16px body        -> 493px container  (= 493 / (0.44*16) = 69.88 chars)
//   - 18px lede        -> 554px container  (= 554 / (0.44*18) = 69.95 chars)
export const PROSE_WIDTH_12 = "max-w-[23.125rem]"; // 370px
export const PROSE_WIDTH_14 = "max-w-[26.9375rem]"; // 431px
export const PROSE_WIDTH_16 = "max-w-[30.8125rem]"; // 493px
export const PROSE_WIDTH_18 = "max-w-[34.625rem]"; // 554px
