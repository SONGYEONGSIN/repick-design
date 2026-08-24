/**
 * The grid's *encoding* — the only thing the pin produces.
 *
 * This file is the structural answer to "what does pinning a cohort do?". Pinning does NOT push a
 * `selectedId` into three sibling widgets that each re-render a highlight. It builds a different
 * `GridEncoding` object, and the matrix draws whatever that object tells it to draw: different
 * numbers (absolute rate -> delta in points), a different colour ramp (sequential orange ->
 * diverging cool/warm), a different row marginal, a different column marginal, a different curve
 * domain. One consumer, one contract. The segment panel and the notes card never learn that a pin
 * exists.
 *
 * ── Contrast, computed rather than eyeballed ────────────────────────────────────────────────────
 * Every ramp stop below carries printed text, so every stop was checked against a SINGLE ink
 * colour, #18181B (zinc-900), before being admitted. Sequential ramp, worst stop #F97316 -> 6.32:1.
 * Diverging ramp, worst stops #FB923C -> 7.82:1 and #94A3B8 -> 6.91:1. Nothing darker is allowed in:
 * orange-700 (#C2410C) computes to 3.42:1 against the same ink and slate-500 (#64748B) to 3.72:1,
 * which is exactly how a heatmap in this repo failed before. There is no intensity-dependent text
 * colour anywhere — one ink clears the whole ramp in both modes, which is the only branch-free way
 * to be safe when a diverging scale darkens at BOTH ends.
 */

import {
  formatCount,
  formatRate,
  HORIZON,
  METRICS,
  VOLUME_FORMAT,
  type MatrixRow,
  type MetricId,
  type PooledCell,
} from "./cohort-data";

export const CELL_INK = "#18181B";
export const CELL_INK_MUTED = "#52525B";

type Stop = { min: number; bg: string; label: string };

/** Sequential — retention percent. Capped at orange-500; nothing darker clears AA with CELL_INK. */
const ABSOLUTE_RAMP: Stop[] = [
  { min: 75, bg: "#F97316", label: "75+" },
  { min: 52, bg: "#FB923C", label: "52–75" },
  { min: 36, bg: "#FDBA74", label: "36–52" },
  { min: 24, bg: "#FED7AA", label: "24–36" },
  { min: 14, bg: "#FFEDD5", label: "14–24" },
  { min: 6, bg: "#FFF7ED", label: "6–14" },
  { min: Number.NEGATIVE_INFINITY, bg: "#FFFBF6", label: "0–6" },
];

/** Diverging — points versus the pinned cohort. Warm = better, cool = worse, white = parity. */
const DELTA_RAMP: Stop[] = [
  { min: 12, bg: "#FB923C", label: "+12 이상" },
  { min: 6, bg: "#FDBA74", label: "+6–12" },
  { min: 2, bg: "#FED7AA", label: "+2–6" },
  { min: 0.5, bg: "#FFEDD5", label: "+0.5–2" },
  { min: -0.5, bg: "#FFFFFF", label: "±0.5" },
  { min: -2, bg: "#F1F5F9", label: "−0.5–2" },
  { min: -6, bg: "#E2E8F0", label: "−2–6" },
  { min: -12, bg: "#CBD5E1", label: "−6–12" },
  { min: Number.NEGATIVE_INFINITY, bg: "#94A3B8", label: "−12 이하" },
];

function pick(ramp: Stop[], value: number): Stop {
  for (const stop of ramp) {
    if (value >= stop.min) return stop;
  }
  return ramp[ramp.length - 1];
}

export function signedRate(value: number): string {
  if (Math.abs(value) < 0.05) return "±0.0";
  return `${value > 0 ? "+" : "−"}${formatRate(Math.abs(value))}`;
}

export type CellPaint = {
  state: "value" | "baseline" | "unbased";
  bg: string;
  ink: string;
  /** Always printed inside the cell — the grid is readable before any hover. */
  label: string;
  /** Screen-reader continuation appended after the printed label. */
  detail: string;
  /** Plain-text readout for the crosshair line. */
  readout: string;
};

export type RowMarginal = {
  heading: string;
  value: string;
  caption: string;
  /** 0..1 for the sequential bar, -1..1 for the diverging bar. */
  ratio: number;
  detail: string;
};

export type ColumnMarginal = {
  label: string;
  detail: string;
  value: number | null;
};

export type GridEncoding = {
  kind: "absolute" | "delta";
  baselineId: string | null;
  baselineShort: string | null;
  metric: MetricId;
  metricLabel: string;
  /** One-line statement of what the grid currently means. Rendered above the grid, always. */
  statement: string;
  unit: string;
  legendTitle: string;
  legend: { swatch: string; label: string }[];
  legendNote: string;
  cell: (row: MatrixRow, offset: number) => CellPaint | null;
  rowMarginal: (row: MatrixRow) => RowMarginal;
  rowMarginalHeading: string;
  column: (offset: number) => ColumnMarginal;
  curve: {
    points: (number | null)[];
    domain: [number, number];
    zero: number | null;
    caption: string;
  };
};

export function buildEncoding(input: {
  rows: MatrixRow[];
  pooled: PooledCell[];
  baselineId: string | null;
  metric: MetricId;
}): GridEncoding {
  const { rows, pooled, baselineId, metric } = input;
  const metricDef = METRICS.find((m) => m.id === metric) ?? METRICS[0];
  const volume = VOLUME_FORMAT[metric];
  const baseline = baselineId ? rows.find((row) => row.id === baselineId) ?? null : null;

  if (!baseline) {
    return {
      kind: "absolute",
      baselineId: null,
      baselineShort: null,
      metric,
      metricLabel: metricDef.label,
      statement: `절대 잔존율 — 각 코호트가 가입 시점 대비 ${metricDef.noun}을 몇 퍼센트 유지하는가`,
      unit: "%",
      legendTitle: "잔존율",
      legend: [...ABSOLUTE_RAMP].reverse().map((stop) => ({ swatch: stop.bg, label: stop.label })),
      legendNote: "단위 %",
      cell(row, offset) {
        if (offset >= row.observed) return null;
        const value = row.values[offset];
        const stop = pick(ABSOLUTE_RAMP, value);
        return {
          state: "value",
          bg: stop.bg,
          ink: CELL_INK,
          label: formatRate(value),
          detail: `퍼센트. ${row.long} 코호트, 가입 후 ${offset}개월, ${metricDef.label} ${volume(
            row.numerator[offset],
          )} / ${volume(row.denominator)}`,
          readout: `${row.short} 코호트 · M${offset} · ${metricDef.label} ${formatRate(value)}% · ${volume(
            row.numerator[offset],
          )} / ${volume(row.denominator)}`,
        };
      },
      rowMarginalHeading: "최종 잔존",
      rowMarginal(row) {
        const last = row.observed - 1;
        const value = row.values[last];
        return {
          heading: "최종 잔존",
          value: `${formatRate(value)}%`,
          caption: `M${last}`,
          ratio: Math.max(0, Math.min(1, value / 100)),
          detail: `${row.long} 코호트 최종 관측 M${last}, ${metricDef.label} ${formatRate(
            value,
          )} 퍼센트, 규모 ${formatCount(row.accounts)}개 계정`,
        };
      },
      column(offset) {
        const cell = pooled[offset];
        return {
          label: formatRate(cell.value),
          detail: `가입 후 ${offset}개월 가중 평균 ${formatRate(cell.value)} 퍼센트, 표본 ${cell.cohorts}개 코호트`,
          value: cell.value,
        };
      },
      curve: {
        points: pooled.map((cell) => cell.value),
        domain: [0, 100],
        zero: null,
        caption: "0–100% 스케일",
      },
    };
  }

  const baseValues = baseline.values;
  const deltaAt = (row: MatrixRow, offset: number): number | null => {
    if (offset >= row.observed || offset >= baseline.observed) return null;
    return row.values[offset] - baseValues[offset];
  };

  let spread = 8;
  rows.forEach((row) => {
    for (let m = 0; m < HORIZON; m += 1) {
      const delta = deltaAt(row, m);
      if (delta !== null) spread = Math.max(spread, Math.abs(delta));
    }
  });
  const curveSpread = Math.max(6, Math.ceil(spread / 5) * 5);

  return {
    kind: "delta",
    baselineId: baseline.id,
    baselineShort: baseline.short,
    metric,
    metricLabel: metricDef.label,
    statement: `${baseline.short} 코호트 기준 델타 — 같은 경과 개월에서 ${metricDef.noun} 잔존이 기준보다 몇 포인트 높고 낮은가`,
    unit: "pt",
    legendTitle: `${baseline.short} 대비`,
    legend: [...DELTA_RAMP].reverse().map((stop) => ({ swatch: stop.bg, label: stop.label })),
    legendNote: "단위 pt",
    cell(row, offset) {
      if (offset >= row.observed) return null;
      const value = row.values[offset];
      if (offset >= baseline.observed) {
        return {
          state: "unbased",
          bg: "#FFFFFF",
          ink: CELL_INK_MUTED,
          label: "—",
          detail: `기준 없음. ${row.long} 코호트 M${offset} 절대 잔존 ${formatRate(
            value,
          )} 퍼센트, 기준 코호트는 이 시점 데이터가 없습니다`,
          readout: `${row.short} 코호트 · M${offset} · 기준 미관측 · 절대 잔존 ${formatRate(value)}%`,
        };
      }
      const delta = value - baseValues[offset];
      if (row.id === baseline.id) {
        return {
          state: "baseline",
          bg: "#FFFFFF",
          ink: CELL_INK,
          label: "기준",
          detail: `기준 코호트 자신. M${offset} 절대 잔존 ${formatRate(value)} 퍼센트`,
          readout: `${row.short} 코호트 · M${offset} · 기준선 · 절대 잔존 ${formatRate(value)}%`,
        };
      }
      const stop = pick(DELTA_RAMP, delta);
      return {
        state: "value",
        bg: stop.bg,
        ink: CELL_INK,
        label: signedRate(delta),
        detail: `포인트. ${row.long} 코호트 M${offset}, 기준 ${baseline.short} 대비. 절대 잔존 ${formatRate(
          value,
        )} 퍼센트, 기준 ${formatRate(baseValues[offset])} 퍼센트`,
        readout: `${row.short} 코호트 · M${offset} · ${signedRate(delta)}pt vs ${baseline.short} · 절대 ${formatRate(
          value,
        )}% (기준 ${formatRate(baseValues[offset])}%)`,
      };
    },
    rowMarginalHeading: "평균 델타",
    rowMarginal(row) {
      const shared = Math.min(row.observed, baseline.observed);
      let sum = 0;
      let count = 0;
      for (let m = 1; m < shared; m += 1) {
        const delta = deltaAt(row, m);
        if (delta !== null) {
          sum += delta;
          count += 1;
        }
      }
      if (row.id === baseline.id) {
        return {
          heading: "평균 델타",
          value: "기준",
          caption: `M0–M${baseline.observed - 1}`,
          ratio: 0,
          detail: `${row.long} 코호트가 현재 기준선입니다`,
        };
      }
      if (count === 0) {
        return {
          heading: "평균 델타",
          value: "—",
          caption: "비교 구간 없음",
          ratio: 0,
          detail: `${row.long} 코호트는 기준과 겹치는 경과 개월이 없습니다`,
        };
      }
      const mean = sum / count;
      return {
        heading: "평균 델타",
        value: `${signedRate(mean)}pt`,
        caption: `M1–M${shared - 1}`,
        ratio: Math.max(-1, Math.min(1, mean / 20)),
        detail: `${row.long} 코호트, 기준 ${baseline.short} 대비 M1부터 M${shared - 1}까지 평균 ${signedRate(
          mean,
        )} 포인트`,
      };
    },
    column(offset) {
      const cell = pooled[offset];
      if (offset >= baseline.observed) {
        return {
          label: "—",
          detail: `가입 후 ${offset}개월은 기준 코호트가 관측하지 못한 구간입니다`,
          value: null,
        };
      }
      const delta = cell.value - baseValues[offset];
      return {
        label: signedRate(delta),
        detail: `가입 후 ${offset}개월 가중 평균이 기준 ${baseline.short} 대비 ${signedRate(delta)} 포인트`,
        value: delta,
      };
    },
    curve: {
      points: pooled.map((cell, offset) =>
        offset >= baseline.observed ? null : cell.value - baseValues[offset],
      ),
      domain: [-curveSpread, curveSpread],
      zero: 0,
      caption: `±${curveSpread}pt 스케일`,
    },
  };
}
