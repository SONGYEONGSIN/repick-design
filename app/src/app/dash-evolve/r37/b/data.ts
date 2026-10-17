/**
 * Literal, hand-verified data for the Baseline vendor quality scorecard.
 *
 * Every five-number summary below satisfies min <= q1 <= median <= q3 <= max
 * by construction (each vendor's row was written in ascending order), and
 * `outliers` holds points that sit outside [min, max] on purpose — that is
 * what makes them outliers. Every value is a fixed literal — nothing in
 * this file or in the components that read it calls any non-deterministic
 * time or randomness API; the only "computed" values are domain min/max
 * reductions over these literals, which run once at module load and are
 * fully deterministic.
 */

export type MetricKey = "defect" | "delivery" | "inspection";
export type SortKey = "median" | "name";
export type VendorStatus = "active" | "renewal-due" | "expired";
export type Region = "North America" | "EMEA" | "APAC" | "LATAM";

export interface FiveNumberSummary {
  readonly min: number;
  readonly q1: number;
  readonly median: number;
  readonly q3: number;
  readonly max: number;
  /** Points lying outside [min, max] — plotted as open circles beyond the whiskers. */
  readonly outliers: readonly number[];
}

export interface Vendor {
  readonly id: string;
  readonly name: string;
  readonly shortCode: string;
  readonly category: string;
  readonly region: Region;
  readonly status: VendorStatus;
  readonly contractEnd: string;
  /** YYYYMMDD integer for correct chronological sort without a Date object. */
  readonly contractEndSort: number;
  readonly contact: string;
  readonly email: string;
}

export const VENDORS: readonly Vendor[] = [
  {
    id: "northfield",
    name: "Northfield Components",
    shortCode: "NFC",
    category: "Raw Materials",
    region: "North America",
    status: "active",
    contractEnd: "Dec 31, 2026",
    contractEndSort: 20261231,
    contact: "Dana Whitfield",
    email: "d.whitfield@northfieldcomp.com",
  },
  {
    id: "arcadia",
    name: "Arcadia Metalworks",
    shortCode: "ARC",
    category: "Alloys",
    region: "EMEA",
    status: "active",
    contractEnd: "Mar 15, 2027",
    contractEndSort: 20270315,
    contact: "Marcus Ito",
    email: "m.ito@arcadiametal.co",
  },
  {
    id: "brightline",
    name: "Brightline Fasteners",
    shortCode: "BRL",
    category: "Fasteners",
    region: "North America",
    status: "renewal-due",
    contractEnd: "Nov 5, 2026",
    contractEndSort: 20261105,
    contact: "Priya Shah",
    email: "p.shah@brightlinefast.com",
  },
  {
    id: "cedarpoint",
    name: "Cedar Point Plastics",
    shortCode: "CDP",
    category: "Plastics",
    region: "North America",
    status: "active",
    contractEnd: "Jun 30, 2027",
    contractEndSort: 20270630,
    contact: "Leon Grant",
    email: "l.grant@cedarpointplas.com",
  },
  {
    id: "deltaharbor",
    name: "Delta Harbor Logistics",
    shortCode: "DHG",
    category: "Logistics",
    region: "APAC",
    status: "expired",
    contractEnd: "Aug 1, 2026",
    contractEndSort: 20260801,
    contact: "Noor Haddad",
    email: "n.haddad@deltaharbor.co",
  },
  {
    id: "evermark",
    name: "Evermark Textiles",
    shortCode: "EVM",
    category: "Textiles",
    region: "LATAM",
    status: "active",
    contractEnd: "Jan 20, 2027",
    contractEndSort: 20270120,
    contact: "Sana Reyes",
    email: "s.reyes@evermarktex.com",
  },
  {
    id: "fenwick",
    name: "Fenwick Circuits",
    shortCode: "FNW",
    category: "Electronics",
    region: "APAC",
    status: "renewal-due",
    contractEnd: "Oct 28, 2026",
    contractEndSort: 20261028,
    contact: "Tomas Berg",
    email: "t.berg@fenwickckt.com",
  },
  {
    id: "granitebay",
    name: "Granite Bay Packaging",
    shortCode: "GRB",
    category: "Packaging",
    region: "North America",
    status: "active",
    contractEnd: "Apr 12, 2027",
    contractEndSort: 20270412,
    contact: "Alicia Moon",
    email: "a.moon@granitebaypkg.com",
  },
  {
    id: "harlow",
    name: "Harlow Industrial",
    shortCode: "HLW",
    category: "Raw Materials",
    region: "EMEA",
    status: "expired",
    contractEnd: "Sep 15, 2026",
    contractEndSort: 20260915,
    contact: "Deja Okafor",
    email: "d.okafor@harlowind.com",
  },
  {
    id: "ironwood",
    name: "Ironwood Coatings",
    shortCode: "IRW",
    category: "Coatings",
    region: "North America",
    status: "active",
    contractEnd: "Feb 28, 2027",
    contractEndSort: 20270228,
    contact: "Ravi Nair",
    email: "r.nair@ironwoodcoat.com",
  },
  {
    id: "juniper",
    name: "Juniper Precision",
    shortCode: "JNP",
    category: "Precision Parts",
    region: "APAC",
    status: "renewal-due",
    contractEnd: "Nov 18, 2026",
    contractEndSort: 20261118,
    contact: "Elin Voss",
    email: "e.voss@juniperprec.com",
  },
  {
    id: "keystone",
    name: "Keystone Alloys",
    shortCode: "KEY",
    category: "Alloys",
    region: "LATAM",
    status: "expired",
    contractEnd: "Jul 22, 2026",
    contractEndSort: 20260722,
    contact: "Finn Carraway",
    email: "f.carraway@keystonealloys.com",
  },
] as const;

export const METRIC_LABEL: Record<MetricKey, string> = {
  defect: "Defect Rate",
  delivery: "Delivery Variance",
  inspection: "Inspection Score",
};

export const METRIC_UNIT: Record<MetricKey, string> = {
  defect: "%",
  delivery: "d",
  inspection: "pts",
};

export const METRIC_DIRECTION: Record<MetricKey, "lower is better" | "higher is better"> = {
  defect: "lower is better",
  delivery: "lower is better",
  inspection: "higher is better",
};

type BoxData = Record<MetricKey, Record<string, FiveNumberSummary>>;

export const BOX_DATA: BoxData = {
  defect: {
    northfield: { min: 0.10, q1: 0.30, median: 0.45, q3: 0.60, max: 0.85, outliers: [1.40] },
    arcadia: { min: 0.20, q1: 0.35, median: 0.50, q3: 0.70, max: 0.95, outliers: [] },
    brightline: { min: 0.15, q1: 0.40, median: 0.55, q3: 0.80, max: 1.10, outliers: [2.10] },
    cedarpoint: { min: 0.30, q1: 0.55, median: 0.70, q3: 0.95, max: 1.30, outliers: [] },
    deltaharbor: { min: 0.40, q1: 0.65, median: 0.90, q3: 1.20, max: 1.60, outliers: [3.00, 3.40] },
    evermark: { min: 0.25, q1: 0.50, median: 0.95, q3: 1.35, max: 1.80, outliers: [] },
    fenwick: { min: 0.50, q1: 0.85, median: 1.10, q3: 1.45, max: 1.90, outliers: [2.80] },
    granitebay: { min: 0.35, q1: 0.70, median: 1.15, q3: 1.60, max: 2.10, outliers: [] },
    harlow: { min: 0.60, q1: 1.00, median: 1.35, q3: 1.80, max: 2.30, outliers: [3.60] },
    ironwood: { min: 0.70, q1: 1.10, median: 1.50, q3: 2.00, max: 2.50, outliers: [] },
    juniper: { min: 0.90, q1: 1.40, median: 1.85, q3: 2.35, max: 2.90, outliers: [4.20] },
    keystone: { min: 1.10, q1: 1.70, median: 2.20, q3: 2.80, max: 3.40, outliers: [] },
  },
  delivery: {
    northfield: { min: 0.20, q1: 0.60, median: 1.00, q3: 1.50, max: 2.20, outliers: [4.50] },
    arcadia: { min: 0.30, q1: 0.70, median: 1.10, q3: 1.60, max: 2.30, outliers: [] },
    brightline: { min: 0.40, q1: 0.90, median: 1.30, q3: 1.90, max: 2.60, outliers: [5.00] },
    cedarpoint: { min: 0.50, q1: 1.00, median: 1.50, q3: 2.10, max: 2.90, outliers: [] },
    deltaharbor: { min: 0.60, q1: 1.20, median: 1.80, q3: 2.50, max: 3.30, outliers: [6.20, 6.80] },
    evermark: { min: 0.70, q1: 1.30, median: 1.90, q3: 2.60, max: 3.40, outliers: [] },
    fenwick: { min: 0.80, q1: 1.50, median: 2.10, q3: 2.90, max: 3.70, outliers: [5.80] },
    granitebay: { min: 0.90, q1: 1.60, median: 2.30, q3: 3.10, max: 4.00, outliers: [] },
    harlow: { min: 1.00, q1: 1.80, median: 2.60, q3: 3.40, max: 4.30, outliers: [7.10] },
    ironwood: { min: 1.20, q1: 2.00, median: 2.80, q3: 3.70, max: 4.60, outliers: [] },
    juniper: { min: 1.40, q1: 2.30, median: 3.10, q3: 4.00, max: 5.00, outliers: [7.80] },
    keystone: { min: 1.60, q1: 2.60, median: 3.50, q3: 4.50, max: 5.60, outliers: [] },
  },
  inspection: {
    northfield: { min: 88.00, q1: 92.00, median: 95.00, q3: 97.00, max: 99.00, outliers: [78.00] },
    arcadia: { min: 85.00, q1: 90.00, median: 93.50, q3: 96.00, max: 98.00, outliers: [] },
    brightline: { min: 82.00, q1: 88.00, median: 92.00, q3: 95.00, max: 97.50, outliers: [72.00] },
    cedarpoint: { min: 80.00, q1: 86.00, median: 90.50, q3: 94.00, max: 97.00, outliers: [] },
    deltaharbor: { min: 76.00, q1: 83.00, median: 88.00, q3: 92.00, max: 95.50, outliers: [65.00, 62.00] },
    evermark: { min: 74.00, q1: 81.00, median: 86.50, q3: 91.00, max: 95.00, outliers: [] },
    fenwick: { min: 70.00, q1: 78.00, median: 84.00, q3: 89.00, max: 93.50, outliers: [60.00] },
    granitebay: { min: 68.00, q1: 76.00, median: 82.50, q3: 88.00, max: 92.50, outliers: [] },
    harlow: { min: 64.00, q1: 73.00, median: 79.50, q3: 86.00, max: 91.00, outliers: [55.00] },
    ironwood: { min: 60.00, q1: 70.00, median: 77.00, q3: 84.00, max: 89.50, outliers: [] },
    juniper: { min: 57.00, q1: 67.00, median: 74.00, q3: 81.00, max: 87.00, outliers: [50.00] },
    keystone: { min: 54.00, q1: 64.00, median: 71.00, q3: 79.00, max: 85.50, outliers: [] },
  },
};

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatMetricValue(metric: MetricKey, value: number): string {
  // Hand-rolled formatting only — no Intl.NumberFormat compact notation
  // anywhere in this file (see brief: its trailing-zero trimming differs
  // between Node's ICU and Chromium's ICU and has caused hydration
  // mismatches in this catalog before).
  const unit = METRIC_UNIT[metric];
  if (metric === "inspection") return `${value.toFixed(1)} ${unit}`;
  return `${value.toFixed(2)}${unit}`;
}

/** Domain (incl. outliers) for a metric, computed once from the literals above. */
export function metricDomain(metric: MetricKey): { min: number; max: number } {
  let lo = Infinity;
  let hi = -Infinity;
  const table = BOX_DATA[metric];
  for (const vendor of VENDORS) {
    const row = table[vendor.id];
    lo = Math.min(lo, row.min, ...row.outliers);
    hi = Math.max(hi, row.max, ...row.outliers);
  }
  return { min: lo, max: hi };
}

export const STATUS_LABEL: Record<VendorStatus, string> = {
  active: "Active",
  "renewal-due": "Renewal due",
  expired: "Expired",
};
