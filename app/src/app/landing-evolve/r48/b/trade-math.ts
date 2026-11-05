import { BASE_VALUE, getBranch, type BranchOption, type LeafOutcome, type StepOneId, type StepTwoId } from "./trade-data";

export interface BranchRange {
  low: number;
  high: number;
  daysLow: number;
  daysHigh: number;
}

/**
 * A step-1 branch's range is never a separately hand-typed number — it is always derived from
 * that branch's own two children, so the range and the eventual exact leaf value can never
 * drift apart.
 */
export function getBranchRange(branch: BranchOption): BranchRange {
  const payouts = branch.children.map((c) => c.payout);
  const days = branch.children.map((c) => c.days);
  return {
    low: Math.min(...payouts),
    high: Math.max(...payouts),
    daysLow: Math.min(...days),
    daysHigh: Math.max(...days),
  };
}

export type PathSummary =
  | {
      stage: "branch";
      branch: BranchOption;
      range: BranchRange;
      leaf: null;
      percentLow: number;
      percentHigh: number;
    }
  | {
      stage: "leaf";
      branch: BranchOption;
      leaf: LeafOutcome;
      percent: number;
    };

const pct = (value: number) => Math.round((value / BASE_VALUE) * 100);

/**
 * The single function every surface on this page reads from — hero headline, value split,
 * closing CTA, the live-region announcement. Given the current step-1/step-2 selection, it
 * derives one summary object; nothing downstream ever re-states a number as a literal.
 */
export function computePathSummary(step1: StepOneId, step2: StepTwoId | null): PathSummary {
  const branch = getBranch(step1);
  if (!step2) {
    const range = getBranchRange(branch);
    return { stage: "branch", branch, range, leaf: null, percentLow: pct(range.low), percentHigh: pct(range.high) };
  }
  const leaf = branch.children.find((c) => c.id === step2);
  if (!leaf) {
    const range = getBranchRange(branch);
    return { stage: "branch", branch, range, leaf: null, percentLow: pct(range.low), percentHigh: pct(range.high) };
  }
  return { stage: "leaf", branch, leaf, percent: pct(leaf.payout) };
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function formatDays(days: number): string {
  if (days === 0) return "Instant";
  return days === 1 ? "1 day" : `${days} days`;
}

/** One sentence describing the current path, used by the "Your path" chip and the live region. */
export function describePath(summary: PathSummary): string {
  if (summary.stage === "branch") {
    return `${summary.branch.fullLabel} — choose a second step to lock in a number.`;
  }
  return `${summary.branch.fullLabel}, ${summary.leaf.fullLabel}.`;
}
