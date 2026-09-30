// Shared design tokens for r28/a — "The Route" (a Sankey/flow-diagram landing).
//
// Theme: light (this round's diversity lean). Accent hue: a deep berry/rose
// (#BE185D, close to Tailwind's pink-700) — deliberately not amber/teal/violet
// (the catalog's three most-used accents) and not the blue-hex or emerald hues
// used by the two most recent winners.
//
// Contrast, computed by hand with the WCAG relative-luminance formula
// (L = 0.2126R + 0.7152G + 0.0722B on linearized channels; full working in
// candidates/a.md):
//   #BE185D vs white (#FFFFFF)        → 6.03:1 — clears body-text AA (4.5:1)
//            with margin. This means the raw accent is dark/saturated enough
//            to use directly as small text/icon color on the light bg, with
//            no separate "light tint" needed (that adjustment is a dark-theme
//            move; in light theme the raw hue already clears the floor).
//   white on #BE185D fill             → 6.03:1 (same pair) — the fill+text
//            rule is satisfied at ANY size, so every accent-filled surface
//            (buttons, filled chips) uses white text, never dark ink.
//   #BE185D vs dark ink (#18181B)     → 2.94:1 — fails even the 3:1 large-
//            text/non-text floor, so dark ink is NEVER used on the accent
//            fill on this page (sidesteps the large-vs-small ink distinction
//            entirely by always using white on fill).
export const ACCENT = "#BE185D";
export const ACCENT_SOFT = "#FDF2F8"; // pink-50–class wash, background only, never a text color
export const ACCENT_RIBBON = "rgba(190, 24, 93, 0.32)"; // ribbon fill, non-text, decorative

export const BG = "#FFFFFF";
export const BG_ALT = "#FAFAFA"; // zinc-50–class banding between sections
export const INK = "#111113"; // near-black heading/body-strong color

export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

// Muted text: the brief's light-theme floor is surface-conditional (zinc-500
// on near-white, zinc-600 on a tinted/filled surface). Standardizing on
// zinc-600 everywhere a muted label appears removes the need to track which
// floor applies per surface — 600 clears both floors with margin, at the
// small cost of slightly less contrast-range between "muted" and "heading".
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE185D]";

// Body-copy container widths, computed per the brief's 0.44em/glyph rule —
// characters per line = container px ÷ (0.44 × font px), never CSS `ch`:
//   17px body → 520px → 520 / (0.44 × 17) ≈ 69.5 chars/line
//   18px lead → 540px → 540 / (0.44 × 18) ≈ 68.2 chars/line
export const BODY = "max-w-[520px] text-[17px] leading-[1.6] text-zinc-600";
export const BODY_LG = "max-w-[540px] text-[18px] leading-[1.6] text-zinc-600";

// Smaller explanatory/caption text that still runs to full sentences (not a
// two-to-three-word label) needs its own width cap too, even at text-xs/
// text-sm — the 0.44em rule applies at any font size, and a wide panel with
// no cap would let a long sentence render as one very long line.
//   14px (text-sm) → 430px → 430 / (0.44 × 14) ≈ 69.8 chars/line
//   12px (text-xs) → 370px → 370 / (0.44 × 12) ≈ 70.1 chars/line
export const BODY_SM = "max-w-[430px] text-sm leading-[1.6] text-zinc-700";
export const CAPTION = "max-w-[370px] text-xs leading-relaxed text-zinc-600";
