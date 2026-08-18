/**
 * Shared focus-ring recipes. Every one below uses a literal Tailwind palette class for both the
 * ring and its offset (never an arbitrary `ring-[var(--x)]`) — Tailwind v4 resolves ring-offset
 * color-mixing against `oklab` and a custom-property source can come back fully transparent,
 * which is exactly the "class is present but nothing paints" failure this round's brief calls
 * out. Literal classes like `ring-blue-600` / `ring-offset-white` do not hit that path.
 */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/** For controls painted with a solid accent background — outline draws outside the box, over the
 * page background, so it never has to contend with matching a same-color ring against its own
 * button fill. */
export const FOCUS_OUTLINE_ON_ACCENT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";
