// Pure, deterministic derivations for the Sorting Yield device. Nothing here reads
// Math.random or Date.now — every number is a function of the fixed BandSpec counts
// in data.ts, so a given strictness id always produces the same output, and every
// surface that cites a derived figure (hero summary, value section, closing CTA)
// calls the SAME function instead of duplicating a literal.

import { BATCH_VALUE, PAYOUT_RATE, type BandSpec } from "./data";

export function totalCount(bands: readonly BandSpec[]): number {
  return bands.reduce((sum, b) => sum + b.count, 0);
}

/** Expected payout per item, in whole dollars, averaged across all three bands. */
export function expectedPayoutPerItem(bands: readonly BandSpec[]): number {
  const total = totalCount(bands);
  if (total === 0) return 0;
  const weighted = bands.reduce((sum, b) => sum + b.count * PAYOUT_RATE[b.key], 0);
  return Math.round((weighted / total) * BATCH_VALUE);
}

/** Share of items that end up sellable (Pass or Refurbish), as a whole-number percent. */
export function sellThroughPercent(bands: readonly BandSpec[]): number {
  const total = totalCount(bands);
  if (total === 0) return 0;
  const sellable = bands.reduce((sum, b) => sum + (b.key === "fail" ? 0 : b.count), 0);
  return Math.round((sellable / total) * 100);
}

/**
 * The single most likely outcome band. The reduce seeds its accumulator with the
 * array's own first element and only ever replaces it on a strict `>` — a tie keeps
 * whichever band is listed first (the fixed pass/refurbish/fail order), so the label
 * this produces can never flip between renders of the exact same counts.
 */
export function mostLikelyBand(bands: readonly BandSpec[]): BandSpec {
  return bands.reduce((best, b) => (b.count > best.count ? b : best), bands[0]);
}

/** Dollars of the overall expected-payout figure one specific band contributes. */
export function bandContribution(bands: readonly BandSpec[], key: BandSpec["key"]): number {
  const total = totalCount(bands);
  const band = bands.find((b) => b.key === key);
  if (total === 0 || !band) return 0;
  return Math.round(((band.count * PAYOUT_RATE[band.key]) / total) * BATCH_VALUE);
}

export interface FlowGeometry {
  key: BandSpec["key"];
  label: string;
  count: number;
  sharePercent: number; // rounded whole-number percent, for display
  ribbonPath: string; // SVG path `d` for the flow ribbon, in viewBox units
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeHeight: number;
  /**
   * Percent-space anchor for the band's HTML label overlay (text rendered outside
   * the SVG — see AllocationFlow). Labels are fixed-px HTML text, not SVG `<text>`,
   * so their font size stays constant at any viewBox render scale instead of
   * shrinking with the diagram.
   */
  labelAnchor: { leftPct: number; topPct: number; maxWidthPct: number };
  /**
   * Percent-space anchor for the band's hit-box overlay — DELIBERATELY NOT the same
   * numbers as the visual node. `heightPct` still tracks the node's own proportional
   * thickness (so a thin band still LOOKS thin), but `centerTopPct` is the node's
   * vertical midpoint rather than its top edge. The hit-box is rendered positioned
   * at `top: centerTopPct%` and then shifted up by exactly half of its own, final,
   * post-min-height box via a self-relative `translateY(-50%)` — so however tall the
   * box actually ends up rendering (its percent height, or the 24px floor, whichever
   * is larger), it stays centered on the same point rather than drifting downward.
   * This is what lets AllocationFlow enforce a fixed minimum tap size that is
   * independent of the ribbon's own fluid vertical scale.
   */
  hitBox: { leftPct: number; widthPct: number; centerTopPct: number; heightPct: number };
}

// Fixed viewBox geometry. Computed, not hand-tuned per data point, so it stays
// correct for any BandSpec[] with positive counts.
export const VB_WIDTH = 680;
export const VB_HEIGHT = 220;
const PAD_Y = 14;
const GAP_Y = 14;
const SOURCE_X = 0;
const SOURCE_WIDTH = 12;
const TARGET_X = 476;
const TARGET_WIDTH = 14;
const LABEL_X = 504; // leaves 680 - 504 = 176px of margin for the longest label
// string ("Refurbish, then sell" at 12px/600 weight, estimated ~135px) to actually
// render inside the viewBox rather than merely clear its anchor point.

export function buildFlowGeometry(bands: readonly [BandSpec, BandSpec, BandSpec]): FlowGeometry[] {
  const total = totalCount(bands);
  const sourceAvailable = VB_HEIGHT - PAD_Y * 2; // source bar is one continuous run
  const targetAvailable = VB_HEIGHT - PAD_Y * 2 - GAP_Y * (bands.length - 1); // targets are separated

  let sourceCursor = PAD_Y;
  let targetCursor = PAD_Y;

  return bands.map((band) => {
    const share = total === 0 ? 0 : band.count / total;
    const sourceHeight = share * sourceAvailable;
    const targetHeight = share * targetAvailable;

    const sourceY0 = sourceCursor;
    const sourceY1 = sourceCursor + sourceHeight;
    sourceCursor = sourceY1;

    const targetY0 = targetCursor;
    const targetY1 = targetCursor + targetHeight;
    targetCursor = targetY1 + GAP_Y;

    const bendX0 = SOURCE_X + SOURCE_WIDTH + (TARGET_X - (SOURCE_X + SOURCE_WIDTH)) * 0.45;
    const bendX1 = SOURCE_X + SOURCE_WIDTH + (TARGET_X - (SOURCE_X + SOURCE_WIDTH)) * 0.55;

    const ribbonPath =
      `M${SOURCE_X + SOURCE_WIDTH},${sourceY0} ` +
      `C${bendX0},${sourceY0} ${bendX1},${targetY0} ${TARGET_X},${targetY0} ` +
      `L${TARGET_X},${targetY1} ` +
      `C${bendX1},${targetY1} ${bendX0},${sourceY1} ${SOURCE_X + SOURCE_WIDTH},${sourceY1} Z`;

    const nodeHeight = Math.max(targetY1 - targetY0, 1);
    const centerY = (targetY0 + targetY1) / 2;

    return {
      key: band.key,
      label: band.label,
      count: band.count,
      sharePercent: Math.round(share * 100),
      ribbonPath,
      nodeX: TARGET_X,
      nodeY: targetY0,
      nodeWidth: TARGET_WIDTH,
      nodeHeight,
      labelAnchor: {
        leftPct: (LABEL_X / VB_WIDTH) * 100,
        topPct: (centerY / VB_HEIGHT) * 100,
        maxWidthPct: ((VB_WIDTH - LABEL_X) / VB_WIDTH) * 100,
      },
      hitBox: {
        leftPct: (TARGET_X / VB_WIDTH) * 100,
        widthPct: ((VB_WIDTH - TARGET_X) / VB_WIDTH) * 100,
        centerTopPct: (centerY / VB_HEIGHT) * 100,
        heightPct: (nodeHeight / VB_HEIGHT) * 100,
      },
    };
  });
}
