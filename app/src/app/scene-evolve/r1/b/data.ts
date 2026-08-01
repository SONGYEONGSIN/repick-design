// Second — copy and constants for the scene. Deterministic by construction: no clock, no unseeded
// randomness, and every figure below is a written constant rather than something computed at render
// time. The page has exactly one time-driven term, the field's resting drift, and the copy says so
// where it talks about it.

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Rose — the one accent. Contrast on the near-black backdrop is 7.6:1, so it is safe on small type. */
export const ACCENT = "#FF6A93";

export const HERO = {
  eyebrow: "Pre-owned goods, matched by machine",
  // Short lines on purpose: at display size a long line runs the width of the viewport and cuts
  // straight through the scene.
  headline: ["Every object", "gets a", "second hand."],
  accentLine: 2,
  sub: "Second reads what a used thing actually is — the wear, the reference, the year — and hands it to the person who was already describing it in the search box. One canvas holds the whole page; how far you have scrolled decides what it is showing.",
  cue: "Scroll — dust, orbit, dial, mark",
};

/** Read while the field is at its orbit state, so the sentences pass between the tracks. */
export const MANIFESTO = [
  "A watch does not make time. It keeps it somewhere you can see it.",
  "Resale works the same way. The value was always in the object; the market only has to show it to the right person before the moment passes.",
  "So the whole product is one question asked quickly: of everyone looking right now, who was looking for this?",
];

export const PROOF = [
  {
    k: "182,400",
    label: "objects rehomed",
    note: "Each one matched against a description someone had already written, not against a keyword they had to guess.",
  },
  {
    k: "9 min",
    label: "median time to first match",
    note: "The index runs continuously, so a listing is compared the minute it lands rather than the night it is batched.",
  },
  {
    k: "1",
    label: "clock in this page",
    note: "The scene is a function of scroll and pointer. The resting drift is the single timed term, and capture or reduced motion stops it.",
  },
];

export const STAGES = [
  {
    tag: "State 01",
    title: "Dust",
    body: "Sixteen thousand grains with no shape yet, swept through by the wake of a hand that has already passed. Nothing has been decided about the object.",
  },
  {
    tag: "State 02",
    title: "Orbit",
    body: "Four tracks and twelve stations — the geometry of a dial without the dial. Hollow in the middle, which is where this text sits while you read it.",
  },
  {
    tag: "State 03",
    title: "Dial",
    body: "The case, the chapter ring, twelve markers, three hands at 10:09. Drawn as linework on an offscreen canvas and sampled pixel by pixel, because a filled disc made of particles is only ever a blob.",
  },
  {
    tag: "State 04",
    title: "Mark",
    body: "The same particles again, in the shape of the name. Each state is the same field re-addressed — particle 4,201 is the same grain in all four.",
  },
];

/** The bookend: the curtain holds you on it, the footer closes with it. */
export const CLOSING = ["Nothing here is new.", "That is the whole idea."];

export const FOOTER_NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#states", label: "States" },
  { href: "/gallery", label: "Specimen" },
];

// "Copyright" is spelled out rather than set as the glyph: that codepoint is Extended_Pictographic
// and the static checker hard-fails on it, comments included.
export const FOOTER_NOTE = [
  "Copyright 2026 Second — a design specimen, not a live marketplace.",
  "One canvas, four states, driven by document scroll.",
];
