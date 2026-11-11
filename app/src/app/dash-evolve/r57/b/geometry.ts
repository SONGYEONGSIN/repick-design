import { COST_CENTERS, orgSpendAt, serviceSpendAt, type CloudService, type CostCenter, type PeriodMode } from "./data";
import { r2, TEAM_RAMP } from "./tokens";

/**
 * Sunburst geometry — pure math, no React. Every angle comes from the exact same spend numbers
 * KpiRow, CostCenterRail and HierarchyTree read (serviceSpendAt / orgSpendAt in data.ts), so the
 * wedge a viewer sees and the percentage printed next to it in the tree can never disagree.
 *
 * viewBox is 0 0 620 620, center (310, 310). Ring layout, inside out:
 *   center hole   0–90   (the always-visible headline total is an HTML overlay here, not SVG —
 *                          sized generously so the compact total fits without crowding)
 *   ring A        94–136  (cost centers)
 *   ring B        140–182 (services)
 *   leader tip    188
 *   label anchor  194     → margin to the viewBox edge is 310 − 194 = 116px.
 * The longest label stop in the whole dataset is "Observability" (13 chars, see data.ts) — it
 * never actually crosses LABEL_MIN_DEGREES below, but the margin is sized against it anyway, not
 * against whatever happens to qualify today. At an 11px label with a conservative ~0.62em
 * average glyph width (≈6.82px/char) that is 13 × 6.82 ≈ 88.7px, plus ~14px of leader/edge
 * padding ≈ 102.7px — comfortably inside the 116px margin above. The actual longest label that
 * does render today, "GPU Training" (12 chars), needs even less (≈95.8px).
 */

export const VB = 620;
export const CENTER = 310;
export const RING_A_INNER = 94;
export const RING_A_OUTER = 136;
export const RING_B_INNER = 140;
export const RING_B_OUTER = 182;
export const LEADER_TIP_R = 188;
export const LABEL_R = 194;
/** A service only gets an on-chart label once its wedge is wide enough to hold one without
 * crowding its neighbors — everything else is still in the always-available hierarchy tree. */
export const LABEL_MIN_DEGREES = 14;

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: r2(CENTER + radius * Math.cos(rad)), y: r2(CENTER + radius * Math.sin(rad)) };
}

export function annularSectorPath(innerR: number, outerR: number, startAngle: number, endAngle: number): string {
  const span = Math.min(endAngle - startAngle, 359.9);
  const end = startAngle + span;
  const startOuter = polar(startAngle, outerR);
  const endOuter = polar(end, outerR);
  const endInner = polar(end, innerR);
  const startInner = polar(startAngle, innerR);
  const largeArc = span > 180 ? 1 : 0;
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

export interface CenterArc {
  id: string;
  center: CostCenter;
  startAngle: number;
  endAngle: number;
  fill: string;
  path: string;
}

export interface ServiceArc {
  id: string;
  center: CostCenter;
  service: CloudService;
  startAngle: number;
  endAngle: number;
  fill: string;
  path: string;
  showLabel: boolean;
  midAngle: number;
  labelAnchor: { x: number; y: number };
  leaderFrom: { x: number; y: number };
  leaderTo: { x: number; y: number };
  textAnchor: "start" | "end";
}

export function buildArcs(period: PeriodMode): { centerArcs: CenterArc[]; serviceArcs: ServiceArc[] } {
  const total = orgSpendAt(period);
  const centerArcs: CenterArc[] = [];
  const serviceArcs: ServiceArc[] = [];
  let cursor = 0;

  COST_CENTERS.forEach((center, centerIndex) => {
    const fill = TEAM_RAMP[centerIndex % TEAM_RAMP.length];
    const centerStart = cursor;

    center.services.forEach((service) => {
      const spend = serviceSpendAt(service, period);
      const span = total === 0 ? 0 : (spend / total) * 360;
      const startAngle = cursor;
      const endAngle = cursor + span;
      const midAngle = (startAngle + endAngle) / 2;
      const rad = ((midAngle - 90) * Math.PI) / 180;
      const cos = Math.cos(rad);
      const textAnchor: "start" | "end" = cos >= 0 ? "start" : "end";
      serviceArcs.push({
        id: service.id,
        center,
        service,
        startAngle,
        endAngle,
        fill,
        path: annularSectorPath(RING_B_INNER, RING_B_OUTER, startAngle, endAngle),
        showLabel: span >= LABEL_MIN_DEGREES,
        midAngle,
        labelAnchor: polar(midAngle, LABEL_R),
        leaderFrom: polar(midAngle, RING_B_OUTER + 2),
        leaderTo: polar(midAngle, LEADER_TIP_R),
        textAnchor,
      });
      cursor = endAngle;
    });

    const centerEnd = cursor;
    centerArcs.push({
      id: center.id,
      center,
      startAngle: centerStart,
      endAngle: centerEnd,
      fill,
      path: annularSectorPath(RING_A_INNER, RING_A_OUTER, centerStart, centerEnd),
    });
  });

  return { centerArcs, serviceArcs };
}
