// Deterministic device state for the Dispute Replay frame scrubber. No Math.random, no
// Date.now() — every number is a fixed lookup keyed by frame index and the human-review toggle,
// so server and client render byte-identical output.

export interface Frame {
  id: number;
  label: string;
  confidence: number; // this frame's own confidence score, 0-100
  deduction: number; // USD deducted at this frame under AI-only review
  note: string;
  /** Present only on frames where a human reviewer can override the AI's deduction. */
  humanOverrideDeduction?: number;
  humanNote?: string;
}

export const LIST_PRICE = 1180;

export const FRAMES: Frame[] = [
  {
    id: 0,
    label: "Intake photo match",
    confidence: 97,
    deduction: 0,
    note: "Submitted photos align with the serial-matched listing on file — no mismatch found.",
  },
  {
    id: 1,
    label: "Serial & IMEI scan",
    confidence: 95,
    deduction: 0,
    note: "Serial number resolves to an original manufacture record, not a refurbished-shell match.",
  },
  {
    id: 2,
    label: "Battery health test",
    confidence: 81,
    deduction: 45,
    note: "Cycle count is elevated relative to the model-year baseline the AI uses for this check.",
    humanOverrideDeduction: 15,
    humanNote: "Reviewer confirmed this submodel's factory baseline is higher than the AI's default — cycle count is normal.",
  },
  {
    id: 3,
    label: "Cosmetic grading",
    confidence: 88,
    deduction: 20,
    note: "Edge wear visible in frame 4 is consistent with light daily use, graded accordingly.",
  },
  {
    id: 4,
    label: "Final price reconciliation",
    confidence: 92,
    deduction: 0,
    note: "Every deduction above is applied exactly once here — nothing is double-counted across frames.",
  },
];

export interface ReplayResult {
  frame: Frame;
  cumulativeDeduction: number;
  finalPriceAtFrame: number;
  overallConfidence: number;
  escalated: boolean;
}

export function deriveReplay(frameIndex: number, humanReview: boolean): ReplayResult {
  const index = Math.max(0, Math.min(FRAMES.length - 1, frameIndex));
  const visible = FRAMES.slice(0, index + 1);

  let cumulativeDeduction = 0;
  let escalated = false;
  for (const f of visible) {
    if (humanReview && f.humanOverrideDeduction !== undefined) {
      cumulativeDeduction += f.humanOverrideDeduction;
      escalated = true;
    } else {
      cumulativeDeduction += f.deduction;
    }
  }

  const confidenceSum = visible.reduce((sum, f) => sum + f.confidence, 0);
  const overallConfidence = Math.round(confidenceSum / visible.length);

  return {
    frame: FRAMES[index],
    cumulativeDeduction,
    finalPriceAtFrame: LIST_PRICE - cumulativeDeduction,
    overallConfidence,
    escalated,
  };
}
