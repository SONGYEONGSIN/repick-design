// Shared focus-visible treatment.
//
// `ring-2` / `ring-offset-*` render fully transparent in this project's Tailwind v4 setup (the
// utility's underlying custom properties don't resolve), and combining `outline-none` with a later
// `focus-visible:outline-*` cancels the outline via the same custom-property mechanism. Both are
// avoided here: this is a literal arbitrary `box-shadow` value, entirely outside Tailwind's
// ring/outline machinery, so it paints reliably regardless of element size (unlike the ring bug,
// which is worse under ~20px, a box-shadow spread is independent of the element's own box).
export const FOCUS_RING =
  "outline-none focus-visible:[box-shadow:0_0_0_2px_var(--fl-surface,#09090b),0_0_0_4px_#fbbf24]";
