// Static product-proof data for the Product Preview section. Independent of the ladder device's
// live state — this is catalog content, not a device output, except the Hero's single compact
// proof card, which overrides `conditionGrade` with the ladder's current selection (wired in
// Hero.tsx) rather than reading this static field.

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

// One hand-picked, fixed Unsplash photo id (a laptop on a desk) reused for every card — controlled
// content, not a randomized image service.
export const PHOTO_ID = "1496181133206-80ce9b11a8f3";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "ultrabook",
    name: "14-inch Ultrabook, 16GB",
    matchPercent: 95,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, full function test passed",
    verified: true,
    listPrice: 1340,
    resalePrice: 1040,
    reasoning: "Matches your saved search for a 16GB config under $1,100.",
  },
  {
    id: "ultrabook-touch",
    name: "14-inch Ultrabook, touch, 16GB",
    matchPercent: 91,
    conditionGrade: "Grade A+",
    conditionNote: "No visible wear, battery health 97%",
    verified: true,
    listPrice: 1520,
    resalePrice: 1260,
    reasoning: "Touch display not in your filters, so match score is slightly lower.",
  },
  {
    id: "ultrabook-b",
    name: "14-inch Ultrabook, 8GB",
    matchPercent: 78,
    conditionGrade: "Grade B",
    conditionNote: "Visible wear, mechanics unaffected",
    verified: true,
    listPrice: 980,
    resalePrice: 700,
    reasoning: "Memory below your stated 16GB preference lowers the match score.",
  },
];
