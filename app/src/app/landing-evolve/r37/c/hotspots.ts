/**
 * Fixed authenticity-check zones on the sneaker illustration, plus the
 * pure derived-state math the whole route shares. Nothing here is
 * randomized — every coordinate and formula is a constant or a function
 * of the live `found` set, so the same interaction always produces the
 * same numbers (and so the gate's `no-random` rule has nothing to flag).
 *
 * Coordinates are percentages of the illustration's own box (0–100),
 * matched 1:1 to the `SneakerIllustration` viewBox (0 0 640 400 — an 8:5
 * box) so that a hotspot drawn at `(xPct, yPct)` in CSS/pointer space
 * lines up with the detail actually drawn at that spot in the SVG.
 */
export interface Hotspot {
  id: string;
  xPct: number;
  yPct: number;
  /** Short name shown on the jump button and the found badge. */
  label: string;
  /** Full sentence shown in the callout once this hotspot is found. */
  detail: string;
}

export const HOTSPOTS: Hotspot[] = [
  {
    id: "eyelets",
    xPct: 45.3,
    yPct: 45.0,
    label: "Lace eyelets",
    detail: "Lace eyelets: metal finish and spacing match authentic pairs.",
  },
  {
    id: "serial",
    xPct: 18.0,
    yPct: 44.25,
    label: "Serial tag",
    detail: "Serial tag: number verified against manufacturer batch records.",
  },
  {
    id: "logo",
    xPct: 64.1,
    yPct: 53.75,
    label: "Logo stamp",
    detail: "Logo stamp: hardware alignment and depth match verified units.",
  },
  {
    id: "stitch",
    xPct: 81.25,
    yPct: 67.5,
    label: "Toe stitching",
    detail: "Toe stitching: thread spacing is consistent with factory spec.",
  },
  {
    id: "sole",
    xPct: 46.9,
    yPct: 83.75,
    label: "Sole wear",
    detail: "Sole wear: tread pattern matches the genuine rubber compound.",
  },
];

export const TOTAL_HOTSPOTS = HOTSPOTS.length;

/**
 * Confidence score formula: an equal-weighted percentage of markers
 * found so far. A weighted version (e.g. serial + logo worth more than
 * sole wear) was considered and set aside — this device's whole point is
 * that a buyer can read the math at a glance, and `found / total` is the
 * one formula that stays legible next to the illustration without a
 * legend. Documented again in `candidates/c.md`.
 */
export function confidenceFromFound(foundCount: number): number {
  return Math.round((foundCount / TOTAL_HOTSPOTS) * 100);
}

/** Deterministic grade label derived from the live confidence score. */
export function gradeFromConfidence(confidence: number): string {
  if (confidence <= 0) return "Not yet scanned";
  if (confidence < 40) return "Early scan";
  if (confidence < 80) return "Good";
  if (confidence < 100) return "Excellent";
  return "Museum-grade";
}

/**
 * Deterministic "AI match" percentage derived from the same confidence
 * score, so the value-split section's match figure visibly moves when
 * the device is used instead of sitting at a fixed placeholder. Base 81
 * (a plausible pre-scan match floor for this listing) plus up to 18
 * points as every marker is confirmed, capped at 99 so a "live demo"
 * number never claims a false 100% match.
 */
export function matchPctFromConfidence(confidence: number): number {
  return Math.min(99, 81 + Math.round(confidence * 0.18));
}
