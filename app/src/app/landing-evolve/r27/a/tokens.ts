// Shared design tokens for r27/a — Signal Map.
//
// Accent hue: violet (this round's diversity assignment for candidate a).
// Computed with the WCAG relative-luminance formula (Node one-off, not eyeballed —
// see candidates/a.md for the full worked numbers):
//   #6E56CF  (base fill) vs bg #0B0B0F  → 3.64:1  — clears the 3:1 large-text/
//            non-text floor, fails 4.5:1 body AA. Used only for borders, bar/
//            chip fills, and headline-scale text (≥24px / ≥19px bold).
//   white    on #6E56CF fill            → 5.39:1  — clears full AA. Small text
//            sitting on an accent-filled surface is always white, never ink.
//   #0B0B0F on #6E56CF fill             → 3.64:1  — only used for ≥24px/bold
//            text or non-text (e.g. a bold big numeral on a fill), never body.
//   #B6A6F0 (light tint) vs bg #0B0B0F  → 9.08:1  — used for small text, icons
//            and focus rings directly on the dark background.
//   #A1A1AA (muted) vs bg #0B0B0F       → 7.66:1  — body copy on bg.
//   white   vs bg #0B0B0F               → 19.64:1 — headings/primary body.
export const ACCENT = "#6E56CF";
export const ACCENT_TINT = "#B6A6F0";
export const BG = "#0B0B0F";
export const CARD_BG = "#131319";
export const MUTED = "#A1A1AA";

export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0]";

// Body-copy container widths, computed per the brief's 0.44em/glyph rule
// (chars = px / (0.44 × font-px)), never CSS `ch`:
//   17px body  → 520px → 520 / (0.44 × 17) ≈ 69.5 chars/line
//   18px lead  → 540px → 540 / (0.44 × 18) ≈ 68.2 chars/line
export const BODY = "max-w-[520px] text-[17px] leading-[1.6] text-[#A1A1AA]";
export const BODY_LG = "max-w-[540px] text-[18px] leading-[1.6] text-[#A1A1AA]";
