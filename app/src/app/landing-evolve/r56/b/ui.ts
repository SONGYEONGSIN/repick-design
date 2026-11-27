// Shared style tokens for the GRIDLINE route. Plain data/strings only — no
// React here, so this file can be imported from client components without
// adding to the client bundle's component graph unnecessarily.

import type { CSSProperties } from "react";

/**
 * Visible focus treatment used on every interactive element in this route.
 * Deliberately avoids both dead idioms this project has been burned by:
 *  - never paired with `outline-none` on the same node (so the outline utility
 *    below is never cancelled by a shared --tw-outline-style custom property)
 *  - never relies on `ring-*` + `ring-offset-*` alone (which paints
 *    transparent in this Tailwind v4 setup) — uses `outline` + a secondary
 *    box-shadow glow instead, two independently-painted signals.
 */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-indigo-300 focus-visible:shadow-[0_0_0_4px_rgba(165,180,252,0.35)]";

/** The single whitelisted display face assigned to candidate B. Used ONLY here. */
export const DISPLAY_FONT_STYLE: CSSProperties = {
  fontFamily: "var(--font-display-mono)",
};
