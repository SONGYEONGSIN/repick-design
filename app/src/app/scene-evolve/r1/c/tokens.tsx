/**
 * The class strings every band on this page is built from. They live here because the footer, the
 * header and the body sections are all consumers — three copies of a column width drift apart on the
 * first edit.
 *
 * Type is set entirely in the house body face. Choosing no display face is a real choice here: the
 * scene is the voice of this page, and a second typographic personality competing with a 14,000-mark
 * particle field is one voice too many. Hierarchy comes from size, tracking and colour instead.
 *
 * Exactly three weights across the whole route: extralight for body, normal for display and
 * statements, semibold for the small uppercase mark.
 *
 * Deliberately a `.tsx` file even though it exports no component: the route-level weight count only
 * reads `.tsx`, so tokens parked in a `.ts` module make the measurement report two weights for a page
 * that renders three. The number is supposed to describe the page, not the file extension.
 */

/** Fluid column, not a fixed cap — a `max-w` matches at exactly one viewport and widens the margin above it. */
export const SHELL = "mx-auto w-[min(100%-2.75rem,86vw)] lg:w-[80vw]";

/** The one small-type style: nav, eyebrows, captions, frame numbers. */
export const MARK = "text-[clamp(0.7rem,0.8vw,1rem)] font-semibold uppercase tracking-[0.14em]";

/**
 * Display type, sized as a proportion of the viewport rather than at a fixed px so the headline
 * column stays clear of the mass at every width. The floor is set by the longest headline line
 * rather than by taste: at 390px the column is 335px, and "Everything you own" only fits inside it
 * below about 2rem — above that the per-character spans start breaking mid-word.
 */
export const DISPLAY = "text-[clamp(2rem,5.4vw,7rem)] font-normal leading-[1.04] tracking-[-0.035em]";

/** Section statements — the copy that reads through the dispersed stage. */
export const STATEMENT = "text-[clamp(1.4rem,2.6vw,2.75rem)] font-normal leading-[1.22] tracking-[-0.02em]";

/** Body copy. The weight is the part that reads, not the size. */
export const BODY = "text-[clamp(0.98rem,1.2vw,1.4rem)] font-extralight leading-[1.6]";

/** The call to action. Dark type on the cyan, which is far too bright to carry white text at AA. */
export const PILL =
  "inline-flex items-center rounded-full bg-[#38BDF8] px-[clamp(0.9rem,1.05vw,1.4rem)] py-[clamp(0.7rem,0.82vw,1.1rem)] leading-none text-[#04141C] transition-colors hover:bg-[#7DD8FB]";

/**
 * Copy sits over an additively blended field, so it needs *some* separation — but only a tight halo
 * with no offset. A wide offset shadow reads as type stuck to a backing plate rather than floating
 * over a scene, and the display sizes are opaque enough not to need one at all.
 */
export const SHADOW = "[text-shadow:0_0_9px_rgba(0,0,0,0.85)]";
export const HEAD_SHADOW = "";

/** The header zone is taller than the bar it looks like, so the nav row can sit low inside it. */
export const HEADER_H = "h-[clamp(4.4rem,5.6vw,6.6rem)]";
export const HEADER_ROW = "flex items-end pb-[clamp(0.9rem,1.15vw,1.5rem)]";

/** Focus ring, repeated everywhere a focusable element exists. */
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#010102]";

/** Scene backdrop. Near-black, not the house canvas token — see the note in scene-client. */
export const INK = "#010102";
