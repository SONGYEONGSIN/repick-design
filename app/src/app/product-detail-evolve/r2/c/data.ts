// Deterministic dummy data for the Ferrous & Oak "No. 4" chef's knife product-detail page.
// No Math.random / Date.now / new Date() anywhere in this module — every value below is a fixed
// literal so the page hydrates identically on server and client.

export const BRAND = "Ferrous & Oak";
export const PRODUCT_NAME = "No. 4 Chef's Knife";
export const MODEL_LINE = "Hand-forged in Vermont, one billet at a time";

export const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2";

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// Configuration — blade length, handle wood, edge finish. Every option changes
// price and at least one physical spec; there are no purely decorative choices.
// ---------------------------------------------------------------------------

export type BladeId = "compact" | "standard" | "long";
export type WoodId = "walnut" | "bogoak" | "micarta";
export type FinishId = "double" | "single";

export interface BladeOption {
  id: BladeId;
  label: string;
  bladeMm: number;
  priceDelta: number;
  baseWeightG: number;
  baseBalanceMm: number;
}

export const BLADES: BladeOption[] = [
  { id: "compact", label: "Compact", bladeMm: 190, priceDelta: -35, baseWeightG: 172, baseBalanceMm: 2 },
  { id: "standard", label: "Standard", bladeMm: 216, priceDelta: 0, baseWeightG: 198, baseBalanceMm: 4 },
  { id: "long", label: "Long", bladeMm: 241, priceDelta: 45, baseWeightG: 227, baseBalanceMm: 9 },
];

export interface WoodOption {
  id: WoodId;
  label: string;
  priceDelta: number;
  weightDeltaG: number;
  balanceDeltaMm: number;
  swatch: string;
}

export const WOODS: WoodOption[] = [
  { id: "walnut", label: "American walnut", priceDelta: 0, weightDeltaG: 0, balanceDeltaMm: 0, swatch: "#5C4433" },
  { id: "bogoak", label: "Bog oak", priceDelta: 65, weightDeltaG: 14, balanceDeltaMm: -1, swatch: "#2B2420" },
  { id: "micarta", label: "Green micarta", priceDelta: 40, weightDeltaG: -6, balanceDeltaMm: 1, swatch: "#3E4A3D" },
];

export interface FinishOption {
  id: FinishId;
  label: string;
  priceDelta: number;
  edgeAngleDeg: number;
  useNote: string;
}

export const FINISHES: FinishOption[] = [
  {
    id: "double",
    label: "Double bevel",
    priceDelta: 0,
    edgeAngleDeg: 15,
    useNote: "Symmetric edge — ambidextrous, easiest to maintain at home.",
  },
  {
    id: "single",
    label: "Single bevel",
    priceDelta: 55,
    edgeAngleDeg: 12,
    useNote: "Right-handed grind, thinner cut, needs more frequent honing.",
  },
];

export const BASE_PRICE = 340;
export const DEFAULT_BLADE_ID: BladeId = "standard";
export const DEFAULT_WOOD_ID: WoodId = "walnut";
export const DEFAULT_FINISH_ID: FinishId = "double";

export function getBlade(id: BladeId): BladeOption {
  return BLADES.find((b) => b.id === id) ?? BLADES[1];
}
export function getWood(id: WoodId): WoodOption {
  return WOODS.find((w) => w.id === id) ?? WOODS[0];
}
export function getFinish(id: FinishId): FinishOption {
  return FINISHES.find((f) => f.id === id) ?? FINISHES[0];
}

export interface ComputedConfig {
  priceUsd: number;
  weightG: number;
  balanceMm: number;
  edgeAngleDeg: number;
}

export function computeConfig(bladeId: BladeId, woodId: WoodId, finishId: FinishId): ComputedConfig {
  const blade = getBlade(bladeId);
  const wood = getWood(woodId);
  const finish = getFinish(finishId);
  return {
    priceUsd: BASE_PRICE + blade.priceDelta + wood.priceDelta + finish.priceDelta,
    weightG: blade.baseWeightG + wood.weightDeltaG,
    balanceMm: blade.baseBalanceMm + wood.balanceDeltaMm,
    edgeAngleDeg: finish.edgeAngleDeg,
  };
}

// ---------------------------------------------------------------------------
// The journal — the narrative spine of the page. Two chapters carry a
// "dynamic" tag: their closing line reads the live configuration instead of
// a fixed string, so the story itself — not just the numbers — updates when
// the picker in the floating card changes.
// ---------------------------------------------------------------------------

export type JournalDynamic = "finish" | "wood" | undefined;

export interface JournalChapter {
  id: string;
  number: string;
  title: string;
  body: string;
  imageSeed: string;
  imageAlt: string;
  dynamic?: JournalDynamic;
}

export const JOURNAL_CHAPTERS: JournalChapter[] = [
  {
    id: "billet",
    number: "Chapter 01",
    title: "The billet",
    body: "Each blade starts as a bar of 52100 high-carbon steel, clad in nickel steel using a San-Mai lamination — a hard cutting core wrapped in a softer, more forgiving jacket. We buy stock in 40 kg coils and cut it down by hand, one billet per knife.",
    imageSeed: "ferrous-oak-billet-v3",
    imageAlt: "A cut steel billet resting on a workbench, still showing the saw marks from cutting it to length",
  },
  {
    id: "forge",
    number: "Chapter 02",
    title: "The forge",
    body: "The billet goes into a coal forge until it reaches a pale orange, then comes out under the power hammer. Drawing out the bevel by hand takes roughly forty minutes and eight to ten heats — rush it, and the grain coarsens.",
    imageSeed: "ferrous-oak-forge-v3",
    imageAlt: "A glowing orange billet held with tongs over an open coal forge",
  },
  {
    id: "quench",
    number: "Chapter 03",
    title: "The quench",
    body: "At 1,475°F the blade goes straight into a brine quench, hardening the edge to 61-62 HRC in under three seconds. A single two-hour draw at 400°F follows, tempering out the brittleness without giving back the edge retention.",
    imageSeed: "ferrous-oak-quench-v3",
    imageAlt: "A blade blank submerged in a brine quench tank, steam rising off the surface",
  },
  {
    id: "grind",
    number: "Chapter 04",
    title: "The grind",
    body: "The bevel is set on a wet grinding wheel against a fixed jig, checked by eye and by feeler gauge until both sides mirror each other within a few thousandths.",
    imageSeed: "ferrous-oak-grind-v3",
    imageAlt: "A blade held against a wet grinding wheel, sparks absent because the wheel runs wet",
    dynamic: "finish",
  },
  {
    id: "handle",
    number: "Chapter 05",
    title: "The handle",
    body: "The tang is fitted, drilled, and pinned through a block of hand-selected wood with three mosaic pins peened flush. The handle is shaped last, once the blade's balance is already set.",
    imageSeed: "ferrous-oak-handle-v3",
    imageAlt: "A rough-cut wood handle blank pinned to a blade tang, not yet shaped",
    dynamic: "wood",
  },
  {
    id: "edge",
    number: "Chapter 06",
    title: "The edge",
    body: "Final sharpening runs through four grits by hand, finishing on a leather strop. Every blade is tested against a sheet of newsprint and a ripe tomato before it ships — if it doesn't pass cleanly through both, it goes back to the stones.",
    imageSeed: "ferrous-oak-edge-v3",
    imageAlt: "A finished blade edge held up to the light, showing an even, mirror-polished bevel",
  },
];

// ---------------------------------------------------------------------------
// Full specification sheet — grouped, table-based (not a definition list) so
// the axe definition-list / dlitem audits have nothing to trip on.
// ---------------------------------------------------------------------------

export interface SpecRow {
  id: string;
  label: string;
  value: string;
}
export interface SpecGroup {
  id: string;
  title: string;
  rows: SpecRow[];
}

export function buildSpecGroups(
  blade: BladeOption,
  wood: WoodOption,
  finish: FinishOption,
  config: ComputedConfig,
): SpecGroup[] {
  return [
    {
      id: "blade",
      title: "Blade",
      rows: [
        { id: "length", label: "Blade length", value: `${blade.bladeMm} mm` },
        { id: "steel", label: "Steel", value: "52100 high-carbon, San-Mai clad" },
        { id: "hardness", label: "Hardness", value: "61-62 HRC" },
        { id: "geometry", label: "Edge geometry", value: finish.label },
        { id: "angle", label: "Edge angle", value: `${config.edgeAngleDeg}° per side` },
        { id: "weight", label: "Total weight", value: `${config.weightG} g` },
        { id: "balance", label: "Balance point", value: `${config.balanceMm} mm forward of bolster` },
      ],
    },
    {
      id: "handle",
      title: "Handle",
      rows: [
        { id: "wood", label: "Wood", value: wood.label },
        { id: "handle-length", label: "Handle length", value: "128 mm" },
        { id: "fastening", label: "Fastening", value: "Three mosaic pins, hand-peened" },
        { id: "handle-finish", label: "Handle finish", value: "Hand-rubbed oil, satin" },
      ],
    },
    {
      id: "craft",
      title: "Craft record",
      rows: [
        { id: "smith", label: "Forged by", value: "J. Aldern, master smith" },
        { id: "location", label: "Forge location", value: "Ferrous & Oak workshop, Vermont" },
        { id: "heat", label: "Billet heat number", value: "H-1147" },
        { id: "quench", label: "Quench method", value: "Brine quench, single draw temper" },
        { id: "bench", label: "Hand-finishing time", value: "6.5 bench hours" },
        { id: "edition", label: "Edition", value: "Batch of 12, individually numbered" },
      ],
    },
    {
      id: "care",
      title: "Care & warranty",
      rows: [
        { id: "maintenance", label: "Maintenance", value: "Hand wash, dry immediately; oil handle quarterly" },
        { id: "sharpen", label: "Recommended sharpening", value: "Every 3-4 months of home use" },
        { id: "warranty", label: "Warranty", value: "Lifetime against forging defects" },
        { id: "included", label: "Included", value: "Leather sheath, care oil, sharpening card" },
      ],
    },
  ];
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  bladeLabel: string;
  recencyRank: number;
  helpful: number;
  title: string;
  body: string;
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "N. Okonkwo",
    role: "Line cook, five years",
    rating: 5,
    bladeLabel: "Standard, walnut",
    recencyRank: 1,
    helpful: 41,
    title: "Holds an edge through a full dinner service",
    body: "I sharpen most knives weekly. This one is still cutting cleanly through onions after three weeks of nightly prep. The balance point sits right where my hand wants it.",
  },
  {
    id: "r2",
    author: "T. Marchetti",
    role: "Home cook",
    rating: 5,
    bladeLabel: "Compact, micarta",
    recencyRank: 2,
    helpful: 27,
    title: "Compact length was the right call for a small kitchen",
    body: "I nearly ordered the long blade out of habit. Glad I didn't — the compact is easier to control on a narrow board and still handles a butternut squash fine.",
  },
  {
    id: "r3",
    author: "A. Reyes",
    role: "Pastry chef",
    rating: 4,
    bladeLabel: "Standard, bog oak",
    recencyRank: 3,
    helpful: 19,
    title: "Beautiful, a little blade-heavy for delicate work",
    body: "The bog oak handle is stunning and the forge marks on the spine are a nice touch. It's noticeably front-weighted, which I like for rocking cuts but not for fine pastry slicing.",
  },
  {
    id: "r4",
    author: "D. Holbrook",
    role: "Butcher",
    rating: 5,
    bladeLabel: "Long, walnut",
    recencyRank: 4,
    helpful: 15,
    title: "Single bevel took some relearning, worth it",
    body: "Switched from double bevel after twenty years and it took a week to adjust my angle. Thinner cuts through silverskin now with noticeably less drag.",
  },
  {
    id: "r5",
    author: "K. Lindgren",
    role: "Home cook",
    rating: 3,
    bladeLabel: "Standard, walnut",
    recencyRank: 5,
    helpful: 6,
    title: "Great knife, wish the sheath fit better",
    body: "No complaints about the blade itself. The included leather sheath is snug enough that it's a two-handed job to get the knife back in.",
  },
];

export const RATING_DISTRIBUTION: Array<{ stars: 1 | 2 | 3 | 4 | 5; count: number }> = [
  { stars: 5, count: 52 },
  { stars: 4, count: 21 },
  { stars: 3, count: 7 },
  { stars: 2, count: 2 },
  { stars: 1, count: 1 },
];

export const REVIEW_COUNT = RATING_DISTRIBUTION.reduce((sum, r) => sum + r.count, 0);
export const AVERAGE_RATING = 4.7;
