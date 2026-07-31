/**
 * The three class strings every band on this page is built from. They were measured off the
 * reference (see `vault/00-principles/brief-scene.md` §1-3) and moved here the moment the footer
 * became a second consumer — two copies of a 1280px column drift apart on the first edit.
 */

/**
 * One shell for every band. `max-w` binds from 1280 up, so at the reference's 1536 viewport the
 * column lands at exactly x=128 with no padding of its own; below that the padding takes over as the
 * gutter. Two nested wrappers would put the text 40px further in than the reference.
 */
export const SHELL = "mx-auto w-full max-w-[1280px] px-6 md:px-10 xl:px-0";

/** 14px / 600 / uppercase — the reference's one small-type style, used for nav, eyebrow and caption. */
export const MARK = "text-[0.875rem] font-semibold uppercase tracking-[0.025em]";

/** Copy sits over an additively-blended field; the shadow is what keeps it legible against a bright patch. */
export const SHADOW = "[text-shadow:0_2px_22px_rgba(1,1,2,0.94)]";
