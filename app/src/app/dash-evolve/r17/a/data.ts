/**
 * Backhaul — deterministic dummy data for the returns & refurbishment recovery pipeline.
 *
 * No Math.random / Date.now / bare new Date() anywhere. The single "now" anchor is one fixed UTC
 * literal, and every hourly/daily wiggle in the trend series comes from a fixed two-term sine of
 * the point index, so re-running this module always yields the identical numbers.
 *
 * RECONCILIATION BY CONSTRUCTION. The funnel is never hand-typed as entered/converted/dropped
 * triples — that shape lets the three numbers drift apart under editing. Instead each period seeds
 * ONE volume (units entering stage 1) plus a per-stage list of drop-off reason counts, and
 * `buildStages()` walks the pipeline: dropped = sum(reasons), converted = entered - dropped, and
 * the next stage's entered IS the previous stage's converted. It is therefore impossible for the
 * funnel band, the stage ledger table, the drop-off breakdown and the headline recovery rate to
 * disagree — they all read the same derived object.
 *
 * The held-unit records use the same discipline: `dwellHours` is the only authored field, and both
 * the SLA state (against the stage's hold SLA) and the period membership (a unit belongs to the
 * 7/30/90-day window if it has been held for fewer than that many days) are derived from it.
 */

import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Layers,
  ListChecks,
  PackageCheck,
  PackageSearch,
  Recycle,
  ScanBarcode,
  Settings2,
  ShieldCheck,
  Tags,
  Truck,
  Wrench,
} from "lucide-react";
import type { SlaState } from "./tokens";

/* ------------------------------------------------------------------- Brand */

export const BRAND = {
  name: "Backhaul",
  tagline: "Returns & refurbishment operations",
};

/** Fictional persona — never real operator data. */
export const CURRENT_USER = {
  name: "Marisol Vance",
  role: "Returns Ops Manager",
  email: "marisol.vance@backhaul.io",
  avatarId: "1494790108377-be9c29b29330",
};

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "ws-na", name: "Cassiel NA Returns", plan: "Enterprise plan" },
  { id: "ws-emea", name: "Cassiel EMEA Returns", plan: "Enterprise plan" },
  { id: "ws-sandbox", name: "Grading Sandbox", plan: "Trial workspace" },
];

/* --------------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "operations",
    title: "Operations",
    items: [
      { id: "pipeline", label: "Recovery pipeline", Icon: Layers, active: true },
      { id: "intake", label: "Intake queue", Icon: PackageSearch },
      { id: "bench", label: "Inspection bench", Icon: ClipboardCheck },
      { id: "workorders", label: "Refurb work orders", Icon: Wrench },
      { id: "dispositions", label: "Dispositions", Icon: Recycle, disabled: true },
    ],
  },
  {
    id: "inventory",
    title: "Inventory",
    items: [
      { id: "sellable", label: "Sellable stock", Icon: Boxes },
      { id: "parts", label: "Parts harvest", Icon: Settings2, disabled: true },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "recovery", label: "Recovery reports", Icon: Gauge },
      { id: "reasons", label: "Reason codes", Icon: ListChecks },
      { id: "sla", label: "SLA breaches", Icon: ShieldCheck, disabled: true },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Inspection bench 2 is 41 units over its daily target.", time: "18 min ago" },
  { id: "n2", text: "Halcyon Retail raised 3 grade appeals on Aurora Pad 11.", time: "1 h ago" },
  { id: "n3", text: "Battery stock for Solace Phone 9 covers 2 more days of refurb.", time: "4 h ago" },
];

/* ------------------------------------------------------------------ Periods */

export type PeriodId = "7d" | "30d" | "90d";

export type Period = { id: PeriodId; label: string; longLabel: string; days: number };

export const PERIODS: Period[] = [
  { id: "7d", label: "7D", longLabel: "Last 7 days", days: 7 },
  { id: "30d", label: "30D", longLabel: "Last 30 days", days: 30 },
  { id: "90d", label: "90D", longLabel: "Last 90 days", days: 90 },
];

export const DEFAULT_PERIOD: PeriodId = "30d";

/* ------------------------------------------------------------------- Stages */

export type StageId = "requested" | "authorized" | "received" | "inspected" | "refurbished" | "restocked";

export const DEFAULT_STAGE: StageId = "inspected";

type StageMeta = {
  id: StageId;
  name: string;
  short: string;
  blurb: string;
  Icon: LucideIcon;
  /** Hours a held exception may sit in this stage before it breaches the operations SLA. */
  holdSlaHours: number;
};

export const STAGE_META: StageMeta[] = [
  {
    id: "requested",
    name: "Return requested",
    short: "Requested",
    blurb: "A merchant or end customer files an RMA against a serial number.",
    Icon: FileSearch,
    holdSlaHours: 72,
  },
  {
    id: "authorized",
    name: "Label issued",
    short: "Labelled",
    blurb: "Authorised returns get a prepaid label and a ten-day shipping window.",
    Icon: Truck,
    holdSlaHours: 240,
  },
  {
    id: "received",
    name: "Received at hub",
    short: "Received",
    blurb: "The parcel lands on the dock, is scanned, and its serial is matched to the RMA.",
    Icon: ScanBarcode,
    holdSlaHours: 96,
  },
  {
    id: "inspected",
    name: "Inspection & grade",
    short: "Inspected",
    blurb: "Bench inspection assigns a cosmetic grade and a functional verdict.",
    Icon: ClipboardCheck,
    holdSlaHours: 168,
  },
  {
    id: "refurbished",
    name: "Refurb & retest",
    short: "Refurbished",
    blurb: "Work orders repair, reflash and retest each unit against its grade target.",
    Icon: Wrench,
    holdSlaHours: 336,
  },
  {
    id: "restocked",
    name: "Restocked",
    short: "Restocked",
    blurb: "Graded units re-enter sellable inventory carrying a refurbished warranty tag.",
    Icon: PackageCheck,
    holdSlaHours: 120,
  },
];

export const STAGE_META_BY_ID: Record<StageId, StageMeta> = STAGE_META.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<StageId, StageMeta>,
);

/* --------------------------------------------------- Period seeds (authored) */

type ReasonSeed = { id: string; label: string; count: number };

type PeriodSeed = {
  /** Units entering stage 1 during the window. Every other volume is derived from this. */
  entered: number;
  /** Change in intake volume against the previous window of the same length, in percent. */
  intakeDeltaPct: number;
  drops: Record<StageId, ReasonSeed[]>;
};

const SEEDS: Record<PeriodId, PeriodSeed> = {
  "7d": {
    entered: 4286,
    intakeDeltaPct: 4.1,
    drops: {
      requested: [
        { id: "window", label: "Outside return window", count: 268 },
        { id: "nonreturnable", label: "Non-returnable SKU", count: 111 },
        { id: "duplicate", label: "Duplicate request", count: 74 },
        { id: "withdrawn", label: "Withdrawn by customer", count: 97 },
      ],
      authorized: [
        { id: "expired", label: "Label expired unused", count: 279 },
        { id: "kept", label: "Kept by customer", count: 138 },
        { id: "lost", label: "Lost in transit", count: 61 },
      ],
      received: [
        { id: "wrongitem", label: "Wrong item shipped", count: 141 },
        { id: "serial", label: "Serial mismatch", count: 96 },
        { id: "parcel", label: "Empty or crushed parcel", count: 72 },
      ],
      inspected: [
        { id: "liquid", label: "Liquid ingress", count: 196 },
        { id: "battery", label: "Battery health under 80%", count: 174 },
        { id: "board", label: "Board-level fault", count: 129 },
        { id: "accessories", label: "Missing accessories", count: 88 },
        { id: "cosmetic", label: "Cosmetic grade F", count: 55 },
      ],
      refurbished: [
        { id: "costcap", label: "Repair cost over cap", count: 92 },
        { id: "retest", label: "Failed post-repair test", count: 74 },
        { id: "parts", label: "Parts unavailable", count: 38 },
      ],
      restocked: [],
    },
  },
  "30d": {
    entered: 18420,
    intakeDeltaPct: 6.2,
    drops: {
      requested: [
        { id: "window", label: "Outside return window", count: 1142 },
        { id: "nonreturnable", label: "Non-returnable SKU", count: 486 },
        { id: "duplicate", label: "Duplicate request", count: 318 },
        { id: "withdrawn", label: "Withdrawn by customer", count: 416 },
      ],
      authorized: [
        { id: "expired", label: "Label expired unused", count: 1208 },
        { id: "kept", label: "Kept by customer", count: 604 },
        { id: "lost", label: "Lost in transit", count: 272 },
      ],
      received: [
        { id: "wrongitem", label: "Wrong item shipped", count: 612 },
        { id: "serial", label: "Serial mismatch", count: 431 },
        { id: "parcel", label: "Empty or crushed parcel", count: 325 },
      ],
      inspected: [
        { id: "liquid", label: "Liquid ingress", count: 894 },
        { id: "battery", label: "Battery health under 80%", count: 741 },
        { id: "board", label: "Board-level fault", count: 563 },
        { id: "accessories", label: "Missing accessories", count: 358 },
        { id: "cosmetic", label: "Cosmetic grade F", count: 240 },
      ],
      refurbished: [
        { id: "costcap", label: "Repair cost over cap", count: 402 },
        { id: "retest", label: "Failed post-repair test", count: 311 },
        { id: "parts", label: "Parts unavailable", count: 165 },
      ],
      restocked: [],
    },
  },
  "90d": {
    entered: 54910,
    intakeDeltaPct: -2.8,
    drops: {
      requested: [
        { id: "window", label: "Outside return window", count: 3402 },
        { id: "nonreturnable", label: "Non-returnable SKU", count: 1446 },
        { id: "duplicate", label: "Duplicate request", count: 967 },
        { id: "withdrawn", label: "Withdrawn by customer", count: 1238 },
      ],
      authorized: [
        { id: "expired", label: "Label expired unused", count: 3588 },
        { id: "kept", label: "Kept by customer", count: 1802 },
        { id: "lost", label: "Lost in transit", count: 812 },
      ],
      received: [
        { id: "wrongitem", label: "Wrong item shipped", count: 1824 },
        { id: "serial", label: "Serial mismatch", count: 1287 },
        { id: "parcel", label: "Empty or crushed parcel", count: 962 },
      ],
      inspected: [
        { id: "liquid", label: "Liquid ingress", count: 2671 },
        { id: "battery", label: "Battery health under 80%", count: 2204 },
        { id: "board", label: "Board-level fault", count: 1682 },
        { id: "accessories", label: "Missing accessories", count: 1073 },
        { id: "cosmetic", label: "Cosmetic grade F", count: 718 },
      ],
      refurbished: [
        { id: "costcap", label: "Repair cost over cap", count: 1203 },
        { id: "retest", label: "Failed post-repair test", count: 934 },
        { id: "parts", label: "Parts unavailable", count: 492 },
      ],
      restocked: [],
    },
  },
};

/* ------------------------------------------------------- Derived stage model */

export type DropReason = {
  id: string;
  label: string;
  count: number;
  /** Share of this stage's total drop-off, in percent. */
  shareOfDropPct: number;
};

export type Stage = StageMeta & {
  index: number;
  entered: number;
  dropped: number;
  converted: number;
  /** converted / entered, in percent. */
  passRatePct: number;
  /** dropped / entered, in percent. */
  dropRatePct: number;
  /** entered / (units entering stage 1), in percent — drives the funnel band height. */
  shareOfIntakePct: number;
  reasons: DropReason[];
};

export type Pipeline = {
  period: Period;
  stages: Stage[];
  intake: number;
  intakeDeltaPct: number;
  restocked: number;
  /** restocked / intake, in percent — the end-to-end recovery rate. */
  recoveryPct: number;
  totalDropped: number;
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildPipeline(periodId: PeriodId): Pipeline {
  const period = PERIODS.find((p) => p.id === periodId) as Period;
  const seed = SEEDS[periodId];
  const intake = seed.entered;

  let entered = intake;
  const stages: Stage[] = STAGE_META.map((meta, index) => {
    const seeds = seed.drops[meta.id];
    const dropped = seeds.reduce((sum, r) => sum + r.count, 0);
    const converted = entered - dropped;
    const stage: Stage = {
      ...meta,
      index,
      entered,
      dropped,
      converted,
      passRatePct: round1((converted / entered) * 100),
      dropRatePct: round1((dropped / entered) * 100),
      shareOfIntakePct: round1((entered / intake) * 100),
      reasons: seeds
        .map((r) => ({ ...r, shareOfDropPct: dropped === 0 ? 0 : round1((r.count / dropped) * 100) }))
        .sort((a, b) => b.count - a.count),
    };
    entered = converted;
    return stage;
  });

  const restocked = stages[stages.length - 1].converted;
  return {
    period,
    stages,
    intake,
    intakeDeltaPct: seed.intakeDeltaPct,
    restocked,
    recoveryPct: round1((restocked / intake) * 100),
    totalDropped: intake - restocked,
  };
}

export const PIPELINES: Record<PeriodId, Pipeline> = {
  "7d": buildPipeline("7d"),
  "30d": buildPipeline("30d"),
  "90d": buildPipeline("90d"),
};

/* ------------------------------------------------------------ Trend series */

/** The one fixed clock in this module. A literal argument keeps it deterministic. */
const ANCHOR_MS = new Date("2026-08-20T00:00:00Z").getTime();
const DAY_MS = 86_400_000;

const POINT_COUNT: Record<PeriodId, number> = { "7d": 7, "30d": 15, "90d": 13 };
const POINT_STEP_DAYS: Record<PeriodId, number> = { "7d": 1, "30d": 2, "90d": 7 };

const DATE_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export type TrendPoint = {
  label: string;
  /** Selected stage's pass-through rate at this point, in percent. */
  stagePct: number;
  /** End-to-end recovery rate at this point, in percent. */
  overallPct: number;
};

/** Fixed two-term sine — a pure function of the point index, so the series never drifts. */
function wiggle(i: number, phase: number, amp: number): number {
  return amp * Math.sin(i * 0.85 + phase) + amp * 0.45 * Math.sin(i * 1.93 + phase * 1.7);
}

/** Builds a series whose mean is exactly `base`, so the chart average always equals the funnel rate. */
function meanLockedSeries(n: number, base: number, phase: number, amp: number): number[] {
  const raw = Array.from({ length: n }, (_, i) => wiggle(i, phase, amp));
  const mean = raw.reduce((a, b) => a + b, 0) / n;
  return raw.map((v) => base + (v - mean));
}

export function buildTrend(periodId: PeriodId, stageId: StageId): TrendPoint[] {
  const pipeline = PIPELINES[periodId];
  const stage = pipeline.stages.find((s) => s.id === stageId) as Stage;
  const n = POINT_COUNT[periodId];
  const step = POINT_STEP_DAYS[periodId];
  const phase = stage.index * 1.31 + 0.4;
  const stageSeries = meanLockedSeries(n, stage.passRatePct, phase, stage.id === "restocked" ? 0 : 2.3);
  const overallSeries = meanLockedSeries(n, pipeline.recoveryPct, 0.9, 1.6);

  return Array.from({ length: n }, (_, i) => {
    const ms = ANCHOR_MS - (n - 1 - i) * step * DAY_MS;
    return {
      label: DATE_FMT.format(new Date(ms)),
      stagePct: round1(stageSeries[i]),
      overallPct: round1(overallSeries[i]),
    };
  });
}

/* -------------------------------------------------------------- Held units */

export type UnitRecord = {
  id: string;
  stage: StageId;
  model: string;
  sku: string;
  merchant: string;
  /** The only authored time field — SLA state and window membership are both derived from it. */
  dwellHours: number;
  valueUsd: number;
  holdReason: string;
  owner: string;
};

export type UnitRow = UnitRecord & { sla: SlaState; heldDays: number };

type UnitSeed = [id: string, model: string, sku: string, merchant: string, dwellHours: number, valueUsd: number, holdReason: string, owner: string];

const UNIT_SEEDS: Record<StageId, UnitSeed[]> = {
  requested: [
    ["RMA-48213", "Aurora Pad 11", "AP11-128-SLT", "Halcyon Retail", 11, 289, "Merchant approval", "R. Idowu"],
    ["RMA-48197", "Solace Phone 9", "SP9-256-OBS", "Northgate Wireless", 26, 412, "Address unverified", "T. Halvard"],
    ["RMA-48154", "Cobalt Buds 2", "CB2-STD-IVY", "Verity Direct", 38, 74, "Duplicate review", "R. Idowu"],
    ["RMA-48102", "Meridian Book 14", "MB14-512-GRA", "Ashcombe Group", 57, 968, "Merchant approval", "P. Okonjo"],
    ["RMA-48061", "Kestrel Router 6E", "KR6E-AX-WHT", "Lindale Mobile", 69, 138, "Warranty file gap", "S. Brenner"],
    ["RMA-47988", "Aurora Pad 11 Pro", "AP11P-256-SLT", "Halcyon Retail", 88, 604, "Address unverified", "T. Halvard"],
    ["RMA-47903", "Cobalt Watch S", "CWS-41-MID", "Portmere Outlet", 121, 226, "Merchant approval", "P. Okonjo"],
    ["RMA-47844", "Solace Phone 9 Mini", "SP9M-128-CLY", "Verity Direct", 214, 331, "Warranty file gap", "S. Brenner"],
    ["RMA-47610", "Meridian Book 14", "MB14-256-GRA", "Ashcombe Group", 812, 902, "Duplicate review", "R. Idowu"],
  ],
  authorized: [
    ["RMA-47921", "Cobalt Buds 2", "CB2-STD-ONX", "Lindale Mobile", 34, 68, "Carrier scan missing", "T. Halvard"],
    ["RMA-47899", "Solace Phone 9", "SP9-128-OBS", "Halcyon Retail", 72, 366, "Label unused 10 d+", "P. Okonjo"],
    ["RMA-47855", "Aurora Pad 11", "AP11-64-SLT", "Portmere Outlet", 118, 241, "Carrier scan missing", "R. Idowu"],
    ["RMA-47790", "Kestrel Router 6E", "KR6E-AX-BLK", "Verity Direct", 163, 124, "Label unused 10 d+", "S. Brenner"],
    ["RMA-47702", "Meridian Book 14", "MB14-512-SLT", "Ashcombe Group", 205, 1044, "Pickup window missed", "T. Halvard"],
    ["RMA-47654", "Cobalt Watch S", "CWS-45-MID", "Northgate Wireless", 268, 254, "Label unused 10 d+", "P. Okonjo"],
    ["RMA-47588", "Aurora Pad 11 Pro", "AP11P-512-GRA", "Halcyon Retail", 341, 712, "Carrier scan missing", "R. Idowu"],
    ["RMA-47401", "Solace Phone 9 Mini", "SP9M-256-CLY", "Lindale Mobile", 596, 288, "Pickup window missed", "S. Brenner"],
    ["RMA-47188", "Cobalt Buds 2", "CB2-PRO-IVY", "Verity Direct", 1004, 96, "Label unused 10 d+", "T. Halvard"],
  ],
  received: [
    ["RMA-48244", "Solace Phone 9", "SP9-256-CLY", "Halcyon Retail", 9, 398, "Dock exception", "S. Brenner"],
    ["RMA-48231", "Aurora Pad 11", "AP11-128-GRA", "Verity Direct", 21, 276, "Barcode unreadable", "R. Idowu"],
    ["RMA-48208", "Cobalt Watch S", "CWS-41-ONX", "Portmere Outlet", 44, 219, "Serial lookup", "P. Okonjo"],
    ["RMA-48166", "Meridian Book 14", "MB14-256-SLT", "Northgate Wireless", 63, 884, "Dock exception", "T. Halvard"],
    ["RMA-48120", "Kestrel Router 6E", "KR6E-AX-WHT", "Ashcombe Group", 88, 131, "Barcode unreadable", "S. Brenner"],
    ["RMA-48044", "Aurora Pad 11 Pro", "AP11P-256-OBS", "Halcyon Retail", 112, 668, "Serial lookup", "R. Idowu"],
    ["RMA-47962", "Cobalt Buds 2", "CB2-PRO-ONX", "Lindale Mobile", 149, 92, "Dock exception", "P. Okonjo"],
    ["RMA-47810", "Solace Phone 9 Mini", "SP9M-128-OBS", "Verity Direct", 372, 302, "Serial lookup", "T. Halvard"],
    ["RMA-47522", "Meridian Book 14", "MB14-512-GRA", "Ashcombe Group", 918, 1012, "Barcode unreadable", "S. Brenner"],
  ],
  inspected: [
    ["RMA-48190", "Aurora Pad 11", "AP11-128-SLT", "Halcyon Retail", 19, 264, "Second opinion", "P. Okonjo"],
    ["RMA-48173", "Solace Phone 9", "SP9-128-OBS", "Lindale Mobile", 34, 341, "Teardown bench queue", "R. Idowu"],
    ["RMA-48141", "Cobalt Watch S", "CWS-45-IVY", "Verity Direct", 63, 238, "Grade appeal", "T. Halvard"],
    ["RMA-48099", "Meridian Book 14", "MB14-512-SLT", "Ashcombe Group", 97, 941, "Second opinion", "S. Brenner"],
    ["RMA-48058", "Aurora Pad 11 Pro", "AP11P-256-GRA", "Halcyon Retail", 128, 726, "Grade appeal", "P. Okonjo"],
    ["RMA-48012", "Kestrel Router 6E", "KR6E-AX-BLK", "Northgate Wireless", 151, 118, "Teardown bench queue", "R. Idowu"],
    ["RMA-47934", "Cobalt Buds 2", "CB2-STD-ONX", "Portmere Outlet", 206, 71, "Grade appeal", "T. Halvard"],
    ["RMA-47871", "Solace Phone 9 Mini", "SP9M-256-CLY", "Verity Direct", 389, 297, "Second opinion", "S. Brenner"],
    ["RMA-47716", "Aurora Pad 11", "AP11-64-OBS", "Lindale Mobile", 812, 208, "Teardown bench queue", "P. Okonjo"],
    ["RMA-47455", "Meridian Book 14", "MB14-256-GRA", "Ashcombe Group", 1104, 856, "Grade appeal", "R. Idowu"],
  ],
  refurbished: [
    ["RMA-48087", "Solace Phone 9", "SP9-256-OBS", "Halcyon Retail", 41, 356, "Retest queue", "T. Halvard"],
    ["RMA-48033", "Aurora Pad 11", "AP11-128-GRA", "Verity Direct", 96, 271, "Part backordered", "S. Brenner"],
    ["RMA-47995", "Cobalt Buds 2", "CB2-PRO-IVY", "Portmere Outlet", 158, 88, "Cost approval", "P. Okonjo"],
    ["RMA-47948", "Meridian Book 14", "MB14-512-SLT", "Ashcombe Group", 224, 962, "Part backordered", "R. Idowu"],
    ["RMA-47902", "Kestrel Router 6E", "KR6E-AX-WHT", "Northgate Wireless", 289, 126, "Retest queue", "T. Halvard"],
    ["RMA-47837", "Aurora Pad 11 Pro", "AP11P-512-SLT", "Halcyon Retail", 358, 748, "Cost approval", "S. Brenner"],
    ["RMA-47764", "Cobalt Watch S", "CWS-41-MID", "Lindale Mobile", 442, 231, "Part backordered", "P. Okonjo"],
    ["RMA-47598", "Solace Phone 9 Mini", "SP9M-128-CLY", "Verity Direct", 688, 284, "Retest queue", "R. Idowu"],
    ["RMA-47302", "Meridian Book 14", "MB14-256-OBS", "Ashcombe Group", 1246, 878, "Part backordered", "T. Halvard"],
  ],
  restocked: [
    ["RMA-48221", "Aurora Pad 11", "AP11-128-SLT", "Halcyon Retail", 16, 311, "Listing photos", "R. Idowu"],
    ["RMA-48185", "Cobalt Buds 2", "CB2-STD-IVY", "Portmere Outlet", 38, 96, "Warehouse slotting", "P. Okonjo"],
    ["RMA-48147", "Solace Phone 9", "SP9-128-CLY", "Lindale Mobile", 74, 384, "Price approval", "T. Halvard"],
    ["RMA-48096", "Meridian Book 14", "MB14-512-GRA", "Ashcombe Group", 101, 1008, "Listing photos", "S. Brenner"],
    ["RMA-48027", "Kestrel Router 6E", "KR6E-AX-BLK", "Verity Direct", 133, 142, "Warehouse slotting", "R. Idowu"],
    ["RMA-47969", "Aurora Pad 11 Pro", "AP11P-256-SLT", "Halcyon Retail", 187, 792, "Price approval", "P. Okonjo"],
    ["RMA-47881", "Cobalt Watch S", "CWS-45-ONX", "Northgate Wireless", 262, 248, "Listing photos", "T. Halvard"],
    ["RMA-47733", "Solace Phone 9 Mini", "SP9M-256-OBS", "Verity Direct", 508, 306, "Warehouse slotting", "S. Brenner"],
    ["RMA-47466", "Aurora Pad 11", "AP11-64-GRA", "Lindale Mobile", 942, 214, "Price approval", "R. Idowu"],
  ],
};

function slaFor(dwellHours: number, slaHours: number): SlaState {
  if (dwellHours > slaHours) return "breached";
  if (dwellHours > slaHours * 0.75) return "at-risk";
  return "on-track";
}

function buildUnits(stageId: StageId): UnitRow[] {
  const meta = STAGE_META_BY_ID[stageId];
  return UNIT_SEEDS[stageId].map(([id, model, sku, merchant, dwellHours, valueUsd, holdReason, owner]) => ({
    id,
    stage: stageId,
    model,
    sku,
    merchant,
    dwellHours,
    valueUsd,
    holdReason,
    owner,
    sla: slaFor(dwellHours, meta.holdSlaHours),
    heldDays: Math.ceil(dwellHours / 24),
  }));
}

export const UNITS_BY_STAGE: Record<StageId, UnitRow[]> = STAGE_META.reduce(
  (acc, s) => {
    acc[s.id] = buildUnits(s.id);
    return acc;
  },
  {} as Record<StageId, UnitRow[]>,
);

/** Held units are scoped to the active window by how long they have been held. */
export function unitsFor(stageId: StageId, periodId: PeriodId): UnitRow[] {
  const days = (PERIODS.find((p) => p.id === periodId) as Period).days;
  return UNITS_BY_STAGE[stageId].filter((u) => u.heldDays <= days);
}

/* ------------------------------------------------------------ Dwell buckets */

export type DwellBucket = { id: string; label: string; count: number; maxHours: number };

const BUCKET_DEFS: { id: string; label: string; maxHours: number }[] = [
  { id: "b1", label: "Under 24 h", maxHours: 24 },
  { id: "b2", label: "1 – 3 days", maxHours: 72 },
  { id: "b3", label: "3 – 7 days", maxHours: 168 },
  { id: "b4", label: "Over 7 days", maxHours: Number.POSITIVE_INFINITY },
];

/** Buckets are counted from the very rows the table shows, so the two can never disagree. */
export function dwellBuckets(units: UnitRow[]): DwellBucket[] {
  return BUCKET_DEFS.map((def, i) => {
    const min = i === 0 ? 0 : BUCKET_DEFS[i - 1].maxHours;
    return { ...def, count: units.filter((u) => u.dwellHours > min && u.dwellHours <= def.maxHours).length };
  });
}

/* ------------------------------------------------------------- Palette jumps */

export const QUICK_JUMPS: { id: string; label: string; targetId: string; Icon: LucideIcon }[] = [
  { id: "j-funnel", label: "Recovery funnel", targetId: "funnel-card", Icon: Layers },
  { id: "j-ledger", label: "Stage ledger table", targetId: "ledger-card", Icon: ListChecks },
  { id: "j-trend", label: "Conversion trend", targetId: "trend-card", Icon: Gauge },
  { id: "j-reasons", label: "Drop-off breakdown", targetId: "inspector-card", Icon: Tags },
  { id: "j-units", label: "Held units", targetId: "units-card", Icon: PackageSearch },
];

/* --------------------------------------------------------------- Formatting */

const INT_FMT = new Intl.NumberFormat("en-US");
const USD_FMT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function fmtInt(n: number): string {
  return INT_FMT.format(n);
}

export function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function fmtUsd(n: number): string {
  return USD_FMT.format(n);
}

export function fmtDwell(hours: number): string {
  if (hours < 48) return `${hours} h`;
  return `${Math.floor(hours / 24)} d ${hours % 24} h`;
}

export function fmtSigned(n: number): string {
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}%`;
}
