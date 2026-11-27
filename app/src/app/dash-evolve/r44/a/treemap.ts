/**
 * Hand-built, deterministic treemap layout — no charting library, no randomness. This is the
 * classic "slice-and-dice" method done recursively: at each step the (already value-sorted) item
 * list is bisected as close to its running half-total as possible, the current rectangle is split
 * in proportion to each half's value share, and the two halves recurse into their own sub-rect
 * with the cut orientation flipped. Area is exact at every level (it is a pure product of nested
 * fractions of the parent rectangle), so tile area always matches value share exactly; alternating
 * the orientation keeps the result looking like a real 2-D treemap instead of one long strip.
 *
 * All math happens in a fixed logical box (`ROOT_W` x `ROOT_H`, a 2.4:1 ratio) and the result is
 * returned as percentages of that box, so the caller can render tiles at any real pixel size with
 * `position: absolute; left/top/width/height: {pct}%` inside a container whose own CSS aspect
 * ratio is set to match (`aspect-[12/5]`) — no `ResizeObserver`, no measured DOM, nothing that can
 * differ between server and client.
 */

const ROOT_W = 240;
const ROOT_H = 100;

export type TreemapRect = {
  id: string;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type PlacedBox = { id: string; value: number; x: number; y: number; w: number; h: number };

function bisect(items: { id: string; value: number }[], x: number, y: number, w: number, h: number, sliceByWidth: boolean): PlacedBox[] {
  if (items.length === 1) {
    const only = items[0]!;
    return [{ id: only.id, value: only.value, x, y, w, h }];
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

  if (sliceByWidth) {
    const widthA = w * fractionA;
    return [
      ...bisect(groupA, x, y, widthA, h, !sliceByWidth),
      ...bisect(groupB, x + widthA, y, w - widthA, h, !sliceByWidth),
    ];
  }
  const heightA = h * fractionA;
  return [
    ...bisect(groupA, x, y, w, heightA, !sliceByWidth),
    ...bisect(groupB, x, y + heightA, w, h - heightA, !sliceByWidth),
  ];
}

/**
 * `items` must already be sorted descending by `value` — callers always have that ordering
 * anyway (it is also how tile color rank is assigned), so sorting is not repeated here.
 */
export function layoutTreemap(items: { id: string; value: number }[]): TreemapRect[] {
  const positive = items.filter((it) => it.value > 0);
  if (positive.length === 0) return [];
  if (positive.length === 1) {
    const only = positive[0]!;
    return [{ id: only.id, xPct: 0, yPct: 0, wPct: 100, hPct: 100 }];
  }
  const placed = bisect(positive, 0, 0, ROOT_W, ROOT_H, ROOT_W >= ROOT_H);
  return placed.map((p) => ({
    id: p.id,
    xPct: round2((p.x / ROOT_W) * 100),
    yPct: round2((p.y / ROOT_H) * 100),
    wPct: round2((p.w / ROOT_W) * 100),
    hPct: round2((p.h / ROOT_H) * 100),
  }));
}

/**
 * Tiles are colored on a strict amber monochrome scale by rank (0 = largest in the current set),
 * never by hue — the single assigned accent stays the only accent, even inside the data viz. Each
 * pairing below is contrast-checked against its own background (not assumed): amber-400/500/600
 * pair with near-black text at 11.9:1 / 9.1:1 / 6.2:1, and amber-700/800 pair with near-white text
 * at 4.8:1 / 6.8:1 — every tile clears 4.5:1 for its label text regardless of which rank lands on
 * it, so this holds for every drill state the treemap can be in, not just the default view.
 */
const TONES: { bg: string; text: string; subtext: string }[] = [
  { bg: "bg-amber-400", text: "text-zinc-950", subtext: "text-zinc-950/70" },
  { bg: "bg-amber-500", text: "text-zinc-950", subtext: "text-zinc-950/70" },
  { bg: "bg-amber-600", text: "text-zinc-950", subtext: "text-zinc-950/70" },
  { bg: "bg-amber-700", text: "text-zinc-50", subtext: "text-zinc-50/75" },
  { bg: "bg-amber-800", text: "text-zinc-50", subtext: "text-zinc-50/75" },
  { bg: "bg-amber-900", text: "text-zinc-50", subtext: "text-zinc-50/75" },
];

export function toneForRank(rank: number): { bg: string; text: string; subtext: string } {
  return TONES[Math.min(rank, TONES.length - 1)]!;
}
