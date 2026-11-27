// Static product-proof data for the Product Preview section. Independent of the Trust Breakdown
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

// One hand-picked, fixed Unsplash photo id (a pair of sneakers) reused for every card —
// controlled content, not a randomized image service.
export const PHOTO_ID = "1491553895911-0055eca6402d";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "runner-a",
    name: "Performance Runner, size 10",
    matchPercent: 94,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, full function test passed",
    verified: true,
    listPrice: 180,
    resalePrice: 118,
    reasoning: "Matches your saved search for this model under $130.",
  },
  {
    id: "runner-aplus",
    name: "Performance Runner, size 10, DS",
    matchPercent: 89,
    conditionGrade: "Grade A+",
    conditionNote: "Deadstock, no visible wear",
    verified: true,
    listPrice: 220,
    resalePrice: 176,
    reasoning: "Deadstock condition pushes price above your stated budget, lowering match score.",
  },
  {
    id: "runner-b",
    name: "Performance Runner, size 10",
    matchPercent: 76,
    conditionGrade: "Grade B",
    conditionNote: "Visible wear, mechanics unaffected",
    verified: true,
    listPrice: 180,
    resalePrice: 92,
    reasoning: "Lower grade than your stated preference pulls the match score down.",
  },
];
