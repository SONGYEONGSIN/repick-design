export interface ProductListing {
  id: string;
  title: string;
  brand: string;
  photoId: string;
  alt: string;
  matchPercent: number;
  matchReasoning: string;
  grade: "A" | "A-" | "B+" | "B";
  priceOriginal: number;
  priceNow: number;
  sellerLabel: string;
}

export function discountPct(p: ProductListing): number {
  return Math.round((1 - p.priceNow / p.priceOriginal) * 100);
}

export const PRODUCTS: readonly ProductListing[] = [
  {
    id: "p1",
    title: "Sony A7 III body, Grade A-",
    brand: "Sony",
    photoId: "1502920917128-1aa500764cbd",
    alt: "Photo of the Sony A7 III camera body listing",
    matchPercent: 96,
    matchReasoning: "Same sensor generation as your search history, verified shutter count under 8,000.",
    grade: "A-",
    priceOriginal: 1999,
    priceNow: 1380,
    sellerLabel: "Verified seller · 142 trades",
  },
  {
    id: "p2",
    title: "Canon RF 24-70mm f/2.8L lens",
    brand: "Canon",
    photoId: "1524805444758-089113d48a6d",
    alt: "Photo of the Canon RF 24-70mm lens listing",
    matchPercent: 91,
    matchReasoning: "Matches the mount on your last trade-in and stays under your stated budget.",
    grade: "A",
    priceOriginal: 2299,
    priceNow: 1640,
    sellerLabel: "Verified seller · 58 trades",
  },
  {
    id: "p3",
    title: "DJI Mic 2 wireless kit",
    brand: "DJI",
    photoId: "1543076447-215ad9ba6923",
    alt: "Photo of the DJI Mic 2 wireless kit listing",
    matchPercent: 88,
    matchReasoning: "Frequently traded alongside cameras in your grade range; full kit, no missing parts.",
    grade: "B+",
    priceOriginal: 299,
    priceNow: 198,
    sellerLabel: "Verified seller · 211 trades",
  },
  {
    id: "p4",
    title: "Peak Design Everyday backpack 20L",
    brand: "Peak Design",
    photoId: "1489987707025-afc232f7ea0f",
    alt: "Photo of the Peak Design Everyday backpack listing",
    matchPercent: 84,
    matchReasoning: "Fits the body-plus-two-lens kit size you traded in, light shelf wear only.",
    grade: "B",
    priceOriginal: 280,
    priceNow: 176,
    sellerLabel: "Verified seller · 97 trades",
  },
];
