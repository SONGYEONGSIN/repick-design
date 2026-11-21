/**
 * Deterministic dummy data for Weir — an API gateway / rate-limit & quota console.
 *
 * No `Math.random`, `Date.now`, or `new Date()` anywhere. Every API key's hourly request matrix
 * is produced by `buildMatrix`, a pure function of two hand-authored literals (a 24-value "shape"
 * curve and a per-endpoint weight list) and a fixed scale constant — same inputs always produce the
 * same integer matrix, on the server and in the browser, so there is nothing to hydrate-mismatch on.
 *
 * Every derived number shown anywhere in the UI (requests today, quota used %, peak hour, the rail's
 * mini usage bars, the heatmap, and its table fallback) is computed from that one `matrix` per key —
 * never a separately hand-placed figure. See `matrixTotal`, `quotaUsedPct`, `peakHour`, `peakCell`
 * and `bucketTotal` below.
 */

export type Method = "GET" | "POST";
export type Environment = "production" | "staging";
export type QuotaStatus = "ok" | "warning" | "exceeded";

export interface Endpoint {
  id: string;
  method: Method;
  path: string;
}

export interface ApiKey {
  id: string;
  name: string;
  environment: Environment;
  owner: string;
  /** Cosmetic masked token preview — never a real secret. */
  secretPreview: string;
  quotaCeiling: number;
  /** Endpoint ids this key is scoped to call, in display order (heatmap/table row order). */
  scope: string[];
  /** One row per `scope` entry, 24 columns (hour 0–23), today's request counts. */
  matrix: number[][];
}

export const ENDPOINTS: Endpoint[] = [
  { id: "payments-create", method: "POST", path: "/v1/payments" },
  { id: "payments-get", method: "GET", path: "/v1/payments/{id}" },
  { id: "refunds-create", method: "POST", path: "/v1/refunds" },
  { id: "customers-list", method: "GET", path: "/v1/customers" },
  { id: "balance-get", method: "GET", path: "/v1/balance" },
  { id: "payouts-create", method: "POST", path: "/v1/payouts" },
  { id: "webhooks-test", method: "POST", path: "/v1/webhooks/test" },
  { id: "accounts-list", method: "GET", path: "/v1/accounts" },
];

export function endpointById(id: string): Endpoint | undefined {
  return ENDPOINTS.find((e) => e.id === id);
}

export function endpointLabel(id: string): string {
  const e = endpointById(id);
  return e ? `${e.method} ${e.path}` : id;
}

/** Relative request volume by hour of day (0 = 12am … 23 = 11pm) for a typical business-hours API. */
const HOURLY_SHAPE: number[] = [
  2, 1, 1, 1, 1, 2, 4, 8, 14, 18, 20, 22, 24, 23, 21, 19, 20, 22, 20, 16, 11, 7, 4, 3,
];

/** Pure, deterministic: row count = `weights.length`, each cell = round(shape[hour] * weight * scale). */
function buildMatrix(weights: number[], scale: number): number[][] {
  return weights.map((w) => HOURLY_SHAPE.map((h) => Math.round(h * w * scale)));
}

export const KEYS: ApiKey[] = [
  {
    id: "checkout",
    name: "Checkout API key",
    environment: "production",
    owner: "Checkout",
    secretPreview: "sk_live_•••• 7c21",
    quotaCeiling: 50_000,
    scope: ["payments-create", "payments-get", "refunds-create", "customers-list", "balance-get"],
    matrix: buildMatrix([0.38, 0.24, 0.16, 0.13, 0.09], 208),
  },
  {
    id: "payouts-worker",
    name: "Payouts worker key",
    environment: "production",
    owner: "Treasury",
    secretPreview: "sk_live_•••• 4a08",
    quotaCeiling: 20_000,
    scope: ["payouts-create", "balance-get", "accounts-list", "webhooks-test"],
    matrix: buildMatrix([0.4, 0.28, 0.2, 0.12], 63),
  },
  {
    id: "mobile-app",
    name: "Mobile app key",
    environment: "production",
    owner: "Mobile",
    secretPreview: "sk_live_•••• 1e55",
    quotaCeiling: 80_000,
    scope: ["payments-create", "customers-list", "accounts-list", "balance-get", "refunds-create"],
    matrix: buildMatrix([0.38, 0.24, 0.16, 0.13, 0.09], 152),
  },
  {
    id: "partner-sync",
    name: "Partner integration key",
    environment: "production",
    owner: "Partnerships",
    secretPreview: "sk_live_•••• 9f02",
    quotaCeiling: 15_000,
    scope: ["customers-list", "accounts-list", "webhooks-test"],
    matrix: buildMatrix([0.5, 0.3, 0.2], 43),
  },
  {
    id: "staging-smoke",
    name: "Staging smoke-test key",
    environment: "staging",
    owner: "QA",
    secretPreview: "sk_test_•••• 0d31",
    quotaCeiling: 5_000,
    scope: [
      "payments-create",
      "payments-get",
      "refunds-create",
      "customers-list",
      "balance-get",
      "webhooks-test",
    ],
    matrix: buildMatrix([0.22, 0.2, 0.18, 0.15, 0.13, 0.12], 5.5),
  },
  {
    id: "analytics-export",
    name: "Analytics export key",
    environment: "production",
    owner: "Data",
    secretPreview: "sk_live_•••• 6b47",
    quotaCeiling: 30_000,
    scope: ["customers-list", "accounts-list", "balance-get"],
    matrix: buildMatrix([0.5, 0.3, 0.2], 50),
  },
  {
    id: "legacy-billing",
    name: "Legacy billing key",
    environment: "production",
    owner: "Billing",
    secretPreview: "sk_live_•••• 2c90",
    quotaCeiling: 40_000,
    scope: ["payments-create", "refunds-create", "payouts-create", "balance-get"],
    matrix: buildMatrix([0.4, 0.28, 0.2, 0.12], 96),
  },
];

export function keyById(id: string, pool: ApiKey[] = KEYS): ApiKey | undefined {
  return pool.find((k) => k.id === id);
}

export function matrixTotal(matrix: number[][]): number {
  return matrix.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0);
}

export function quotaUsedPct(key: ApiKey): number {
  if (key.quotaCeiling <= 0) return 0;
  return Math.round((matrixTotal(key.matrix) / key.quotaCeiling) * 100);
}

export function quotaStatus(pct: number): QuotaStatus {
  if (pct >= 100) return "exceeded";
  if (pct >= 80) return "warning";
  return "ok";
}

export interface PeakHour {
  hour: number;
  total: number;
}

/** Hour (column) with the highest summed request count across every endpoint row. */
export function peakHour(matrix: number[][]): PeakHour {
  let bestHour = 0;
  let bestTotal = -1;
  for (let h = 0; h < 24; h++) {
    let total = 0;
    for (const row of matrix) total += row[h] ?? 0;
    if (total > bestTotal) {
      bestTotal = total;
      bestHour = h;
    }
  }
  return { hour: bestHour, total: bestTotal };
}

export interface PeakCell {
  rowIndex: number;
  hour: number;
  value: number;
}

/** Single busiest endpoint × hour cell in the matrix. */
export function peakCell(matrix: number[][]): PeakCell {
  let rowIndex = 0;
  let hour = 0;
  let value = -1;
  matrix.forEach((row, r) => {
    row.forEach((v, h) => {
      if (v > value) {
        value = v;
        rowIndex = r;
        hour = h;
      }
    });
  });
  return { rowIndex, hour, value };
}

/** 6 four-hour buckets — used by the rail's compact mini-bar AND the heatmap's table fallback, so
 * both read the same aggregation of the same underlying matrix. */
export const BUCKETS: { label: string; hours: number[] }[] = [
  { label: "12–4am", hours: [0, 1, 2, 3] },
  { label: "4–8am", hours: [4, 5, 6, 7] },
  { label: "8am–12pm", hours: [8, 9, 10, 11] },
  { label: "12–4pm", hours: [12, 13, 14, 15] },
  { label: "4–8pm", hours: [16, 17, 18, 19] },
  { label: "8pm–12am", hours: [20, 21, 22, 23] },
];

export function bucketTotal(row: number[], hours: number[]): number {
  return hours.reduce((sum, h) => sum + (row[h] ?? 0), 0);
}

export function hourLabel(hour: number): string {
  const period = hour < 12 ? "am" : "pm";
  const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${display}${period}`;
}

export function hourRangeLabel(hour: number): string {
  return `${hourLabel(hour)}–${hourLabel((hour + 1) % 24)}`;
}

/** 0 = no traffic, 1–5 = increasing intensity bins relative to this key's own busiest cell. */
export function intensityBin(value: number, max: number): number {
  if (max <= 0 || value <= 0) return 0;
  const ratio = value / max;
  if (ratio < 0.2) return 1;
  if (ratio < 0.45) return 2;
  if (ratio < 0.7) return 3;
  if (ratio < 0.9) return 4;
  return 5;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function environmentLabel(env: Environment): string {
  return env === "production" ? "Production" : "Staging";
}
