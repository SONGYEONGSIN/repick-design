// Portcall — vendor API performance scorecard.
// Pure, deterministic dummy data: every number below is a literal or a fixed arithmetic
// transform of a literal. No Math.random, no Date.now, no bare `new Date()` anywhere in this
// module, so the numbers are identical on every render and every hydration pass.

export const PERIODS = ["24h", "7d", "30d"] as const;
export type Period = (typeof PERIODS)[number];

export const CATEGORIES = ["Payments", "Identity", "Logistics", "Messaging", "Maps", "Fraud"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Status = "on-track" | "watch" | "breach";

type BaseStat = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number;
  requests: number;
  errorRate: number;
};

export type PeriodStat = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number;
  requests: number;
  errorRate: number;
  status: Status;
};

export type Vendor = {
  id: string;
  name: string;
  code: string;
  category: Category;
  base: BaseStat;
  /** 7-point relative trend, oldest to current (current = base.median), for the table's sparkline cell. */
  sparkline: number[];
};

// Each vendor's 24h five-number summary (ms), outlier count, request volume and error rate. These
// are the only hand-authored numbers; 7d/30d are a fixed deterministic widen of them (see
// `PERIOD_FACTORS` below), never re-typed by hand, so the three periods can never silently drift
// out of sync with one another.
const VENDOR_SEED: Array<{ id: string; name: string; code: string; category: Category; base: BaseStat }> = [
  { id: "ledgerwire", name: "Ledgerwire", code: "LWR", category: "Payments", base: { min: 40, q1: 55, median: 68, q3: 82, max: 210, outliers: 2, requests: 42000, errorRate: 0.3 } },
  { id: "fasthand-pay", name: "Fasthand Pay", code: "FHP", category: "Payments", base: { min: 48, q1: 62, median: 75, q3: 95, max: 260, outliers: 3, requests: 38500, errorRate: 0.4 } },
  { id: "clearspan", name: "Clearspan", code: "CLS", category: "Payments", base: { min: 90, q1: 140, median: 175, q3: 230, max: 520, outliers: 5, requests: 24300, errorRate: 1.1 } },
  { id: "veriscope", name: "Veriscope", code: "VSC", category: "Identity", base: { min: 180, q1: 260, median: 320, q3: 410, max: 980, outliers: 4, requests: 9800, errorRate: 0.8 } },
  { id: "haloform-id", name: "Haloform ID", code: "HFI", category: "Identity", base: { min: 260, q1: 410, median: 520, q3: 680, max: 1450, outliers: 7, requests: 7600, errorRate: 2.4 } },
  { id: "portline-freight", name: "Portline Freight", code: "PLF", category: "Logistics", base: { min: 220, q1: 340, median: 430, q3: 560, max: 1280, outliers: 6, requests: 15400, errorRate: 1.6 } },
  { id: "switchyard-routing", name: "Switchyard Routing", code: "SYR", category: "Logistics", base: { min: 310, q1: 460, median: 590, q3: 760, max: 1640, outliers: 9, requests: 11200, errorRate: 3.2 } },
  { id: "dockhand-carrier", name: "Dockhand Carrier", code: "DHC", category: "Logistics", base: { min: 150, q1: 210, median: 260, q3: 330, max: 740, outliers: 3, requests: 19800, errorRate: 0.6 } },
  { id: "pingmast", name: "Pingmast", code: "PNG", category: "Messaging", base: { min: 20, q1: 30, median: 38, q3: 48, max: 140, outliers: 2, requests: 128000, errorRate: 0.2 } },
  { id: "dispatchly", name: "Dispatchly", code: "DSP", category: "Messaging", base: { min: 28, q1: 42, median: 54, q3: 70, max: 190, outliers: 4, requests: 96500, errorRate: 0.5 } },
  { id: "gridline-geo", name: "Gridline Geo", code: "GRL", category: "Maps", base: { min: 55, q1: 80, median: 98, q3: 125, max: 320, outliers: 2, requests: 34200, errorRate: 0.3 } },
  { id: "waypost-maps", name: "Waypost Maps", code: "WPM", category: "Maps", base: { min: 70, q1: 105, median: 130, q3: 170, max: 440, outliers: 5, requests: 28100, errorRate: 1.3 } },
  { id: "sentinel-score", name: "Sentinel Score", code: "SNT", category: "Fraud", base: { min: 110, q1: 165, median: 205, q3: 260, max: 620, outliers: 3, requests: 21700, errorRate: 0.5 } },
  { id: "trustwell-risk", name: "Trustwell Risk", code: "TWR", category: "Fraud", base: { min: 160, q1: 240, median: 300, q3: 390, max: 920, outliers: 6, requests: 14900, errorRate: 1.9 } },
];

// Fixed deterministic multiplier per period: wider windows see a wider tail (more of the rare slow
// calls get captured), a mildly higher median (more peak-traffic minutes included) and a mildly
// higher error rate (slow drift), while request volume scales by the window length itself.
const PERIOD_FACTORS: Record<Period, { min: number; q1: number; q3: number; max: number; outliers: number; requests: number; medianMul: number; errMul: number }> = {
  "24h": { min: 1, q1: 1, q3: 1, max: 1, outliers: 1, requests: 1, medianMul: 1, errMul: 1 },
  "7d": { min: 0.85, q1: 0.95, q3: 1.08, max: 1.25, outliers: 5, requests: 7, medianMul: 1.04, errMul: 1.05 },
  "30d": { min: 0.75, q1: 0.9, q3: 1.15, max: 1.45, outliers: 18, requests: 30, medianMul: 1.09, errMul: 1.15 },
};

// A vendor's SLA posture depends on how fast that category of call is supposed to be — a 300ms
// identity check is fine, a 300ms payment auth is not. Two independent trip wires: the median
// latency crossing a category threshold, or the error rate crossing one, either is enough to move
// the badge — matching how an on-call engineer would actually read "is this vendor healthy".
const SLA_TARGETS: Record<Category, { targetMs: number; breachMs: number; watchErr: number; breachErr: number }> = {
  Payments: { targetMs: 150, breachMs: 400, watchErr: 1.0, breachErr: 2.0 },
  Identity: { targetMs: 500, breachMs: 800, watchErr: 1.5, breachErr: 2.0 },
  Logistics: { targetMs: 400, breachMs: 700, watchErr: 1.5, breachErr: 2.5 },
  Messaging: { targetMs: 60, breachMs: 150, watchErr: 0.8, breachErr: 1.5 },
  Maps: { targetMs: 120, breachMs: 300, watchErr: 1.0, breachErr: 2.0 },
  Fraud: { targetMs: 220, breachMs: 450, watchErr: 1.0, breachErr: 2.0 },
};

export function classifyStatus(category: Category, medianMs: number, errorRatePct: number): Status {
  const t = SLA_TARGETS[category];
  if (medianMs > t.breachMs || errorRatePct > t.breachErr) return "breach";
  if (medianMs > t.targetMs || errorRatePct > t.watchErr) return "watch";
  return "on-track";
}

export function getVendorStat(vendor: Vendor, period: Period): PeriodStat {
  const f = PERIOD_FACTORS[period];
  const b = vendor.base;
  const min = Math.round(b.min * f.min);
  const q1 = Math.round(b.q1 * f.q1);
  const median = Math.round(b.median * f.medianMul);
  const q3 = Math.round(b.q3 * f.q3);
  const max = Math.round(b.max * f.max);
  const outliers = Math.round(b.outliers * f.outliers);
  const requests = Math.round(b.requests * f.requests);
  const errorRate = Math.round(b.errorRate * f.errMul * 10) / 10;
  return { min, q1, median, q3, max, outliers, requests, errorRate, status: classifyStatus(vendor.category, median, errorRate) };
}

// Five hand-authored relative-trend shapes, round-robined across vendors by index so the sparkline
// column shows varied silhouettes without any per-vendor randomness. Every shape ends at 1.00 so
// the rightmost point always lands exactly on that vendor's own 24h median — the sparkline reads as
// "how we got to today's number", not an unrelated series.
const TREND_SHAPES: number[][] = [
  [1.08, 1.04, 0.97, 1.0, 0.93, 0.96, 1.0],
  [0.92, 0.97, 1.03, 1.01, 1.06, 1.02, 1.0],
  [1.0, 1.05, 1.1, 1.04, 0.98, 0.94, 1.0],
  [1.05, 0.98, 0.94, 0.99, 1.03, 0.97, 1.0],
  [0.95, 0.99, 1.04, 1.08, 1.02, 0.97, 1.0],
];

export const VENDORS: Vendor[] = VENDOR_SEED.map((seed, i) => ({
  ...seed,
  sparkline: TREND_SHAPES[i % TREND_SHAPES.length].map((mul) => Math.round(seed.base.median * mul)),
}));

export function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

const nfInt = new Intl.NumberFormat("en-US");
const nfPct = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatNum = (v: number): string => nfInt.format(v);
export const formatMs = (v: number): string => `${nfInt.format(v)} ms`;
export const formatPct = (v: number): string => `${nfPct.format(v)}%`;

export const STATUS_LABEL: Record<Status, string> = {
  "on-track": "On track",
  watch: "Watch",
  breach: "Breach",
};
