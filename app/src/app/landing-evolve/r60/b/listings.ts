// Static product-proof data for the Product Preview section. Independent of the Triage Tree
// device's live state — this is catalog content (items for sale), not a trade-in valuation.

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

// One hand-picked, fixed Unsplash photo id (a laptop) reused for every card — controlled content,
// not a randomized image service.
export const PHOTO_ID = "1526170375885-4d8ecf77b99f";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "laptop-13-a",
    name: "13-inch Laptop, 256GB",
    matchPercent: 91,
    conditionGrade: "Grade A",
    conditionNote: "Clean display, full function test passed",
    verified: true,
    listPrice: 980,
    resalePrice: 702,
    reasoning: "Matches your saved search for this model under $750.",
  },
  {
    id: "laptop-13-aplus",
    name: "13-inch Laptop, 512GB",
    matchPercent: 83,
    conditionGrade: "Grade A+",
    conditionNote: "Like new, original box included",
    verified: true,
    listPrice: 1180,
    resalePrice: 896,
    reasoning: "Higher storage pushes price above your stated budget, lowering match score.",
  },
  {
    id: "laptop-13-b",
    name: "13-inch Laptop, 256GB",
    matchPercent: 72,
    conditionGrade: "Grade B",
    conditionNote: "Minor marks on the lid, display unaffected",
    verified: true,
    listPrice: 980,
    resalePrice: 489,
    reasoning: "Lower grade than your stated preference pulls the match score down.",
  },
];
