// Deterministic demo data for Kelvin, a subscription revenue-mix console for
// SaaS finance/RevOps teams. No Math.random / Date.now / new Date anywhere in
// this file or any consumer — every figure below is a fixed literal.
//
// Source of truth: each region's revenue lives ONLY as four tier figures
// (`tiers`). Region totals, the grand total, tier totals and every share are
// *derived* from those figures below, never re-typed as a second literal —
// so the chart, the KPI row, the fallback table and the spotlight card can
// never drift out of reconciliation with one another.

export type TierId = "enterprise" | "scale" | "growth" | "starter";

export const TIERS: { id: TierId; label: string; swatch: string; fill: string }[] = [
  { id: "enterprise", label: "Enterprise", swatch: "bg-teal-800", fill: "bg-teal-800" },
  { id: "scale", label: "Scale", swatch: "bg-teal-600", fill: "bg-teal-600" },
  { id: "growth", label: "Growth", swatch: "bg-teal-400", fill: "bg-teal-400" },
  { id: "starter", label: "Starter", swatch: "bg-teal-200", fill: "bg-teal-200" },
];

export const TIER_BY_ID = Object.fromEntries(TIERS.map((t) => [t.id, t])) as Record<TierId, (typeof TIERS)[number]>;

export type Region = {
  id: string;
  name: string;
  code: string;
  accounts: number;
  /** Annual recurring revenue, in thousands of USD, by plan tier. */
  tiers: Record<TierId, number>;
};

export const REGIONS: Region[] = [
  {
    id: "na",
    name: "North America",
    code: "NA",
    accounts: 612,
    tiers: { enterprise: 1580, scale: 1560, growth: 1200, starter: 480 },
  },
  {
    id: "emea",
    name: "Europe & UK",
    code: "EMEA",
    accounts: 398,
    tiers: { enterprise: 860, scale: 1020, growth: 900, starter: 380 },
  },
  {
    id: "apac",
    name: "Asia Pacific",
    code: "APAC",
    accounts: 201,
    tiers: { enterprise: 500, scale: 650, growth: 760, starter: 430 },
  },
  {
    id: "latam",
    name: "Latin America",
    code: "LATAM",
    accounts: 54,
    tiers: { enterprise: 110, scale: 220, growth: 310, starter: 340 },
  },
  {
    id: "mea",
    name: "Middle East & Africa",
    code: "MEA",
    accounts: 19,
    tiers: { enterprise: 60, scale: 150, growth: 230, starter: 260 },
  },
];

export const REGION_BY_ID: Record<string, Region> = Object.fromEntries(REGIONS.map((r) => [r.id, r]));

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Region's total ARR ($k) — the sum of its four tier figures. */
export function regionTotal(region: Region): number {
  return TIERS.reduce((sum, t) => sum + region.tiers[t.id], 0);
}

/** Grand total ARR ($k) across every region and tier. */
export function grandTotal(): number {
  return REGIONS.reduce((sum, r) => sum + regionTotal(r), 0);
}

/** Total ARR ($k) for one tier, summed across all regions. */
export function tierTotal(tierId: TierId): number {
  return REGIONS.reduce((sum, r) => sum + r.tiers[tierId], 0);
}

/** Total accounts across every region — reconciles with the KPI tile below. */
export function totalAccounts(): number {
  return REGIONS.reduce((sum, r) => sum + r.accounts, 0);
}

/** Region's share of the grand total, 0–100, rounded to 2 decimals. */
export function regionSharePct(region: Region): number {
  return round2((regionTotal(region) / grandTotal()) * 100);
}

/** One tier's share of ONE region's own revenue, 0–100, rounded to 2 decimals. */
export function tierShareOfRegionPct(region: Region, tierId: TierId): number {
  return round2((region.tiers[tierId] / regionTotal(region)) * 100);
}

/** One tier's share of the grand total, 0–100, rounded to 2 decimals. */
export function tierShareOfGrandPct(tierId: TierId): number {
  return round2((tierTotal(tierId) / grandTotal()) * 100);
}

/** Regions ranked descending by total ARR. */
export function regionsByRank(): Region[] {
  return [...REGIONS].sort((a, b) => regionTotal(b) - regionTotal(a));
}

export function regionRank(region: Region): number {
  return regionsByRank().findIndex((r) => r.id === region.id) + 1;
}

/** The tier with the largest dollar figure inside one region. */
export function leadingTierOf(region: Region): TierId {
  return TIERS.reduce((best, t) => (region.tiers[t.id] > region.tiers[best.id] ? t : best), TIERS[0]).id;
}

/** The tier with the largest grand total across all regions — the chart's headline segment. */
export function leadingTierOverall(): TierId {
  return TIERS.reduce((best, t) => (tierTotal(t.id) > tierTotal(best.id) ? t : best), TIERS[0]).id;
}

export const BRAND_NAME = "Kelvin";
export const BRAND_TAGLINE = "Revenue Mix";

export const WORKSPACES = ["Core Billing — Prod", "Core Billing — Sandbox"];

export const CURRENT_USER = {
  name: "Priya Shenoy",
  role: "Revenue Operations Lead",
  email: "priya.shenoy@kelvin.io",
  avatarId: "1519244703995-f4e0f30006d5",
};

export type MekkoView = "share" | "scale";

export const VIEW_OPTIONS: { value: MekkoView; label: string }[] = [
  { value: "share", label: "Share mix" },
  { value: "scale", label: "Revenue scale" },
];
