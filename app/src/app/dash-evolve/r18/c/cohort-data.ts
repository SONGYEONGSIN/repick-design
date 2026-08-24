/**
 * Trellis — cohort retention console, deterministic dataset.
 *
 * Everything below is generated from a pure integer hash — no runtime randomness and no clock reads
 * of any kind. The generator is seeded only by loop indices, so server and client render
 * byte-identical markup.
 *
 * Arithmetic consistency is structural, not decorative:
 *   segment sizes           -> summed to produce the cohort size (the total IS the sum)
 *   accounts[m]             -> monotonically non-increasing, clamped against accounts[m-1]
 *   seats[m]                -> accounts[m] x seats-per-account x seat expansion
 *   revenue[m]              -> seats[m] x price-per-seat   (so revenue is derived, never invented)
 * Every displayed rate is recomputed from those integers, which is why a cell, its row marginal and
 * the column marginal can never disagree.
 */

export type SegmentId = "starter" | "growth" | "scale" | "enterprise";
export type MetricId = "accounts" | "seats" | "revenue";
export type SegmentFilter = SegmentId | "all";

export type SegmentDef = {
  id: SegmentId;
  label: string;
  blurb: string;
  share: number;
  asymptote: number;
  decay: number;
  seatsPerAccount: number;
  seatGrowth: number;
  pricePerSeatKrw: number;
};

export const SEGMENTS: SegmentDef[] = [
  {
    id: "starter",
    label: "Starter",
    blurb: "셀프서브 · 기본 2석",
    share: 0.5,
    asymptote: 0.15,
    decay: 0.58,
    seatsPerAccount: 2,
    seatGrowth: 0.001,
    pricePerSeatKrw: 12000,
  },
  {
    id: "growth",
    label: "Growth",
    blurb: "팀 단위 · 기본 6석",
    share: 0.29,
    asymptote: 0.3,
    decay: 0.7,
    seatsPerAccount: 6,
    seatGrowth: 0.006,
    pricePerSeatKrw: 21000,
  },
  {
    id: "scale",
    label: "Scale",
    blurb: "부서 단위 · 기본 18석",
    share: 0.14,
    asymptote: 0.46,
    decay: 0.79,
    seatsPerAccount: 18,
    seatGrowth: 0.014,
    pricePerSeatKrw: 29000,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    blurb: "전사 계약 · 기본 62석",
    share: 0.07,
    asymptote: 0.64,
    decay: 0.86,
    seatsPerAccount: 62,
    seatGrowth: 0.022,
    pricePerSeatKrw: 38000,
  },
];

export type MetricDef = {
  id: MetricId;
  label: string;
  chip: string;
  noun: string;
  question: string;
};

export const METRICS: MetricDef[] = [
  { id: "accounts", label: "계정 잔존", chip: "계정", noun: "계정", question: "몇 개의 계정이 남아 있는가" },
  { id: "seats", label: "좌석 잔존", chip: "좌석", noun: "좌석", question: "몇 개의 좌석이 남아 있는가" },
  { id: "revenue", label: "매출 잔존", chip: "매출", noun: "월 매출", question: "월 매출이 얼마나 남아 있는가" },
];

export const HORIZON = 12;
const COHORT_COUNT = 12;
const FIRST_YEAR = 2024;
const FIRST_MONTH_INDEX = 9; // 0-based -> 2024년 10월

/** Integer-only PRNG (mulberry32 core). Deterministic for a given seed, no floating drift. */
function unit(seed: number): number {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
  t = (t ^ (t + Math.imul(t ^ (t >>> 7), t | 61))) >>> 0;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export type SegmentSeries = {
  size: number;
  accounts: number[];
  seats: number[];
  revenue: number[];
};

export type CohortRecord = {
  id: string;
  short: string;
  long: string;
  index: number;
  observed: number;
  size: number;
  segments: Record<SegmentId, SegmentSeries>;
};

function buildCohorts(): CohortRecord[] {
  const cohorts: CohortRecord[] = [];

  for (let i = 0; i < COHORT_COUNT; i += 1) {
    const absolute = FIRST_MONTH_INDEX + i;
    const year = FIRST_YEAR + Math.floor(absolute / 12);
    const month = (absolute % 12) + 1;
    const observed = HORIZON - i;

    const target = 840 + i * 78 + Math.round(unit(i * 13 + 5) * 140) - 70;

    const weights = SEGMENTS.map((seg, si) => seg.share * (0.9 + 0.2 * unit(i * 71 + si * 17 + 3)));
    const weightSum = weights.reduce((sum, w) => sum + w, 0);

    const sizes: number[] = [];
    let assigned = 0;
    for (let si = 0; si < SEGMENTS.length - 1; si += 1) {
      const value = Math.max(14, Math.round((target * weights[si]) / weightSum));
      sizes.push(value);
      assigned += value;
    }
    sizes.push(Math.max(11, target - assigned));

    const quality = 0.92 + 0.16 * unit(i * 97 + 7);

    const segments = {} as Record<SegmentId, SegmentSeries>;
    SEGMENTS.forEach((seg, si) => {
      const size = sizes[si];
      const accounts: number[] = [];
      const seats: number[] = [];
      const revenue: number[] = [];

      for (let m = 0; m < observed; m += 1) {
        let held: number;
        if (m === 0) {
          held = size;
        } else {
          const curve = seg.asymptote + (1 - seg.asymptote) * Math.pow(seg.decay, m);
          const noise = 0.97 + 0.06 * unit(i * 311 + m * 17 + si * 53);
          const rate = Math.min(0.99, Math.max(0.015, curve * quality * noise));
          held = Math.min(accounts[m - 1], Math.round(size * rate));
        }
        accounts.push(held);

        const heldSeats = Math.round(held * seg.seatsPerAccount * (1 + seg.seatGrowth * m));
        seats.push(heldSeats);
        revenue.push(heldSeats * seg.pricePerSeatKrw);
      }

      segments[seg.id] = { size, accounts, seats, revenue };
    });

    cohorts.push({
      id: `${year}-${String(month).padStart(2, "0")}`,
      short: `${year}-${String(month).padStart(2, "0")}`,
      long: `${year}년 ${month}월`,
      index: i,
      observed,
      // The cohort size is literally the sum of its segments — parts always equal the whole.
      size: sizes.reduce((sum, value) => sum + value, 0),
      segments,
    });
  }

  return cohorts;
}

export const COHORTS: CohortRecord[] = buildCohorts();

/* ------------------------------------------------------------------ formatting */

const numberFormat = new Intl.NumberFormat("ko-KR");
const oneDecimal = new Intl.NumberFormat("ko-KR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCount(value: number): string {
  return numberFormat.format(value);
}

export function formatRate(value: number): string {
  return oneDecimal.format(value);
}

export function formatKrwManwon(value: number): string {
  return `${numberFormat.format(Math.round(value / 10000))}만원`;
}

export const VOLUME_FORMAT: Record<MetricId, (value: number) => string> = {
  accounts: (value) => `${numberFormat.format(value)}개`,
  seats: (value) => `${numberFormat.format(value)}석`,
  revenue: (value) => formatKrwManwon(value),
};

/* ------------------------------------------------------------------ derivations */

export type MatrixRow = {
  id: string;
  short: string;
  long: string;
  index: number;
  observed: number;
  /** Accounts acquired in this cohort under the active segment filter — the row's "규모". */
  accounts: number;
  denominator: number;
  numerator: number[];
  values: number[];
};

function seriesFor(record: CohortRecord, metric: MetricId, segment: SegmentFilter): number[] {
  const ids: SegmentId[] = segment === "all" ? SEGMENTS.map((s) => s.id) : [segment];
  const out = new Array<number>(record.observed).fill(0);
  ids.forEach((id) => {
    const series = record.segments[id];
    const source = metric === "accounts" ? series.accounts : metric === "seats" ? series.seats : series.revenue;
    for (let m = 0; m < record.observed; m += 1) out[m] += source[m];
  });
  return out;
}

export function buildMatrix(metric: MetricId, segment: SegmentFilter): MatrixRow[] {
  return COHORTS.map((record) => {
    const numerator = seriesFor(record, metric, segment);
    const denominator = numerator[0];
    const accounts =
      segment === "all"
        ? record.size
        : record.segments[segment].size;

    return {
      id: record.id,
      short: record.short,
      long: record.long,
      index: record.index,
      observed: record.observed,
      accounts,
      denominator,
      numerator,
      values: numerator.map((value) => (denominator === 0 ? 0 : (value / denominator) * 100)),
    };
  });
}

export type PooledCell = {
  offset: number;
  value: number;
  cohorts: number;
  numerator: number;
  denominator: number;
};

export function buildPooled(rows: MatrixRow[]): PooledCell[] {
  const out: PooledCell[] = [];
  for (let m = 0; m < HORIZON; m += 1) {
    let numerator = 0;
    let denominator = 0;
    let cohorts = 0;
    rows.forEach((row) => {
      if (m >= row.observed) return;
      numerator += row.numerator[m];
      denominator += row.denominator;
      cohorts += 1;
    });
    out.push({
      offset: m,
      value: denominator === 0 ? 0 : (numerator / denominator) * 100,
      cohorts,
      numerator,
      denominator,
    });
  }
  return out;
}

export type SegmentSummaryRow = {
  id: SegmentId;
  label: string;
  blurb: string;
  accounts: number;
  seats: number;
  m3: number;
  m6: number;
  revenueShare: number;
  spark: number[];
};

export function buildSegmentSummary(): SegmentSummaryRow[] {
  const revenueBaseTotal = SEGMENTS.reduce((total, seg) => {
    return (
      total +
      COHORTS.reduce((sum, record) => sum + record.segments[seg.id].revenue[0], 0)
    );
  }, 0);

  return SEGMENTS.map((seg) => {
    const accounts = COHORTS.reduce((sum, record) => sum + record.segments[seg.id].size, 0);
    const seats = COHORTS.reduce((sum, record) => sum + record.segments[seg.id].seats[0], 0);
    const revenueBase = COHORTS.reduce((sum, record) => sum + record.segments[seg.id].revenue[0], 0);

    const spark: number[] = [];
    for (let m = 0; m < HORIZON; m += 1) {
      let numerator = 0;
      let denominator = 0;
      COHORTS.forEach((record) => {
        if (m >= record.observed) return;
        numerator += record.segments[seg.id].accounts[m];
        denominator += record.segments[seg.id].size;
      });
      spark.push(denominator === 0 ? 0 : (numerator / denominator) * 100);
    }

    return {
      id: seg.id,
      label: seg.label,
      blurb: seg.blurb,
      accounts,
      seats,
      m3: spark[3],
      m6: spark[6],
      revenueShare: revenueBaseTotal === 0 ? 0 : (revenueBase / revenueBaseTotal) * 100,
      spark,
    };
  });
}

export const OBSERVATION_WINDOW = "2024년 10월 – 2025년 9월";
export const REFRESHED_AT = "2025-10-02 09:14 KST";
