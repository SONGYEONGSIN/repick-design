// KEPT — copy and constants. Deterministic by construction: nothing here derives from a clock, and
// the page never claims otherwise. The scene runs exactly one time-driven term (idle drift) and the
// copy below says so, because a page whose argument is "this can be verified" cannot misdescribe
// itself.

export const EASE = [0.16, 1, 0.3, 1] as const;

export const HERO = {
  eyebrow: "Secondhand, matched by machine",
  // Short lines on purpose: at display size a long line runs half the viewport and collides with the
  // scene. The headline column is held to roughly a third of the width.
  headline: ["Nothing here", "is new.", "Every piece", "was kept."],
  accentLine: 3,
  sub: "KEPT is a matching layer for secondhand goods. Describe what you are after in a sentence and the model reads the listings the way a person would read a shelf — one of everything, described by whoever happened to own it.",
  cue: "Scroll — dust, orbit, object, name",
};

/** Read while the field is dispersed, so the copy passes between the orbits. */
export const MANIFESTO = [
  "A secondhand market is not a catalogue. It is one of everything, listed once, in the words of whoever is done with it.",
  "So the hard problem was never search. It was reading forty careless descriptions of the same shoe and knowing they are the same shoe.",
  "What you are scrolling through is that field settling: dust with no order, then orbits, then the one object you asked for.",
];

export const PROOF = [
  {
    k: "1",
    label: "of everything",
    note: "Every listing is a single item. Nothing restocks, so a match is either now or it is gone.",
  },
  {
    k: "4",
    label: "silhouette states",
    note: "Dust, orbit, object, wordmark — one canvas layer carries the whole page, not one hero.",
  },
  {
    k: "1",
    label: "clock, with a switch",
    note: "Idle drift is the only time-driven term in the scene, and capture or reduced motion pins it flat.",
  },
];

export const METHOD = [
  {
    tag: "Layer 01",
    title: "Rasterised silhouettes",
    body: "The shoe is drawn once on an offscreen canvas and its opaque pixels sampled by a seeded generator, boundary shell first. Curves a parametric blob could never hold — the toe spring, the collar dip, the midsole line — survive being turned into grain.",
  },
  {
    tag: "Layer 02",
    title: "Swirl handoff",
    body: "Between states the field does not explode and reassemble. It turns: inner particles rotate further than outer ones, so one silhouette unwinds into the next. The angle peaks mid-transition and is exactly zero at both ends, which is why every state settles face-on.",
  },
  {
    tag: "Layer 03",
    title: "Pointer lens",
    body: "The cursor opens the object underneath it and slides the background layers against each other by depth. Both are pure functions of pointer position, so a page with no cursor on it renders the frame unchanged.",
  },
];

export const CLOSING = [
  "The object arrives last.",
  "Everything before it is the search —",
  "which is most of what buying secondhand actually is.",
];

/** Links point only at destinations this repository actually serves. */
export const NAV = [
  { href: "#field", label: "Field" },
  { href: "#method", label: "Method" },
];

export const FOOTER_NOTE = [
  "Copyright 2026 KEPT — a design specimen, not a live marketplace.",
  "One canvas, four states, one clock with an off switch.",
];
