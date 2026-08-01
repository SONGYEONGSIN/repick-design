/**
 * Every band on this page is built from these strings, so the two consumers (the page body and the
 * footer) cannot drift apart on the first edit.
 *
 * Three font weights across the whole route and no more: light for display and body, normal for
 * statements and numerals, semibold for the small uppercase marks. Hierarchy is carried by size,
 * tracking and colour instead.
 */

/**
 * The display face for this route is the mono — it is the one that belongs next to a chronometer,
 * and it is set as an inline style rather than a utility so the value stays the allow-listed
 * `--font-display-mono` custom property instead of a raw family name.
 */
export const MONO = { fontFamily: "var(--font-display-mono)" } as const;

/**
 * One fluid content column for every band. Fluid rather than capped: a fixed max width matches at
 * exactly one viewport and leaves a widening empty margin above it. Below `md` it falls back to the
 * viewport minus a fixed gutter, because 82vw of a phone is a sliver, not a margin.
 */
export const SHELL = "mx-auto w-[min(100%-2.5rem,82vw)] md:w-[82vw]";

/**
 * The reading column for every band below the manifesto. The scene parks its mass on the right half
 * from the dial state onward, so the copy holds the left — full-width grids there put a cell
 * directly under the case, which is text over a sculpture rather than text beside one.
 */
export const COLUMN = "lg:w-[56%]";

/** The one small-type style: mono, uppercase, wide-tracked. Nav, eyebrows, tags, footer links. */
export const MARK = "text-[clamp(0.72rem,0.8vw,1rem)] font-semibold uppercase tracking-[0.16em]";

/** Display type. Sized as a proportion of the viewport — a monospace face at a fixed px runs far wider than a proportional one, and the headline column has to stay clear of the scene beside it. */
export const DISPLAY = "text-[clamp(2.1rem,5.2vw,6.6rem)] font-light leading-[1.06] tracking-[-0.045em]";

/** Section statement — the copy the reader passes through while the field is at its orbit state. */
export const STATEMENT = "text-[clamp(1.35rem,2.4vw,2.5rem)] font-normal leading-[1.25] tracking-[-0.015em]";

/** Body copy. The weight is the part that reads, not the size. */
export const BODY = "text-[clamp(1rem,1.2vw,1.4rem)] font-light leading-[1.55] text-[#C9C9C9]";

/** The one filled control on the page. */
export const PILL =
  "inline-flex items-center rounded-full bg-[#FF6A93] px-[clamp(1rem,1.1vw,1.5rem)] py-[clamp(0.7rem,0.85vw,1.1rem)] leading-none text-[#180A0F] transition-colors hover:bg-[#ff87a8]";

/** Focus ring, in the accent, offset against the scene backdrop. */
export const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A93] focus-visible:ring-offset-4 focus-visible:ring-offset-[#010102]";

/**
 * Copy sits over an additively blended field and needs *some* separation, but only a little: a tight
 * halo with no offset. A wide offset shadow reads as type stuck to the background rather than
 * floating over it, and headings are large and opaque enough to need nothing at all.
 */
export const SHADOW = "[text-shadow:0_0_8px_rgba(0,0,0,0.85)]";

/** The header zone — taller than the row it holds, so the nav sits low in it. */
export const HEADER_H = "h-[clamp(4.4rem,5.6vw,6.6rem)]";
export const HEADER_ROW = "flex items-end pb-[clamp(0.9rem,1.2vw,1.5rem)]";
