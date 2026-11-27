// Static product-proof data for the Product Preview section. Independent of the Timing Dial
// device's live state — this is catalog content, not a device output.

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

// One hand-picked, fixed Unsplash photo id (a smartphone) reused for every card — controlled
// content, not a randomized image service.
export const PHOTO_ID = "1512790182412-b19e6d62bc39";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "flagship-128",
    name: "Flagship Phone, 128GB",
    matchPercent: 92,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, battery health 91%",
    verified: true,
    listPrice: 620,
    resalePrice: 448,
    reasoning: "Matches your saved search for this model under $460.",
  },
  {
    id: "flagship-256",
    name: "Flagship Phone, 256GB",
    matchPercent: 85,
    conditionGrade: "Grade A+",
    conditionNote: "Like new, battery health 98%",
    verified: true,
    listPrice: 740,
    resalePrice: 537,
    reasoning: "Higher storage pushes price above your stated budget, lowering match score.",
  },
  {
    id: "flagship-128-b",
    name: "Flagship Phone, 128GB",
    matchPercent: 74,
    conditionGrade: "Grade B",
    conditionNote: "Visible scuffs, battery health 84%",
    verified: true,
    listPrice: 620,
    resalePrice: 291,
    reasoning: "Lower grade and battery health than your stated preference pulls the match score down.",
  },
];
