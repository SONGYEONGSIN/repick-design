/**
 * Shared design tokens for this route only (`landing-evolve/r38/c`).
 *
 * THEME: light by default (page bg is pure white, ink is near-black), with two
 * *intentional* dark surfaces — the scrub/ledger device panel and the
 * closing CTA section — used as contained "instrument panel" blocks, not as
 * an ambiguous light/dark toggle. Colors are hard-coded here rather than
 * read from `globals.css`'s `--background`/`--foreground` custom properties,
 * because those flip under `prefers-color-scheme: dark` at the OS level and
 * this route needs to stay visually consistent regardless of the visitor's
 * system theme (see brief: "pick one, consistency matters more than which").
 *
 * ACCENT HUE: cyan — not amber/teal/violet/blue (the catalog's most-used
 * hues) and not emerald (used one round prior, r37/b). Chosen partly because
 * a scan-line/scrub-line color reads naturally as cyan, and partly because
 * it is explicitly listed as under-represented.
 *
 * Full WCAG relative-luminance contrast arithmetic (computed by hand with
 * the standard formula, not eyeballed) is written out in
 * `vault/20-generations/2026-10-22-auto-landing-r38/candidates/c.md` under
 * "브리프에 없던 것" — the short version:
 *
 * ACCENT_FILL  #0E7490 (cyan-700) — solid FILLS only (buttons, the trust
 *   bar's filled track, the discount badge chip, the slider's filled rail).
 *   White text on this fill = 5.36:1 (clears AA at any size) against both
 *   white and against this fill itself works out the same either direction;
 *   dark ink (#0B0B0F) on this fill is only 3.67:1 (clears the 3:1
 *   large-text/non-text floor, fails body AA) — so every fill in this route
 *   carries WHITE text, never dark ink, sidestepping the failing case
 *   entirely rather than needing a large-text exception.
 * ACCENT_DEEP  #155E75 (cyan-800) — text / icons / links / focus rings
 *   directly on the LIGHT page background (zinc-50 or white). 7.27:1 vs
 *   white, clears AA with real headroom.
 * ACCENT_LIGHT #67E8F9 (cyan-300) — text / icons / focus rings on the DARK
 *   ink panels only (device panel, closing CTA). 13.56:1 vs `#0B0B0F`.
 *   NEVER used on the light page background — vs white it is only 1.45:1.
 */
export const PAGE_BG = "#FFFFFF"; // pure white — "zinc-50-or-lighter", so muted text floor is zinc-500
export const CARD_TINT = "#F4F4F5"; // zinc-100 — tinted surface, muted text floor is zinc-600
export const INK = "#0B0B0F"; // dark ink: both the light page's foreground AND the dark panels' bg
export const PANEL_BORDER = "rgba(255,255,255,0.12)";

export const ACCENT_FILL = "#0E7490"; // cyan-700 — fills, white text on top
export const ACCENT_DEEP = "#155E75"; // cyan-800 — text/icon/focus on the light page
export const ACCENT_LIGHT = "#67E8F9"; // cyan-300 — text/icon/focus on dark panels only

export const MUTED_ON_PAGE = "#71717A"; // zinc-500 — muted text directly on PAGE_BG (white)
export const MUTED_ON_TINT = "#52525B"; // zinc-600 — muted text on CARD_TINT/pills
export const MUTED_ON_DARK = "#A1A1AA"; // zinc-400 — muted text on the dark ink panels

export const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/**
 * Visible-focus utilities. Never preceded by `outline-none`, never a bare
 * `ring-*`/`ring-offset-*` utility (both are known-dead in this repo's exact
 * Tailwind v4 build) — a real `outline` pair every time.
 */
export const FOCUS_LIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#155E75]";
export const FOCUS_DARK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67E8F9]";
