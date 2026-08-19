// Deterministic listing pool for the Cascade live match feed.
// No randomness anywhere in this module — every field is a fixed literal, and every
// derived value (discounts, averages, distributions) is a pure function of that literal data.

export type Category = "outerwear" | "footwear" | "bags" | "accessories";
export type FilterId = "all" | Category;
export type Grade = "A+" | "A" | "A-" | "B+" | "B";

export interface MatchListing {
  id: string;
  category: Category;
  title: string;
  brand: string;
  photoId: string;
  /** Alt text framed as what the matching model observed in the photo set. */
  scan: string;
  price: number;
  originalPrice: number;
  matchPercent: number;
  grade: Grade;
  verified: boolean;
  listedAgo: string;
  tags: [string, string, string];
}

export const LISTINGS: MatchListing[] = [
  {
    id: "wool-trench",
    category: "outerwear",
    title: "Wool-Blend Trench Coat",
    brand: "Kova Studio",
    photoId: "photo-1490481651871-ab68de25d43d",
    scan: "AI scan: single-breasted wool-blend, belt intact, light shoulder wear",
    price: 128,
    originalPrice: 210,
    matchPercent: 96,
    grade: "A",
    verified: true,
    listedAgo: "4m ago",
    tags: [
      "Matches your saved search ‘minimalist outerwear’",
      "Priced 19% below 6 comparable listings",
      "Seller replies in under 2 hours on average",
    ],
  },
  {
    id: "shearling-bomber",
    category: "outerwear",
    title: "Shearling-Collar Bomber",
    brand: "Aldern & Row",
    photoId: "photo-1441986300917-64674bd600d8",
    scan: "AI scan: full-grain leather shell, shearling trim, even patina",
    price: 96,
    originalPrice: 165,
    matchPercent: 91,
    grade: "A-",
    verified: true,
    listedAgo: "11m ago",
    tags: [
      "Close match to 3 items in your saved closet",
      "Condition confirmed against 14 reference photos",
      "12 buyers are watching this listing",
    ],
  },
  {
    id: "quilted-field-jacket",
    category: "outerwear",
    title: "Quilted Field Jacket",
    brand: "Wynter Field",
    photoId: "photo-1445205170230-053b83016050",
    scan: "AI scan: quilted nylon shell, drawstring hem functional, faint scuff at left pocket",
    price: 65,
    originalPrice: 110,
    matchPercent: 89,
    grade: "B+",
    verified: true,
    listedAgo: "15m ago",
    tags: [
      "Matches your saved search ‘field jacket’",
      "Comparable listings average $102",
      "Seller has completed 19 verified sales",
    ],
  },
  {
    id: "waxed-chore-coat",
    category: "outerwear",
    title: "Waxed Canvas Chore Coat",
    brand: "Osmund Trade",
    photoId: "photo-1502920917128-1aa500764cbd",
    scan: "AI scan: waxed canvas body, corozo buttons, wax finish even across shoulders",
    price: 82,
    originalPrice: 135,
    matchPercent: 92,
    grade: "A-",
    verified: true,
    listedAgo: "27m ago",
    tags: [
      "Close match to 4 items you saved this month",
      "Wax finish condition confirmed on video",
      "Priced 39% below comparable listings",
    ],
  },
  {
    id: "canvas-trainers",
    category: "footwear",
    title: "Retro Canvas Trainers",
    brand: "Fieldstone",
    photoId: "photo-1552664730-d307ca884978",
    scan: "AI scan: canvas upper, rubber sole tread at 85%, no sole separation",
    price: 42,
    originalPrice: 78,
    matchPercent: 94,
    grade: "A",
    verified: true,
    listedAgo: "2m ago",
    tags: [
      "Matches your saved size and colorway filters",
      "Sole wear measured within your accepted range",
      "First listed 2 minutes ago",
    ],
  },
  {
    id: "leather-derby",
    category: "footwear",
    title: "Hand-Finished Leather Derby",
    brand: "Norrend",
    photoId: "photo-1523381210434-271e8be1f52b",
    scan: "AI scan: full-grain leather, resoled heel, light creasing at toe box",
    price: 74,
    originalPrice: 140,
    matchPercent: 88,
    grade: "B+",
    verified: false,
    listedAgo: "18m ago",
    tags: [
      "Matches your saved search ‘leather derby’",
      "Verification in progress — seller ID pending",
      "Priced 8% below the category average",
    ],
  },
  {
    id: "suede-desert-boots",
    category: "footwear",
    title: "Suede Desert Boots",
    brand: "Cabrillo",
    photoId: "photo-1519085360753-af0119f7cbe7",
    scan: "AI scan: suede upper, crepe sole even wear, light watermarking near toe",
    price: 51,
    originalPrice: 89,
    matchPercent: 90,
    grade: "A-",
    verified: false,
    listedAgo: "22m ago",
    tags: [
      "Matches your saved size 9.5",
      "Verification in progress — seller ID pending",
      "Watermark pattern flagged for your review",
    ],
  },
  {
    id: "court-sneakers",
    category: "footwear",
    title: "Classic Court Sneakers",
    brand: "Rennick & Sons",
    photoId: "photo-1633332755192-727a05c4013d",
    scan: "AI scan: leather upper, midsole yellowing minimal, original laces present",
    price: 38,
    originalPrice: 70,
    matchPercent: 86,
    grade: "B+",
    verified: true,
    listedAgo: "40m ago",
    tags: [
      "Matches your saved search ‘court sneakers’",
      "Midsole condition confirmed in 5 close-up frames",
      "9 buyers viewed this listing today",
    ],
  },
  {
    id: "canvas-weekender",
    category: "bags",
    title: "Waxed Canvas Weekender",
    brand: "Portside Supply",
    photoId: "photo-1509631179647-0177331693ae",
    scan: "AI scan: waxed canvas body, brass hardware, interior lining intact",
    price: 58,
    originalPrice: 95,
    matchPercent: 93,
    grade: "A-",
    verified: true,
    listedAgo: "7m ago",
    tags: [
      "Matches your saved search ‘weekend bag’",
      "Hardware condition confirmed in 8 close-up frames",
      "Comparable listings average $89",
    ],
  },
  {
    id: "leather-satchel",
    category: "bags",
    title: "Structured Leather Satchel",
    brand: "Halden Co.",
    photoId: "photo-1531123897727-8f129e1688ce",
    scan: "AI scan: structured leather panel, brass buckles, corners show light wear",
    price: 89,
    originalPrice: 160,
    matchPercent: 90,
    grade: "A-",
    verified: true,
    listedAgo: "24m ago",
    tags: [
      "Close match to 2 items you saved this week",
      "Corner wear falls within your condition threshold",
      "Seller has completed 41 verified sales",
    ],
  },
  {
    id: "canvas-crossbody",
    category: "bags",
    title: "Canvas Crossbody",
    brand: "Marrow Goods",
    photoId: "photo-1489987707025-afc232f7ea0f",
    scan: "AI scan: canvas body, adjustable strap intact, interior pocket clean",
    price: 34,
    originalPrice: 58,
    matchPercent: 91,
    grade: "A-",
    verified: true,
    listedAgo: "9m ago",
    tags: [
      "Matches your saved search ‘crossbody bag’",
      "Strap hardware confirmed secure on video",
      "Priced 41% below comparable listings",
    ],
  },
  {
    id: "top-handle-tote",
    category: "bags",
    title: "Top-Handle Tote",
    brand: "Tiller & Vane",
    photoId: "photo-1553062407-98eeb64c6a62",
    scan: "AI scan: structured tote, corner wear visible, lining shows light staining",
    price: 71,
    originalPrice: 125,
    matchPercent: 87,
    grade: "B+",
    verified: false,
    listedAgo: "31m ago",
    tags: [
      "Matches your saved search ‘work tote’",
      "Verification in progress — seller ID pending",
      "Lining condition flagged for your review",
    ],
  },
  {
    id: "auto-chronograph",
    category: "accessories",
    title: "Automatic Chronograph",
    brand: "Verlan",
    photoId: "photo-1500648767791-00dcc994a43e",
    scan: "AI scan: stainless case, sapphire crystal clear, movement ticking on video",
    price: 210,
    originalPrice: 340,
    matchPercent: 97,
    grade: "A+",
    verified: true,
    listedAgo: "1m ago",
    tags: [
      "Matches your saved search ‘automatic chronograph’",
      "Movement verified by a 6-second video check",
      "Priced 38% below retail comparables",
    ],
  },
  {
    id: "steel-dial-watch",
    category: "accessories",
    title: "Minimal Steel Dial Watch",
    brand: "Nordec",
    photoId: "photo-1524504388940-b1c1722653e1",
    scan: "AI scan: brushed steel case, hairline scratches near the crown",
    price: 118,
    originalPrice: 190,
    matchPercent: 85,
    grade: "B+",
    verified: false,
    listedAgo: "33m ago",
    tags: [
      "Matches your saved search ‘minimal dial’",
      "Verification in progress — seller ID pending",
      "Scratch pattern flagged for your review",
    ],
  },
  {
    id: "aviator-sunglasses",
    category: "accessories",
    title: "Vintage Aviator Sunglasses",
    brand: "Aurelia Optics",
    photoId: "photo-1543076447-215ad9ba6923",
    scan: "AI scan: metal frame, polarized lenses scratch-free, hinge tension even",
    price: 48,
    originalPrice: 85,
    matchPercent: 93,
    grade: "A-",
    verified: true,
    listedAgo: "6m ago",
    tags: [
      "Matches your saved search ‘aviator sunglasses’",
      "Lens clarity confirmed in a macro frame",
      "Comparable listings average $76",
    ],
  },
  {
    id: "chain-bracelet",
    category: "accessories",
    title: "Sterling Chain Bracelet",
    brand: "Kessler & Vane",
    photoId: "photo-1519219788971-8d9797e0928e",
    scan: "AI scan: sterling silver links, clasp mechanism tested, light tarnish near clasp",
    price: 55,
    originalPrice: 98,
    matchPercent: 84,
    grade: "B",
    verified: true,
    listedAgo: "45m ago",
    tags: [
      "Matches your saved search ‘silver bracelet’",
      "Clasp function confirmed on video",
      "Priced 44% below comparable listings",
    ],
  },
];

export const CATEGORY_FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "outerwear", label: "Outerwear" },
  { id: "footwear", label: "Footwear" },
  { id: "bags", label: "Bags" },
  { id: "accessories", label: "Accessories" },
];

export const GRADES: Grade[] = ["A+", "A", "A-", "B+", "B"];

export function discountPercent(listing: MatchListing): number {
  return Math.round(
    ((listing.originalPrice - listing.price) / listing.originalPrice) * 100,
  );
}

export function filterListings(filter: FilterId): MatchListing[] {
  if (filter === "all") return LISTINGS;
  return LISTINGS.filter((listing) => listing.category === filter);
}

export interface StreamStats {
  count: number;
  avgMatch: number;
  avgSavings: number;
  verifiedCount: number;
}

export function streamStats(listings: MatchListing[]): StreamStats {
  if (listings.length === 0) {
    return { count: 0, avgMatch: 0, avgSavings: 0, verifiedCount: 0 };
  }
  const avgMatch = Math.round(
    listings.reduce((sum, l) => sum + l.matchPercent, 0) / listings.length,
  );
  const avgSavings = Math.round(
    listings.reduce((sum, l) => sum + discountPercent(l), 0) / listings.length,
  );
  const verifiedCount = listings.filter((l) => l.verified).length;
  return { count: listings.length, avgMatch, avgSavings, verifiedCount };
}

export interface GradeBucket {
  grade: Grade;
  count: number;
  ratio: number;
}

export function gradeDistribution(listings: MatchListing[]): GradeBucket[] {
  const maxCount = GRADES.reduce((max, g) => {
    const c = listings.filter((l) => l.grade === g).length;
    return c > max ? c : max;
  }, 0);
  return GRADES.map((grade) => {
    const count = listings.filter((l) => l.grade === grade).length;
    const ratio = maxCount === 0 ? 0 : Math.round((count / maxCount) * 100) / 100;
    return { grade, count, ratio };
  });
}

export function photoUrl(photoId: string, width: number): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}
