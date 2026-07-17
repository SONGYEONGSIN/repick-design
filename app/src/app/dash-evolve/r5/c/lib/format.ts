// Formatting + sorting helpers for Bisect. All inputs are deterministic
// numbers derived in lib/data.ts — nothing here touches Math.random or Date.now.

export const integerFormatter = new Intl.NumberFormat("en-US");

export function formatInt(n: number): string {
  return integerFormatter.format(Math.round(n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

// Signed percentage-point / percentage delta, using a proper minus sign and
// an explicit "+" so direction never relies on color alone.
export function formatSigned(value: number, digits = 1): string {
  const rounded = Math.abs(value) < 0.05 ? 0 : value;
  if (rounded === 0) return `±0.${"0".repeat(digits)}%`;
  const sign = rounded > 0 ? "+" : "−";
  return `${sign}${Math.abs(rounded).toFixed(digits)}%`;
}

export type SegmentSortKey = "segment" | "visitors" | "conversions" | "rate";
export type SortDir = "asc" | "desc";

export interface SegmentRow {
  id: string;
  label: string;
  visitors: number;
  conversions: number;
}

export interface SegmentRowWithRate extends SegmentRow {
  rate: number;
}

export function withRate(rows: SegmentRow[]): SegmentRowWithRate[] {
  return rows.map((r) => ({
    ...r,
    rate: r.visitors > 0 ? (r.conversions / r.visitors) * 100 : 0,
  }));
}

export function sortSegments(
  rows: SegmentRowWithRate[],
  key: SegmentSortKey,
  dir: SortDir
): SegmentRowWithRate[] {
  const sorted = [...rows].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "segment":
        cmp = a.label.localeCompare(b.label);
        break;
      case "visitors":
        cmp = a.visitors - b.visitors;
        break;
      case "conversions":
        cmp = a.conversions - b.conversions;
        break;
      case "rate":
      default:
        cmp = a.rate - b.rate;
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function sumSegments(rows: SegmentRow[]): { visitors: number; conversions: number; rate: number } {
  const visitors = rows.reduce((sum, r) => sum + r.visitors, 0);
  const conversions = rows.reduce((sum, r) => sum + r.conversions, 0);
  return { visitors, conversions, rate: visitors > 0 ? (conversions / visitors) * 100 : 0 };
}
