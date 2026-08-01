/**
 * The class strings every band on this page is built from. Kept in one file because the footer and
 * the main column are two consumers of the same measure — two copies drift apart on the first edit.
 *
 * Weights: exactly three across the route — `font-extralight` (display and statements),
 * `font-normal` (body, inherited by everything unset) and `font-semibold` (small caps type).
 * Hierarchy is carried by size, tracking and colour instead.
 */

/** The one display face this route uses, applied by inline style so the allow-list check can see it. */
export const DISPLAY_FACE = { fontFamily: "var(--font-display-wide)" } as const;

/**
 * One fluid column for every band — a vw measure rather than a fixed cap, so the gutters stay
 * proportional instead of the content stranding in the middle of a 1920 viewport. Below `md` it
 * falls back to the viewport minus a fixed gutter, because 82vw of a phone is a sliver, not a margin.
 */
export const SHELL = "mx-auto w-[min(100%-2.75rem,82vw)] md:w-[82vw]";

/** Small type — nav, eyebrow, tags, footer. Wide tracking is what makes it read as a label. */
export const MARK = "text-[clamp(0.7rem,0.8vw,1rem)] font-semibold uppercase tracking-[0.16em]";

/** Display type. Extralight at this size is the whole voice of the page. */
export const DISPLAY = "text-[clamp(2.4rem,5.6vw,7.5rem)] font-extralight leading-[1.02] tracking-[-0.045em]";

/** Section statements — the copy that reads through the dispersed field. */
export const STATEMENT = "text-[clamp(1.4rem,2.55vw,2.7rem)] font-extralight leading-[1.22] tracking-[-0.02em]";

/** Body copy. */
export const BODY = "text-[clamp(1rem,1.15vw,1.35rem)] font-normal leading-[1.6]";

/**
 * Copy sits over an additively blended field, so it needs separation — but a wide offset shadow
 * makes the type read as stuck to the background rather than floating over it. A tight halo with no
 * offset, on body copy only; the display sizes are large and opaque enough to need nothing.
 */
export const SHADOW = "[text-shadow:0_0_8px_rgba(0,0,0,0.82)]";

/**
 * A wider version of the same halo for the statements that sit *inside* the dispersed field. The
 * display sizes elsewhere need nothing — they are large and opaque — but these lines are read while
 * an orbit passes behind them, and a measured sweep found particles landing inside the letterforms.
 * Still zero-offset: an offset shadow reads as type stuck to the background rather than over it.
 */
export const HALO = "[text-shadow:0_0_16px_rgba(1,1,2,0.92)]";

/** The header zone, taller than the row it holds, with the row sitting low in it. */
export const HEADER_H = "h-[clamp(4.5rem,5.6vw,6.8rem)]";
export const HEADER_ROW = "flex items-end pb-[clamp(0.9rem,1.2vw,1.5rem)]";

/** Focus ring, reused everywhere so no interactive element is left without one. */
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DE2C5] focus-visible:ring-offset-4 focus-visible:ring-offset-[#010102]";

/** The one filled control on the page. Dark ink on the accent — white on teal never reaches AA. */
export const PILL =
  "inline-flex items-center rounded-full bg-[#2DE2C5] px-[clamp(0.95rem,1.05vw,1.4rem)] py-[clamp(0.7rem,0.82vw,1.1rem)] leading-none text-[#03120F] transition-colors hover:bg-[#63F0DA]";

/** Palette. Every value measured against the scene's near-black rather than picked by eye. */
export const ACCENT = "#2DE2C5";
export const MUTED = "text-[#9BAFAC]";
export const COPY = "text-[#C9D6D4]";
