// Pure radar-chart geometry. No trig call here ever returns an unrounded
// coordinate — every point is rounded to 2 decimals before it reaches an
// SVG attribute, per this catalog's determinism rule.

export const VIEW_SIZE = 400;
export const CENTER = 200;
export const MAX_RADIUS = 150;
export const RING_FRACTIONS = [0.25, 0.5, 0.75, 1] as const;
export const LABEL_RADIUS_FACTOR = 1.26;
export const HOTZONE_RADIUS_FACTOR = 1.26;

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Angle in radians for spoke `index` of `count`, starting at 12 o'clock and going clockwise. */
export function spokeAngle(index: number, count: number): number {
  const degrees = -90 + (360 / count) * index;
  return (degrees * Math.PI) / 180;
}

export interface Point {
  x: number;
  y: number;
}

export function pointAtRadius(angleRad: number, radius: number): Point {
  return {
    x: round2(CENTER + radius * Math.cos(angleRad)),
    y: round2(CENTER + radius * Math.sin(angleRad)),
  };
}

/** Point on the polygon for a 0–100 score at the given spoke. */
export function scorePoint(index: number, count: number, score: number): Point {
  const clamped = Math.min(100, Math.max(0, score));
  return pointAtRadius(spokeAngle(index, count), MAX_RADIUS * (clamped / 100));
}

export function labelPoint(index: number, count: number): Point {
  return pointAtRadius(spokeAngle(index, count), MAX_RADIUS * LABEL_RADIUS_FACTOR);
}

export function hotzonePoint(index: number, count: number): Point {
  return pointAtRadius(spokeAngle(index, count), MAX_RADIUS * HOTZONE_RADIUS_FACTOR);
}

export function ringRadius(fraction: number): number {
  return round2(MAX_RADIUS * fraction);
}

/** Text-anchor so axis labels lean away from the chart center. */
export function anchorFor(angleRad: number): "start" | "middle" | "end" {
  const cos = Math.cos(angleRad);
  if (cos > 0.3) return "start";
  if (cos < -0.3) return "end";
  return "middle";
}

/** Vertical nudge so top/bottom labels don't collide with the spoke tip. */
export function dyFor(angleRad: number): number {
  const sin = Math.sin(angleRad);
  if (sin < -0.5) return -4;
  if (sin > 0.5) return 10;
  return 4;
}

export function polygonPoints(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}
