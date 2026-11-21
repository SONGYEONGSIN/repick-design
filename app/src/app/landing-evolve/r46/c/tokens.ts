// Shared literal color tokens + class strings for the "Payout Speed Race" candidate
// (light theme, near-white surface, rose accent). Exact hex values and the WCAG
// relative-luminance math behind every pairing are written up in full in
// vault/20-generations/2026-11-03-auto-landing-r46/candidates/c.md — this file is the
// single place those decisions turn into classes so every component draws from the
// same palette.

export const BG = "#FFFFFF"; // page surface. Relative luminance L = 1.
export const BG_CLASS = "bg-white";
export const INK = "#171717"; // near-black default body/ink text on the white surface. L ≈ 0.00861.
export const INK_CLASS = "text-[#171717]";

// Card / panel surface: one step off white so the race panel and cards read as a
// raised tray, without introducing a second hue family.
export const PANEL_BG = "#F7F5F5";
export const PANEL_BORDER = "border-[#E8E5E4]";

// Inactive progress-track fill: a tinted neutral, deliberately distinct from both the
// page bg and the panel bg so the "unfilled" portion of each race track is still
// visibly a track (not a gap in the layout). L ≈ 0.783 (computed from #E5E5E5 below).
export const TRACK_BG = "#E5E5E5";
export const TRACK_BG_CLASS = "bg-[#E5E5E5]";

// The one accent family for this candidate: rose. Two scale-dependent tokens, each
// computed against the surface it actually renders on (white = L 1, ink = L ≈ 0.00861):
//   - rose-600 #E11D48 (L ≈ 0.1736) is the BASE accent: used only at large scale — fills,
//     borders, progress-bar fills, ≥24px/19px-bold figures and the CTA button background.
//     · White text on this fill            -> 4.70:1  (clears 4.5:1 AA for any size)
//     · Dark ink (#171717) text on this fill -> 3.82:1  (clears the 3:1 large-text/non-text
//       floor only — ink is never paired with this fill below 24px/19px-bold)
//   - rose-700 #BE123C (L ≈ 0.1171) is the SMALL-SCALE tint: used for every small text,
//     icon or standalone accent-colored label that sits directly on the white/near-white
//     page surface (never reusing the base accent at small sizes, per the usage-tier rule).
//     · On white                            -> 6.28:1  (clears 4.5:1 AA with real margin —
//       darker than the base accent on purpose, since on a LIGHT surface a darker, more
//       saturated step raises contrast against white, where the brief's "brighter tint"
//       guidance — written for a lighter-tint-on-dark-bg case — inverts.)
// Focus rings use `outline` + `outline-offset`, which places the ring on the page
// surface just outside the element rather than on top of any fill, so a ring never has
// to be legible against the accent fill itself; the base accent at 4.70:1 against white
// is used for every ring, satisfying the 3:1 non-text floor with margin to spare.
export const ACCENT_HEX = "#E11D48";
export const ACCENT_BG = "bg-[#E11D48]";
export const ACCENT_BORDER = "border-[#E11D48]";
export const ACCENT_TEXT_ON_FILL = "text-white"; // text/icons ON the accent fill, ≤19px non-bold
export const ACCENT_INK_ON_FILL = "text-[#171717]"; // text ON the accent fill, ≥24px/19px-bold/non-text only

export const ACCENT_SMALL_HEX = "#BE123C";
export const ACCENT_SMALL_TEXT = "text-[#BE123C]"; // small text/icons/standalone labels on the page surface
export const ACCENT_SOFT_BG = "bg-[#FFF1F2]"; // very light rose chip/badge surface (L ≈ 0.95+)
export const ACCENT_SOFT_BORDER = "border-[#FFD7DC]";

// Muted text floor. #525252 (L ≈ 0.0841) against white -> 7.83:1; against the panel
// surface (#F7F5F5, L ≈ 0.933) -> 7.42:1; against the inactive track (#E5E5E5, L ≈
// 0.783) -> 6.22:1. All three clear 4.5:1 with margin, so one muted token is safe to
// reuse everywhere in this candidate, including inside the toggle's inactive segment.
export const MUTED_TEXT = "text-[#525252]";
export const MUTED_HEX = "#525252";

// Focus ring: outline-based (not Tailwind's `ring-*` utilities), verified to actually
// paint. Deliberately does NOT set an unconditional `outline-none` base: in this
// Tailwind v4 setup that shares a `--tw-outline-style` custom property across the
// `outline-none`/`outline`/`outline-2` utilities, an unconditional `outline-none`
// silently cancels a later `focus-visible:outline*` even though it reads as an
// override in the class list (confirmed empirically via computed styles on a real
// keyboard focus — outlineStyle stayed "none" despite outlineWidth/outlineColor
// being set). Omitting the unconditional class entirely — relying on the browser's
// default "no outline" at rest and only ever setting outline-style via
// `focus-visible:outline` — is what actually lets the ring paint.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]";

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.2em]";
export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.12em]";
export const STAT_LABEL = "text-[11px] font-semibold uppercase tracking-[0.1em]";

// Exactly three rendered font weights across the whole page: 400 (font-normal, body
// copy), 600 (font-semibold, labels/captions/buttons/badges), 800 (font-extrabold,
// headline + every big figure: race ETA, tally total, net-payout numbers). font-bold
// (700) and font-medium (500) are never used anywhere in this candidate. No
// `--font-display-*` class is used anywhere, including the headline — this candidate
// is Pretendard-only (--font-sans) by deliberate choice, per the brief's "no display
// face" instruction for this slot.
