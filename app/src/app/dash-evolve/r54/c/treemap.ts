/**
 * Deterministic slice-and-dice treemap layout — no charting library, no randomness, no measured
 * DOM. At every recursion step the (pre-sorted) item list is split as close to its running
 * half-total as possible; the current rectangle is divided along one axis in proportion to each
 * half's value share, and the two halves recurse into their own sub-rectangle with the cut axis
 * flipped. Because each rectangle's area is a pure product of nested fractions of its parent, tile
 * area always matches value share exactly — there is never a hand-typed, independently-overlapping
 * rectangle to go out of sync with the data.
 *
 * All math happens in a fixed logical box (`ROOT_W` x `ROOT_H`) and the result comes back as
 * percentages of that box, so a caller renders tiles at any real pixel size with
 * `position: absolute; left/top/width/height: {pct}%` inside a container whose CSS aspect ratio
 * matches `ROOT_W / ROOT_H` — nothing here differs between server and client render.
 */

const ROOT_W = 280;
const ROOT_H = 120;

export type TreemapTile = {
  id: string;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type Box = { id: string; x: number; y: number; w: number; h: number };

function splitRect(items: { id: string; value: number }[], x: number, y: number, w: number, h: number, cutVertical: boolean): Box[] {
  if (items.length === 1) {
    const only = items[0]!;
    return [{ id: only.id, x, y, w, h }];
  }

  const total = items.reduce((sum, it) => sum + it.value, 0);
  const half = total / 2;
  let cumulative = 0;
  let splitIndex = 1;
  for (let i = 0; i < items.length; i++) {
    cumulative += items[i]!.value;
    if (cumulative >= half) {
      splitIndex = i + 1;
      break;
    }
  }
  splitIndex = Math.min(Math.max(splitIndex, 1), items.length - 1);

  const groupA = items.slice(0, splitIndex);
  const groupB = items.slice(splitIndex);
  const sumA = groupA.reduce((sum, it) => sum + it.value, 0);
  const fractionA = total > 0 ? sumA / total : 0.5;

  if (cutVertical) {
    const widthA = w * fractionA;
    return [...splitRect(groupA, x, y, widthA, h, !cutVertical), ...splitRect(groupB, x + widthA, y, w - widthA, h, !cutVertical)];
  }
  const heightA = h * fractionA;
  return [...splitRect(groupA, x, y, w, heightA, !cutVertical), ...splitRect(groupB, x, y + heightA, w, h - heightA, !cutVertical)];
}

/** `items` must already be sorted descending by value — callers hold that order anyway (it is
 *  also the order tiles are iterated in for keyboard tab order), so sorting is not repeated here. */
export function layoutTreemap(items: { id: string; value: number }[]): TreemapTile[] {
  const positive = items.filter((it) => it.value > 0);
  if (positive.length === 0) return [];
  if (positive.length === 1) {
    return [{ id: positive[0]!.id, xPct: 0, yPct: 0, wPct: 100, hPct: 100 }];
  }
  const placed = splitRect(positive, 0, 0, ROOT_W, ROOT_H, ROOT_W >= ROOT_H);
  return placed.map((p) => ({
    id: p.id,
    xPct: round2((p.x / ROOT_W) * 100),
    yPct: round2((p.y / ROOT_H) * 100),
    wPct: round2((p.w / ROOT_W) * 100),
    hPct: round2((p.h / ROOT_H) * 100),
  }));
}

/** Area of a tile as a fraction of the whole box (0–1), used to pick a sensible label text size
 *  per cell so small tiles don't overflow and large tiles don't look under-filled. */
export function tileArea(tile: TreemapTile): number {
  return (tile.wPct / 100) * (tile.hPct / 100);
}
