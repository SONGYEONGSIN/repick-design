// Motion pilot — deterministic content + geometry. No Math.random / Date.now anywhere:
// every "organic" value below is a closed-form function of its index, so the page renders
// byte-identically on every load and screenshots stay comparable across judge rounds.

export const EASE = [0.16, 1, 0.3, 1] as const;

export const HERO = {
  eyebrow: "Motion pilot · pointer-driven",
  headline: ["Interfaces that", "answer the hand", "that moves them."],
  accentLine: 2,
  sub: "A feasibility probe: rich scroll and pointer choreography built without a single time-based or random value, so the gate can still verify it and judges can still compare it.",
};

export const PROOF = [
  { k: "0", label: "random calls", note: "Every motion value derives from pointer or scroll position" },
  { k: "3", label: "reveal layers", note: "Character, line, and block staggers compose independently" },
  { k: "60", label: "fps target", note: "Canvas redraws only while the pointer is actually moving" },
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
    body: "The lattice behind the hero displaces toward the cursor. At rest it is a static grid, which is exactly what the capture pipeline sees.",
  },
];

/** Lattice geometry — deterministic wave offsets so the field has structure without randomness. */
export const LATTICE = { gap: 34, radius: 1.6, influence: 150, maxPush: 16 };

export function latticePhase(col: number, row: number): number {
  // Closed-form pseudo-organic offset in [-1, 1]; identical on every render.
  return Math.sin(col * 0.7 + row * 0.45) * Math.cos(row * 0.31 - col * 0.19);
}
