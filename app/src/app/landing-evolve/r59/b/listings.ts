// Static product-proof data for the Product Preview section. Independent of the frame scrubber's
// live state — this is catalog content, not a device output, except the Hero's single compact
// proof card, which overrides `conditionNote` price-ish framing is NOT overridden; only the
// Hero's confidence line (wired in Hero.tsx) reads the live replay result.

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

// One hand-picked, fixed Unsplash photo id (a smartwatch) reused for every card — controlled
// content, not a randomized image service.
export const PHOTO_ID = "1523275335684-37898b6baf30";

export function photoUrl(width: number): string {
  return `https://images.unsplash.com/photo-${PHOTO_ID}?w=${width}&q=80&auto=format&fit=crop`;
}

export function discountPercent(listing: Listing): number {
  return Math.round((1 - listing.resalePrice / listing.listPrice) * 100);
}

export const LISTINGS: Listing[] = [
  {
    id: "watch-steel",
    name: "Steel-case Smartwatch, GPS+Cellular",
    matchPercent: 93,
    conditionGrade: "Grade A",
    conditionNote: "Light wear, full function test passed",
    verified: true,
    listPrice: 1180,
    resalePrice: 820,
    reasoning: "Matches your saved search for a cellular model under $900.",
  },
  {
    id: "watch-alu",
    name: "Aluminum-case Smartwatch, GPS only",
    matchPercent: 85,
    conditionGrade: "Grade A+",
    conditionNote: "No visible wear, battery health 96%",
    verified: true,
    listPrice: 820,
    resalePrice: 640,
    reasoning: "No cellular radio, which was in your filters, so match score is lower.",
  },
  {
    id: "watch-b",
    name: "Steel-case Smartwatch, GPS+Cellular",
    matchPercent: 74,
    conditionGrade: "Grade B",
    conditionNote: "Visible wear, mechanics unaffected",
    verified: true,
    listPrice: 1180,
    resalePrice: 690,
    reasoning: "Lower grade than your stated preference pulls the match score down.",
  },
];
