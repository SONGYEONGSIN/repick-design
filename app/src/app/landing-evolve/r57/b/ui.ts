// Shared style tokens for the FOCAL route (candidate b). Plain strings only —
// no React — so this can be imported from any client component without
// adding to the component graph.

import type { CSSProperties } from "react";

/**
 * Visible focus treatment for every interactive element on this route:
 * drag chips, move-up/move-down buttons, CTA links, nav links, the
 * reset-order button and the show-more toggle. Two independently-painted
 * signals (outline + glow), never `ring-*`/`ring-offset-*` alone (paints
 * transparent in this Tailwind v4 setup) and never paired with
 * `outline-none` on the same node (which would cancel the outline below).
 */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[#7CA6FF] focus-visible:shadow-[0_0_0_4px_rgba(124,166,255,0.35)]";

/** The single whitelisted display face used on this route — Latin, large
 *  headline text only, never body copy, never Korean. */
export const DISPLAY_FONT_STYLE: CSSProperties = {
  fontFamily: "var(--font-display-grotesk)",
};

/**
 * Accent hue for this route (not amber/teal/violet — a fresh blue).
 * ACCENT (#2F6FED): contrast vs white ≈ 4.55:1 (passes body AA on a light
 * fill), vs this route's dark bg #0B0B0F ≈ 4.32:1 (passes the ≥3:1 large/
 * bold-text tier, just under the 4.5:1 body-size tier). Used only for solid
 * fills (CTA button: white text on this fill ≈ 4.55:1, passes) and for
 * large/bold headline-scale accents on the dark bg.
 * ACCENT_TINT (#7CA6FF): the lighter tint, contrast vs the dark bg ≈ 8.19:1
 * — used for every small-text, icon and focus-ring use of the accent on the
 * dark bg, since the base ACCENT fails AA at body size there. (Vs white,
 * ACCENT_TINT is only ≈ 2.40:1, but this route has no white/light surfaces,
 * so that pairing never occurs.)
 */
export const ACCENT = "#2F6FED";
export const ACCENT_TINT = "#7CA6FF";
