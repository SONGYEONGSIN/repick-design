/**
 * Squarified treemap layout (Bruls, Huizing & van Wijk, "Squarified Treemaps"). Pure and
 * deterministic — no randomness anywhere. Callers should pass items pre-sorted by value
 * descending (standard practice for this algorithm's visual quality), but the function itself
 * never reorders by anything other than the array it is given.
 */

export interface LayoutInput {
  id: string;
  value: number;
}

export interface LayoutRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

function worstAspect(values: number[], length: number): number {
  const sum = values.reduce((a, b) => a + b, 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const s2 = sum * sum;
  const l2 = length * length;
  return Math.max((l2 * max) / s2, s2 / (l2 * min));
}

function layoutRow(
  row: { id: string; value: number }[],
  x: number,
  y: number,
  w: number,
  h: number,
): { rects: LayoutRect[]; x: number; y: number; w: number; h: number } {
  const sum = row.reduce((a, r) => a + r.value, 0);
  const rects: LayoutRect[] = [];
  if (w >= h) {
    const rowW = sum / h;
    let cy = y;
    for (const item of row) {
      const rh = item.value / rowW;
      rects.push({ id: item.id, x, y: cy, w: rowW, h: rh });
      cy += rh;
    }
    return { rects, x: x + rowW, y, w: Math.max(w - rowW, 0), h };
  }
  const rowH = sum / w;
  let cx = x;
  for (const item of row) {
    const rw = item.value / rowH;
    rects.push({ id: item.id, x: cx, y, w: rw, h: rowH });
    cx += rw;
  }
  return { rects, x, y: y + rowH, w, h: Math.max(h - rowH, 0) };
}

export function squarify(items: LayoutInput[], x: number, y: number, w: number, h: number): LayoutRect[] {
  if (items.length === 0 || w <= 0 || h <= 0) return [];
  const total = items.reduce((a, b) => a + b.value, 0);
  if (total <= 0) return [];
  const area = w * h;
  let remaining = items.map((it) => ({ id: it.id, value: (it.value / total) * area }));

  const out: LayoutRect[] = [];
  let rx = x;
  let ry = y;
  let rw = w;
  let rh = h;

  while (remaining.length > 0) {
    const length = Math.min(rw, rh);
    let row = [remaining[0]];
    let i = 1;
    while (i < remaining.length) {
      const candidate = [...row, remaining[i]];
      const worstWith = worstAspect(candidate.map((r) => r.value), length);
      const worstWithout = worstAspect(row.map((r) => r.value), length);
      if (worstWith <= worstWithout) {
        row = candidate;
        i += 1;
      } else {
        break;
      }
    }
    const laid = layoutRow(row, rx, ry, rw, rh);
    out.push(...laid.rects);
    remaining = remaining.slice(row.length);
    rx = laid.x;
    ry = laid.y;
    rw = laid.w;
    rh = laid.h;
  }
  return out;
}
