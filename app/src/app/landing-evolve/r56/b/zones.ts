// Pure data + derivation logic for the GRIDLINE pickup-zone device.
// No React, no hooks — safe to import from both server and client files.
// Every number shown on the page must flow through getZoneResult() so the
// hero device, the live-value section, and the closing CTA can never drift
// into separate hardcoded literals.

export type TierId = "near" | "mid" | "far";

export interface Zone {
  id: string;
  name: string;
  tier: TierId;
  /** Percent-based geometry so the zone tile IS the click target on the grid. */
  top: number;
  left: number;
  width: number;
  height: number;
  listingIds: string[];
}

export interface Listing {
  id: string;
  title: string;
  size: string;
  price: number;
  originalPrice: number;
  grade: "Like New" | "Excellent" | "Good";
  matchPercent: number;
  matchReason: string;
  verified: boolean;
  sellerLabel: string;
  photoId: string;
}

interface TierInfo {
  etaLabel: string;
  fee: number;
  feeLabel: string;
}

export const TIER_INFO: Record<TierId, TierInfo> = {
  near: { etaLabel: "Today, 2–4 PM", fee: 0, feeLabel: "No extra fee" },
  mid: { etaLabel: "Tomorrow, 10 AM–12 PM", fee: 3, feeLabel: "+$3 courier fee" },
  far: { etaLabel: "Wed, 9–11 AM", fee: 6, feeLabel: "+$6 courier fee" },
};

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Retro High Basketball Sneaker",
    size: "US 10",
    price: 128,
    originalPrice: 210,
    grade: "Excellent",
    matchPercent: 94,
    matchReason: "Matches your saved size and high-top history",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1595950653106-6c9ebd614d3a",
  },
  {
    id: "l2",
    title: "Classic Court Low",
    size: "US 9",
    price: 64,
    originalPrice: 100,
    grade: "Like New",
    matchPercent: 88,
    matchReason: "Frequent low-top buyer, same colorway family",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1549298916-b41d501d3772",
  },
  {
    id: "l3",
    title: "Trail Running Shoe",
    size: "US 11",
    price: 82,
    originalPrice: 140,
    grade: "Good",
    matchPercent: 76,
    matchReason: "Close to your last outdoor-shoe search",
    verified: false,
    sellerLabel: "Community seller",
    photoId: "photo-1460353581641-37baddab0fa2",
  },
  {
    id: "l4",
    title: "Canvas Low-Top Sneaker",
    size: "US 8",
    price: 38,
    originalPrice: 60,
    grade: "Excellent",
    matchPercent: 91,
    matchReason: "Matches your budget and casual-wear filter",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1491553895911-0055eca6402d",
  },
  {
    id: "l5",
    title: "Suede Chukka Boot",
    size: "US 10.5",
    price: 95,
    originalPrice: 150,
    grade: "Like New",
    matchPercent: 83,
    matchReason: "Pairs with items in your saved list",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1525966222134-fcfa99b8ae77",
  },
  {
    id: "l6",
    title: "Performance Running Shoe",
    size: "US 9.5",
    price: 70,
    originalPrice: 120,
    grade: "Good",
    matchPercent: 79,
    matchReason: "Close size match, similar mileage listed",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1514989940723-e8e51635b782",
  },
  {
    id: "l7",
    title: "Skate Shoe — Low",
    size: "US 10",
    price: 48,
    originalPrice: 80,
    grade: "Excellent",
    matchPercent: 90,
    matchReason: "Matches your low-top + flat-sole filter",
    verified: false,
    sellerLabel: "Community seller",
    photoId: "photo-1556906781-9a412961c28c",
  },
  {
    id: "l8",
    title: "Winter Boot — Insulated",
    size: "US 11",
    price: 110,
    originalPrice: 170,
    grade: "Like New",
    matchPercent: 72,
    matchReason: "Seasonal match for your saved region",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1600185365483-26d7a4cc7519",
  },
  {
    id: "l9",
    title: "Minimalist Trainer",
    size: "US 9",
    price: 58,
    originalPrice: 95,
    grade: "Good",
    matchPercent: 85,
    matchReason: "Matches your neutral-palette preference",
    verified: true,
    sellerLabel: "Verified seller",
    photoId: "photo-1465453869711-7e174808ace9",
  },
  {
    id: "l10",
    title: "Slip-On Canvas Sneaker",
    size: "US 8.5",
    price: 32,
    originalPrice: 50,
    grade: "Excellent",
    matchPercent: 81,
    matchReason: "Matches your quick-pickup, low-price filter",
    verified: false,
    sellerLabel: "Community seller",
    photoId: "photo-1542291026-7eec264c27ff",
  },
];

export const ZONES: Zone[] = [
  {
    id: "midtown",
    name: "Midtown Exchange",
    tier: "near",
    top: 8,
    left: 34,
    width: 28,
    height: 30,
    listingIds: ["l1", "l4", "l7", "l2", "l9", "l10", "l6"],
  },
  {
    id: "harbor",
    name: "Harbor Row",
    tier: "near",
    top: 42,
    left: 6,
    width: 24,
    height: 26,
    listingIds: ["l2", "l9", "l4", "l10"],
  },
  {
    id: "oldmill",
    name: "Old Mill Quarter",
    tier: "mid",
    top: 4,
    left: 66,
    width: 30,
    height: 24,
    listingIds: ["l5", "l8", "l3", "l6", "l1"],
  },
  {
    id: "riverside",
    name: "Riverside Dock",
    tier: "far",
    top: 70,
    left: 4,
    width: 26,
    height: 26,
    listingIds: ["l8", "l5", "l3", "l6"],
  },
  {
    id: "uptown",
    name: "Uptown Studios",
    tier: "mid",
    top: 40,
    left: 64,
    width: 32,
    height: 26,
    listingIds: ["l6", "l3", "l9", "l7", "l1"],
  },
  {
    id: "eastmarket",
    name: "East Market",
    tier: "near",
    top: 70,
    left: 36,
    width: 26,
    height: 26,
    listingIds: ["l7", "l10", "l2", "l4", "l9"],
  },
  {
    id: "greenbelt",
    name: "Greenbelt Common",
    tier: "far",
    top: 68,
    left: 66,
    width: 30,
    height: 28,
    listingIds: ["l8", "l5", "l6", "l3"],
  },
];

export const DEFAULT_ZONE_ID = "midtown";

export interface ZoneResult {
  zone: Zone;
  etaLabel: string;
  fee: number;
  feeLabel: string;
  listings: Listing[];
}

const LISTING_BY_ID: Record<string, Listing> = Object.fromEntries(
  LISTINGS.map((listing) => [listing.id, listing]),
);

/**
 * The single source of truth for every derived number/label on this route.
 * The hero device, the live-value section, and the closing CTA all call this
 * same function with the current zone id — never a second hardcoded copy.
 */
export function getZoneResult(zoneId: string): ZoneResult {
  const zone = ZONES.find((z) => z.id === zoneId) ?? ZONES[0];
  const tier = TIER_INFO[zone.tier];
  const listings = zone.listingIds
    .map((id) => LISTING_BY_ID[id])
    .filter((l): l is Listing => Boolean(l));
  return {
    zone,
    etaLabel: tier.etaLabel,
    fee: tier.fee,
    feeLabel: tier.feeLabel,
    listings,
  };
}

export function discountPercent(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}
