// Fenwick Audio — Aria II product-detail data.
// Every value here is a fixed literal: no Math.random, no Date.now, no `new Date()`. Review dates
// are plain display strings and `order` is a hand-set integer used only to sort deterministically —
// nothing here derives from the clock at render time, so server and client markup always match.

export const BRAND = "Fenwick Audio";
export const PRODUCT_NAME = "Aria II";
export const SKU_LINE = "2-in / 2-out USB-C audio interface";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function usd(cents: number): string {
  // Values are stored as whole dollars already (349, not 34900) — kept as plain integers since the
  // catalogue never needs sub-dollar precision, then formatted with a thousands separator by hand
  // (no Intl locale drift between server and client render).
  const s = Math.trunc(cents).toString();
  return `$${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export type FinishId = "graphite" | "silver";

export interface Finish {
  id: FinishId;
  label: string;
  swatch: string;
  chassis: string;
  panel: string;
  shipsIn: string;
  weight: string;
}

export const FINISHES: Finish[] = [
  {
    id: "graphite",
    label: "Graphite",
    swatch: "#3F3F46",
    chassis: "#3F3F46",
    panel: "#27272A",
    shipsIn: "Ships in 2 business days",
    weight: "412 g",
  },
  {
    id: "silver",
    label: "Silver anodized",
    swatch: "#D4D4D8",
    chassis: "#D4D4D8",
    panel: "#A1A1AA",
    shipsIn: "Built to order — ships in 8 business days",
    weight: "418 g",
  },
];

export type BundleId = "solo" | "cables" | "producer";

export interface Bundle {
  id: BundleId;
  label: string;
  price: number;
  blurb: string;
  items: string[];
}

export const BUNDLES: Bundle[] = [
  {
    id: "solo",
    label: "Interface only",
    price: 349,
    blurb: "Just the Aria II — bring your own cables and mics.",
    items: ["Aria II interface", "USB-C to USB-C cable, 1.5 m", "Quick start guide", "2-year warranty card"],
  },
  {
    id: "cables",
    label: "+ Studio Cable Bundle",
    price: 389,
    blurb: "Adds the cabling most desks are missing on day one.",
    items: [
      "Aria II interface",
      "USB-C to USB-C cable, 1.5 m",
      "2× XLR cables, 3 m",
      "Foam pop filter",
      "2-year warranty card",
    ],
  },
  {
    id: "producer",
    label: "+ Producer Software Bundle",
    price: 459,
    blurb: "Everything in Cables, plus a full DAW license and plugin pack.",
    items: [
      "Aria II interface",
      "USB-C to USB-C cable, 1.5 m",
      "2× XLR cables, 3 m",
      "Foam pop filter",
      "DAW license (full version)",
      "Channel-strip plugin pack",
      "2-year warranty card",
    ],
  },
];

export type GalleryViewId = "front" | "rear" | "top" | "desk";

export interface GalleryView {
  id: GalleryViewId;
  label: string;
  caption: string;
}

export const GALLERY_VIEWS: GalleryView[] = [
  { id: "front", label: "Front panel", caption: "Twin gain knobs with a 12-segment peak-reading LED ladder per channel." },
  { id: "rear", label: "Rear I/O", caption: "Combo XLR/TRS inputs, balanced monitor outs, and a USB-C bus-power port." },
  { id: "top", label: "Top view", caption: "42 mm CNC-milled aluminum chassis — thin enough to sit under a monitor arm." },
  { id: "desk", label: "On the desk", caption: "Aria II staged next to a laptop, showing scale against a 15-inch keyboard deck." },
];

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecSection {
  id: string;
  title: string;
  items: SpecItem[];
}

export const SPEC_SECTIONS: SpecSection[] = [
  {
    id: "preamps",
    title: "Preamps & conversion",
    items: [
      { label: "Preamp type", value: "Class-A discrete, +60 dB variable gain" },
      { label: "A/D & D/A conversion", value: "24-bit / 192 kHz" },
      { label: "Dynamic range", value: "118 dB (A-weighted)" },
      { label: "Equivalent input noise", value: "-129 dBu" },
      { label: "THD+N", value: "0.0007% @ 1 kHz" },
    ],
  },
  {
    id: "io",
    title: "I/O & connectivity",
    items: [
      { label: "Analog inputs", value: "2× combo XLR/TRS, mic or line" },
      { label: "Analog outputs", value: "2× balanced TRS, monitor level" },
      { label: "Headphone outs", value: "1× 6.35 mm, independent level" },
      { label: "Digital", value: "1× optical loopback (S/PDIF)" },
      { label: "Host connection", value: "USB-C, USB 2.0 Hi-Speed" },
    ],
  },
  {
    id: "build",
    title: "Build & power",
    items: [
      { label: "Chassis", value: "CNC-milled aluminum unibody" },
      { label: "Dimensions", value: "140 × 110 × 42 mm" },
      { label: "Weight", value: "412–418 g (finish-dependent)" },
      { label: "Power", value: "Bus-powered via USB-C" },
      { label: "Control", value: "2× stepped gain knobs, 1× monitor dial" },
    ],
  },
  {
    id: "box",
    title: "In the box",
    items: [
      { label: "Interface", value: "1× Aria II, in selected finish" },
      { label: "Cable", value: "1× USB-C to USB-C, 1.5 m" },
      { label: "Documentation", value: "Quick start guide, printed" },
      { label: "Warranty", value: "2-year limited, card included" },
    ],
  },
];

export type TierId = "aria-ii" | "aria-ii-pro" | "aria-studio";

export interface Tier {
  id: TierId;
  name: string;
  price: number;
  current?: boolean;
}

export const TIERS: Tier[] = [
  { id: "aria-ii", name: "Aria II", price: 349, current: true },
  { id: "aria-ii-pro", name: "Aria II Pro", price: 549 },
  { id: "aria-studio", name: "Aria Studio", price: 899 },
];

export interface CompareRow {
  key: string;
  label: string;
  values: Record<TierId, string>;
  pinned?: boolean;
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    key: "price",
    label: "Price",
    pinned: true,
    values: { "aria-ii": "$349", "aria-ii-pro": "$549", "aria-studio": "$899" },
  },
  {
    key: "inputs",
    label: "Analog inputs",
    values: { "aria-ii": "2× combo XLR/TRS", "aria-ii-pro": "4× combo XLR/TRS", "aria-studio": "8× combo XLR/TRS" },
  },
  {
    key: "outputs",
    label: "Analog outputs",
    values: { "aria-ii": "2× balanced TRS", "aria-ii-pro": "4× balanced TRS", "aria-studio": "8× balanced TRS" },
  },
  {
    key: "gain",
    label: "Preamp gain range",
    values: { "aria-ii": "+60 dB variable", "aria-ii-pro": "+60 dB variable", "aria-studio": "+60 dB variable" },
  },
  {
    key: "conversion",
    label: "A/D & D/A conversion",
    values: { "aria-ii": "24-bit / 192 kHz", "aria-ii-pro": "24-bit / 192 kHz", "aria-studio": "24-bit / 192 kHz" },
  },
  {
    key: "midi",
    label: "MIDI I/O",
    values: { "aria-ii": "None", "aria-ii-pro": "In / Out", "aria-studio": "In / Out" },
  },
  {
    key: "adat",
    label: "ADAT expansion",
    values: { "aria-ii": "None", "aria-ii-pro": "None", "aria-studio": "2× ADAT, 8 ch @ 48 kHz" },
  },
  {
    key: "dsp",
    label: "Onboard DSP mixer",
    values: { "aria-ii": "No", "aria-ii-pro": "No", "aria-studio": "Yes — 4-bus" },
  },
  {
    key: "headphones",
    label: "Headphone outs",
    values: { "aria-ii": "1", "aria-ii-pro": "2", "aria-studio": "2" },
  },
  {
    key: "power",
    label: "Power",
    values: { "aria-ii": "Bus-powered, USB-C", "aria-ii-pro": "Bus-powered, USB-C", "aria-studio": "External PSU, included" },
  },
];

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  order: number;
  helpful: number;
  verified: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: "rv-1",
    author: "M. Okafor",
    role: "Podcast producer",
    rating: 5,
    title: "Preamps are dead quiet",
    body: "Ran two dynamic mics at +55 dB gain in a treated closet and the noise floor is a non-issue. Driver install on the first try, no dropouts in six months of weekly sessions.",
    date: "Jul 22, 2026",
    order: 6,
    helpful: 128,
    verified: true,
  },
  {
    id: "rv-2",
    author: "D. Varga",
    role: "Mixing engineer",
    rating: 5,
    title: "Replaced a much pricier interface",
    body: "A/B'd this against a unit twice the price for tracking vocals. Conversion is transparent enough that I stopped noticing which one was in the chain.",
    date: "Jul 09, 2026",
    order: 5,
    helpful: 94,
    verified: true,
  },
  {
    id: "rv-3",
    author: "S. Lindqvist",
    role: "Home studio hobbyist",
    rating: 4,
    title: "Great unit, monitor knob is stiff",
    body: "Sound quality and build are excellent for the price. My only nitpick is the monitor volume dial has more resistance than I'd like at low levels — everything else is spot on.",
    date: "Jun 30, 2026",
    order: 4,
    helpful: 41,
    verified: true,
  },
  {
    id: "rv-4",
    author: "R. Abioye",
    role: "Streaming setup",
    rating: 5,
    title: "Bus power alone sold me",
    body: "One cable to the laptop and it's live — no wall wart to route under the desk. Headphone out is loud enough for open-back cans without a separate amp.",
    date: "Jun 14, 2026",
    order: 3,
    helpful: 67,
    verified: false,
  },
  {
    id: "rv-5",
    author: "T. Kowalczyk",
    role: "Voiceover artist",
    rating: 3,
    title: "Good preamps, driver panel is basic",
    body: "Audio quality is genuinely excellent, but the control-panel software feels unfinished next to the hardware — buffer settings reset after some updates and needed reconfiguring.",
    date: "May 28, 2026",
    order: 2,
    helpful: 22,
    verified: true,
  },
  {
    id: "rv-6",
    author: "J. Pham",
    role: "Band rehearsal space",
    rating: 4,
    title: "Only two inputs is the real limit",
    body: "For a duo setup this is plenty, but if you're tracking a full band you'll want the Pro tier for the extra inputs — the II simply wasn't built for that and doesn't pretend to be.",
    date: "May 03, 2026",
    order: 1,
    helpful: 15,
    verified: true,
  },
];

export const RATING_SUMMARY = {
  average: 4.7,
  count: 182,
  distribution: [
    { stars: 5, pct: 70 },
    { stars: 4, pct: 20 },
    { stars: 3, pct: 6 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 1 },
  ],
} as const;

export const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "specs", label: "Specifications" },
  { id: "compare", label: "Compare tiers" },
  { id: "reviews", label: "Reviews" },
] as const;
