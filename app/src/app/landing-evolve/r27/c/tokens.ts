/**
 * Fair-Price Slope — route-scoped design tokens (r27 / candidate c).
 *
 * THEME: dark, per this round's assignment. Ground `#0B0B0F`, foreground `#FFFFFF`.
 *
 * ACCENT: lime family (this round's assignment — violet/green go to the other two candidates;
 * blue/indigo/teal/amber/sky are overused catalog-wide). Picked a deep, olive-leaning lime rather
 * than a bright highlighter tone so it stays near-monochrome-compatible on the dark ground.
 *
 * Every ratio below is the real WCAG relative-luminance formula, run through Node (not eyeballed):
 * L = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin (sRGB→linear per channel), contrast =
 * (L_lighter + 0.05) / (L_darker + 0.05). Script kept at /tmp for this session; numbers reproduced
 * in candidates/c.md.
 *
 *   Pairing                                                    Ratio     Verdict
 *   ----------------------------------------------------------------------------------------------
 *   #8BA83A (ACCENT_FILL) vs #0B0B0F (page bg)                 7.26:1    clears AA at EVERY text
 *                                                                         size, not just the 3:1
 *                                                                         large-text/non-text floor
 *                                                                         — used for fills / borders
 *                                                                         / bar+line fills / large
 *                                                                         text (>=24px or >=19px bold)
 *   #C9E08A (ACCENT_TINT) vs #0B0B0F                           13.58:1   small text / icons /
 *                                                                         focus-visible ring
 *   #FFFFFF (white) as TEXT on #8BA83A FILL                     2.71:1   FAILS even the 3:1 large-
 *                                                                         text floor — never used
 *   #0B0B0F (ink) as TEXT on #8BA83A FILL                       7.26:1   clears full AA at every
 *                                                                         size — the only text color
 *                                                                         used ON an accent-filled
 *                                                                         surface on this route
 *                                                                         (buttons/chips/badges)
 *   #A1A1AA (MUTED, also the slope chart's "before" neutral)   7.66:1    safe for muted body text
 *   vs #0B0B0F                                                            AND as a non-text fill
 *                                                                         (asking-price dots / down-
 *                                                                         corrected lines)
 *   #FFFFFF vs #0B0B0F (page fg on page bg)                    19.64:1
 *   #6B6B78 (folio ghost numeral) vs #0B0B0F                    3.74:1   clears the large-text/non-
 *                                                                         text floor only — used at
 *                                                                         a small, receding weight/
 *                                                                         size, not as body text
 *   #7A9433 (hover-darkened fill, non-text hover state) vs bg   5.72:1
 *
 * SECOND COLOR for the slope chart's "before" state (asking price / pre-verification): reuses
 * MUTED (#A1A1AA) rather than inventing a second hue — a neutral gray, exactly what the brief
 * suggests, and it doubles as the "corrected down" line color, which is a deliberate reuse: gray
 * reads as "still unverified / flagged," lime reads as "verified / trending toward fair," so the
 * two roles reinforce each other instead of adding a third color to track. Direction is NEVER
 * conveyed by color alone: every line pairs with a TrendingUp/TrendingDown/Minus icon and a signed
 * percentage in real text, both in the chart's HTML labels and in the always-available data table.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const BG = "#0B0B0F";
export const FG = "#FFFFFF";
export const MUTED = "#A1A1AA";
export const MUTED_TEXT = "text-[#A1A1AA]";
export const BORDER = "rgba(255,255,255,0.10)";
export const PANEL = "rgba(255,255,255,0.03)";

export const ACCENT_FILL = "#8BA83A"; // fills, borders, bar/line fills, large text (>=24px/19px bold)
export const ACCENT_TINT = "#C9E08A"; // small text, icons, focus-visible ring
export const ACCENT_INK = "#0B0B0F"; // text ON an accent fill (white on fill fails AA — see above)
export const ACCENT_HOVER = "#7A9433"; // non-text hover state for accent-filled buttons
export const FOLIO = "#6B6B78"; // decorative section numeral only, 3.74:1, kept small/light to recede

// Visible-focus idiom: a real outline + offset, never a bare `ring-*` (renders transparent in this
// Tailwind v4 setup) and never preceded by `outline-none` on the same element.
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9E08A]";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
