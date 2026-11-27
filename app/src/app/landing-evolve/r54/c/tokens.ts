// Shared literal design tokens -- light theme. Accent is green, distinct from this round's
// banned/over-represented hues (amber, teal, violet, blue, orange, cyan, rose) and from this
// catalog's most recent landing accent (r53/c used lime two rounds ago) -- green has zero prior
// uses catalog-wide as of this round.
//
// Contrast computed via sRGB -> linearised channel -> WCAG relative luminance
// (L = 0.2126 R + 0.7152 G + 0.0722 B, each channel gamma-expanded), then
// contrast = (L_lighter + 0.05) / (L_darker + 0.05). Values below were computed with a small
// script implementing exactly that formula (not eyeballed):
//
//   L(white)            = 1.0
//   L(#0B0B0F) ink       = 0.0034
//   L(#16A34A) green-600 = 0.2686
//   L(#15803D) green-700 = 0.1593
//   L(#52525B) zinc-600  = 0.0858
//   L(#FAFAFA) zinc-50   = 0.9560
//   L(#D4D4D8) zinc-300  = (light neutral, donate fill)
//   L(#27272A) zinc-800  = (dark neutral, bundle fill)
//
//   White text on a green-600 fill:   (1.0+0.05)/(0.2686+0.05) = 3.296:1 -- FAILS body AA (4.5).
//   Dark ink on a green-600 fill:     (0.2686+0.05)/(0.0034+0.05) = 5.961:1 -- passes every size.
//     -> green-600 is a LIGHT accent (same family as this catalog's amber/lime precedent): every
//        fill that uses it carries dark ink text, never white.
//   green-600 text directly on white: (1.0+0.05)/(0.2686+0.05) = 3.296:1 -- clears only the
//     large-text / non-text 3:1 floor (>=24px, or borders/bars/focus rings as graphical objects).
//     Not safe for body-size text.
//   green-700 text directly on white: (1.0+0.05)/(0.1593+0.05) = 5.016:1 -- clears body AA (4.5).
//     -> green-600 is reserved for fills, borders, >=24px display text and chart segments;
//        green-700 carries every small-text / icon / focus-ring role.
//   green-600 border on the zinc-50 drop-zone surface: (0.9560+0.05)/(0.2686+0.05) = 3.158:1 --
//     still clears the 3:1 non-text floor with a real (not knife-edge) margin, which is why zone
//     surfaces are zinc-50 (near-white) rather than a green-tinted surface: a green-600 border on
//     a green-tinted ~zinc-100-equivalent surface measured only 3.06:1 in a first pass -- too
//     close to the floor by this catalog's own "no just-barely" posture -- so the tint was dropped
//     in favour of neutral zinc-50 zones with white cards inside them.
//   zinc-600 (muted text) on white:    7.73:1 / on zinc-50 zones: 7.18:1 -- safe under BOTH the
//     pure-white zinc-500 floor and the tinted-surface zinc-600 floor, on every surface this
//     route uses. Standardising all secondary/muted text on zinc-600 (never zinc-500) avoids
//     auditing each surface separately.
export const BG = "#FFFFFF";
export const INK = "#0B0B0F";
export const MUTED_HEX = "#52525B"; // zinc-600, safe on every surface this route uses (see above)
export const MUTED_TEXT = "text-[#52525B] font-normal";

export const ZONE_SURFACE_HEX = "#FAFAFA"; // zinc-50 -- neutral, not green-tinted (see math above)
export const ZONE_BORDER_HEX = "#E4E4E7"; // zinc-200
export const CARD_BORDER_HEX = "#E4E4E7";

export const ACCENT_LARGE_HEX = "#16A34A"; // green-600 -- fills, borders, chart ink, >=24px text
export const ACCENT_SMALL_HEX = "#15803D"; // green-700 -- body-size text, icons, focus ring

export const ACCENT_FILL = "bg-[#16A34A]";
export const ACCENT_BORDER = "border-[#16A34A]";
export const ACCENT_TEXT_LARGE = "text-[#16A34A]";
export const ACCENT_TEXT_SMALL = "text-[#15803D]";
export const ON_ACCENT_FILL_TEXT = "text-[#0B0B0F]"; // dark ink, never white -- see math above

// No `outline-none` anywhere in this string and no bare `ring-*` utility -- Tailwind v4 in this
// build paints `ring`/`ring-offset` fully transparent, so every focus indicator here uses a real
// `outline` instead, verified as actually rendered (not just present in the class list).
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const CAPTION = "text-[12px] font-normal";

// One display face, Latin headline-scale text only, never body copy or Korean (none on this
// route). --font-display-mono is the assignment for this candidate (distinct from any face
// candidates a/b in this round may pick).
export const DISPLAY_FONT = "var(--font-display-mono)";

// Body-paragraph width arithmetic (brief constant: Pretendard mixed-script average advance is
// 0.44em per character; target ~70 chars, hard ceiling 75; `ch` banned -- it renders ~35% wider
// than the true average in Pretendard).
// chars-per-line = container-px / (0.44 * font-size-px)
// All flowing body paragraphs on this route are set at 16px inside a 480px container:
//   480 / (0.44 * 16) = 480 / 7.04 = 68.18 chars -- under the ~70 target, well under the 75
//   ceiling, with headroom matching the width-validation "16px minimum margin" posture.
export const PROSE_WIDTH = "max-w-[480px]";
export const BODY_TEXT = "text-[16px] font-normal leading-[1.6]";

// Exactly 3 rendered font weights for the whole route, audited on computed weight, not classes:
//   400 (font-normal)   -- every flowing paragraph, captions, muted labels
//   600 (font-semibold) -- card titles, buttons, pills, stat labels, nav-level emphasis
//   800 (font-extrabold)-- h1/h2 display headlines and the large payout figure
// No text node in this route is left without one of these three classes.
