import {
  PackageCheck,
  ShieldAlert,
  UserMinus,
  PackageX,
  ClipboardX,
  Truck,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Core domain types                                                   */
/* ------------------------------------------------------------------ */

export type CategoryId =
  | "recovered"
  | "external-theft"
  | "internal-theft"
  | "damage"
  | "admin-error"
  | "vendor-shortage";

export type BridgeId = "starting" | CategoryId | "ending";
export type BridgeKind = "total" | "increase" | "decrease";

/** A single input row for a shrinkage bridge. `value` is a signed dollar
 * delta for every category row; for the `starting` total row it is the
 * absolute opening inventory value. The `ending` total row's `value` is
 * kept only as a hand-verified reference figure — `buildBridgeSteps`
 * never reads it, so the chart can never show a closing balance that
 * doesn't actually reconcile with the categories above it. */
export interface BridgeInput {
  id: BridgeId;
  label: string;
  kind: BridgeKind;
  value: number;
}

export interface BridgeStep extends BridgeInput {
  runningTotal: number;
  previousTotal: number;
}

export interface CategoryMeta {
  label: string;
  direction: "up" | "down";
  icon: LucideIcon;
  guidance: string;
}

export const CATEGORY_ORDER: CategoryId[] = [
  "recovered",
  "external-theft",
  "internal-theft",
  "damage",
  "admin-error",
  "vendor-shortage",
];

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  recovered: {
    label: "Recovered / found",
    direction: "up",
    icon: PackageCheck,
    guidance:
      "Found inventory is usually mis-shelved stock surfacing in cycle counts. Tight put-away discipline during restock keeps this line small on its own.",
  },
  "external-theft": {
    label: "External theft",
    direction: "down",
    icon: ShieldAlert,
    guidance:
      "Review camera coverage and staffing near entrances and high-value aisles during peak hours — most external loss clusters in a handful of predictable time windows.",
  },
  "internal-theft": {
    label: "Internal theft",
    direction: "down",
    icon: UserMinus,
    guidance:
      "Reconcile register voids and discount overrides weekly. A small number of repeat shifts usually account for most internal loss.",
  },
  damage: {
    label: "Damage & spoilage",
    direction: "down",
    icon: PackageX,
    guidance:
      "Check pallet stacking height limits and backroom climate logs. Damage spikes are often tied to a specific receiving dock or storage zone.",
  },
  "admin-error": {
    label: "Admin error",
    direction: "down",
    icon: ClipboardX,
    guidance:
      "Cross-check cycle-count adjustments against receiving logs before posting. Most admin loss is a transcription mismatch, not real shrink.",
  },
  "vendor-shortage": {
    label: "Vendor shortage",
    direction: "down",
    icon: Truck,
    guidance:
      "Audit case counts against the manifest at the dock, before sign-off. Short-ships concentrate on a small set of vendors and lanes.",
  },
};

/* ------------------------------------------------------------------ */
/* Locations (left rail)                                               */
/* ------------------------------------------------------------------ */

export type StoreId =
  | "harbor-point"
  | "union-market"
  | "brightside"
  | "lakeshore-depot"
  | "fulton-yard";

export type ShrinkStatus = "healthy" | "watch" | "critical";

export interface StoreMeta {
  id: StoreId;
  name: string;
  region: string;
  manager: string;
}

export const STORES: StoreMeta[] = [
  { id: "harbor-point", name: "Harbor Point", region: "Northeast", manager: "Tasha Okafor" },
  { id: "union-market", name: "Union Market", region: "Midwest", manager: "Liam Brennan" },
  { id: "brightside", name: "Brightside", region: "West", manager: "Priya Chandra" },
  { id: "lakeshore-depot", name: "Lakeshore Depot", region: "Southeast", manager: "Derek Voss" },
  { id: "fulton-yard", name: "Fulton Yard", region: "Southwest", manager: "Naomi Flores" },
];

/* Every store's bridge is hand reconciled: the starting inventory value
 * plus every category delta below sums exactly to the ending value —
 * `buildBridgeSteps` computes that sum at runtime, it is never hand-typed. */
const STORE_BRIDGE_INPUTS: Record<StoreId, BridgeInput[]> = {
  "harbor-point": [
    { id: "starting", label: "Opening inventory", kind: "total", value: 3_120_000 },
    { id: "recovered", label: CATEGORY_META.recovered.label, kind: "increase", value: 11_000 },
    { id: "external-theft", label: CATEGORY_META["external-theft"].label, kind: "decrease", value: -16_000 },
    { id: "internal-theft", label: CATEGORY_META["internal-theft"].label, kind: "decrease", value: -10_500 },
    { id: "damage", label: CATEGORY_META.damage.label, kind: "decrease", value: -8_200 },
    { id: "admin-error", label: CATEGORY_META["admin-error"].label, kind: "decrease", value: -5_100 },
    { id: "vendor-shortage", label: CATEGORY_META["vendor-shortage"].label, kind: "decrease", value: -4_400 },
    { id: "ending", label: "Closing inventory", kind: "total", value: 3_086_800 },
  ],
  "union-market": [
    { id: "starting", label: "Opening inventory", kind: "total", value: 2_450_000 },
    { id: "recovered", label: CATEGORY_META.recovered.label, kind: "increase", value: 7_500 },
    { id: "external-theft", label: CATEGORY_META["external-theft"].label, kind: "decrease", value: -17_000 },
    { id: "internal-theft", label: CATEGORY_META["internal-theft"].label, kind: "decrease", value: -12_000 },
    { id: "damage", label: CATEGORY_META.damage.label, kind: "decrease", value: -8_000 },
    { id: "admin-error", label: CATEGORY_META["admin-error"].label, kind: "decrease", value: -6_000 },
    { id: "vendor-shortage", label: CATEGORY_META["vendor-shortage"].label, kind: "decrease", value: -5_000 },
    { id: "ending", label: "Closing inventory", kind: "total", value: 2_409_500 },
  ],
  brightside: [
    { id: "starting", label: "Opening inventory", kind: "total", value: 1_980_000 },
    { id: "recovered", label: CATEGORY_META.recovered.label, kind: "increase", value: 5_000 },
    { id: "external-theft", label: CATEGORY_META["external-theft"].label, kind: "decrease", value: -18_000 },
    { id: "internal-theft", label: CATEGORY_META["internal-theft"].label, kind: "decrease", value: -12_000 },
    { id: "damage", label: CATEGORY_META.damage.label, kind: "decrease", value: -8_000 },
    { id: "admin-error", label: CATEGORY_META["admin-error"].label, kind: "decrease", value: -6_000 },
    { id: "vendor-shortage", label: CATEGORY_META["vendor-shortage"].label, kind: "decrease", value: -5_000 },
    { id: "ending", label: "Closing inventory", kind: "total", value: 1_936_000 },
  ],
  "lakeshore-depot": [
    { id: "starting", label: "Opening inventory", kind: "total", value: 2_730_000 },
    { id: "recovered", label: CATEGORY_META.recovered.label, kind: "increase", value: 9_800 },
    { id: "external-theft", label: CATEGORY_META["external-theft"].label, kind: "decrease", value: -12_000 },
    { id: "internal-theft", label: CATEGORY_META["internal-theft"].label, kind: "decrease", value: -8_500 },
    { id: "damage", label: CATEGORY_META.damage.label, kind: "decrease", value: -6_900 },
    { id: "admin-error", label: CATEGORY_META["admin-error"].label, kind: "decrease", value: -4_200 },
    { id: "vendor-shortage", label: CATEGORY_META["vendor-shortage"].label, kind: "decrease", value: -3_600 },
    { id: "ending", label: "Closing inventory", kind: "total", value: 2_704_600 },
  ],
  "fulton-yard": [
    { id: "starting", label: "Opening inventory", kind: "total", value: 2_210_000 },
    { id: "recovered", label: CATEGORY_META.recovered.label, kind: "increase", value: 6_200 },
    { id: "external-theft", label: CATEGORY_META["external-theft"].label, kind: "decrease", value: -16_000 },
    { id: "internal-theft", label: CATEGORY_META["internal-theft"].label, kind: "decrease", value: -12_000 },
    { id: "damage", label: CATEGORY_META.damage.label, kind: "decrease", value: -8_000 },
    { id: "admin-error", label: CATEGORY_META["admin-error"].label, kind: "decrease", value: -6_000 },
    { id: "vendor-shortage", label: CATEGORY_META["vendor-shortage"].label, kind: "decrease", value: -5_000 },
    { id: "ending", label: "Closing inventory", kind: "total", value: 2_169_200 },
  ],
};

/** Turns a store's raw bridge inputs into steps carrying a running
 * total. The `starting` row seeds the running total; every other row
 * (except `ending`, whose figure is derived, never trusted) adds its
 * signed delta on top. This is the one place the bridge arithmetic
 * happens, so every rendered number — bars, labels, KPI cards — traces
 * back to the same computed total and can never drift from it. */
export function buildBridgeSteps(inputs: BridgeInput[]): BridgeStep[] {
  let running = 0;
  return inputs.map((step, index) => {
    const previousTotal = running;
    if (step.kind === "total") {
      running = index === 0 ? step.value : running;
    } else {
      running += step.value;
    }
    return { ...step, previousTotal, runningTotal: running };
  });
}

export function getStoreBridge(storeId: StoreId): BridgeStep[] {
  return buildBridgeSteps(STORE_BRIDGE_INPUTS[storeId]);
}

/** The two thresholds behind every status pill and progress bar on the
 * page — defined once here so the KPI row's "target ceiling" can never
 * drift from the actual healthy/watch/critical cutoffs. */
export const SHRINK_WATCH_PCT = 1.2;
export const SHRINK_CRITICAL_PCT = 2.0;

export function shrinkStatus(pct: number): ShrinkStatus {
  if (pct < SHRINK_WATCH_PCT) return "healthy";
  if (pct < SHRINK_CRITICAL_PCT) return "watch";
  return "critical";
}

export interface StoreSummary {
  opening: number;
  closing: number;
  netShrink: number;
  shrinkPct: number;
  status: ShrinkStatus;
}

export function getStoreSummary(storeId: StoreId): StoreSummary {
  const steps = getStoreBridge(storeId);
  const opening = steps[0].runningTotal;
  const closing = steps[steps.length - 1].runningTotal;
  const netShrink = closing - opening;
  const shrinkPct = round2((Math.abs(netShrink) / opening) * 100);
  return { opening, closing, netShrink, shrinkPct, status: shrinkStatus(shrinkPct) };
}

/** The category with the largest absolute loss for a store — used to
 * seed the cause spotlight with real content before anything is ever
 * pinned, rather than an empty "select a bar" placeholder. */
export function getDefaultCategory(storeId: StoreId): CategoryId {
  const steps = getStoreBridge(storeId);
  let best: CategoryId = "external-theft";
  let bestAbs = -Infinity;
  for (const step of steps) {
    if (step.kind !== "decrease") continue;
    const abs = Math.abs(step.value);
    if (abs > bestAbs) {
      bestAbs = abs;
      best = step.id as CategoryId;
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Incidents — per-store, per-category detail backing the bridge       */
/* ------------------------------------------------------------------ */

export type IncidentStatus = "open" | "resolved";

export interface Incident {
  id: string;
  storeId: StoreId;
  category: CategoryId;
  description: string;
  impact: number;
  investigator: string;
  status: IncidentStatus;
  loggedDate: string;
}

const INVESTIGATORS = [
  "Tasha Okafor",
  "Liam Brennan",
  "Priya Chandra",
  "Derek Voss",
  "Naomi Flores",
  "Marcus Webb",
  "Sofia Reyes",
  "Owen Clarke",
] as const;

const LOGGED_DATES = [
  "2026-07-03",
  "2026-07-11",
  "2026-07-19",
  "2026-07-27",
  "2026-08-04",
  "2026-08-12",
  "2026-08-20",
  "2026-08-28",
  "2026-09-05",
  "2026-09-13",
  "2026-09-21",
  "2026-09-27",
] as const;

/** Each category's two rows below sum exactly to that category's bridge
 * delta for the same store (e.g. Harbor Point's two external-theft rows
 * sum to -16,000), so the incident ledger always reconciles with the
 * waterfall it was pinned from. */
const INCIDENT_SPLITS: Record<StoreId, Record<CategoryId, [number, number]>> = {
  "harbor-point": {
    recovered: [7_000, 4_000],
    "external-theft": [-9_500, -6_500],
    "internal-theft": [-6_000, -4_500],
    damage: [-4_700, -3_500],
    "admin-error": [-3_000, -2_100],
    "vendor-shortage": [-2_600, -1_800],
  },
  "union-market": {
    recovered: [4_500, 3_000],
    "external-theft": [-10_000, -7_000],
    "internal-theft": [-7_000, -5_000],
    damage: [-4_500, -3_500],
    "admin-error": [-3_500, -2_500],
    "vendor-shortage": [-3_000, -2_000],
  },
  brightside: {
    recovered: [3_000, 2_000],
    "external-theft": [-10_500, -7_500],
    "internal-theft": [-7_000, -5_000],
    damage: [-4_500, -3_500],
    "admin-error": [-3_500, -2_500],
    "vendor-shortage": [-3_000, -2_000],
  },
  "lakeshore-depot": {
    recovered: [6_000, 3_800],
    "external-theft": [-7_000, -5_000],
    "internal-theft": [-5_000, -3_500],
    damage: [-4_000, -2_900],
    "admin-error": [-2_500, -1_700],
    "vendor-shortage": [-2_100, -1_500],
  },
  "fulton-yard": {
    recovered: [3_700, 2_500],
    "external-theft": [-9_500, -6_500],
    "internal-theft": [-7_000, -5_000],
    damage: [-4_500, -3_500],
    "admin-error": [-3_500, -2_500],
    "vendor-shortage": [-3_000, -2_000],
  },
};

const DESCRIPTION_TEMPLATES: Record<CategoryId, [string, string]> = {
  recovered: ["Recovered during scheduled cycle count", "Found misplaced inventory during restock"],
  "external-theft": ["Shoplifting incident — electronics aisle", "Shoplifting incident — apparel section"],
  "internal-theft": ["Register shortage during evening shift", "Unauthorized discount applied at checkout"],
  damage: ["Water damage to stockroom cartons", "Breakage during pallet unloading"],
  "admin-error": ["Cycle count adjustment — SKU mismatch", "Receiving log transcription error"],
  "vendor-shortage": ["Short-shipped pallet from primary vendor", "Case count mismatch on delivery manifest"],
};

function buildIncidents(): Incident[] {
  const rows: Incident[] = [];
  let seq = 0;
  let counter = 2100;
  for (const store of STORES) {
    for (const category of CATEGORY_ORDER) {
      const [a, b] = INCIDENT_SPLITS[store.id][category];
      const [descA, descB] = DESCRIPTION_TEMPLATES[category];
      const pair: [number, string][] = [
        [a, descA],
        [b, descB],
      ];
      for (const [impact, desc] of pair) {
        counter += 1;
        rows.push({
          id: `INC-${counter}`,
          storeId: store.id,
          category,
          description: `${desc} at ${store.name}.`,
          impact,
          investigator: INVESTIGATORS[seq % INVESTIGATORS.length],
          status: seq % 3 === 0 ? "resolved" : "open",
          loggedDate: LOGGED_DATES[seq % LOGGED_DATES.length],
        });
        seq += 1;
      }
    }
  }
  return rows;
}

export const INCIDENTS: Incident[] = buildIncidents();

/* ------------------------------------------------------------------ */
/* Company-wide trailing shrink rate (KPI sparkline)                   */
/* ------------------------------------------------------------------ */
/* 12 monthly closes, blended across all five locations. Deterministic
 * and hand-set — unrelated to which store is selected in the rail. */
export const COMPANY_TRAILING_SHRINK: number[] = [
  1.92, 1.88, 1.81, 1.76, 1.71, 1.68, 1.64, 1.6, 1.58, 1.55, 1.52, 1.49,
];

/* ------------------------------------------------------------------ */
/* Formatting helpers — deterministic, no Intl "compact" (hydration)   */
/* ------------------------------------------------------------------ */

const wholeUsdFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Manual compact abbreviation — never Intl's `notation: "compact"`,
 * which can render differently between the server and client ICU and
 * trigger a hydration mismatch for the same deterministic number. */
export function formatCompactUSD(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${decimalFormatter.format(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`;
  return `${sign}$${wholeUsdFormatter.format(abs)}`;
}

export function formatSignedCompactUSD(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatCompactUSD(Math.abs(value))}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatDate(iso: string): string {
  // Parsed as UTC noon to stay stable regardless of viewer timezone —
  // never reads the current date/time.
  return dateFormatter.format(new Date(`${iso}T12:00:00Z`));
}
