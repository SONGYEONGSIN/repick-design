// Shared focus-visible treatment for every interactive element on this route.
//
// Plain `outline` utilities only (never `ring-*`/`ring-offset-*`, which render fully transparent
// on this Tailwind v4 setup unless a color is force-set on both layers) and never paired with
// `outline-none` anywhere, so there is nothing that can cancel it via `--tw-outline-style: none`.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

// For a control with no room for an offset ring without colliding with a neighbor (table header
// buttons, tab strip items, graph node buttons packed close together).
export const FOCUS_RING_INSET =
  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400";
