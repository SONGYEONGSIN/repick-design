// Static product-proof data for the Product Preview section. Independent of the Zone Ledger
// device's live state — this is catalog content (items for sale), not a self-inspection output.

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

// One hand-picked, fixed Unsplash photo id (a smartphone) reused for every card and for the
// self-inspection photo — controlled content, not a randomized image service.
export const PHOTO_ID = "1500648767791-00dcc994a43e";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "handset-64",
    name: "Handset, 64GB",
    matchPercent: 90,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, all zones confirmed clean",
    verified: true,
    listPrice: 540,
    resalePrice: 422,
    reasoning: "Matches your saved search for this model under $440.",
  },
  {
    id: "handset-128",
    name: "Handset, 128GB",
    matchPercent: 84,
    conditionGrade: "Grade A+",
    conditionNote: "Like new, zero disclosed concerns",
    verified: true,
    listPrice: 640,
    resalePrice: 499,
    reasoning: "Higher storage pushes price above your stated budget, lowering match score.",
  },
  {
    id: "handset-64-b",
    name: "Handset, 64GB",
    matchPercent: 71,
    conditionGrade: "Grade B",
    conditionNote: "Seller disclosed screen and battery concerns",
    verified: true,
    listPrice: 540,
    resalePrice: 318,
    reasoning: "Disclosed concerns in two zones pulled the match score down versus your stated preference.",
  },
];
