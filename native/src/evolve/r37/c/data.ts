// native/src/evolve/r37/c/data.ts
//
// Fixed dummy data for the Bundle Deal Builder screen — a seller picks 2+ of
// their own active listings to combine into one discounted bundle offer.
// Every price below is a fixed KRW integer (no Math.random / Date.now). The
// bundle discount rate and the resulting bundle price are both PURE
// functions of the selected listings — never a hand-typed number that
// happens to equal a computed sum.

export type SellerListingCondition = "new" | "likeNew" | "good" | "fair";

export type SellerListing = {
  id: string;
  title: string;
  categoryLabel: string;
  condition: SellerListingCondition;
  priceWon: number;
  // index into tokens.color.swatch1/2/3 — a deterministic cycle, not a
  // random placeholder color.
  swatchIndex: 1 | 2 | 3;
};

export const sellerActiveListings: SellerListing[] = [
  {
    id: "lst-canvas-tote",
    title: "Canvas Tote Backpack",
    categoryLabel: "Bags",
    condition: "good",
    priceWon: 28000,
    swatchIndex: 1,
  },
  {
    id: "lst-pourover-kettle",
    title: "Ceramic Pour-Over Kettle",
    categoryLabel: "Home",
    condition: "likeNew",
    priceWon: 34000,
    swatchIndex: 2,
  },
  {
    id: "lst-mech-keyboard",
    title: "Mechanical Keyboard, 65%",
    categoryLabel: "Electronics",
    condition: "good",
    priceWon: 52000,
    swatchIndex: 3,
  },
  {
    id: "lst-wool-scarf",
    title: "Wool Blend Scarf",
    categoryLabel: "Apparel",
    condition: "new",
    priceWon: 19000,
    swatchIndex: 1,
  },
  {
    id: "lst-board-game",
    title: "Tabletop Board Game: Settlers",
    categoryLabel: "Games",
    condition: "good",
    priceWon: 31000,
    swatchIndex: 2,
  },
  {
    id: "lst-desk-lamp",
    title: "Desk Lamp, Adjustable Arm",
    categoryLabel: "Home",
    condition: "fair",
    priceWon: 15000,
    swatchIndex: 3,
  },
  {
    id: "lst-film-camera",
    title: "Film Camera, 35mm",
    categoryLabel: "Electronics",
    condition: "likeNew",
    priceWon: 64000,
    swatchIndex: 1,
  },
  {
    id: "lst-running-shoes",
    title: "Running Shoes, Size 9",
    categoryLabel: "Apparel",
    condition: "good",
    priceWon: 37000,
    swatchIndex: 2,
  },
];

export function conditionLabel(condition: SellerListingCondition): string {
  switch (condition) {
    case "new":
      return "New";
    case "likeNew":
      return "Like new";
    case "good":
      return "Good";
    case "fair":
      return "Fair";
  }
}

// The bundle discount scales with how many items are bundled together — a
// fixed, deterministic step function, not a random or hand-typed value.
export function bundleDiscountRateForCount(count: number): number {
  if (count >= 4) return 0.18;
  if (count === 3) return 0.14;
  if (count === 2) return 0.1;
  return 0;
}

export type BundleQuote = {
  itemCount: number;
  subtotalWon: number;
  discountRate: number;
  bundlePriceWon: number;
  savingsWon: number;
};

// Pure function of the selected listings: the subtotal is the actual sum of
// the selected prices, the discount rate is derived from the count, and the
// bundle price/savings are both computed from those two — never hardcoded.
export function computeBundleQuote(selected: SellerListing[]): BundleQuote {
  const subtotalWon = selected.reduce((sum, listing) => sum + listing.priceWon, 0);
  const discountRate = bundleDiscountRateForCount(selected.length);
  const bundlePriceWon = Math.round(subtotalWon * (1 - discountRate));
  const savingsWon = subtotalWon - bundlePriceWon;
  return {
    itemCount: selected.length,
    subtotalWon,
    discountRate,
    bundlePriceWon,
    savingsWon,
  };
}

// Deliberate ₩-glyph choice (brief §1): give the symbol breathing room with a
// plain space before the digits, rather than a sibling-node or nesting-depth
// trick (both were independently falsified for this repo already).
export function formatWon(amountWon: number): string {
  const sign = amountWon < 0 ? "-" : "";
  const digits = Math.abs(Math.round(amountWon)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₩ ${grouped}`;
}
