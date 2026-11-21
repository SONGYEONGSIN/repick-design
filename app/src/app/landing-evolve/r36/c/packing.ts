/**
 * Deterministic circle packing — no physics engine, no randomness.
 *
 * Circles are placed one at a time, largest radius first:
 *  1. The first circle sits at the origin.
 *  2. The second sits tangent to the first along the x-axis.
 *  3. Every circle after that is placed tangent to the best pair of
 *     already-placed circles: for every pair `(A, B)` already on the
 *     stage, there are at most two points where a new circle of the
 *     given radius can sit tangent to both (classic circle/circle
 *     intersection of the two "offset" circles of radius `rA + rNew` and
 *     `rB + rNew`, solved in closed form below). Every candidate point is
 *     checked against every other already-placed circle, and among the
 *     valid ones the candidate closest to the centroid of everything
 *     placed so far is kept. Pair order is fixed (`j < k`, both increasing),
 *     so the same input always produces the same output.
 *
 * A circle that cannot find a valid tangent point (should not happen for
 * the small, fixed category counts this route ever packs) falls back to a
 * fixed golden-angle spiral position — a constant, not a random value, so
 * determinism holds even in that branch.
 */

export interface PackInput {
  id: string;
  r: number;
}

export interface PackedCircle extends PackInput {
  x: number;
  y: number;
}

const GOLDEN_ANGLE_DEG = 137.508;

export function packCircles(circles: PackInput[]): PackedCircle[] {
  if (circles.length === 0) return [];

  const order = circles
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c.r - a.c.r || a.i - b.i)
    .map((entry) => entry.c);

  const placed: PackedCircle[] = [{ ...order[0], x: 0, y: 0 }];

  if (order.length > 1) {
    const r0 = placed[0].r;
    const r1 = order[1].r;
    placed.push({ ...order[1], x: r0 + r1, y: 0 });
  }

  for (let i = 2; i < order.length; i++) {
    const cur = order[i];
    let best: { x: number; y: number; dist: number } | null = null;

    for (let j = 0; j < placed.length; j++) {
      for (let k = j + 1; k < placed.length; k++) {
        const A = placed[j];
        const B = placed[k];
        const R1 = A.r + cur.r;
        const R2 = B.r + cur.r;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d === 0 || d > R1 + R2 || d < Math.abs(R1 - R2)) continue;

        const a = (R1 * R1 - R2 * R2 + d * d) / (2 * d);
        const h2 = R1 * R1 - a * a;
        if (h2 < 0) continue;
        const h = Math.sqrt(h2);
        const mx = A.x + (a * dx) / d;
        const my = A.y + (a * dy) / d;
        const ox = (-dy * h) / d;
        const oy = (dx * h) / d;

        for (const cand of [
          { x: mx + ox, y: my + oy },
          { x: mx - ox, y: my - oy },
        ]) {
          const valid = placed.every((p) => {
            const ddx = p.x - cand.x;
            const ddy = p.y - cand.y;
            return Math.sqrt(ddx * ddx + ddy * ddy) >= p.r + cur.r - 0.01;
          });
          if (!valid) continue;

          const dist = Math.sqrt(cand.x * cand.x + cand.y * cand.y);
          if (!best || dist < best.dist) {
            best = { x: cand.x, y: cand.y, dist };
          }
        }
      }
    }

    if (best) {
      placed.push({ ...cur, x: best.x, y: best.y });
    } else {
      const angle = (i * GOLDEN_ANGLE_DEG * Math.PI) / 180;
      const farthest = placed.reduce((m, p) => Math.max(m, p.r), 0);
      const dist = farthest + cur.r + i * 4;
      placed.push({ ...cur, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    }
  }

  return placed;
}

/** Abstract stage size every bubble layout is normalized into (percent-based). */
export const STAGE = 240;

/** Fraction of the stage the packed cluster's bounding box is scaled to fill. */
const FILL = 0.78;

export interface LaidOutCircle extends PackedCircle {
  /** Percentage string for CSS `left`/`width`, with the stage treated as a square. */
  pctX: string;
  pctY: string;
  pctSize: string;
}

/**
 * Packs the given circles, then centers and scales the result to occupy a
 * fixed fraction of a square `STAGE × STAGE` abstract canvas, returning
 * ready-to-use percentage strings. Centering and scale factor are both
 * derived purely from the packed bounding box — same input, same output.
 */
export function layoutOnStage(circles: PackInput[]): LaidOutCircle[] {
  const packed = packCircles(circles);
  if (packed.length === 0) return [];

  const minX = Math.min(...packed.map((c) => c.x - c.r));
  const maxX = Math.max(...packed.map((c) => c.x + c.r));
  const minY = Math.min(...packed.map((c) => c.y - c.r));
  const maxY = Math.max(...packed.map((c) => c.y + c.r));
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const scale = (STAGE * FILL) / span;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Rounded to 2 decimal places before stringifying — same precaution the
  // brief asks for on raw SVG trig coordinates, applied here too, so the
  // server-rendered and client-rendered percentage strings can never
  // differ by a long floating-point tail and trip a hydration mismatch.
  const round2 = (n: number) => Math.round(n * 100) / 100;

  return packed.map((c) => {
    const x = STAGE / 2 + (c.x - centerX) * scale;
    const y = STAGE / 2 + (c.y - centerY) * scale;
    const r = c.r * scale;
    return {
      ...c,
      x: round2(x),
      y: round2(y),
      r: round2(r),
      pctX: `${round2((x / STAGE) * 100)}%`,
      pctY: `${round2((y / STAGE) * 100)}%`,
      pctSize: `${round2(((r * 2) / STAGE) * 100)}%`,
    };
  });
}
