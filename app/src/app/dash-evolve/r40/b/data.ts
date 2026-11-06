// Calibre — supplier intelligence console.
// All figures below are fixed, hand-authored constants. No Math.random, no
// Date.now, no bare `new Date()` — every number here is deterministic so the
// page renders identically on every pass (server, client, re-render).

export type AxisId =
  | "price"
  | "leadTime"
  | "quality"
  | "reliability"
  | "support"
  | "sustainability";

export interface AxisDef {
  id: AxisId;
  /** Full label, used in the data table header and tooltips. */
  label: string;
  /** Short label, used at the radar spoke tip. */
  shortLabel: string;
  /** One line describing which direction is better, for the drawer. */
  description: string;
}

// Order here is also the radar's clockwise spoke order, starting at 12 o'clock.
export const AXES: AxisDef[] = [
  {
    id: "price",
    label: "Price Competitiveness",
    shortLabel: "Price",
    description: "Unit cost relative to the category's negotiated benchmark band.",
  },
  {
    id: "leadTime",
    label: "Lead Time",
    shortLabel: "Lead Time",
    description: "Speed from purchase order to dock delivery, scored against target.",
  },
  {
    id: "quality",
    label: "Quality Score",
    shortLabel: "Quality",
    description: "Inbound inspection pass rate across the last four audit cycles.",
  },
  {
    id: "reliability",
    label: "Reliability",
    shortLabel: "Reliability",
    description: "On-time-in-full rate across all purchase orders this fiscal year.",
  },
  {
    id: "support",
    label: "Support SLA",
    shortLabel: "Support",
    description: "Ticket response and resolution time against the contracted SLA.",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    shortLabel: "Sustainability",
    description: "Verified environmental and labor compliance rating.",
  },
];

// Weights sum to exactly 1 — used for the composite score shown as the
// chart's always-visible headline readout.
export const AXIS_WEIGHTS: Record<AxisId, number> = {
  price: 0.2,
  leadTime: 0.15,
  quality: 0.25,
  reliability: 0.2,
  support: 0.1,
  sustainability: 0.1,
};

// Fixed industry reference band per axis (10th/90th percentile of this
// category's supplier pool last quarter). Used only to compute the
// "Percentile Rank" view — a deterministic linear remap, not a statistic
// drawn from the three suppliers shown here.
export const AXIS_BENCHMARKS: Record<AxisId, { min: number; max: number }> = {
  price: { min: 40, max: 95 },
  leadTime: { min: 35, max: 95 },
  quality: { min: 50, max: 95 },
  reliability: { min: 45, max: 95 },
  support: { min: 40, max: 90 },
  sustainability: { min: 30, max: 85 },
};

export type VendorId = "meridian" | "atlas" | "kestrel";

export type MarkerShape = "circle" | "square" | "triangle";
export type StrokeStyle = "solid" | "dashed" | "dotted";

export interface VendorDef {
  id: VendorId;
  name: string;
  shortName: string;
  initials: string;
  category: string;
  status: "Preferred" | "Secondary" | "Approved";
  relationshipYears: number;
  marker: MarkerShape;
  stroke: StrokeStyle;
  scores: Record<AxisId, number>;
  /** Composite score history, last six quarterly evaluation cycles, oldest first. */
  trend: number[];
  note: string;
}

export const VENDORS: VendorDef[] = [
  {
    id: "meridian",
    name: "Meridian Components Co.",
    shortName: "Meridian Components",
    initials: "MC",
    category: "Precision fasteners",
    status: "Preferred",
    relationshipYears: 6,
    marker: "circle",
    stroke: "solid",
    scores: {
      price: 72,
      leadTime: 68,
      quality: 88,
      reliability: 84,
      support: 76,
      sustainability: 61,
    },
    trend: [71, 73, 74, 76, 75, 77],
    note: "Primary approved vendor for FY26 Q4. Renewal window opens in November.",
  },
  {
    id: "atlas",
    name: "Atlas Fabrication Group",
    shortName: "Atlas Fabrication",
    initials: "AF",
    category: "Precision fasteners",
    status: "Secondary",
    relationshipYears: 2,
    marker: "square",
    stroke: "dashed",
    scores: {
      price: 85,
      leadTime: 58,
      quality: 74,
      reliability: 70,
      support: 65,
      sustainability: 54,
    },
    trend: [68, 69, 67, 70, 69, 70],
    note: "Backup vendor; fastest unit cost in the category at a quality trade-off.",
  },
  {
    id: "kestrel",
    name: "Kestrel Supply Partners",
    shortName: "Kestrel Supply",
    initials: "KS",
    category: "Precision fasteners",
    status: "Preferred",
    relationshipYears: 4,
    marker: "triangle",
    stroke: "dotted",
    scores: {
      price: 64,
      leadTime: 91,
      quality: 79,
      reliability: 88,
      support: 82,
      sustainability: 73,
    },
    trend: [74, 75, 77, 78, 78, 79],
    note: "Preferred for sustainability-sensitive programs; longest on-time streak.",
  },
];

export const WORKSPACE_LABEL = "Hardware Sourcing · Precision Fasteners";
export const WORKSPACES = [WORKSPACE_LABEL, "Packaging · Contract Manufacturing"];

export const CURRENT_USER = {
  name: "Priya Shah",
  role: "Senior Sourcing Analyst",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&q=80",
};

export const DEFAULT_VENDOR_ID: VendorId = "meridian";
