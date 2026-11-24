// Tracewave — deterministic fixture data for the observability console.
//
// Hard rule compliance notes:
// - No Math.random / Date.now / new Date anywhere in this module. The hourly curves below come
//   from a fixed trigonometric shape function (`shape`) applied to a fixed index 0..23 — the same
//   input always produces the same output, on the server and in the browser, so there is no
//   hydration mismatch risk.
// - Every summary number the UI shows (rail "current" values, the 24h total stat tiles, the chart's
//   hero stats, the trace feed's average) is computed in the components FROM these arrays via
//   reduce/slice — never typed as a separate "plausible" constant.

export type Status = "healthy" | "degraded" | "down";

export type Bucket = {
  p50: number;
  p95: number;
  p99: number;
  requests: number;
  errors: number;
};

export type Trace = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  statusCode: number;
  durationMs: number;
  time: string;
};

export type Service = {
  id: string;
  name: string;
  status: Status;
  description: string;
  hourly: Bucket[];
  traces: Trace[];
};

// A fixed single-hump curve over 24 fixed sample indices (0 = 23h ago, 23 = now). Deterministic:
// same index always maps to the same output. Used only to vary demo traffic/latency smoothly
// across the day — not to represent real elapsed time.
function shape(h: number): number {
  const hump = Math.sin((Math.PI * h) / 23);
  const texture = Math.sin(h * 1.7) * 0.12;
  return Math.max(0, hump + texture);
}

function buildHourly(
  base: { p50: number; p95: number; p99: number; req: number; err: number },
  range: { p50: number; p95: number; p99: number; req: number; err: number },
  overrides?: Record<number, Partial<Bucket>>,
): Bucket[] {
  const out: Bucket[] = [];
  for (let h = 0; h < 24; h++) {
    const f = shape(h);
    const bucket: Bucket = {
      p50: Math.round(base.p50 + range.p50 * f),
      p95: Math.round(base.p95 + range.p95 * f),
      p99: Math.round(base.p99 + range.p99 * f),
      requests: Math.round(base.req + range.req * f),
      errors: Math.round(base.err + range.err * f),
    };
    out.push({ ...bucket, ...overrides?.[h] });
  }
  return out;
}

export const SERVICES: Service[] = [
  {
    id: "checkout-api",
    name: "checkout-api",
    status: "healthy",
    description: "Cart totals, tax and order placement",
    hourly: buildHourly(
      { p50: 78, p95: 176, p99: 310, req: 640, err: 2 },
      { p50: 34, p95: 70, p99: 110, req: 720, err: 6 },
    ),
    traces: [
      { id: "tw-8f21ac", method: "POST", endpoint: "/v1/checkout/complete", statusCode: 201, durationMs: 412, time: "1m ago" },
      { id: "tw-19d3e7", method: "GET", endpoint: "/v1/checkout/quote", statusCode: 200, durationMs: 96, time: "2m ago" },
      { id: "tw-55a0bb", method: "POST", endpoint: "/v1/checkout/apply-promo", statusCode: 200, durationMs: 221, time: "4m ago" },
      { id: "tw-7c4411", method: "GET", endpoint: "/v1/checkout/quote", statusCode: 200, durationMs: 88, time: "6m ago" },
      { id: "tw-e62290", method: "POST", endpoint: "/v1/checkout/complete", statusCode: 500, durationMs: 1840, time: "9m ago" },
      { id: "tw-0b7f5d", method: "PUT", endpoint: "/v1/checkout/address", statusCode: 200, durationMs: 134, time: "12m ago" },
      { id: "tw-a93c21", method: "GET", endpoint: "/v1/checkout/quote", statusCode: 200, durationMs: 101, time: "15m ago" },
      { id: "tw-d1056e", method: "POST", endpoint: "/v1/checkout/complete", statusCode: 201, durationMs: 388, time: "19m ago" },
    ],
  },
  {
    id: "payments-gateway",
    name: "payments-gateway",
    status: "degraded",
    description: "Card authorization and settlement",
    hourly: buildHourly(
      { p50: 150, p95: 360, p99: 640, req: 380, err: 4 },
      { p50: 90, p95: 180, p99: 260, req: 420, err: 10 },
      {
        14: { p95: 980, p99: 1620, errors: 48 },
        15: { p95: 1140, p99: 1890, errors: 61 },
        16: { p95: 1020, p99: 1710, errors: 55 },
        17: { p95: 860, p99: 1480, errors: 39 },
      },
    ),
    traces: [
      { id: "tw-ff10a2", method: "POST", endpoint: "/v1/payments/authorize", statusCode: 504, durationMs: 3012, time: "1m ago" },
      { id: "tw-2e9c40", method: "POST", endpoint: "/v1/payments/authorize", statusCode: 200, durationMs: 612, time: "2m ago" },
      { id: "tw-ab7731", method: "POST", endpoint: "/v1/payments/capture", statusCode: 502, durationMs: 2740, time: "3m ago" },
      { id: "tw-c40d19", method: "GET", endpoint: "/v1/payments/status", statusCode: 200, durationMs: 210, time: "5m ago" },
      { id: "tw-9915dd", method: "POST", endpoint: "/v1/payments/authorize", statusCode: 200, durationMs: 588, time: "7m ago" },
      { id: "tw-331fae", method: "POST", endpoint: "/v1/payments/refund", statusCode: 200, durationMs: 455, time: "10m ago" },
      { id: "tw-6c0b2a", method: "POST", endpoint: "/v1/payments/capture", statusCode: 500, durationMs: 2998, time: "13m ago" },
      { id: "tw-4471e8", method: "GET", endpoint: "/v1/payments/status", statusCode: 200, durationMs: 188, time: "16m ago" },
    ],
  },
  {
    id: "auth-service",
    name: "auth-service",
    status: "healthy",
    description: "Session tokens and credential checks",
    hourly: buildHourly(
      { p50: 28, p95: 64, p99: 128, req: 1900, err: 1 },
      { p50: 18, p95: 38, p99: 58, req: 1300, err: 5 },
    ),
    traces: [
      { id: "tw-10aa2f", method: "POST", endpoint: "/v1/auth/token", statusCode: 200, durationMs: 54, time: "1m ago" },
      { id: "tw-7731bc", method: "POST", endpoint: "/v1/auth/refresh", statusCode: 200, durationMs: 41, time: "2m ago" },
      { id: "tw-de0091", method: "GET", endpoint: "/v1/auth/session", statusCode: 200, durationMs: 33, time: "3m ago" },
      { id: "tw-6690fd", method: "POST", endpoint: "/v1/auth/token", statusCode: 401, durationMs: 29, time: "5m ago" },
      { id: "tw-1142aa", method: "GET", endpoint: "/v1/auth/session", statusCode: 200, durationMs: 36, time: "8m ago" },
      { id: "tw-99c0e7", method: "POST", endpoint: "/v1/auth/refresh", statusCode: 200, durationMs: 47, time: "11m ago" },
      { id: "tw-205bb1", method: "POST", endpoint: "/v1/auth/token", statusCode: 200, durationMs: 58, time: "14m ago" },
      { id: "tw-884cfe", method: "GET", endpoint: "/v1/auth/session", statusCode: 200, durationMs: 31, time: "18m ago" },
    ],
  },
  {
    id: "inventory-sync",
    name: "inventory-sync",
    status: "down",
    description: "Warehouse stock reconciliation",
    hourly: buildHourly(
      { p50: 180, p95: 520, p99: 980, req: 540, err: 6 },
      { p50: 60, p95: 140, p99: 220, req: 260, err: 10 },
      {
        13: { p95: 1680, p99: 2920, errors: 210, requests: 410 },
        14: { p95: 2040, p99: 3380, errors: 340, requests: 290 },
        15: { p95: 2210, p99: 3690, errors: 402, requests: 180 },
        16: { p95: 2260, p99: 3740, errors: 388, requests: 140 },
        17: { p95: 2180, p99: 3610, errors: 360, requests: 120 },
        18: { p95: 2090, p99: 3480, errors: 355, requests: 110 },
        19: { p95: 2150, p99: 3550, errors: 365, requests: 104 },
        20: { p95: 2120, p99: 3520, errors: 358, requests: 98 },
        21: { p95: 2170, p99: 3600, errors: 362, requests: 95 },
        22: { p95: 2140, p99: 3560, errors: 359, requests: 92 },
        23: { p95: 2190, p99: 3630, errors: 364, requests: 90 },
      },
    ),
    traces: [
      { id: "tw-aa0012", method: "POST", endpoint: "/v1/inventory/reconcile", statusCode: 503, durationMs: 4120, time: "1m ago" },
      { id: "tw-bb2241", method: "POST", endpoint: "/v1/inventory/reconcile", statusCode: 503, durationMs: 3980, time: "2m ago" },
      { id: "tw-cc9810", method: "GET", endpoint: "/v1/inventory/levels", statusCode: 500, durationMs: 2990, time: "3m ago" },
      { id: "tw-dd1177", method: "POST", endpoint: "/v1/inventory/adjust", statusCode: 503, durationMs: 4310, time: "4m ago" },
      { id: "tw-ee6602", method: "GET", endpoint: "/v1/inventory/levels", statusCode: 500, durationMs: 3110, time: "6m ago" },
      { id: "tw-ff3321", method: "POST", endpoint: "/v1/inventory/reconcile", statusCode: 503, durationMs: 4050, time: "9m ago" },
      { id: "tw-10d904", method: "GET", endpoint: "/v1/inventory/levels", statusCode: 200, durationMs: 640, time: "12m ago" },
      { id: "tw-20ef15", method: "POST", endpoint: "/v1/inventory/adjust", statusCode: 503, durationMs: 3870, time: "15m ago" },
    ],
  },
  {
    id: "search-indexer",
    name: "search-indexer",
    status: "degraded",
    description: "Product catalog indexing and query",
    hourly: buildHourly(
      { p50: 60, p95: 150, p99: 260, req: 820, err: 3 },
      { p50: 40, p95: 90, p99: 140, req: 540, err: 7 },
      {
        9: { p95: 520, p99: 860, errors: 28 },
        10: { p95: 610, p99: 980, errors: 35 },
        11: { p95: 560, p99: 910, errors: 31 },
      },
    ),
    traces: [
      { id: "tw-33bb90", method: "GET", endpoint: "/v1/search/query", statusCode: 200, durationMs: 140, time: "1m ago" },
      { id: "tw-44cc11", method: "GET", endpoint: "/v1/search/query", statusCode: 504, durationMs: 2410, time: "2m ago" },
      { id: "tw-55dd82", method: "POST", endpoint: "/v1/search/reindex", statusCode: 200, durationMs: 890, time: "4m ago" },
      { id: "tw-66ee43", method: "GET", endpoint: "/v1/search/suggest", statusCode: 200, durationMs: 112, time: "6m ago" },
      { id: "tw-77ff04", method: "GET", endpoint: "/v1/search/query", statusCode: 500, durationMs: 2680, time: "8m ago" },
      { id: "tw-880115", method: "GET", endpoint: "/v1/search/suggest", statusCode: 200, durationMs: 98, time: "11m ago" },
      { id: "tw-991c76", method: "POST", endpoint: "/v1/search/reindex", statusCode: 200, durationMs: 940, time: "14m ago" },
      { id: "tw-aa2d37", method: "GET", endpoint: "/v1/search/query", statusCode: 200, durationMs: 128, time: "17m ago" },
    ],
  },
  {
    id: "recommendation-engine",
    name: "recommendation-engine",
    status: "healthy",
    description: "Personalized product ranking",
    hourly: buildHourly(
      { p50: 58, p95: 134, p99: 218, req: 1480, err: 1 },
      { p50: 28, p95: 58, p99: 88, req: 760, err: 5 },
    ),
    traces: [
      { id: "tw-0a1b2c", method: "GET", endpoint: "/v1/recs/home", statusCode: 200, durationMs: 102, time: "1m ago" },
      { id: "tw-1b2c3d", method: "GET", endpoint: "/v1/recs/similar", statusCode: 200, durationMs: 88, time: "3m ago" },
      { id: "tw-2c3d4e", method: "GET", endpoint: "/v1/recs/home", statusCode: 200, durationMs: 115, time: "5m ago" },
      { id: "tw-3d4e5f", method: "POST", endpoint: "/v1/recs/feedback", statusCode: 200, durationMs: 54, time: "7m ago" },
      { id: "tw-4e5f60", method: "GET", endpoint: "/v1/recs/similar", statusCode: 200, durationMs: 93, time: "10m ago" },
      { id: "tw-5f6071", method: "GET", endpoint: "/v1/recs/home", statusCode: 200, durationMs: 108, time: "13m ago" },
      { id: "tw-607182", method: "GET", endpoint: "/v1/recs/similar", statusCode: 500, durationMs: 640, time: "16m ago" },
      { id: "tw-718293", method: "POST", endpoint: "/v1/recs/feedback", statusCode: 200, durationMs: 49, time: "20m ago" },
    ],
  },
];

export type TimeRange = "6h" | "24h" | "7d";

export type ChartBucket = Bucket & { label: string };

/** Splits `arr` into `n` nearly-equal contiguous chunks (pure, deterministic — only depends on
 * arr.length and n, never on wall-clock time or randomness). */
function chunkInto<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  const base = Math.floor(arr.length / n);
  let extra = arr.length % n;
  let i = 0;
  for (let c = 0; c < n; c++) {
    const size = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
    out.push(arr.slice(i, i + size));
    i += size;
  }
  return out;
}

function average(nums: number[]): number {
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

/** Every number in the returned buckets is derived directly from `service.hourly` — the exact same
 * per-record array the rail sparkline and the 24h stat tiles read — never authored separately. */
export function chartBuckets(service: Service, range: TimeRange): ChartBucket[] {
  if (range === "6h") {
    const labels = ["-5h", "-4h", "-3h", "-2h", "-1h", "now"];
    return service.hourly.slice(-6).map((b, i) => ({ ...b, label: labels[i] }));
  }
  if (range === "24h") {
    return service.hourly.map((b, i) => ({
      ...b,
      label: i === 23 ? "now" : i % 4 === 3 ? `-${23 - i}h` : "",
    }));
  }
  const labels = ["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "today"];
  return chunkInto(service.hourly, 7).map((group, i) => ({
    p50: average(group.map((b) => b.p50)),
    p95: average(group.map((b) => b.p95)),
    p99: average(group.map((b) => b.p99)),
    requests: group.reduce((a, b) => a + b.requests, 0),
    errors: group.reduce((a, b) => a + b.errors, 0),
    label: labels[i],
  }));
}

export function requests24h(service: Service): number {
  return service.hourly.reduce((a, b) => a + b.requests, 0);
}

export function errors24h(service: Service): number {
  return service.hourly.reduce((a, b) => a + b.errors, 0);
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  trailingZeroDisplay: "stripIfInteger",
  maximumFractionDigits: 1,
});

export function formatCompact(n: number): string {
  return compactFormatter.format(n);
}

export const integerFormatter = new Intl.NumberFormat("en-US");

export function formatInt(n: number): string {
  return integerFormatter.format(n);
}

export const STATUS_LABEL: Record<Status, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};
