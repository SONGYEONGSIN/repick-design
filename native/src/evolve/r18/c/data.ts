// native/src/evolve/r18/c/data.ts — auto-native-r18 candidate c.
//
// Deterministic content + the pure grade-computation function for the Condition Assessment
// screen. No Math.random / Date.now / bare `new Date()` anywhere in this file.

export type LevelId = "like_new" | "light_wear" | "visible_wear" | "heavy_wear";

export type LevelOption = {
  id: LevelId;
  /** Full wording, used in accessibility labels and the criterion's answered-state readout. */
  label: string;
  /** Short wording that fits inside a segmented chip at phone width. */
  chipLabel: string;
};

// Points feed computeGrade below — 4 = best condition, 1 = worst.
const LEVEL_POINTS: Record<LevelId, number> = {
  like_new: 4,
  light_wear: 3,
  visible_wear: 2,
  heavy_wear: 1,
};

export const LEVEL_OPTIONS: LevelOption[] = [
  { id: "like_new", label: "Like New", chipLabel: "Like New" },
  { id: "light_wear", label: "Light Wear", chipLabel: "Light" },
  { id: "visible_wear", label: "Visible Wear", chipLabel: "Visible" },
  { id: "heavy_wear", label: "Heavy Wear", chipLabel: "Heavy" },
];

export type CriterionId = "fabric" | "stitching" | "odor" | "flaws" | "accessories";

export type Criterion = {
  id: CriterionId;
  title: string;
  /** Short form used inside the blocking sentence, e.g. "2 more to go: Stitching, Odor." */
  shortLabel: string;
  hint: string;
  /** Relative weight in the grade's weighted average — see computeGrade doc comment. */
  weight: number;
};

export const CRITERIA: Criterion[] = [
  {
    id: "fabric",
    title: "Fabric & Material Wear",
    shortLabel: "Fabric",
    hint: "Thinning, fading, pilling, or stretching of the fabric itself.",
    weight: 1,
  },
  {
    id: "stitching",
    title: "Stitching & Seams",
    shortLabel: "Stitching",
    hint: "Loose threads, popped seams, or any repaired stitching.",
    weight: 1,
  },
  {
    id: "odor",
    title: "Odor",
    shortLabel: "Odor",
    hint: "Smoke, perfume, mildew, or other smells that linger after airing out.",
    weight: 0.75,
  },
  {
    id: "flaws",
    title: "Visible Flaws",
    shortLabel: "Flaws",
    hint: "Stains, tears, holes, or discoloration visible while worn.",
    weight: 1.25,
  },
  {
    id: "accessories",
    title: "Original Tags & Accessories",
    shortLabel: "Tags",
    hint: "Brand tags, dust bag, spare buttons, or a belt, if it shipped with any.",
    weight: 0.5,
  },
];

export type Selections = Partial<Record<CriterionId, LevelId>>;

// Deterministic starting point: two of five criteria pre-answered, so the screen opens already
// mid-assessment (blocked band visible on first render) rather than fully blank.
export const INITIAL_SELECTIONS: Selections = {
  fabric: "light_wear",
  stitching: "like_new",
};

export type GradeId = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C";

export type GradeResult = {
  grade: GradeId;
  label: string;
  /** 0-100 display score derived from the same weighted average, for the meter bar. */
  score: number;
  /** True when the "any Heavy Wear caps the grade at C" rule fired. */
  capped: boolean;
};

/**
 * computeGrade — pure function mapping the seller's per-criterion selections to one overall
 * condition grade. Fixed, documented logic; no randomness, no hidden state.
 *
 * 1. Requires every criterion in CRITERIA to have a selection — returns null otherwise. The
 *    caller (the screen) only calls this once the band is in its "ready" state, but the guard
 *    keeps the function honest on its own.
 * 2. Weighted average: each criterion contributes LEVEL_POINTS (1-4) times its `weight` from
 *    CRITERIA; average = sum(points * weight) / sum(weight) — a real weighted mean, not a plain
 *    average of four numbers. Visible Flaws (1.25) outweighs Original Tags & Accessories (0.5)
 *    because a buyer inspecting the item in person notices a stain before they notice a missing
 *    dust bag; Odor (0.75) sits below the structural criteria because it is the most subjective
 *    of the five.
 * 3. Defect-dominant cap: if ANY single criterion is rated "Heavy Wear", the result is capped at
 *    grade "C" regardless of how high the weighted average of the rest comes out. One heavily
 *    worn area (e.g. a torn seam) undermines buyer trust in a way a good average elsewhere can't
 *    offset — this is a second rule layered on top of the average, not folded into it, mirroring
 *    how in-person secondhand graders work (worst-defect gating, not pure averaging).
 * 4. Otherwise the weighted average (a 1-4 scale) is bucketed into a letter grade.
 */
export function computeGrade(selections: Selections): GradeResult | null {
  if (CRITERIA.some((c) => selections[c.id] === undefined)) return null;

  const hasHeavyWear = CRITERIA.some((c) => selections[c.id] === "heavy_wear");
  const totalWeight = CRITERIA.reduce((sum, c) => sum + c.weight, 0);
  const weightedPoints = CRITERIA.reduce((sum, c) => {
    const level = selections[c.id] as LevelId;
    return sum + LEVEL_POINTS[level] * c.weight;
  }, 0);
  const average = weightedPoints / totalWeight; // 1..4
  const score = Math.round(((average - 1) / 3) * 100); // 0..100

  if (hasHeavyWear) {
    return { grade: "C", label: "Fair condition", score, capped: true };
  }
  if (average >= 3.7) return { grade: "A", label: "Excellent condition", score, capped: false };
  if (average >= 3.3) return { grade: "A-", label: "Excellent condition", score, capped: false };
  if (average >= 3.0) return { grade: "B+", label: "Good condition", score, capped: false };
  if (average >= 2.6) return { grade: "B", label: "Good condition", score, capped: false };
  if (average >= 2.2) return { grade: "B-", label: "Fair condition", score, capped: false };
  if (average >= 1.8) return { grade: "C+", label: "Fair condition", score, capped: false };
  return { grade: "C", label: "Fair condition", score, capped: false };
}

/** Builds the blocking sentence, e.g. "2 more to go: Stitching, Odor." */
export function describeUnresolved(unresolved: Criterion[]): string {
  const names = unresolved.map((c) => c.shortLabel).join(", ");
  return `${unresolved.length} more to go: ${names}.`;
}
