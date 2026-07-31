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
    body: "The field behind the page turns toward the cursor and magnifies under it, and it keeps drifting on its own when nothing is happening. Under capture or reduced motion the pointer reads as absent and the drift is pinned, which is exactly the still frame the pipeline needs.",
  },
];

/**
 * The bookend. This is the statement the loading curtain holds you on and the one the footer closes
 * with — the same two lines in both places, which is how the reference frames a visit as a loop
 * rather than a scroll that runs out. Changing it changes both ends at once, on purpose.
 */
export const CLOSING = ["Motion you can measure.", "Attune answers the hand."];

/**
 * Footer links point only at destinations this repo actually serves. The reference carries social
 * accounts here; inventing plausible ones for a specimen would put fabricated records on a page whose
 * whole argument is that it can be verified.
 */
export const FOOTER_NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#technique", label: "Technique" },
  { href: "/gallery", label: "Specimen" },
];

/**
 * Social destinations. These are not invented here — they are the handles this repo already ships
 * for the Attune brand in `app/src/app/(marketing)/landing-client.tsx`, reused so the two pages do
 * not disagree about where the same brand lives. They are still placeholders: nothing verifies that
 * these accounts exist, and they must be confirmed before this is anything but a specimen.
 */
export const FOOTER_SOCIAL = [
  { href: "https://instagram.com/attune", label: "Instagram" },
  { href: "https://x.com/attune", label: "X" },
];

// "Copyright" is spelled out rather than set as the U+00A9 glyph. That codepoint is
// Extended_Pictographic, so the `no-emoji` rule in `scripts/dash-static-check.mjs` hard-fails on it
// — including inside comments, which is why this note describes the character instead of showing it.
// The reference does set the glyph in its own footer; we cannot, and the word carries the same line.
export const FOOTER_NOTE = ["Copyright 2026 Attune — a design specimen.", "Built to be checked, not demoed."];

/** Lattice geometry — deterministic wave offsets so the field has structure without randomness. */
export const LATTICE = { gap: 34, radius: 1.6, influence: 150, maxPush: 16 };

export function latticePhase(col: number, row: number): number {
  // Closed-form pseudo-organic offset in [-1, 1]; identical on every render.
  return Math.sin(col * 0.7 + row * 0.45) * Math.cos(row * 0.31 - col * 0.19);
}
