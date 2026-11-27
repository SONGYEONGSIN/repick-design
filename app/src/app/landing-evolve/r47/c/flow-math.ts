// Pure, deterministic derivations for the Allocation Flow device. Nothing here reads
// Math.random or Date.now — every number is a function of the fixed BandSpec counts
// in data.ts, so the same strictness id always produces the same output, and every
// surface that cites a derived number (hero summary, value section, closing CTA) is
// calling the SAME function rather than duplicating a literal.

import { AVG_MARKET_VALUE, PAYOUT_RATE, type BandSpec } from "./data";

export function totalCount(bands: readonly BandSpec[]): number {
  return bands.reduce((sum, b) => sum + b.count, 0);
}

export function shareOf(band: BandSpec, total: number): number {
  return total === 0 ? 0 : band.count / total;
}

/** Expected payout per item, in whole dollars, averaged across all three bands. */
export function expectedPayoutPerItem(bands: readonly BandSpec[]): number {
  const total = totalCount(bands);
  if (total === 0) return 0;
  const weighted = bands.reduce((sum, b) => sum + b.count * PAYOUT_RATE[b.key], 0);
  return Math.round((weighted / total) * AVG_MARKET_VALUE);
}

/** Share of items that end up sellable (Pass or Refurbish), as a whole-number percent. */
export function sellThroughPercent(bands: readonly BandSpec[]): number {
  const total = totalCount(bands);
  if (total === 0) return 0;
  const sellable = bands.reduce((sum, b) => sum + (b.key === "fail" ? 0 : b.count), 0);
  return Math.round((sellable / total) * 100);
}

/**
 * The single most likely outcome band, tie-guarded: the reduce seeds its accumulator
 * with the array's own first element and only ever replaces it on a STRICT `>`
 * comparison. A tie (two bands with equal counts) therefore always keeps whichever
 * band appears first in the fixed [pass, refurbish, fail] order — neither `>` nor
 * `<` fires under equality, so the earlier band is never silently swapped out, and
 * the label this produces never contradicts itself between renders of the same data.
 */
export function mostLikelyBand(bands: readonly BandSpec[]): BandSpec {
  return bands.reduce((best, b) => (b.count > best.count ? b : best), bands[0]);
}

/** Dollars of the overall expected-payout figure this one band contributes. */
export function bandContribution(bands: readonly BandSpec[], key: BandSpec["key"]): number {
  const total = totalCount(bands);
  const band = bands.find((b) => b.key === key);
  if (total === 0 || !band) return 0;
  return Math.round(((band.count * PAYOUT_RATE[band.key]) / total) * AVG_MARKET_VALUE);
}

export interface FlowGeometry {
  key: BandSpec["key"];
  label: string;
  count: number;
  sharePercent: number; // rounded whole-number percent, for display
  path: string; // SVG path `d` for the flow ribbon
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeHeight: number;
  labelX: number;
  labelY: number;
  hitBoxPercent: { left: number; top: number; width: number; height: number };
  /**
   * Percent-space anchor for the band's HTML label overlay (rendered outside the
   * SVG, see AllocationFlow). Labels are fixed-px HTML text, not SVG `<text>`, so
   * they stay legible at any viewBox render scale instead of shrinking/growing with
   * it; these percentages place that overlay at the same position the old in-SVG
   * text used, relative to the same viewBox coordinate system.
   */
  labelPercent: { left: number; top: number; maxWidth: number };
}

// Fixed viewBox geometry. All of this is computed, not hand-tuned per data point, so
// it stays correct for any BandSpec[] with positive counts.
export const VB_WIDTH = 740;
export const VB_HEIGHT = 232;
const PAD_Y = 16;
const GAP_Y = 12;
const SOURCE_X = 0;
const SOURCE_WIDTH = 14;
const TARGET_X = 522;
const TARGET_WIDTH = 16;
const LABEL_X = 552; // leaves 740 - 552 = 188px of margin for the longest label string
// ("Refurbish-then-sell" at 12px/600 weight, estimated ~140px wide) to actually
// render inside the viewBox, not just clear its text-anchor="start" anchor point.

export function buildFlowGeometry(bands: readonly [BandSpec, BandSpec, BandSpec]): FlowGeometry[] {
  const total = totalCount(bands);
  const sourceAvailable = VB_HEIGHT - PAD_Y * 2; // source node is one continuous bar, no internal gaps
  const targetAvailable = VB_HEIGHT - PAD_Y * 2 - GAP_Y * (bands.length - 1); // target nodes are separated

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

    const curveX0 = SOURCE_X + SOURCE_WIDTH + (TARGET_X - (SOURCE_X + SOURCE_WIDTH)) * 0.45;
    const curveX1 = SOURCE_X + SOURCE_WIDTH + (TARGET_X - (SOURCE_X + SOURCE_WIDTH)) * 0.55;

    const path =
      `M${SOURCE_X + SOURCE_WIDTH},${sourceY0} ` +
      `C${curveX0},${sourceY0} ${curveX1},${targetY0} ${TARGET_X},${targetY0} ` +
      `L${TARGET_X},${targetY1} ` +
      `C${curveX1},${targetY1} ${curveX0},${sourceY1} ${SOURCE_X + SOURCE_WIDTH},${sourceY1} Z`;

    return {
      key: band.key,
      label: band.label,
      count: band.count,
      sharePercent: Math.round(share * 100),
      path,
      nodeX: TARGET_X,
      nodeY: targetY0,
      nodeWidth: TARGET_WIDTH,
      nodeHeight: Math.max(targetY1 - targetY0, 1),
      labelX: LABEL_X,
      labelY: (targetY0 + targetY1) / 2,
      hitBoxPercent: {
        left: (TARGET_X / VB_WIDTH) * 100,
        top: (targetY0 / VB_HEIGHT) * 100,
        width: ((VB_WIDTH - TARGET_X) / VB_WIDTH) * 100,
        height: ((targetY1 - targetY0) / VB_HEIGHT) * 100,
      },
      labelPercent: {
        left: (LABEL_X / VB_WIDTH) * 100,
        top: ((targetY0 + targetY1) / 2 / VB_HEIGHT) * 100,
        maxWidth: ((VB_WIDTH - LABEL_X) / VB_WIDTH) * 100,
      },
    };
  });
}
