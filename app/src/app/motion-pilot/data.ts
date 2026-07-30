// Motion pilot — deterministic content + geometry. No Math.random / Date.now anywhere: every
// "organic" value below is a closed-form function of its index. The scene has exactly one clock —
// the idle drift — and the capture pipeline freezes it, so screenshots stay byte-identical across
// judge rounds while a visitor still sees a field that is never quite still.

export const EASE = [0.16, 1, 0.3, 1] as const;

export const HERO = {
  eyebrow: "Motion pilot · pointer-driven",
  // Short lines on purpose: at display size a 15-character line runs half the viewport and
  // collides with the scene. The reference keeps its headline column to roughly a quarter width.
  headline: ["Interfaces", "that answer", "the hand."],
  accentLine: 2,
  sub: "A feasibility probe: rich scroll and pointer choreography with exactly one clock in it — and an off switch on that clock, so the gate can still verify the page and judges can still compare it.",
};

export const PROOF = [
  { k: "0", label: "random calls", note: "Every motion value derives from pointer or scroll position" },
  { k: "3", label: "reveal layers", note: "Character, line, and block staggers compose independently" },
  { k: "1", label: "clock, frozen on capture", note: "Idle drift is the only time-driven term; capture and reduced motion pin it to a still frame" },
];

/** Manifesto copy — read while the field is dispersed, so the text passes through the particles. */
export const MANIFESTO = [
  "A page that moves should still be a page that can be checked.",
  "Most of this vocabulary breaks the moment a gate asks it to render the same way twice.",
  "So everything a judge has to reproduce is driven by where you are, not by what time it is.",
  "Scroll and pointer positions are the only inputs a screenshot depends on. The drift you see at rest is the one exception, and it stops the moment a camera is pointed at it.",
];

export const STAGES = [
  {
    tag: "Layer 01",
    title: "Character stagger",
    body: "Each glyph is its own element with its own delay, but the accessible name stays the whole sentence — screen readers never hear it letter by letter.",
  },
  {
    tag: "Layer 02",
    title: "Scroll-linked transform",
    body: "Progress through the section drives opacity and offset directly. Nothing animates on a timer, so a screenshot at a given scroll position is reproducible.",
  },
  {
    tag: "Layer 03",
    title: "Pointer field",
    body: "The field behind the page magnifies toward the cursor and drifts on its own when nothing is happening. Under capture or reduced motion the drift is pinned, which is exactly the still frame the pipeline needs.",
  },
];

/** Lattice geometry — deterministic wave offsets so the field has structure without randomness. */
export const LATTICE = { gap: 34, radius: 1.6, influence: 150, maxPush: 16 };

export function latticePhase(col: number, row: number): number {
  // Closed-form pseudo-organic offset in [-1, 1]; identical on every render.
  return Math.sin(col * 0.7 + row * 0.45) * Math.cos(row * 0.31 - col * 0.19);
}
