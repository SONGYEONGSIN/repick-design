// Pure, deterministic treemap layout — no Math.random / Date.now anywhere. Given an ordered list
// of {id, value} items and a nominal coordinate space (width x height), it recursively splits the
// space into two rectangles whose areas are proportional to the summed value of two contiguous
// groups, alternating the split axis by whichever side of the *current* rectangle is longer. This
// is a "recursive balanced binary slice" treemap: simpler than full squarify, but it satisfies the
// same contract a treemap needs — every leaf rectangle's area is exactly proportional to its value,
// the rectangles exactly tile the parent with no gaps or overlaps, and the whole thing is a pure
// function of (items, width, height) so React can re-render it on every selection change with no
// extra state.
//
// Callers should pass `items` already sorted by descending value (the caller's fixed catalog order
// already is) — that keeps the largest allocation anchored in the same corner across selections
// instead of hopping around, which reads as more stable/legible as tiles are added or removed.

export type TreemapItem = { id: string; value: number };

export type TreemapRect = {
  id: string;
  /** Percent of the container's width/height — safe to use directly as CSS left/top/width/height. */
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
};

type RawRect = { id: string; x: number; y: number; w: number; h: number };

function splitRect(items: TreemapItem[], x: number, y: number, w: number, h: number): RawRect[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ id: items[0].id, x, y, w, h }];
  }

  const total = items.reduce((sum, item) => sum + item.value, 0);

  // Find the contiguous split point whose running sum lands closest to half the total — this is
  // what keeps each recursive half roughly balanced (and so, roughly square) without needing a
  // full squarified-ratio search.
  let splitIndex = 1;
  let bestDiff = Infinity;
  let running = 0;
  for (let i = 0; i < items.length - 1; i++) {
    running += items[i].value;
    const diff = Math.abs(running - total / 2);
    if (diff < bestDiff) {
      bestDiff = diff;
      splitIndex = i + 1;
    }
  }

  const groupA = items.slice(0, splitIndex);
  const groupB = items.slice(splitIndex);
  const sumA = groupA.reduce((sum, item) => sum + item.value, 0);
  const ratio = total > 0 ? sumA / total : 0.5;

  // Always cut along the longer side, so tiles trend toward square rather than sliver-thin.
  if (w >= h) {
    const wA = w * ratio;
    return [...splitRect(groupA, x, y, wA, h), ...splitRect(groupB, x + wA, y, w - wA, h)];
  }
  const hA = h * ratio;
  return [...splitRect(groupA, x, y, w, hA), ...splitRect(groupB, x, y + hA, w, h - hA)];
}

export function layoutTreemap(
  items: TreemapItem[],
  width: number = 1000,
  height: number = 562.5,
): TreemapRect[] {
  const positive = items.filter((item) => item.value > 0);
  if (positive.length === 0) return [];
  return splitRect(positive, 0, 0, width, height).map((r) => ({
    id: r.id,
    xPct: (r.x / width) * 100,
    yPct: (r.y / height) * 100,
    wPct: (r.w / width) * 100,
    hPct: (r.h / height) * 100,
  }));
}
