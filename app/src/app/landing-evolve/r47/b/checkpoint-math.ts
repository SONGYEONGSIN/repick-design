// Pure, deterministic derivation shared by the Checkpoint Deck, the live tally, the value
// section and the closing CTA — nothing here reads Math.random() or Date.now(), so the same
// checkpoint statuses always produce the same trust score, grade and price range, server or
// client, on this render or the next.

import type { CheckpointId, CheckpointStatus } from "./checkpoint-data";

// A human confirmation nudges the AI's own estimate up slightly (it was right); a flag drops it
// hard (something real may be wrong); an untouched, pending card still contributes its AI
// baseline as-is — this is what makes the default partial state a REAL proof point rather than
// a placeholder: two pending checkpoints are already counted at the AI's own confidence.
export function effectiveScore(baseScore: number, status: CheckpointStatus): number {
  if (status === "confirmed") return Math.min(100, baseScore + 4);
  if (status === "flagged") return Math.max(5, baseScore - 38);
  return baseScore;
}

export interface VerdictInput {
  id: CheckpointId;
  baseScore: number;
  status: CheckpointStatus;
}

export type GradeLetter = "A" | "B" | "C";

export interface Verdict {
  avgScore: number; // 0–100, rounded
  total: number;
  confirmedCount: number;
  flaggedCount: number;
  pendingCount: number;
  resolvedCount: number;
  allResolved: boolean;
  confirmedRatio: number;
  gradeLetter: GradeLetter;
  statusLabel: string;
  finalStatus: string;
  priceLow: number;
  priceHigh: number;
}

export function computeVerdict(items: VerdictInput[]): Verdict {
  const total = items.length;
  const scores = items.map((c) => effectiveScore(c.baseScore, c.status));
  const avgScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / total);

  const confirmedCount = items.filter((c) => c.status === "confirmed").length;
  const flaggedCount = items.filter((c) => c.status === "flagged").length;
  const pendingCount = items.filter((c) => c.status === "pending").length;
  const resolvedCount = confirmedCount + flaggedCount;
  const allResolved = resolvedCount === total;
  const confirmedRatio = confirmedCount / total;

  // Grade letter: boundary-guarded with >= at BOTH thresholds, so an average that lands exactly
  // on 85 or exactly on 70 resolves deterministically to one tier instead of silently falling
  // through a gap between a `>` on one branch and a `>=` on the next.
  let gradeLetter: GradeLetter;
  if (avgScore >= 85) gradeLetter = "A";
  else if (avgScore >= 70) gradeLetter = "B";
  else gradeLetter = "C";

  // Status label: boundary-guarded at exactly half confirmed. This candidate's own DEFAULT
  // state is 2 of 4 checkpoints confirmed — confirmedRatio === 0.5 exactly — so this is not a
  // hypothetical edge case, it is the state every visitor sees on first paint. Using >= means
  // that exact tie resolves to "Trending Verified" on purpose, not by accident.
  const statusLabel = confirmedRatio >= 0.5 ? "Trending Verified" : "Needs Review";

  // Final verdict (shown once every checkpoint is resolved): "Verified" only if nothing was
  // ever flagged; any flag at all, even on an otherwise high-scoring run, reads as needing a
  // human look rather than a clean pass.
  const finalStatus = flaggedCount === 0 ? "Verified" : "Flagged for Review";

  // Price range: a continuous function of avgScore (not three hard-coded buckets), so every
  // single confirm/flag/undo visibly moves both numbers, not just the score.
  //   avgScore 0   -> $900–$1,150   avgScore 100 -> $1,780–$2,040
  const priceLow = Math.round((900 + 8.8 * avgScore) / 10) * 10;
  const priceHigh = Math.round((1150 + 8.9 * avgScore) / 10) * 10;

  return {
    avgScore,
    total,
    confirmedCount,
    flaggedCount,
    pendingCount,
    resolvedCount,
    allResolved,
    confirmedRatio,
    gradeLetter,
    statusLabel,
    finalStatus,
    priceLow,
    priceHigh,
  };
}

export function formatUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatRange(low: number, high: number): string {
  return `${formatUsd(low)}–${formatUsd(high)}`;
}
