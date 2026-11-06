import { PLAYHEAD_MAX, STAGE_SPAN, STAGES, type Stage } from "./data";

export type StageStatus = "pending" | "active" | "done";

export interface LedgerRow extends Stage {
  /** 0–1 fraction of this stage the playhead has passed through. */
  progress: number;
  /** progress × weight — this stage's partial contribution to the trust total. */
  contribution: number;
  /** Running sum of every stage's contribution up to and including this one. */
  subtotal: number;
  status: StageStatus;
}

export function clampPlayhead(value: number): number {
  return Math.min(PLAYHEAD_MAX, Math.max(0, value));
}

/** How far (0–1) the playhead has moved through stage `index`. */
export function stageProgress(index: number, value: number): number {
  const start = index * STAGE_SPAN;
  if (value <= start) return 0;
  if (value >= start + STAGE_SPAN) return 1;
  return (value - start) / STAGE_SPAN;
}

/** Which stage the playhead currently sits inside, clamped to a valid index. */
export function currentStageIndex(value: number): number {
  const idx = Math.floor(value / STAGE_SPAN);
  return Math.min(STAGES.length - 1, Math.max(0, idx));
}

/**
 * The full itemized ledger for the current playhead position. Every row's
 * `progress`/`contribution` is a genuine function of `value` — scrubbing
 * halfway through a stage yields exactly half that stage's weight, not a
 * value that snaps once a threshold is crossed.
 */
export function ledgerRows(value: number): LedgerRow[] {
  let subtotal = 0;
  return STAGES.map((stage, i) => {
    const progress = stageProgress(i, value);
    const contribution = progress * stage.weight;
    subtotal += contribution;
    const status: StageStatus = progress >= 1 ? "done" : progress > 0 ? "active" : "pending";
    return { ...stage, progress, contribution, subtotal, status };
  });
}

/** The primary "trust accumulation" value, 0–100, continuous in `value`. */
export function trustTotal(value: number): number {
  return STAGES.reduce((sum, stage, i) => sum + stageProgress(i, value) * stage.weight, 0);
}
