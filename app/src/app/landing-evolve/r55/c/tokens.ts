// Shared literal design tokens — dark theme (this round's assignment), single accent hue: orange.
// Literal hex everywhere (never a named Tailwind color, never `dark:text-*`): Tailwind v4 in this
// app paints `ring`/`ring-offset` fully transparent and recomputes named palette colors through
// oklab, and `dark:text-zinc-500` / `dark:text-zinc-600` are an explicit hard-fail regardless — a
// plain `text-[#HEX]` class sidesteps both.
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance (not guessed):
//
//   srgb_to_linear(c) = c/12.92                     if c <= 0.03928
//                      = ((c+0.055)/1.055)^2.4       otherwise
//   L = 0.2126*R + 0.7152*G + 0.0722*B
//   contrast(L1, L2) = (max(L1,L2)+0.05) / (min(L1,L2)+0.05)
//
//   L(#0B0B0F) bg/ink   = 0.00345
//   L(#15151B) panel    = 0.00775
//   L(#A1A1AA) muted    = 0.35951
//   L(#C7C7CF) copy     = 0.57408
//   L(#FFFFFF) white    = 1.0
//   L(#FF7A33) accent   = 0.35419   (R=1.0, G=0.19463 linear, B=0.03310 linear)
//
//   ACCENT (#FF7A33) vs bg (#0B0B0F):        (0.35419+0.05)/(0.00345+0.05) = 7.56:1
//     -> clears 4.5:1 body-text AA at ANY size, not just the >=24px/19px-bold large-text floor the
//        brief's default #6E56CF example needs. One accent hex is therefore enough for text, icons,
//        borders AND fills on this route — the brief's "full fill for large text only, lighter tint
//        for small text/icons" split is a floor, not a requirement to always ship two shades; this
//        hue already clears the higher bar everywhere, so a second lighter tint would add a weight
//        class / token with no contrast benefit. (Re-checked against the slightly lighter panel
//        surface too: (0.35419+0.05)/(0.00775+0.05) = 7.00:1 — still comfortably clears AA.)
//   WHITE text ON the #FF7A33 fill:          (1.0+0.05)/(0.35419+0.05) = 2.60:1
//     -> FAILS even the large-text 3:1 floor. This is the opposite of the brief's default-purple
//        worked example (where white-on-fill is the safe choice and dark ink only clears large
//        text) — #FF7A33 is bright enough that white never passes on it, at any size. White text is
//        therefore never used on an accent-filled surface anywhere on this route.
//   DARK INK (#0B0B0F) text ON the #FF7A33 fill: (0.35419+0.05)/(0.00345+0.05) = 7.56:1
//     -> clears body-text AA with the same margin as accent-on-bg (same two luminances, inverted
//        role). Every accent-filled control (CTA buttons, the "likely"/"ready to send" outcome
//        chip, filled gap-track segment) uses dark-ink (#0B0B0F) text/icons, never white.
//   MUTED (#A1A1AA) vs bg:                   (0.35951+0.05)/(0.00345+0.05) = 7.67:1 — AA-safe caption text.
//   COPY (#C7C7CF) vs bg:                    (0.57408+0.05)/(0.00345+0.05) = 11.68:1 — body paragraph text.
//   COPY (#C7C7CF) vs panel:                 (0.57408+0.05)/(0.00775+0.05) = 10.81:1 — same, on the panel surface.
//
// A custom near-black gray (tried at an early draft for the decorative folio numbers, ~2.9:1 on bg)
// is deliberately NOT used anywhere: aria-hidden is not a color-contrast exemption for a visible
// text node, so every folio number and caption on this route uses MUTED or COPY instead — both
// already comfortably clear 4.5:1 small-text AA, so folio numbers need no separate, weaker tier.
export const BG = "#0B0B0F";
export const PANEL = "#15151B"; // card/track surfaces, one step up from bg
export const PANEL_BORDER = "#27272F";
export const INK = "#FFFFFF"; // default foreground on bg, matches the brief's fg-matches-bg rule
export const DARK_INK = "#0B0B0F"; // the only safe text color ON the accent fill (see math above)

export const ACCENT_HEX = "#FF7A33"; // orange — assigned hue, picked shade (hue ~24°), 7.56:1 on bg
export const ACCENT_FILL = "bg-[#FF7A33]";
export const ACCENT_TEXT = "text-[#FF7A33]"; // body-size-safe everywhere on this route, see math above
export const ACCENT_BORDER = "border-[#FF7A33]";
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // never text-white on this fill — see math above

export const MUTED = "text-[#A1A1AA]"; // 7.67:1 on bg — captions, folio numbers, fine print
export const COPY_HEX = "#C7C7CF"; // 11.68:1 on bg / 10.81:1 on panel — body paragraph color

// No `outline-none` anywhere in this route and no `ring-*` utility (see header note) — every
// interactive element pairs a visible `focus-visible:outline` with nothing that can cancel it out.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A33]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const FOLIO = "text-[11px] font-semibold uppercase tracking-[0.16em]";

// Display face: none. This candidate is Pretendard-only by assignment (a sanctioned choice, not a
// fallback) — no `--font-display-*` variable is ever set, so `var(--font-sans)` carries every
// heading too. Hierarchy comes from size/tracking/weight contrast instead of a second typeface.

// Body-width arithmetic (brief: Pretendard's mixed-script average glyph advance is 0.44em/char,
// never `ch` — `ch` is the advance of the digit "0", ~35% wider than that average, and silently
// over-budgets the line). chars-per-line = container-px / (0.44 * font-size-px). Target ~70 chars,
// hard ceiling 75.
//   Hero subhead, 18px:  0.44*18 = 7.92px/char. 70 chars ~= 554px, 75-char ceiling ~= 594px.
//     Container used: 540px -> 540/7.92 = 68.2 chars/line. Under target, well under the ceiling.
//   Section body copy, 16px: 0.44*16 = 7.04px/char. 70 chars ~= 493px, ceiling ~= 528px.
//     Container used: 480px -> 480/7.04 = 68.2 chars/line.
//   Testimonial quotes, 14px: 0.44*14 = 6.16px/char. 70 chars ~= 431px, ceiling ~= 462px.
//     Container used: 420px -> 420/6.16 = 68.2 chars/line.
// All three are literal pixel max-widths (`max-w-[...]`), never `max-w-[70ch]`.
export const PROSE_WIDTH_HERO = "max-w-[540px]";
export const PROSE_WIDTH_BODY = "max-w-[480px]";
export const PROSE_WIDTH_CARD = "max-w-[420px]";
