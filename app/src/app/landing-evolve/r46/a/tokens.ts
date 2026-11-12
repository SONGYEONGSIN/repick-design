// Shared literal color tokens + class strings for the "Credit Stack" candidate
// (dark theme, near-black surface, sky accent). Full WCAG relative-luminance math behind
// every pairing below is written up in vault/20-generations/2026-11-03-auto-landing-r46/candidates/a.md —
// this file is the single place those decisions turn into classes/hexes every component draws from.

export const BG = "#0B0B0F"; // near-black page surface. Relative luminance L ≈ 0.00339.
export const BG_CLASS = "bg-[#0B0B0F]";
export const INK = "#F5F5F7"; // near-white default body/ink text on the dark surface.
export const INK_CLASS = "text-[#F5F5F7]";

// Card surface: one step lighter than the page so cards/panels read as raised, without adding
// a second hue family.
export const CARD_BG = "#15151C";
export const CARD_BG_CLASS = "bg-[#15151C]";
export const CARD_BORDER = "border-white/10";

// ---- The one accent family for this candidate: sky. ----
// Base accent (fills/borders/large text ≥24px or ≥19px bold): #0EA5E9 (sky-500).
//   - contrast vs BG (#0B0B0F) as foreground text/icon/border  -> 7.19:1  (clears body-text AA)
//   - contrast of WHITE text ON a #0EA5E9 fill                  -> 2.73:1 (FAILS even the 3:1
//     large-text floor for this exact hex — never pair white text with this fill, any size)
//   - contrast of dark-ink (#0B0B0F) text ON a #0EA5E9 fill      -> 7.19:1 (clears body-text AA,
//     safe for any size, so dark ink is used on every accent fill in this candidate, not just
//     large text, since white never clears the floor here)
export const ACCENT_HEX = "#0EA5E9";
export const ACCENT_TEXT = "text-sky-500"; // eyebrows/icons/links/selected-state copy directly on BG/CARD_BG
export const ACCENT_FILL = "bg-sky-500"; // filled chips/bars/active pills — always paired with dark ink text
export const ON_ACCENT_TEXT = "text-[#0B0B0F]"; // dark ink, for any text ON a sky-500 fill (every size)
export const ACCENT_BORDER = "border-sky-500/50";

// Darker fill for buttons that still want a *filled* look at button scale: #0369A1 (sky-700).
//   - contrast of WHITE text ON a #0369A1 fill -> 5.93:1 (clears body-text AA) — used only here,
//     never for the lighter #0EA5E9 fill above.
export const ACCENT_BUTTON_FILL = "bg-sky-700 hover:bg-sky-800";
export const ON_ACCENT_BUTTON_TEXT = "text-white";

// Small text / icons / focus rings get a brighter TINT of the same hue rather than the base
// accent, per the usage-tier rule: #7DD3FC (sky-300).
//   - contrast vs BG -> 11.81:1 (very safe for thin strokes / focus rings on the dark surface)
export const ACCENT_TINT_HEX = "#7DD3FC";
export const ACCENT_TINT_TEXT = "text-sky-300";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 focus-visible:rounded-[3px]";

// Muted text floor kept at zinc-400 (#A1A1AA) everywhere on this dark surface.
//   - contrast vs BG -> 7.68:1 — well clear of the 4.5:1 body-text floor.
export const MUTED_TEXT = "text-zinc-400";
export const MUTED_HEX = "#A1A1AA";

// Decorative ghost glyphs (large background numerals etc.) still need ≥3:1 even aria-hidden.
// #6B6B78 against #0B0B0F measures ≈3.74:1 — clears the large-text/non-text floor.
export const GHOST_TEXT = "text-[#6B6B78]";
export const GHOST_HEX = "#6B6B78";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.14em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";

// Display face for this candidate: Space Grotesk Display via --font-display-grotesk, latin-only,
// large headline/figure text only. Body and every other string stay on --font-sans (Pretendard).
export const DISPLAY = "font-[family-name:var(--font-display-grotesk)]";

// Exactly three rendered font weights across the whole page: 400 (font-normal, body copy),
// 600 (font-semibold, labels/captions/buttons), 800 (font-extrabold, headline + big figures).
// font-bold (700) and font-medium (500) are never used anywhere in this candidate.

// Body-copy line-length container widths (see candidates/a.md for the full calculation):
// chars-per-line = container-px / (0.44 * font-size-px). Target ~70 chars, ceiling 75.
//   - 12px fine-print text -> 368px container (~69.7 chars)
//   - 16px body text       -> 488px container (~69.3 chars)
//   - 18px lede text       -> 552px container (~69.7 chars)
export const PROSE_WIDTH_12 = "max-w-[23rem]"; // 368px, for text-xs (12px) wrapped copy
export const PROSE_WIDTH_16 = "max-w-[30.5rem]"; // 488px, for text-base (16px) paragraphs
export const PROSE_WIDTH_18 = "max-w-[34.5rem]"; // 552px, for text-lg (18px) paragraphs
