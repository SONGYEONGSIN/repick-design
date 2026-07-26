import {
  Boxes,
  Building2,
  Cpu,
  Layers,
  Package,
  Radar,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Deterministic helpers — no Math.random / Date.now / new Date anywhere   */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function unsplashPhoto(id: string, size = 200): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

export const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const numberFmt = new Intl.NumberFormat("en-US");

/* ---------------------------------------------------------------------- */
/* Brand / workspace / user                                                */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Sourcemark", tagline: "Supplier Sourcing & Comparison Console" };
export { Radar as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "atlas-mfg", name: "Atlas Manufacturing Co.", plan: "Enterprise · 12 buyers" },
  { id: "northwind", name: "Northwind Procurement", plan: "Team · 5 buyers" },
  { id: "fenwick-industrial", name: "Fenwick Industrial", plan: "Internal test" },
];

/** Fully fictional persona — the procurement lead using Sourcemark (not the session user). */
export const CURRENT_USER = {
  name: "Priya Deshmukh",
  role: "Procurement Lead",
  email: "priya.deshmukh@sourcemark-app.io",
  avatarId: "1553062407-98eeb64c6a62",
};

/* ---------------------------------------------------------------------- */
/* Navigation                                                               */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: Layers },
      { id: "browse", label: "Browse Suppliers", Icon: Radar, active: true },
      { id: "rfqs", label: "RFQs", Icon: Package, badge: "3" },
    ],
  },
  {
    id: "deals",
    title: "Sourcing",
    items: [
      { id: "compare-lists", label: "Compare Lists", Icon: Boxes },
      { id: "contracts", label: "Contracts", Icon: Truck },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "analytics", label: "Spend Analytics", Icon: Building2, disabled: true },
      { id: "settings", label: "Settings", Icon: Wrench },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Facet taxonomies                                                         */
/* ---------------------------------------------------------------------- */

export type CategoryId = "packaging" | "industrial-hardware" | "electronics" | "logistics" | "raw-materials" | "office-facilities";

export const CATEGORY_META: Record<CategoryId, { label: string; Icon: LucideIcon }> = {
  packaging: { label: "Packaging", Icon: Package },
  "industrial-hardware": { label: "Industrial Hardware", Icon: Wrench },
  electronics: { label: "Electronics Components", Icon: Cpu },
  logistics: { label: "Logistics & Freight", Icon: Truck },
  "raw-materials": { label: "Raw Materials", Icon: Layers },
  "office-facilities": { label: "Office & Facilities", Icon: Building2 },
};
export const CATEGORY_IDS = Object.keys(CATEGORY_META) as CategoryId[];

export type RegionId = "north-america" | "europe" | "apac" | "latin-america" | "mea";

export const REGION_META: Record<RegionId, { label: string }> = {
  "north-america": { label: "North America" },
  europe: { label: "Europe" },
  apac: { label: "Asia-Pacific" },
  "latin-america": { label: "Latin America" },
  mea: { label: "Middle East & Africa" },
};
export const REGION_IDS = Object.keys(REGION_META) as RegionId[];

export type PriceBandId = "budget" | "mid" | "premium";

export const PRICE_BAND_META: Record<PriceBandId, { label: string; symbol: string; rank: number }> = {
  budget: { label: "Budget", symbol: "$", rank: 1 },
  mid: { label: "Mid-range", symbol: "$$", rank: 2 },
  premium: { label: "Premium", symbol: "$$$", rank: 3 },
};
export const PRICE_BAND_IDS = Object.keys(PRICE_BAND_META) as PriceBandId[];

export type CapabilityId =
  | "iso-9001"
  | "rush-fulfillment"
  | "sustainable"
  | "small-batch"
  | "white-label"
  | "volume-discounts"
  | "free-samples"
  | "support-247";

export const CAPABILITY_META: Record<CapabilityId, { label: string }> = {
  "iso-9001": { label: "ISO 9001 Certified" },
  "rush-fulfillment": { label: "Rush Fulfillment" },
  sustainable: { label: "Sustainable Materials" },
  "small-batch": { label: "Small-Batch OK" },
  "white-label": { label: "White-Label Ready" },
  "volume-discounts": { label: "Volume Discounts" },
  "free-samples": { label: "Free Sample Kits" },
  "support-247": { label: "24/7 Support" },
};
export const CAPABILITY_IDS = Object.keys(CAPABILITY_META) as CapabilityId[];

export type RatingThreshold = { id: string; label: string; min: number };
export const RATING_THRESHOLDS: RatingThreshold[] = [
  { id: "all", label: "All ratings", min: 0 },
  { id: "t35", label: "3.5★ & up", min: 3.5 },
  { id: "t40", label: "4.0★ & up", min: 4.0 },
  { id: "t45", label: "4.5★ & up", min: 4.5 },
];

export type SortId = "relevance" | "rating-desc" | "price-asc" | "lead-asc";
export const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "relevance", label: "Best match" },
  { id: "rating-desc", label: "Rating: high to low" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "lead-asc", label: "Lead time: fastest" },
];

export type ViewMode = "grid" | "list";

/* ---------------------------------------------------------------------- */
/* Suppliers — 16 fictional listings, fully deterministic                  */
/* ---------------------------------------------------------------------- */

export type Supplier = {
  id: string;
  name: string;
  category: CategoryId;
  region: RegionId;
  city: string;
  country: string;
  score: number;
  reviewCount: number;
  priceBand: PriceBandId;
  leadTimeDays: number;
  minOrderUnits: number;
  verified: boolean;
  capabilities: CapabilityId[];
  contactName: string;
  contactRole: string;
  photoId: string;
  blurb: string;
};

export const SUPPLIERS: Supplier[] = [
  {
    id: "cascade-pack",
    name: "Cascade Pack Co.",
    category: "packaging",
    region: "north-america",
    city: "Portland",
    country: "USA",
    score: 4.8,
    reviewCount: 312,
    priceBand: "mid",
    leadTimeDays: 12,
    minOrderUnits: 500,
    verified: true,
    capabilities: ["iso-9001", "sustainable", "volume-discounts"],
    contactName: "Marcus Feld",
    contactRole: "Account Manager",
    photoId: "1472099645785-5658abf4ff4e",
    blurb: "Corrugated and molded-fiber packaging for consumer goods brands, FSC-certified stock.",
  },
  {
    id: "verdant-box",
    name: "Verdant Box Works",
    category: "packaging",
    region: "europe",
    city: "Rotterdam",
    country: "Netherlands",
    score: 4.2,
    reviewCount: 154,
    priceBand: "budget",
    leadTimeDays: 18,
    minOrderUnits: 1000,
    verified: true,
    capabilities: ["sustainable", "small-batch", "free-samples"],
    contactName: "Elin Sorensen",
    contactRole: "Sales Director",
    photoId: "1487412720507-e7ab37603c6f",
    blurb: "Compostable mailers and retail cartons, small-batch runs for DTC brands.",
  },
  {
    id: "dunmore-carton",
    name: "Dunmore Carton & Crate",
    category: "packaging",
    region: "latin-america",
    city: "Guadalajara",
    country: "Mexico",
    score: 3.9,
    reviewCount: 68,
    priceBand: "budget",
    leadTimeDays: 24,
    minOrderUnits: 2000,
    verified: false,
    capabilities: ["small-batch", "free-samples"],
    contactName: "Rafael Duarte",
    contactRole: "Key Account Lead",
    photoId: "1519219788971-8d9797e0928e",
    blurb: "Wood crating and export cartons for cross-border industrial shipments.",
  },
  {
    id: "ironclad-fasteners",
    name: "Ironclad Fasteners",
    category: "industrial-hardware",
    region: "north-america",
    city: "Cleveland",
    country: "USA",
    score: 4.6,
    reviewCount: 480,
    priceBand: "mid",
    leadTimeDays: 9,
    minOrderUnits: 250,
    verified: true,
    capabilities: ["iso-9001", "rush-fulfillment", "volume-discounts"],
    contactName: "Dana Whitcombe",
    contactRole: "Account Manager",
    photoId: "1519244703995-f4e0f30006d5",
    blurb: "Precision bolts, rivets and structural fasteners machined to spec.",
  },
  {
    id: "torque-bolt",
    name: "Torque & Bolt Supply",
    category: "industrial-hardware",
    region: "apac",
    city: "Osaka",
    country: "Japan",
    score: 3.7,
    reviewCount: 96,
    priceBand: "budget",
    leadTimeDays: 21,
    minOrderUnits: 1000,
    verified: false,
    capabilities: ["small-batch", "free-samples"],
    contactName: "Kenji Watari",
    contactRole: "Sales Rep",
    photoId: "1523381210434-271e8be1f52b",
    blurb: "General-purpose hardware bins for light assembly lines.",
  },
  {
    id: "anvilworks",
    name: "Anvilworks Industrial",
    category: "industrial-hardware",
    region: "europe",
    city: "Katowice",
    country: "Poland",
    score: 4.5,
    reviewCount: 275,
    priceBand: "premium",
    leadTimeDays: 14,
    minOrderUnits: 100,
    verified: true,
    capabilities: ["iso-9001", "support-247", "volume-discounts"],
    contactName: "Ingrid Vance",
    contactRole: "Account Manager",
    photoId: "1524504388940-b1c1722653e1",
    blurb: "Forged industrial hardware for heavy-machinery OEMs, dedicated line support.",
  },
  {
    id: "circuithive",
    name: "CircuitHive Components",
    category: "electronics",
    region: "apac",
    city: "Shenzhen",
    country: "China",
    score: 4.7,
    reviewCount: 601,
    priceBand: "mid",
    leadTimeDays: 15,
    minOrderUnits: 200,
    verified: true,
    capabilities: ["iso-9001", "rush-fulfillment", "white-label"],
    contactName: "Mei Lin Tan",
    contactRole: "Partnerships Lead",
    photoId: "1534528741775-53994a69daeb",
    blurb: "PCB assembly and passive components, white-label boards for IoT hardware teams.",
  },
  {
    id: "lumen-semi",
    name: "Lumen Semiconductor Trading",
    category: "electronics",
    region: "north-america",
    city: "Austin",
    country: "USA",
    score: 4.4,
    reviewCount: 233,
    priceBand: "premium",
    leadTimeDays: 25,
    minOrderUnits: 100,
    verified: true,
    capabilities: ["iso-9001", "support-247"],
    contactName: "Owen Baptiste",
    contactRole: "Account Executive",
    photoId: "1543076447-215ad9ba6923",
    blurb: "Semiconductor distribution with allocation support during supply shortages.",
  },
  {
    id: "faraday-circuits",
    name: "Faraday Circuits Ltd.",
    category: "electronics",
    region: "europe",
    city: "Eindhoven",
    country: "Netherlands",
    score: 4.1,
    reviewCount: 142,
    priceBand: "mid",
    leadTimeDays: 19,
    minOrderUnits: 300,
    verified: true,
    capabilities: ["white-label", "small-batch"],
    contactName: "Anneke Visser",
    contactRole: "Sales Director",
    photoId: "1544005313-94ddf0286df2",
    blurb: "Custom PCB fabrication with low-volume prototyping turnaround.",
  },
  {
    id: "fenwick-freight",
    name: "Fenwick Freight Partners",
    category: "logistics",
    region: "north-america",
    city: "Chicago",
    country: "USA",
    score: 4.5,
    reviewCount: 189,
    priceBand: "mid",
    leadTimeDays: 5,
    minOrderUnits: 1,
    verified: true,
    capabilities: ["rush-fulfillment", "support-247", "volume-discounts"],
    contactName: "Tobias Reyes",
    contactRole: "Logistics Account Lead",
    photoId: "1547425260-76bcadfb4f2c",
    blurb: "LTL and freight brokerage across the Midwest with same-week dispatch.",
  },
  {
    id: "silkroute-logistics",
    name: "Silkroute Logistics",
    category: "logistics",
    region: "apac",
    city: "Singapore",
    country: "Singapore",
    score: 4.0,
    reviewCount: 210,
    priceBand: "budget",
    leadTimeDays: 8,
    minOrderUnits: 1,
    verified: true,
    capabilities: ["rush-fulfillment", "volume-discounts"],
    contactName: "Priyanka Iyer",
    contactRole: "Account Manager",
    photoId: "1552664730-d307ca884978",
    blurb: "Ocean and air freight forwarding with bonded-warehouse consolidation.",
  },
  {
    id: "delta-bulk",
    name: "Delta Bulk Carriers",
    category: "logistics",
    region: "mea",
    city: "Dubai",
    country: "UAE",
    score: 3.8,
    reviewCount: 77,
    priceBand: "mid",
    leadTimeDays: 11,
    minOrderUnits: 1,
    verified: false,
    capabilities: ["support-247"],
    contactName: "Amara Chukwu",
    contactRole: "Account Executive",
    photoId: "1560243563-062bfc001d68",
    blurb: "Bulk carrier charters serving Gulf and East African trade lanes.",
  },
  {
    id: "stonebridge-raw",
    name: "Stonebridge Raw Materials",
    category: "raw-materials",
    region: "north-america",
    city: "Pittsburgh",
    country: "USA",
    score: 4.3,
    reviewCount: 165,
    priceBand: "mid",
    leadTimeDays: 16,
    minOrderUnits: 5000,
    verified: true,
    capabilities: ["iso-9001", "sustainable", "volume-discounts"],
    contactName: "Colin Marsh",
    contactRole: "Sales Lead",
    photoId: "1580489944761-15a19d654956",
    blurb: "Recycled steel and aluminum billet supply for metal fabricators.",
  },
  {
    id: "amber-polymer",
    name: "Amber Polymer Supply",
    category: "raw-materials",
    region: "europe",
    city: "Antwerp",
    country: "Belgium",
    score: 4.6,
    reviewCount: 349,
    priceBand: "premium",
    leadTimeDays: 20,
    minOrderUnits: 2000,
    verified: true,
    capabilities: ["iso-9001", "sustainable", "support-247"],
    contactName: "Julia Novakova",
    contactRole: "Account Manager",
    photoId: "1607746882042-944635dfe10e",
    blurb: "Engineering-grade resins and bio-based polymer pellets, batch-traceable.",
  },
  {
    id: "baobab-agro",
    name: "Baobab Agro Materials",
    category: "raw-materials",
    region: "mea",
    city: "Nairobi",
    country: "Kenya",
    score: 3.6,
    reviewCount: 41,
    priceBand: "budget",
    leadTimeDays: 27,
    minOrderUnits: 3000,
    verified: false,
    capabilities: ["sustainable", "small-batch"],
    contactName: "Kwame Boateng",
    contactRole: "Sales Director",
    photoId: "1445205170230-053b83016050",
    blurb: "Natural fiber and agricultural byproduct materials for textile inputs.",
  },
  {
    id: "crestline-office",
    name: "Crestline Office Supply",
    category: "office-facilities",
    region: "north-america",
    city: "Denver",
    country: "USA",
    score: 4.0,
    reviewCount: 118,
    priceBand: "budget",
    leadTimeDays: 6,
    minOrderUnits: 50,
    verified: true,
    capabilities: ["rush-fulfillment", "free-samples"],
    contactName: "Hana Osei",
    contactRole: "Account Manager",
    photoId: "1445205170230-053b83016050",
    blurb: "Office consumables and facilities restocking with next-week delivery.",
  },
];

export const TOTAL_SUPPLIERS = SUPPLIERS.length;
export const VERIFIED_COUNT = SUPPLIERS.filter((s) => s.verified).length;
export const AVERAGE_SCORE = round2(SUPPLIERS.reduce((sum, s) => sum + s.score, 0) / SUPPLIERS.length);

export function supplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}

/* ---------------------------------------------------------------------- */
/* Filtering — combination rule (documented once, applied consistently)    */
/*                                                                          */
/* Within a facet GROUP (category / region / price band): OR — selecting   */
/* multiple checkboxes widens results to match ANY of them.                */
/* Capability tags: AND — a listing must carry EVERY selected tag, since    */
/* these represent required certifications/features a buyer needs.        */
/* Rating threshold: a single minimum floor (score >= min).                */
/* ACROSS groups (category, region, price, rating, capabilities, search):  */
/* AND — a listing must satisfy every active group.                       */
/* ---------------------------------------------------------------------- */

export type Filters = {
  categories: CategoryId[];
  regions: RegionId[];
  priceBands: PriceBandId[];
  minRating: number;
  capabilities: CapabilityId[];
};

export const EMPTY_FILTERS: Filters = { categories: [], regions: [], priceBands: [], minRating: 0, capabilities: [] };

export function activeFilterCount(f: Filters): number {
  return f.categories.length + f.regions.length + f.priceBands.length + f.capabilities.length + (f.minRating > 0 ? 1 : 0);
}

export function supplierMatches(s: Supplier, f: Filters, search: string): boolean {
  if (f.categories.length && !f.categories.includes(s.category)) return false;
  if (f.regions.length && !f.regions.includes(s.region)) return false;
  if (f.priceBands.length && !f.priceBands.includes(s.priceBand)) return false;
  if (f.minRating > 0 && s.score < f.minRating) return false;
  if (f.capabilities.length && !f.capabilities.every((c) => s.capabilities.includes(c))) return false;
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = `${s.name} ${CATEGORY_META[s.category].label} ${REGION_META[s.region].label} ${s.city} ${s.country}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

export function sortSuppliers(list: Supplier[], sort: SortId): Supplier[] {
  const copy = [...list];
  switch (sort) {
    case "rating-desc":
      copy.sort((a, b) => b.score - a.score || b.reviewCount - a.reviewCount);
      break;
    case "price-asc":
      copy.sort((a, b) => PRICE_BAND_META[a.priceBand].rank - PRICE_BAND_META[b.priceBand].rank || b.score - a.score);
      break;
    case "lead-asc":
      copy.sort((a, b) => a.leadTimeDays - b.leadTimeDays || b.score - a.score);
      break;
    case "relevance":
    default:
      // Best match = curated catalog order (no re-sort).
      break;
  }
  return copy;
}

/** Facet counts against the full (unfiltered) dataset — shown next to each checkbox/chip. */
export function countByCategory(id: CategoryId): number {
  return SUPPLIERS.filter((s) => s.category === id).length;
}
export function countByRegion(id: RegionId): number {
  return SUPPLIERS.filter((s) => s.region === id).length;
}
export function countByPriceBand(id: PriceBandId): number {
  return SUPPLIERS.filter((s) => s.priceBand === id).length;
}
export function countByCapability(id: CapabilityId): number {
  return SUPPLIERS.filter((s) => s.capabilities.includes(id)).length;
}
