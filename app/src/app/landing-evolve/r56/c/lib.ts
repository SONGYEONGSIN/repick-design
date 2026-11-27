/**
 * Sift — shared data + derivation module for the sequential swipe-deck landing page.
 *
 * Everything here is pure and deterministic (no Math.random, no Date.now/new Date) so the same
 * `decisions` record always produces the same profile, ranking and copy, no matter which
 * component calls it. Hero, ValueSplit and ClosingCta all import these same functions rather than
 * recomputing or hardcoding a "similar-looking" number — that's what keeps the derived state live
 * end-to-end, per the brief's §5.3 rule.
 */

export type Category = "Sneakers" | "Outerwear" | "Bags" | "Accessories";
export type PriceTier = "Budget" | "Mid" | "Premium";
export type Style = "Classic" | "Streetwear" | "Minimal" | "Vintage";
export type Decision = "like" | "pass";
export type Condition = "Like New" | "Excellent" | "Good";

export interface Listing {
  id: string;
  title: string;
  seller: string;
  category: Category;
  priceTier: PriceTier;
  style: Style;
  price: number;
  originalPrice: number;
  condition: Condition;
  verifiedSeller: boolean;
  image: string;
  imageAlt: string;
}

/** Canonical catalog order. Ranking ties break on this index, never on insertion order of a Map. */
export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Air Current Runner",
    seller: "northbend_resale",
    category: "Sneakers",
    priceTier: "Mid",
    style: "Streetwear",
    price: 86,
    originalPrice: 140,
    condition: "Excellent",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    imageAlt: "A white and orange low-top running sneaker photographed against a plain studio background",
  },
  {
    id: "l2",
    title: "Canvas Court Low",
    seller: "thrift_and_thread",
    category: "Sneakers",
    priceTier: "Budget",
    style: "Classic",
    price: 42,
    originalPrice: 65,
    condition: "Good",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    imageAlt: "A white canvas low-top sneaker with light creasing, shot on a neutral background",
  },
  {
    id: "l3",
    title: "Cloudform Trainer",
    seller: "resole_supply",
    category: "Sneakers",
    priceTier: "Premium",
    style: "Minimal",
    price: 148,
    originalPrice: 210,
    condition: "Like New",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    imageAlt: "A minimalist grey knit trainer with a thick white sole on a plain backdrop",
  },
  {
    id: "l4",
    title: "Shearling Trucker Jacket",
    seller: "secondact_vintage",
    category: "Outerwear",
    priceTier: "Mid",
    style: "Vintage",
    price: 95,
    originalPrice: 160,
    condition: "Excellent",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    imageAlt: "A denim trucker jacket with a shearling collar laid flat against a neutral surface",
  },
  {
    id: "l5",
    title: "Waxed Canvas Field Jacket",
    seller: "fieldstock_co",
    category: "Outerwear",
    priceTier: "Budget",
    style: "Classic",
    price: 58,
    originalPrice: 90,
    condition: "Good",
    verifiedSeller: false,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    imageAlt: "A tan waxed-canvas field jacket hanging against a plain wall",
  },
  {
    id: "l6",
    title: "Tech Shell Parka",
    seller: "northbend_resale",
    category: "Outerwear",
    priceTier: "Premium",
    style: "Streetwear",
    price: 210,
    originalPrice: 320,
    condition: "Like New",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80",
    imageAlt: "A black technical shell parka with a drawstring hood on a plain background",
  },
  {
    id: "l7",
    title: "Structured Tote",
    seller: "resole_supply",
    category: "Bags",
    priceTier: "Mid",
    style: "Minimal",
    price: 72,
    originalPrice: 120,
    condition: "Excellent",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    imageAlt: "A structured black leather tote bag with minimal hardware on a plain surface",
  },
  {
    id: "l8",
    title: "Saddle Leather Satchel",
    seller: "secondact_vintage",
    category: "Bags",
    priceTier: "Premium",
    style: "Vintage",
    price: 165,
    originalPrice: 240,
    condition: "Good",
    verifiedSeller: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    imageAlt: "A worn tan leather satchel bag with a front buckle flap on a plain surface",
  },
  {
    id: "l9",
    title: "Analog Field Watch",
    seller: "fieldstock_co",
    category: "Accessories",
    priceTier: "Budget",
    style: "Classic",
    price: 64,
    originalPrice: 95,
    condition: "Excellent",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    imageAlt: "A steel analog field watch with a canvas strap laid on a plain surface",
  },
  {
    id: "l10",
    title: "Matte Frame Sunglasses",
    seller: "thrift_and_thread",
    category: "Accessories",
    priceTier: "Mid",
    style: "Streetwear",
    price: 38,
    originalPrice: 60,
    condition: "Like New",
    verifiedSeller: true,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    imageAlt: "A pair of matte black sunglasses with angular frames on a plain surface",
  },
];

/** All eleven tags the profile tracks weights for, grouped but flattened into one namespace. */
export const TAGS = [
  "Sneakers",
  "Outerwear",
  "Bags",
  "Accessories",
  "Budget",
  "Mid",
  "Premium",
  "Classic",
  "Streetwear",
  "Minimal",
  "Vintage",
] as const;
export type Tag = (typeof TAGS)[number];

export const TAG_LABELS: Record<Tag, string> = {
  Sneakers: "Sneakers",
  Outerwear: "Outerwear",
  Bags: "Bags",
  Accessories: "Accessories",
  Budget: "Budget-friendly",
  Mid: "Mid-tier",
  Premium: "Premium",
  Classic: "Classic",
  Streetwear: "Streetwear",
  Minimal: "Minimal",
  Vintage: "Vintage",
};

export type Profile = Record<Tag, number>;

/**
 * Not specified by the brief: a profile built only from decisions is all-zero (or perfectly
 * uniform) before the first swipe, which fails the "non-empty, sensible default" requirement.
 * This fixed seed represents a documented, non-personal "catalog starting point" — it is never
 * re-derived from a real user action, only ever added to by one.
 */
const BASELINE_SEED: Partial<Record<Tag, number>> = { Sneakers: 3, Streetwear: 2, Mid: 2 };

export function defaultProfile(): Profile {
  const profile = {} as Profile;
  for (const tag of TAGS) profile[tag] = BASELINE_SEED[tag] ?? 1;
  return profile;
}

export function tagsOf(listing: Listing): Tag[] {
  return [listing.category, listing.priceTier, listing.style];
}

const LIKE_DELTA = 2;
const PASS_DELTA = -1;

export function computeProfile(decisions: Record<string, Decision>): Profile {
  const profile = defaultProfile();
  for (const listing of LISTINGS) {
    const decision = decisions[listing.id];
    if (!decision) continue;
    const delta = decision === "like" ? LIKE_DELTA : PASS_DELTA;
    for (const tag of tagsOf(listing)) {
      profile[tag] = Math.max(0, profile[tag] + delta);
    }
  }
  return profile;
}

/** The single highest-weighted tag. Ties resolve to the earlier tag in TAGS — deterministic,
 *  never two different "winners" on re-render, and no comparator starts from a zero accumulator
 *  that could tie with every real weight. */
export function topTrait(profile: Profile): Tag {
  let best: Tag = TAGS[0];
  let bestWeight = profile[TAGS[0]];
  for (let i = 1; i < TAGS.length; i++) {
    const tag = TAGS[i];
    if (profile[tag] > bestWeight) {
      best = tag;
      bestWeight = profile[tag];
    }
  }
  return best;
}

export function fitScore(profile: Profile, listing: Listing): number {
  return tagsOf(listing).reduce((sum, tag) => sum + profile[tag], 0);
}

/**
 * Not specified by the brief: turning a raw weighted-sum fit score into a display percentage.
 * Normalizes against the best a listing could theoretically score (its 3 tags all at the
 * profile's current max weight), then clamps to a plausible 30–99 display band so a brand-new
 * baseline profile never reads as a literal 0% or 100% match.
 */
export function matchPercent(profile: Profile, listing: Listing): number {
  const maxWeight = Math.max(...TAGS.map((t) => profile[t]));
  const ceiling = Math.max(1, maxWeight * 3);
  const raw = Math.round((fitScore(profile, listing) / ceiling) * 100);
  return Math.min(99, Math.max(30, raw));
}

export function matchReason(profile: Profile, listing: Listing): string {
  const trait = topTrait(profile);
  if (tagsOf(listing).includes(trait)) {
    return `Matches your ${TAG_LABELS[trait].toLowerCase()} lean`;
  }
  return `Widens your ${listing.category.toLowerCase()} range`;
}

export function discountPct(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}

/** The next not-yet-decided listing, in canonical order — the card currently on top of the deck. */
export function currentCard(decisions: Record<string, Decision>): Listing | null {
  return LISTINGS.find((l) => !(l.id in decisions)) ?? null;
}

/** Every not-yet-decided listing EXCEPT the current card: the pool the recommendation rail
 *  re-ranks live as the profile changes. */
export function upcomingPool(decisions: Record<string, Decision>): Listing[] {
  const current = currentCard(decisions);
  return LISTINGS.filter((l) => !(l.id in decisions) && l.id !== current?.id);
}

export function rankByFit(profile: Profile, pool: Listing[]): Listing[] {
  return [...pool].sort((a, b) => {
    const diff = fitScore(profile, b) - fitScore(profile, a);
    if (diff !== 0) return diff;
    return LISTINGS.indexOf(a) - LISTINGS.indexOf(b);
  });
}

export function decidedCount(decisions: Record<string, Decision>): number {
  return Object.keys(decisions).length;
}
