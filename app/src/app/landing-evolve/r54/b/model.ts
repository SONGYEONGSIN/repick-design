import { MONTH_COUNT, PRICE_HISTORY, type PricePoint } from "./data";

export type Trend = "up" | "down" | "flat";

export interface TimelineWindow {
  start: number;
  end: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function mean(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function formatUsd(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function discountPct(price: number, originalPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/** The lowest and highest monthly price in the fixed dataset, used to scale the chart. */
export const MIN_PRICE = Math.min(...PRICE_HISTORY.map((p) => p.price));
export const MAX_PRICE = Math.max(...PRICE_HISTORY.map((p) => p.price));

/** Fraction of horizontal edge padding reserved on each side of the plotted line. */
export const CHART_PAD = 0.02;

/** Horizontal position (0..1) of point `index` out of `count` points, edge-padded. */
export function xFrac(index: number, count: number): number {
  if (count <= 1) return 0.5;
  return CHART_PAD + (index / (count - 1)) * (1 - 2 * CHART_PAD);
}

/** Inverse of `xFrac`: the nearest point index for a horizontal fraction (0..1). */
export function indexFromFrac(frac: number, count: number): number {
  if (count <= 1) return 0;
  const span = 1 - 2 * CHART_PAD;
  const raw = ((frac - CHART_PAD) / span) * (count - 1);
  return clamp(Math.round(raw), 0, count - 1);
}

/** "Now", "1 mo ago", "2 mo ago", ... counted back from the final (most recent) point. */
export function monthLabel(index: number): string {
  const monthsAgo = MONTH_COUNT - 1 - index;
  if (monthsAgo === 0) return "Now";
  if (monthsAgo === 1) return "1 mo ago";
  return `${monthsAgo} mo ago`;
}

export interface SegmentStats {
  avgPrice: number;
  count: number;
  trend: Trend;
  deltaPct: number;
}

/** Pure summary of one slice of the timeline -- average price, point count, first-to-last trend. */
export function computeSegment(points: readonly PricePoint[]): SegmentStats | null {
  if (points.length === 0) return null;
  const avgPrice = mean(points.map((p) => p.price));
  if (points.length < 2) {
    return { avgPrice, count: points.length, trend: "flat", deltaPct: 0 };
  }
  const first = points[0].price;
  const last = points[points.length - 1].price;
  const deltaPct = first === 0 ? 0 : Math.round(((last - first) / first) * 100);
  const trend: Trend = deltaPct > 0 ? "up" : deltaPct < 0 ? "down" : "flat";
  return { avgPrice, count: points.length, trend, deltaPct };
}

export interface WindowSegments {
  before: readonly PricePoint[];
  inside: readonly PricePoint[];
  after: readonly PricePoint[];
}

export function windowSegments(data: readonly PricePoint[], win: TimelineWindow): WindowSegments {
  return {
    before: data.slice(0, win.start),
    inside: data.slice(win.start, win.end + 1),
    after: data.slice(win.end + 1),
  };
}

export type HeadlineMetric =
  | { kind: "vs-before"; insideAvg: number; months: number; pct: number; direction: Trend }
  | { kind: "vs-after"; insideAvg: number; months: number; pct: number; direction: Trend }
  | { kind: "full-range"; insideAvg: number; months: number; pct: number; direction: Trend };

/**
 * The single derived number this whole page keeps alive end to end: the average price inside
 * the current window, compared against whichever neighboring segment exists. Both the device's
 * own readout and the closing CTA call this with the same window state and render it through
 * `headlineText`, so the two can never drift apart or show a stale/hardcoded figure.
 */
export function headlineMetric(data: readonly PricePoint[], win: TimelineWindow): HeadlineMetric {
  const { before, inside, after } = windowSegments(data, win);
  const insideAvg = Math.round(mean(inside.map((p) => p.price)));
  const months = inside.length;

  if (before.length > 0) {
    const baseAvg = Math.round(mean(before.map((p) => p.price)));
    const pct = baseAvg === 0 ? 0 : Math.round(((insideAvg - baseAvg) / baseAvg) * 100);
    const direction: Trend = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
    return { kind: "vs-before", insideAvg, months, pct, direction };
  }
  if (after.length > 0) {
    const baseAvg = Math.round(mean(after.map((p) => p.price)));
    const pct = baseAvg === 0 ? 0 : Math.round(((insideAvg - baseAvg) / baseAvg) * 100);
    const direction: Trend = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
    return { kind: "vs-after", insideAvg, months, pct, direction };
  }
  const first = inside[0]?.price ?? insideAvg;
  const last = inside[inside.length - 1]?.price ?? insideAvg;
  const pct = first === 0 ? 0 : Math.round(((last - first) / first) * 100);
  const direction: Trend = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return { kind: "full-range", insideAvg, months, pct, direction };
}

const DIRECTION_WORD: Record<Trend, string> = { up: "higher", down: "lower", flat: "flat" };
const TREND_WORD: Record<Trend, string> = { up: "up", down: "down", flat: "flat" };

/** Short clause version of the same metric, for a heading rather than a full sentence. */
export function headlineClause(metric: HeadlineMetric): string {
  const magnitude = Math.abs(metric.pct);
  if (metric.kind === "vs-before") return `${magnitude}% ${DIRECTION_WORD[metric.direction]} than before it`;
  if (metric.kind === "vs-after") return `${magnitude}% ${DIRECTION_WORD[metric.direction]} than after it`;
  return `trending ${TREND_WORD[metric.direction]} ${magnitude}% end to end`;
}

/** Renders a `HeadlineMetric` as one sentence. Used verbatim by both the device and the CTA. */
export function headlineText(metric: HeadlineMetric): string {
  const avg = formatUsd(metric.insideAvg);
  const magnitude = Math.abs(metric.pct);
  if (metric.kind === "vs-before") {
    return `Inside your window, the average price was ${avg} — ${magnitude}% ${DIRECTION_WORD[metric.direction]} than before it.`;
  }
  if (metric.kind === "vs-after") {
    return `Inside your window, the average price was ${avg} — ${magnitude}% ${DIRECTION_WORD[metric.direction]} than after it.`;
  }
  return `Across all ${metric.months} months, the average price was ${avg}, trending ${TREND_WORD[metric.direction]} ${magnitude}% from start to end.`;
}
