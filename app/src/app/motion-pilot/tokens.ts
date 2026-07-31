/**
 * The three class strings every band on this page is built from. They were measured off the
 * reference (see `vault/00-principles/brief-scene.md` §1-3) and moved here the moment the footer
 * became a second consumer — two copies of a 1280px column drift apart on the first edit.
 */

/**
 * One shell for every band, and it is **fluid, not capped**. Measuring the reference at two widths
 * settled this: its content column is 1280px at 1536 and 1600px at 1920 — 83.333vw both times, with
 * an 8.333vw gutter. A fixed `max-w-[1280px]` matches at exactly one viewport and leaves a widening
 * empty margin above it. Below `md` the column falls back to the viewport minus a fixed gutter,
 * because 83vw of a phone is not a margin, it is a sliver.
 */
export const SHELL = "mx-auto w-[min(100%-3rem,83.333vw)] md:w-[83.333vw]";

/** 14px / 600 / uppercase — the reference's one small-type style, used for nav, eyebrow and caption. */
export const MARK =
  "text-[clamp(0.75rem,0.833vw,1.05rem)] font-semibold uppercase tracking-[0.025em]";

/** Display type — see pilot-client's note on why the size is proportional rather than the reference's px. */
export const DISPLAY = "text-[clamp(2.5rem,6vw,8rem)] font-normal leading-[1.1] tracking-[-0.04em]";

/** Section statement — the reference sets these at 2.5vw / 400 / lh 1.2. */
export const STATEMENT = "text-[clamp(1.5rem,2.5vw,2.6rem)] font-normal leading-[1.2]";

/** Body copy — 1.25vw / 200 / lh 1.5 at the reference. The weight is the part that reads. */
export const BODY = "text-[clamp(1rem,1.25vw,1.5rem)] font-extralight leading-[1.5]";

/**
 * The pill. Every number here is the reference's: 0.833vw type at 600, 16.48/20px padding (0.86vw /
 * 1.04vw), fully rounded, on its brighter violet — ours had been a darker #6E56CF at a fixed 14px.
 */
export const PILL =
  "inline-flex items-center rounded-full bg-[#8052FF] px-[clamp(0.9rem,1.04vw,1.4rem)] py-[clamp(0.75rem,0.86vw,1.15rem)] text-white transition-colors hover:bg-[#9169ff]";

/** Copy sits over an additively-blended field; the shadow is what keeps it legible against a bright patch. */
export const SHADOW = "[text-shadow:0_2px_22px_rgba(1,1,2,0.94)]";
