// Shared focus-visible treatment for every interactive element on this page.
//
// Deliberately NOT `ring-2` + `ring-offset-*` (that combination renders fully transparent on
// some Tailwind v4 builds) and NOT `outline-none` followed by a `focus-visible:outline-*` (which
// can cancel itself via `--tw-outline-style: none`). This uses the plain `outline` utility, which
// sets `outline-style: solid` explicitly, plus a width and an offset — nothing here ever sets
// `outline-none`, so there is nothing for it to cancel.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400";

// Same treatment for a focus ring that must sit *inside* its element (e.g. a table header button
// that has no room for an offset outline without colliding with a neighboring cell).
export const FOCUS_RING_INSET =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-400";
