/**
 * Every word on the page, in one place.
 *
 * The copy describes what the scene actually does — including the one clock term. A page that runs
 * an idle drift while claiming "nothing here is time-based" would be lying about itself, which is a
 * worse defect than the drift.
 */

export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export const HERO = {
  eyebrow: "Reframe — resale intelligence",
  /**
   * Broken into short lines on purpose. The headline column has to stay clear of the mass parked on
   * the right at scroll 0, which puts a hard ceiling on how wide the longest line may run — at
   * 1280px the sculpture reaches back to roughly x=512, and a two-word line is what fits in front of
   * it. Line breaks here are layout, not punctuation.
   */
  headline: ["Every object", "already had", "a second", "exposure."],
  /** Index of the line that takes the accent colour. */
  accentLine: 3,
  sub: "Photograph what you are done with. Reframe reads the object rather than your description of it, and finds the one person who has been looking for exactly that.",
  cue: "Scroll — four frames, one object",
};

export const MANIFESTO = [
  "A listing is a guess. A photograph is evidence. Reframe works from the evidence.",
  "Nineteen million objects sit unmatched in drawers, lofts and storage units. Not unwanted — unseen.",
  "Matching is a focus problem. Narrow the field until exactly one person is sharp, then stop.",
];

export const FRAMES = [
  {
    n: "01",
    tag: "Aperture",
    title: "The shutter opens on one object",
    body: "A single photograph, taken on whatever is in your pocket. No form, no category tree, no condition grade to argue with.",
  },
  {
    n: "02",
    tag: "Field",
    title: "Everything the market is holding",
    body: "Your object is placed against nineteen million others — every listing, every saved search, every offer that went unanswered last season.",
  },
  {
    n: "03",
    tag: "Subject",
    title: "The object resolves",
    body: "Model, era, finish, wear. Reframe reconstructs what the photograph is of, then prices it against what comparable pieces actually closed at.",
  },
  {
    n: "04",
    tag: "Reframe",
    title: "It leaves under a new name",
    body: "One buyer, one price, one collection window. The object stops being yours and starts being theirs, without ever passing through a warehouse.",
  },
];

export const PROOF = [
  {
    k: "1.9M",
    label: "Objects rematched",
    note: "Cameras, chairs, coats and tools that were photographed once and never listed twice.",
  },
  {
    k: "11 s",
    label: "Median time to first match",
    note: "From the moment the shutter closes to a named buyer with a standing offer on file.",
  },
  {
    k: "94%",
    label: "Accepted on first offer",
    note: "Because the offer is made to someone who already told us what they were waiting for.",
  },
];

export const CLOSING = [
  "Nothing on this page was manufactured.",
  "It is already in the world, waiting to be looked at again —",
  "and a camera is only a way of paying attention.",
];

export const TECHNIQUE =
  "The field above is fourteen thousand marks in a single draw call. Its shape is a pure function of how far you have scrolled and where your cursor is, so the same position renders the same frame every time — apart from one small idle drift, which stops the moment you ask for reduced motion.";

export const FOOTER_LINKS = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#frames", label: "Frames" },
  { href: "#proof", label: "Numbers" },
];
