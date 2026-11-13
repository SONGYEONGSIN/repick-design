// Deterministic API-latency reliability data. No Math.random / Date.now / new Date().

export type Period = "1h" | "24h" | "7d";

export type Endpoint = {
  id: string;
  method: "GET" | "POST" | "PATCH";
  path: string;
  rps: number;
  p50: number;
  p95: number;
  p99: number;
  errorRatePct: number;
};

export const ENDPOINTS: Endpoint[] = [
  { id: "ep-checkout", method: "POST", path: "/v2/checkout", rps: 412, p50: 88, p95: 240, p99: 410, errorRatePct: 0.4 },
  { id: "ep-search", method: "GET", path: "/v2/search", rps: 980, p50: 54, p95: 160, p99: 310, errorRatePct: 0.2 },
  { id: "ep-auth", method: "POST", path: "/oauth/refresh", rps: 310, p50: 42, p95: 120, p99: 260, errorRatePct: 0.1 },
  { id: "ep-cart", method: "PATCH", path: "/v2/cart", rps: 205, p50: 61, p95: 150, p99: 290, errorRatePct: 0.3 },
  { id: "ep-catalog", method: "GET", path: "/v2/catalog", rps: 640, p50: 47, p95: 110, p99: 210, errorRatePct: 0.1 },
  { id: "ep-webhooks", method: "POST", path: "/v2/webhooks/dispatch", rps: 88, p50: 130, p95: 420, p99: 980, errorRatePct: 1.8 },
];

// Histogram bins for the dominant visualization — latency in ms, aggregate across all endpoints.
// Each period is a fixed, hand-authored distribution (not computed from ENDPOINTS, which are
// per-endpoint summary stats, not raw samples).
export type Bin = { from: number; to: number; count: number };

export const HISTOGRAMS: Record<Period, Bin[]> = {
  "1h": [
    { from: 0, to: 50, count: 1240 },
    { from: 50, to: 100, count: 2180 },
    { from: 100, to: 150, count: 1360 },
    { from: 150, to: 200, count: 640 },
    { from: 200, to: 300, count: 310 },
    { from: 300, to: 500, count: 140 },
    { from: 500, to: 1000, count: 52 },
  ],
  "24h": [
    { from: 0, to: 50, count: 29800 },
    { from: 50, to: 100, count: 51200 },
    { from: 100, to: 150, count: 31900 },
    { from: 150, to: 200, count: 14100 },
    { from: 200, to: 300, count: 7200 },
    { from: 300, to: 500, count: 3100 },
    { from: 500, to: 1000, count: 1180 },
  ],
  "7d": [
    { from: 0, to: 50, count: 204000 },
    { from: 50, to: 100, count: 358000 },
    { from: 100, to: 150, count: 221000 },
    { from: 150, to: 200, count: 98000 },
    { from: 200, to: 300, count: 51000 },
    { from: 300, to: 500, count: 21400 },
    { from: 500, to: 1000, count: 8600 },
  ],
};

// Percentiles always shown as text alongside the histogram (dash-brief-v3's "단일 지배
// 시각화 완성도" rule: at-a-glance values, not hover-only).
export const PERCENTILES: Record<Period, { p50: number; p95: number; p99: number }> = {
  "1h": { p50: 86, p95: 238, p99: 405 },
  "24h": { p50: 84, p95: 231, p99: 398 },
  "7d": { p50: 85, p95: 235, p99: 402 },
};

export const ERROR_RATE_PCT: Record<Period, number> = { "1h": 0.38, "24h": 0.34, "7d": 0.31 };
export const ERROR_RATE_PCT_LAST: Record<Period, number> = { "1h": 0.52, "24h": 0.41, "7d": 0.36 };

export const TOTAL_REQUESTS: Record<Period, number> = {
  "1h": HISTOGRAMS["1h"].reduce((sum, b) => sum + b.count, 0),
  "24h": HISTOGRAMS["24h"].reduce((sum, b) => sum + b.count, 0),
  "7d": HISTOGRAMS["7d"].reduce((sum, b) => sum + b.count, 0),
};

export function fmtCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export const ENDPOINT_BY_ID: Map<string, Endpoint> = new Map(ENDPOINTS.map((e) => [e.id, e]));
