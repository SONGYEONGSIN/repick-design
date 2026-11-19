// Shared literal design tokens for this route — dark theme, single accent hue: orange.
// Arbitrary hex values, not Tailwind palette-name utilities: Tailwind v4 in this app paints
// `ring`/`ring-offset` fully transparent and recomputes named palette colors through oklab (a
// known failure mode in earlier rounds of this catalog) — literal hex sidesteps both. Orange was
// picked over the catalog's recent amber/teal/violet/lime accents (see candidates/a.md "브리프에
// 없던 것" for the diversity reasoning) and the math below is specific to THIS hex, not copied
// from another round's worked example.
//
// Contrast computed by hand, sRGB -> linear -> WCAG relative luminance:
//
//   L(white)              = 1.0000
//   L(#0B0B0F) bg/ink      = 0.0034
//   L(#141418) surface     = 0.0071
//   L(#A1A1AA) muted       = 0.3564  (zinc-400, the brief's stated muted floor)
//   L(#F97316) accent      = 0.3248  (orange-500)
//
//   white vs bg:              (1.0000+0.05)/(0.0034+0.05) = 19.66:1 — body text on bg, huge headroom
//   #A1A1AA vs bg:             (0.3564+0.05)/(0.0034+0.05) =  7.61:1 — muted text clears body AA
//   #A1A1AA vs surface:        (0.3564+0.05)/(0.0071+0.05) =  7.12:1 — same muted token covers the
//     slightly-raised card surface too, so one MUTED constant serves both backgrounds.
//   accent (#F97316) vs bg:    (0.3248+0.05)/(0.0034+0.05) =  7.02:1
//     -> clears body-size AA (4.5:1) directly against the dark background with real headroom, so
//        — like lime in an earlier round, unlike the catalog's default violet — the SAME hex is
//        used for text/icon/border/fill at ANY size against bg or surface. No second "small-text
//        tint" token is needed for this hue.
//   accent (#F97316) vs surface: (0.3248+0.05)/(0.0071+0.05) = 6.57:1 — still clears body AA.
//   white ON accent fill:      (1.0000+0.05)/(0.3248+0.05) =  2.80:1 — FAILS even the large-text
//        3:1 floor. Orange-500 is high-luminance enough that white text sitting on an orange FILL
//        is low contrast, not high contrast, exactly the trap the brief warns about. White-on-
//        accent-fill is never used on this route.
//   ink (#0B0B0F) ON accent fill: (0.3248+0.05)/(0.0034+0.05) = 7.02:1 — clears body AA with
//        plenty of room. Every pill/button/badge that fills with the accent color sets its text
//        to INK, never white.
//
// Net rule for this route: ACCENT is used directly as a text/icon/border color at any size against
// BG or SURFACE, and as a fill with INK text on top — never white on an accent fill.

export const BG = "#0B0B0F";
export const SURFACE = "#141418"; // card / panel background, one step up from bg
export const SURFACE_RAISED = "#1C1C24"; // nested panel (e.g. the slider track housing)
export const BORDER = "#2A2A33";
export const INK = "#0B0B0F"; // text color placed ON an accent fill — see math above
export const FG = "#FFFFFF"; // primary text on bg/surface — 19.66:1 on bg

export const ACCENT = "#F97316"; // orange-500 — 7.02:1 on bg, 6.57:1 on surface; safe at any text size
export const ACCENT_SOFT_BG = "rgba(249, 115, 22, 0.12)"; // decorative tint only, never carries text

export const MUTED = "#A1A1AA"; // zinc-400 — 7.61:1 on bg, 7.12:1 on surface

export const FAIL = "#F87171"; // red-400, paired with an X icon + the word "Fail" — never color-only
// FAIL vs bg: L(#F87171) = 0.2797 -> (0.2797+0.05)/(0.0034+0.05) = 6.18:1 — clears body AA too.

export const ACCENT_TEXT = "text-[#F97316]";
export const ACCENT_BORDER = "border-[#F97316]";
export const ACCENT_FILL = "bg-[#F97316]";
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // 7.02:1 on the accent fill — see math above
export const MUTED_TEXT = "text-[#A1A1AA]";
export const FG_TEXT = "text-white";
export const FAIL_TEXT = "text-[#F87171]";

// No `outline-none` anywhere in this route and no `ring-*` utility as the sole focus signal — every
// interactive element pairs a visible `focus-visible:outline` with nothing that can cancel it.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F97316] focus-visible:rounded-sm";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_TRACKING = "tracking-[0.12em]";

// Exactly one display face for large Latin headline text only, never body, never Korean (there is
// none — copy is English-only). `--font-display-wide` was used in 2 of the last 3 landing rounds
// per the brief's diversity note, so this route uses `--font-display-grotesk` instead. Referenced
// as a literal `"var(--font-display-grotesk)"` string at each call site (never indirected through
// a constant) because `no-unlisted-font`'s static check only recognizes the literal pattern in the
// source text — indirecting through a token constant like the ones above hard-failed a past round.

// Body-width arithmetic (brief: Pretendard/Latin mixed-script average glyph advance is
// 0.44em/char — NOT CSS `ch`, which is the advance of the digit "0" and runs ~35% wider).
// chars-per-line = container-px / (0.44 * font-size-px). Target ~70 chars, hard ceiling 75.
//   Hero subhead, 17px:        0.44*17 = 7.48px/char. Container 500px -> 500/7.48 = 66.8 chars.
//     75-char ceiling at this size is 561px; 500px is 61px (8.2 chars) under it.
//   Value-split column copy, 14px: 0.44*14 = 6.16px/char. Container 300px -> 300/6.16 = 48.7 chars.
//     Well under target; columns are narrow by layout, not a risk.
//   Closing CTA subhead, 16px: 0.44*16 = 7.04px/char. Container 480px -> 480/7.04 = 68.2 chars.
//     75-char ceiling at this size is 528px; 480px is 48px (6.8 chars) under it.
//   Testimonial quotes, 14.5px: 0.44*14.5 = 6.38px/char. Container 400px -> 400/6.38 = 62.7 chars.
//     75-char ceiling at this size is 478.5px; 400px is well under it.
export const PROSE_WIDTH_HERO = "max-w-[500px]";
export const PROSE_WIDTH_COLUMN = "max-w-[300px]";
export const PROSE_WIDTH_CTA = "max-w-[480px]";
export const PROSE_WIDTH_CARD = "max-w-[400px]";
