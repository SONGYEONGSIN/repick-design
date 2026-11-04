// Latch — third-party vendor SLA / response-time compliance console.
//
// Every number on the page is derived from two static record sets below (`VENDORS`,
// `INCIDENTS`) by the pure functions at the bottom of this file. Nothing is a hand-typed
// subtotal: percentiles come from `percentile()` run over each vendor's own response-time
// sample array, and portfolio-level stats (avg compliance, breach count, open-incident count)
// are folded over `VENDORS`/`INCIDENTS` at call time. No `Math.random`, no `Date.now`, no
// `new Date` — every timestamp is a fixed display label plus a plain integer sort key so the
// incidents table can still sort "by date" without ever constructing a Date object.

export type ComplianceStatus = "compliant" | "at-risk" | "breach";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  /** Response-time target in minutes — the per-row SLA marker on the shared box-plot scale. */
  targetMinutes: number;
  /** Raw response-time samples in minutes, one per recent ticket/escalation. Order doesn't matter. */
  samples: number[];
  owner: string;
}

export const VENDORS: Vendor[] = [
  {
    id: "anchor-bpo",
    name: "Anchor BPO",
    category: "Customer support",
    targetMinutes: 30,
    samples: [40, 55, 65, 75, 85, 95, 105, 115, 125, 135, 150, 165, 185, 210, 240, 280],
    owner: "Priya Nair",
  },
  {
    id: "coldline-storage",
    name: "Coldline Storage Co.",
    category: "Infrastructure",
    targetMinutes: 480,
    samples: [200, 260, 320, 380, 430, 470, 510, 540, 570, 610, 650, 690, 740, 800, 870, 950],
    owner: "Marcus Webb",
  },
  {
    id: "northgate-logistics",
    name: "Northgate Logistics",
    category: "Fulfillment",
    targetMinutes: 240,
    samples: [60, 90, 110, 130, 150, 160, 180, 195, 210, 225, 240, 255, 270, 300, 340, 420],
    owner: "Elena Kade",
  },
  {
    id: "veritas-kyc",
    name: "Veritas KYC",
    category: "Compliance",
    targetMinutes: 60,
    samples: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 78, 88, 102, 120, 150],
    owner: "Daniel Osei",
  },
  {
    id: "signwell-docs",
    name: "SignWell Docs",
    category: "Document signing",
    targetMinutes: 45,
    samples: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 62, 70, 80, 95, 115, 140],
    owner: "Tomas Rivera",
  },
  {
    id: "apex-payments",
    name: "Apex Payments",
    category: "Payments",
    targetMinutes: 25,
    samples: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 26, 31],
    owner: "Mia Chen",
  },
  {
    id: "cumulus-cloud",
    name: "Cumulus Cloud Services",
    category: "Infrastructure",
    targetMinutes: 30,
    samples: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 18, 22, 29, 40],
    owner: "Mia Chen",
  },
  {
    id: "sentry-fraud",
    name: "Sentry Fraud Shield",
    category: "Risk & fraud",
    targetMinutes: 10,
    samples: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 18, 22, 27, 34],
    owner: "Priya Nair",
  },
  {
    id: "relay-sms",
    name: "Relay SMS Gateway",
    category: "Messaging",
    targetMinutes: 5,
    samples: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 10, 13, 18],
    owner: "Daniel Osei",
  },
  {
    id: "geopoint-maps",
    name: "GeoPoint Maps",
    category: "Infrastructure",
    targetMinutes: 18,
    samples: [1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 11, 14, 18, 24],
    owner: "Tomas Rivera",
  },
];

export interface Incident {
  id: string;
  vendorId: string;
  subject: string;
  /** Display label — a fixed string, never derived from `new Date`. */
  openedLabel: string;
  /** Integer sort key standing in for chronological order, oldest = 1. */
  openedSortKey: number;
  responseMinutes: number;
  severity: "Critical" | "Major" | "Minor";
  status: "Open" | "Resolved";
}

export const INCIDENTS: Incident[] = [
  { id: "ENG-4401", vendorId: "anchor-bpo", subject: "Tier-2 queue unacknowledged past escalation window", openedLabel: "Oct 3, 2026", openedSortKey: 1, responseMinutes: 185, severity: "Critical", status: "Resolved" },
  { id: "ENG-4418", vendorId: "anchor-bpo", subject: "Chat handoff dropped for refund disputes", openedLabel: "Oct 11, 2026", openedSortKey: 4, responseMinutes: 150, severity: "Major", status: "Resolved" },
  { id: "ENG-4452", vendorId: "anchor-bpo", subject: "After-hours coverage gap on payment disputes", openedLabel: "Oct 22, 2026", openedSortKey: 9, responseMinutes: 240, severity: "Critical", status: "Open" },
  { id: "ENG-4467", vendorId: "anchor-bpo", subject: "First-response SLA missed on VIP tier", openedLabel: "Nov 1, 2026", openedSortKey: 13, responseMinutes: 115, severity: "Major", status: "Open" },

  { id: "ENG-4403", vendorId: "coldline-storage", subject: "Archive retrieval request stuck in queue", openedLabel: "Oct 4, 2026", openedSortKey: 2, responseMinutes: 740, severity: "Major", status: "Resolved" },
  { id: "ENG-4429", vendorId: "coldline-storage", subject: "Restore job exceeded committed turnaround", openedLabel: "Oct 14, 2026", openedSortKey: 5, responseMinutes: 870, severity: "Critical", status: "Resolved" },
  { id: "ENG-4460", vendorId: "coldline-storage", subject: "Capacity ticket unanswered over weekend", openedLabel: "Oct 27, 2026", openedSortKey: 11, responseMinutes: 950, severity: "Critical", status: "Open" },

  { id: "ENG-4407", vendorId: "northgate-logistics", subject: "Carrier exception queue backing up", openedLabel: "Oct 5, 2026", openedSortKey: 3, responseMinutes: 300, severity: "Major", status: "Resolved" },
  { id: "ENG-4441", vendorId: "northgate-logistics", subject: "Lost-parcel claim response delayed", openedLabel: "Oct 18, 2026", openedSortKey: 7, responseMinutes: 420, severity: "Critical", status: "Open" },

  { id: "ENG-4411", vendorId: "veritas-kyc", subject: "Manual review backlog on enhanced due diligence", openedLabel: "Oct 7, 2026", openedSortKey: 4, responseMinutes: 102, severity: "Major", status: "Resolved" },
  { id: "ENG-4448", vendorId: "veritas-kyc", subject: "Document re-verification queue delayed", openedLabel: "Oct 21, 2026", openedSortKey: 8, responseMinutes: 150, severity: "Major", status: "Open" },

  { id: "ENG-4415", vendorId: "signwell-docs", subject: "Signature webhook retries exhausted", openedLabel: "Oct 9, 2026", openedSortKey: 5, responseMinutes: 95, severity: "Minor", status: "Resolved" },
  { id: "ENG-4455", vendorId: "signwell-docs", subject: "Template rendering ticket past target", openedLabel: "Oct 24, 2026", openedSortKey: 10, responseMinutes: 140, severity: "Major", status: "Open" },

  { id: "ENG-4420", vendorId: "apex-payments", subject: "Chargeback evidence request past target", openedLabel: "Oct 12, 2026", openedSortKey: 6, responseMinutes: 26, severity: "Minor", status: "Resolved" },

  { id: "ENG-4424", vendorId: "cumulus-cloud", subject: "Region failover ack slower than target", openedLabel: "Oct 13, 2026", openedSortKey: 6, responseMinutes: 34, severity: "Minor", status: "Resolved" },

  { id: "ENG-4431", vendorId: "sentry-fraud", subject: "Model-review escalation past target", openedLabel: "Oct 15, 2026", openedSortKey: 7, responseMinutes: 27, severity: "Minor", status: "Resolved" },

  { id: "ENG-4436", vendorId: "relay-sms", subject: "Delivery-receipt webhook lag spike", openedLabel: "Oct 16, 2026", openedSortKey: 7, responseMinutes: 13, severity: "Minor", status: "Resolved" },

  { id: "ENG-4439", vendorId: "geopoint-maps", subject: "Geocode batch job response past target", openedLabel: "Oct 17, 2026", openedSortKey: 7, responseMinutes: 21, severity: "Minor", status: "Resolved" },
];

export function getIncidentsForVendor(vendorId: string): Incident[] {
  return INCIDENTS.filter((i) => i.vendorId === vendorId);
}

/**
 * Linear-interpolation percentile (the "R-7" / Excel method) over a sorted numeric array.
 * Deterministic, no randomness — the same `samples` array always yields the same percentile.
 */
export function percentile(sortedAsc: number[], p: number): number {
  const n = sortedAsc.length;
  if (n === 0) return 0;
  if (n === 1) return sortedAsc[0];
  const h = ((n - 1) * p) / 100;
  const lo = Math.floor(h);
  const hi = Math.ceil(h);
  const loVal = sortedAsc[lo];
  const hiVal = sortedAsc[hi];
  return loVal + (h - lo) * (hiVal - loVal);
}

export interface VendorStats {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  max: number;
  status: ComplianceStatus;
  sampleSize: number;
}

/**
 * Compliance status is derived directly from the percentiles the box-plot already draws, not a
 * separately hand-set field: "compliant" means 90% of responses land inside the target,
 * "at-risk" means the median does but the long tail doesn't, "breach" means even the median
 * misses target.
 */
export function computeVendorStats(vendor: Vendor): VendorStats {
  const sorted = [...vendor.samples].sort((a, b) => a - b);
  const p10 = percentile(sorted, 10);
  const p25 = percentile(sorted, 25);
  const p50 = percentile(sorted, 50);
  const p75 = percentile(sorted, 75);
  const p90 = percentile(sorted, 90);
  const max = sorted[sorted.length - 1];
  let status: ComplianceStatus = "compliant";
  if (p50 > vendor.targetMinutes) status = "breach";
  else if (p90 > vendor.targetMinutes) status = "at-risk";
  return { p10, p25, p50, p75, p90, max, status, sampleSize: sorted.length };
}

export interface PortfolioStats {
  vendorCount: number;
  breachCount: number;
  atRiskCount: number;
  compliantCount: number;
  avgCompliancePct: number;
  openIncidents: number;
}

export function computePortfolioStats(): PortfolioStats {
  const rows = VENDORS.map((v) => computeVendorStats(v));
  const breachCount = rows.filter((r) => r.status === "breach").length;
  const atRiskCount = rows.filter((r) => r.status === "at-risk").length;
  const compliantCount = rows.filter((r) => r.status === "compliant").length;
  const withinTargetShare = VENDORS.reduce((sum, v) => {
    const within = v.samples.filter((s) => s <= v.targetMinutes).length;
    return sum + within / v.samples.length;
  }, 0);
  const openIncidents = INCIDENTS.filter((i) => i.status === "Open").length;
  return {
    vendorCount: VENDORS.length,
    breachCount,
    atRiskCount,
    compliantCount,
    avgCompliancePct: Math.round((withinTargetShare / VENDORS.length) * 1000) / 10,
    openIncidents,
  };
}

/** Picks the default-selected vendor: the worst-overshoot breach, never an empty selection. */
export function getDefaultVendorId(): string {
  let worstId = VENDORS[0].id;
  let worstRatio = -Infinity;
  for (const v of VENDORS) {
    const stats = computeVendorStats(v);
    const ratio = stats.p50 / v.targetMinutes;
    if (ratio > worstRatio) {
      worstRatio = ratio;
      worstId = v.id;
    }
  }
  return worstId;
}

const minutesFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export function formatMinutes(value: number): string {
  return `${minutesFormatter.format(Math.round(value))}m`;
}

const pctFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
export function formatPct(value: number): string {
  return `${pctFormatter.format(value)}%`;
}

export const STATUS_LABEL: Record<ComplianceStatus, string> = {
  compliant: "Compliant",
  "at-risk": "At risk",
  breach: "Breach",
};
