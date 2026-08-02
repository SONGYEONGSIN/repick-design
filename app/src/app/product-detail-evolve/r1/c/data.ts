// Deterministic dummy data for the Torvex LA-640 series product-detail page.
// No Math.random / Date.now / new Date() anywhere in this module — every value below is a fixed
// literal so the page hydrates identically on server and client.

export type VariantId = "050" | "100" | "150" | "200" | "300";

export interface Variant {
  id: VariantId;
  sku: string;
  strokeMm: number;
  priceUsd: number;
  maxLoadN: number;
  maxStaticLoadN: number;
  maxSpeedMms: number;
  weightKg: number;
  leadTimeDays: number;
}

export const VARIANTS: Variant[] = [
  { id: "050", sku: "LA-640-050", strokeMm: 50, priceUsd: 284, maxLoadN: 620, maxStaticLoadN: 990, maxSpeedMms: 220, weightKg: 1.8, leadTimeDays: 5 },
  { id: "100", sku: "LA-640-100", strokeMm: 100, priceUsd: 312, maxLoadN: 590, maxStaticLoadN: 945, maxSpeedMms: 210, weightKg: 2.1, leadTimeDays: 5 },
  { id: "150", sku: "LA-640-150", strokeMm: 150, priceUsd: 349, maxLoadN: 560, maxStaticLoadN: 895, maxSpeedMms: 200, weightKg: 2.4, leadTimeDays: 7 },
  { id: "200", sku: "LA-640-200", strokeMm: 200, priceUsd: 391, maxLoadN: 530, maxStaticLoadN: 850, maxSpeedMms: 190, weightKg: 2.7, leadTimeDays: 7 },
  { id: "300", sku: "LA-640-300", strokeMm: 300, priceUsd: 468, maxLoadN: 470, maxStaticLoadN: 750, maxSpeedMms: 175, weightKg: 3.3, leadTimeDays: 10 },
];

export const DEFAULT_VARIANT_ID: VariantId = "150";

export function getVariant(id: VariantId): Variant {
  return VARIANTS.find((v) => v.id === id) ?? VARIANTS[2];
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// Specification sheet — four groups. Mechanical rows depend on the selected
// variant; the other three are shared across the whole LA-640 family (same
// motor, connector and enclosure regardless of stroke length).
// ---------------------------------------------------------------------------

export interface SpecRow {
  id: string;
  label: string;
  value: string;
  /** Present when the row is numeric and therefore diffable in compare mode. */
  numeric?: number;
  unit?: string;
}

export interface SpecGroup {
  id: string;
  title: string;
  rows: SpecRow[];
}

export function buildSpecGroups(v: Variant): SpecGroup[] {
  return [
    {
      id: "mechanical",
      title: "Mechanical",
      rows: [
        { id: "stroke", label: "Stroke length", value: `${v.strokeMm} mm`, numeric: v.strokeMm, unit: "mm" },
        { id: "max-load", label: "Max dynamic load", value: `${formatInt(v.maxLoadN)} N`, numeric: v.maxLoadN, unit: "N" },
        { id: "max-static", label: "Max static load", value: `${formatInt(v.maxStaticLoadN)} N`, numeric: v.maxStaticLoadN, unit: "N" },
        { id: "max-speed", label: "Max speed", value: `${v.maxSpeedMms} mm/s`, numeric: v.maxSpeedMms, unit: "mm/s" },
        { id: "repeatability", label: "Repeatability", value: "±0.02 mm" },
        { id: "duty-cycle", label: "Duty cycle", value: "25% @ 25°C ambient" },
        { id: "weight", label: "Weight", value: `${v.weightKg.toFixed(1)} kg`, numeric: v.weightKg, unit: "kg" },
        { id: "housing", label: "Housing material", value: "Hard-anodized 6061 aluminum" },
        { id: "mounting", label: "Mounting", value: "Clevis + trunnion, M8 threaded rear" },
      ],
    },
    {
      id: "electrical",
      title: "Electrical",
      rows: [
        { id: "motor", label: "Motor type", value: "24V DC brushless" },
        { id: "voltage", label: "Rated voltage", value: "24V DC (±10%)" },
        { id: "current", label: "Rated current", value: "3.2 A continuous / 6.5 A peak" },
        { id: "power", label: "Power, continuous", value: "77 W", numeric: 77, unit: "W" },
        { id: "connector", label: "Connector", value: "M12, 5-pin circular" },
        { id: "feedback", label: "Position feedback", value: "Integrated Hall-effect encoder, 0.05 mm resolution" },
      ],
    },
    {
      id: "environmental",
      title: "Environmental",
      rows: [
        { id: "temp", label: "Operating temperature", value: "-20°C to 65°C" },
        { id: "ip", label: "Ingress protection", value: "IP65" },
        { id: "vibration", label: "Vibration resistance", value: "5G random, IEC 60068-2-64" },
        { id: "humidity", label: "Humidity range", value: "10-95% RH, non-condensing" },
      ],
    },
    {
      id: "certifications",
      title: "Certifications",
      rows: [
        { id: "ce", label: "CE", value: "Certified" },
        { id: "ul", label: "UL 60730-1", value: "Recognized" },
        { id: "rohs", label: "RoHS 3", value: "Compliant" },
        { id: "reach", label: "REACH", value: "Compliant" },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Media gallery
// ---------------------------------------------------------------------------

export interface MediaItem {
  id: string;
  label: string;
  seed: string;
  altFor: (sku: string) => string;
}

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "photo",
    label: "Product photo",
    seed: "torvex-la640-photo-v2",
    altFor: (sku) => `${sku} linear actuator, photographed at a slight angle against a neutral background`,
  },
  {
    id: "drawing",
    label: "Dimensional drawing",
    seed: "torvex-la640-drawing-v2",
    altFor: (sku) => `Dimensional line drawing of the ${sku} actuator, showing stroke and mounting dimensions`,
  },
  {
    id: "application",
    label: "In application",
    seed: "torvex-la640-application-v2",
    altFor: (sku) => `The ${sku} actuator installed in a packaging-line gantry, driving a pick-and-place head`,
  },
];

// ---------------------------------------------------------------------------
// Documentation & downloads
// ---------------------------------------------------------------------------

export interface DocItem {
  id: string;
  titleFor: (sku: string) => string;
  fileType: string;
  size: string;
}

export const DOC_ITEMS: DocItem[] = [
  { id: "datasheet", titleFor: () => "LA-640 series datasheet", fileType: "PDF", size: "1.2 MB" },
  { id: "drawing", titleFor: (sku) => `${sku} dimensional drawing`, fileType: "STEP / DWG", size: "3.8 MB" },
  { id: "wiring", titleFor: () => "Wiring & connector guide", fileType: "PDF", size: "640 KB" },
  { id: "compliance", titleFor: () => "Certificate of compliance (CE / UL / RoHS)", fileType: "PDF", size: "310 KB" },
];

// ---------------------------------------------------------------------------
// Compatibility
// ---------------------------------------------------------------------------

export type FitStatus = "compatible" | "partial" | "incompatible";

export interface CompatRow {
  id: string;
  system: string;
  interface: string;
  note: string;
  status: FitStatus;
}

export const COMPAT_ROWS: CompatRow[] = [
  { id: "cx", system: "Torvex CX-series controllers", interface: "CANopen / M12", note: "Native drop-in, no adapter needed", status: "compatible" },
  { id: "dr100", system: "Torvex legacy DR-100", interface: "RS-485", note: "Requires a DR-100 → CX signal adapter", status: "partial" },
  { id: "plc", system: "Generic PLC, digital I/O", interface: "24V discrete I/O", note: "Direct wiring, no position feedback loop", status: "compatible" },
  { id: "ethercat", system: "EtherCAT master (third-party)", interface: "EtherCAT via CX-EC gateway", note: "Gateway module sold separately", status: "partial" },
  { id: "analog", system: "Analog 0-10V positioning loop", interface: "Analog", note: "Not supported on encoder-only firmware", status: "incompatible" },
  { id: "fleet", system: "Torvex Fleet Manager software", interface: "Cloud / M12 CANopen", note: "Full telemetry and predictive maintenance", status: "compatible" },
];

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  variantLabel: string;
  recencyRank: number;
  helpful: number;
  title: string;
  body: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "D. Alvarez",
    role: "Automation Engineer, Kestrel Robotics",
    rating: 5,
    variantLabel: "150 mm stroke",
    recencyRank: 1,
    helpful: 34,
    title: "Drop-in replacement for our aging pneumatic cylinders",
    body: "Swapped six of these into a packaging cell last quarter. Repeatability held at spec even after 2M cycles, and CANopen integration with our CX-series controller took under an hour.",
  },
  {
    id: "r2",
    author: "M. Okafor",
    role: "Controls Lead, Priam Systems",
    rating: 4,
    variantLabel: "300 mm stroke",
    recencyRank: 2,
    helpful: 21,
    title: "Great for long-travel work, watch the load derating",
    body: "Max thrust drops more than I expected at full 300 mm extension. Worth checking the derating curve in the datasheet before sizing for the heaviest end of your load.",
  },
  {
    id: "r3",
    author: "S. Lindqvist",
    role: "Mechatronics Engineer, Fjord Line Robotics",
    rating: 5,
    variantLabel: "100 mm stroke",
    recencyRank: 3,
    helpful: 18,
    title: "Encoder feedback resolution is genuinely 0.05 mm",
    body: "Verified against a dial indicator across the full stroke. No detectable backlash on direction reversal.",
  },
  {
    id: "r4",
    author: "R. Nakashima",
    role: "Mechanical Engineer, Torque & Frame",
    rating: 3,
    variantLabel: "50 mm stroke",
    recencyRank: 4,
    helpful: 9,
    title: "Solid unit, connector housing feels underspecified for IP65",
    body: "Passed our wash-down test but the M12 connector boot needed extra thread sealant to hold rating long-term.",
  },
  {
    id: "r5",
    author: "P. Vance",
    role: "Systems Integrator, Vance Automation Group",
    rating: 5,
    variantLabel: "200 mm stroke",
    recencyRank: 5,
    helpful: 7,
    title: "Fleet Manager telemetry caught a bearing wear trend early",
    body: "The predictive-maintenance flag gave us three weeks of lead time before a real failure. That alone paid for the fleet software tier.",
  },
  {
    id: "r6",
    author: "H. Bergström",
    role: "Test Engineer, Kestrel Robotics",
    rating: 2,
    variantLabel: "150 mm stroke",
    recencyRank: 6,
    helpful: 4,
    title: "Lead time slipped past the stated 7 days",
    body: "Spec sheet says 7 days; ours shipped in 15. Product performs well once installed, but plan your line accordingly.",
  },
];

export const RATING_DISTRIBUTION: Array<{ stars: 1 | 2 | 3 | 4 | 5; count: number }> = [
  { stars: 5, count: 48 },
  { stars: 4, count: 19 },
  { stars: 3, count: 6 },
  { stars: 2, count: 3 },
  { stars: 1, count: 1 },
];

export const REVIEW_COUNT = RATING_DISTRIBUTION.reduce((sum, r) => sum + r.count, 0);
export const AVERAGE_RATING = 4.6;
