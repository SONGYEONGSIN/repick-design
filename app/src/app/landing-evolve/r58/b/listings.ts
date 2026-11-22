// Static product-proof data for the Product Preview section and the Hero proof card. Independent
// of the coverage device's live state — this is catalog content, not a device output, so it is
// never cited as if it were derived from `deriveCoverage`.

export interface Listing {
  id: string;
  name: string;
  matchPercent: number;
  conditionGrade: string;
  conditionNote: string;
  verified: boolean;
  listPrice: number;
  resalePrice: number;
  reasoning: string;
}

// One hand-picked, fixed Unsplash photo id (a mirrorless camera on a wooden surface) reused for
// every card. Controlled content, not a randomized image service.
export const PHOTO_ID = "1502920917128-1aa500764cbd";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "kit",
    name: "Mirrorless Camera Kit",
    matchPercent: 96,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, full function test passed",
    verified: true,
    listPrice: 1850,
    resalePrice: 1240,
    reasoning: "Matches your saved search for a compact full-frame body under $1,300.",
  },
  {
    id: "body",
    name: "Mirrorless Body Only",
    matchPercent: 89,
    conditionGrade: "Grade B",
    conditionNote: "Visible shelf wear, mechanics unaffected",
    verified: true,
    listPrice: 1420,
    resalePrice: 980,
    reasoning: "Matches your budget filter; lens not included, so match score is lower.",
  },
  {
    id: "bundle",
    name: "Camera + Zoom Lens Bundle",
    matchPercent: 92,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, includes original strap",
    verified: true,
    listPrice: 2300,
    resalePrice: 1590,
    reasoning: "Matches your interest in a travel zoom; priced above your saved range.",
  },
];
