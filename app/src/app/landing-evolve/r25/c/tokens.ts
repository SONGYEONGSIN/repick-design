/**
 * Category Demand Ribbon — route-scoped design tokens (r25 / candidate c).
 *
 * THEME: light. Ground `#FAFAFA` (near-white, not pure `#FFFFFF`) so the ribbon panel and cards
 * (`#FFFFFF`) read as raised surfaces. Chosen over dark per the round's diversity steering note
 * (violet + dark theme overrepresented in the catalog) and because a light, paper-like ground reads
 * closer to a resale marketplace's product photography than a dark "dashboard" treatment would.
 *
 * ACCENT: single brand hue, ORANGE family (not violet/amber/teal, not the cyan r24/c already used in
 * this same catalog). Two tints, picked by computed WCAG contrast, not by eye — full derivation
 * (relative-luminance formula, run through Node, not eyeballed) is repeated in candidates/c.md under
 * "브리프에 없던 것":
 *
 *   Pairing                                                Ratio     Verdict
 *   ----------------------------------------------------  --------  ---------------------------------
 *   #C2410C (orange-700, FILL) vs #FAFAFA (page bg)         4.96:1   clears AA for text at every size,
 *                                                                     not just the 3:1 large-text floor
 *                                                                     — used for fills/borders/large
 *                                                                     text/buttons/the "Lenses" band
 *   #C2410C vs #F4F4F5 (panel/card bg)                      4.71:1   still clears normal-text AA on
 *                                                                     the slightly tinted panel surface
 *   #9A3412 (orange-800, TEXT TINT) vs #FAFAFA               7.00:1   extra headroom for small text /
 *                                                                     icons / the focus-visible ring —
 *                                                                     on a LIGHT ground the higher-
 *                                                                     contrast tint is the DARKER step,
 *                                                                     not a "brighter" one (the brief's
 *                                                                     phrasing assumes a dark ground;
 *                                                                     what matters is the measured
 *                                                                     ratio, and #9A3412 is the hue
 *                                                                     that clears 4.5:1 with margin)
 *   #FFFFFF (white) as TEXT on #C2410C FILL                  5.18:1   clears AA at every text size —
 *                                                                     the only text color used ON an
 *                                                                     accent-filled surface on this page
 *   #111114 (ink) as TEXT on #C2410C FILL                    3.64:1   large-text/non-text floor only —
 *                                                                     NOT used for body text on fill
 *                                                                     anywhere on this route (white
 *                                                                     already clears full AA, so ink-
 *                                                                     on-fill is simply unneeded here)
 *   #52525B (zinc-600, MUTED) vs #FAFAFA                     7.41:1   safe on the page ground
 *   #52525B vs #F4F4F5 (panel)                                7.03:1   safe on panel/card surfaces too
 *
 * SECOND HUE (chart categorical palette, not a second BRAND accent): the ribbon chart must
 * distinguish 4 categories. Rather than adding a second brand color, 3 of the 4 bands use graduated
 * NEUTRALS (near-monochrome, per design-principles) and only the 4th — Lenses, which is also the
 * category "your item" belongs to — carries the orange brand accent. That reuses the "sparingly"
 * accent for the one band the page is actually arguing about, instead of spending accent budget on
 * decoration. Non-text ("meaningful graphical object", WCAG 1.4.11) contrast for every band fill
 * against the `#FAFAFA` page ground, all >= 3:1:
 *
 *   Band              Fill        vs #FAFAFA   Role
 *   ----------------  ----------  -----------  --------------------------------------------------
 *   Lenses            #C2410C     4.96:1       brand accent — the band "your item" sits in
 *   Camera Bodies      #3F3F46    10.01:1       neutral (zinc-700)
 *   Accessories        #71717A     4.63:1       neutral (zinc-500) — NOTE: the brief's literal
 *                                               `#A1A1AA` muted token measures only 2.46:1 against
 *                                               this LIGHT ground (it is the dark-theme default and
 *                                               assumes a dark bg behind it) so it is used here only
 *                                               for small TEXT tucked on a white/near-white card
 *                                               surface where `#52525B` (7.41:1) is used instead —
 *                                               never as a standalone graphical fill against `#FAFAFA`
 *   Vintage Film Gear #18181B     16.97:1       neutral (zinc-900)
 *
 * Band fills render at 90% opacity for a layered streamgraph look; opacity is kept high enough
 * (>=0.9) that effective contrast against the page stays within ~0.3 of the solid-hex numbers above,
 * so none of the four drops under the 3:1 non-text floor in practice.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const BG = "#FAFAFA";
export const PANEL = "#FFFFFF";
export const PANEL_TINT = "#F4F4F5";
export const INK = "#111114";
export const MUTED = "#52525B";
export const BORDER = "#E4E4E7";

export const ACCENT_FILL = "#C2410C"; // buttons, primary CTA bg, "Lenses" band, large text, borders
export const ACCENT_TEXT = "#9A3412"; // small text / icons / focus-visible ring — 7.00:1 on BG
export const ACCENT_TINT_BG = "#FFF7ED"; // orange-50, used only as a subtle chip/callout background

export const CATEGORY_COLOR = {
  lenses: ACCENT_FILL,
  bodies: "#3F3F46",
  accessories: "#71717A",
  vintage: "#18181B",
} as const;

export const INK_TEXT = "text-[#111114]";
export const MUTED_TEXT = "text-[#52525B]";

// Visible-focus idiom: a real outline + offset, never a bare `ring-*` (transparent fill in this
// Tailwind v4 setup) and never preceded by `outline-none`.
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A3412]";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";
