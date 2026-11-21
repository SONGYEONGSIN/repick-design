// Shared design tokens for r29/a — "Caliper" (a weighted-dial, live-re-ranking
// leaderboard landing).
//
// Theme: dark, the round default. Background sits at the DNA's own
// #0B0B0F rather than a custom near-black — nothing about this candidate's
// density or imagery needed a different base, so there was no reason to
// deviate from the documented default.
//
// Accent hue: teal/cyan family, as assigned (the catalog's two heaviest
// accents are violet and rose; teal appears nowhere in the live landing
// catalog at the time this was built). Two shades are used for two
// different jobs, because one hex cannot satisfy both contrast rules at
// once on a near-black page:
//
//   ACCENT      #14B8A6 (Tailwind teal-500) — used for text, icons,
//               borders and the focus ring, always directly on the
//               #0B0B0F/#111116 background, never as a filled surface
//               behind body-size text.
//   ACCENT_FILL #0F766E (Tailwind teal-700) — used only as a FILLED
//               background (buttons, match-score pills, active toggle
//               state), always paired with white text.
//
// Contrast, computed by hand with the WCAG relative-luminance formula
// (L = 0.2126R + 0.7152G + 0.0722B on linearized sRGB channels, contrast =
// (L_light + 0.05) / (L_dark + 0.05)):
//
//   #14B8A6 vs background #0B0B0F        → L_accent ≈ 0.3720, L_bg ≈ 0.00345
//            contrast ≈ (0.3720+0.05)/(0.00345+0.05) ≈ 7.90:1
//            Clears BOTH the 3:1 non-text/large-text floor and the 4.5:1
//            small body-text floor with wide margin — #14B8A6 is bright
//            enough to use directly as small-text/icon/link color on this
//            background, so no further-lightened tint was needed for text.
//   White (#FFFFFF) on #14B8A6 FILL       → contrast ≈ (1+0.05)/(0.3720+0.05)
//            ≈ 2.49:1 — FAILS even the 3:1 floor. #14B8A6 is light enough
//            that white text on top of it does not work (this is the
//            "empirically reversed" case the brief warns about, just
//            flipped the other way round: most catalog accents are dark
//            enough that white-on-fill passes and dark-ink-on-fill fails;
//            this particular teal is light enough that the opposite is
//            true). Rather than special-case dark ink on one surface and
//            white on another, #14B8A6 is simply never used as a filled
//            background behind text.
//   White (#FFFFFF) on #0F766E FILL       → L_fill ≈ 0.14196
//            contrast ≈ (1+0.05)/(0.14196+0.05) ≈ 5.47:1 — clears the
//            4.5:1 small-text-on-fill floor with real margin (not a
//            "just barely" 4.53). This is the ONLY hex used behind text,
//            and it always takes white text, never dark ink.
//   #0F766E FILL vs background #0B0B0F    → contrast ≈
//            (0.14196+0.05)/(0.00345+0.05) ≈ 3.59:1 — clears the 3:1
//            non-text floor, so a filled button/pill still reads as a
//            distinct shape against the page even before its label is
//            legible.
//   zinc-400 (#A1A1AA, the dark-theme muted-text floor) vs background
//            → contrast ≈ 7.67:1. text-zinc-500/600 are never used on
//            this page (banned on dark per the repo's dark-dim-text rule);
//            zinc-400 is the muted-caption floor throughout.
export const ACCENT = "#14B8A6"; // text / icons / borders / focus ring, on-background only
export const ACCENT_FILL = "#0F766E"; // filled surfaces only — always with white text
export const ACCENT_SOFT = "rgba(20, 184, 166, 0.14)"; // decorative wash/border tint, non-text

export const BG = "#0B0B0F";
export const SURFACE = "#121217"; // card/panel surface, one step up from BG
export const SURFACE_BORDER = "#242430";

export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14B8A6]";

// Body-copy container widths, computed per the brief's 0.44em-per-glyph rule
// (characters per line = container px ÷ (0.44 × font px) — never CSS `ch`,
// which is the width of "0" and runs ~35% wide of the true average):
//   18px lead  → 540px → 540 / (0.44 × 18) ≈ 68.2 chars/line
//   17px body  → 520px → 520 / (0.44 × 17) ≈ 69.5 chars/line
//   14px (sm)  → 430px → 430 / (0.44 × 14) ≈ 69.8 chars/line
//   12px (xs)  → 370px → 370 / (0.44 × 12) ≈ 70.1 chars/line
// All land just under the ~70-char target, with slack below the 75-char
// ceiling the same way the width-overflow rules treat "just barely fits"
// as a failure.
export const BODY_LG = "max-w-[540px] text-[18px] leading-[1.6] text-zinc-300";
export const BODY = "max-w-[520px] text-[17px] leading-[1.6] text-zinc-300";
export const BODY_SM = "max-w-[430px] text-sm leading-[1.6] text-zinc-300";
export const CAPTION = "max-w-[370px] text-xs leading-relaxed text-zinc-400";
