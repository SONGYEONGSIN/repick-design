/**
 * Deterministic donut arc math. All coordinates are rounded to 2 decimals —
 * nothing here reads Math.random or the clock, so the same inputs always
 * produce the same path string.
 */

export interface DonutLayout {
  cx: number;
  cy: number;
  rOuter: number;
  rInner: number;
  /** Gap carved out of each wedge's angular span, in degrees, for visual separation. */
  padDeg: number;
}

export const DONUT_LAYOUT: DonutLayout = {
  cx: 120,
  cy: 120,
  rOuter: 104,
  rInner: 66,
  padDeg: 1.6,
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: round2(cx + r * Math.cos(rad)), y: round2(cy + r * Math.sin(rad)) };
}

export function wedgePath(layout: DonutLayout, startDeg: number, endDeg: number): string {
  const { cx, cy, rOuter, rInner } = layout;
  const outerStart = polarPoint(cx, cy, rOuter, startDeg);
  const outerEnd = polarPoint(cx, cy, rOuter, endDeg);
  const innerEnd = polarPoint(cx, cy, rInner, endDeg);
  const innerStart = polarPoint(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

export interface WedgeGeometry<ID extends string = string> {
  id: ID;
  path: string;
  /** Point just outside the ring, at the wedge's mid-angle — the tooltip anchor. */
  labelPoint: { x: number; y: number };
}

export function buildWedges<ID extends string>(
  layout: DonutLayout,
  shares: { id: ID; percent: number }[],
): WedgeGeometry<ID>[] {
  let cumulative = 0;
  return shares.map((share) => {
    const sweep = (share.percent / 100) * 360;
    const start = cumulative;
    const end = cumulative + sweep;
    cumulative = end;
    const halfPad = Math.min(layout.padDeg / 2, sweep / 4);
    const path = wedgePath(layout, start + halfPad, end - halfPad);
    const midAngle = (start + end) / 2;
    const labelPoint = polarPoint(layout.cx, layout.cy, (layout.rOuter + layout.rInner) / 2, midAngle);
    return { id: share.id, path, labelPoint };
  });
}
