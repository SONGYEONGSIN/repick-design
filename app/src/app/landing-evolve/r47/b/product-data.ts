// Fixed listing data for the Product Preview section — distinct items from the hero's featured
// Sony a7 IV so the page shows breadth beyond the one listing running through the Checkpoint
// Deck. Photo ids are fixed, real Unsplash photos.

export interface ProductListing {
  id: string;
  title: string;
  brand: string;
  category: string;
  photoId: string;
  alt: string;
  grade: "A" | "B" | "C";
  matchPercent: number;
  matchReasoning: string;
  sellerLabel: string;
  priceOriginal: number;
  priceNow: number;
}

export const PRODUCTS: ProductListing[] = [
  {
    id: "jordan-1",
    title: "Air Jordan 1 Retro High",
    brand: "Nike",
    category: "Sneaker",
    photoId: "1542291026-7eec264c27ff",
    alt: "Air Jordan 1 Retro High sneaker, side profile on a plain background",
    grade: "B",
    matchPercent: 88,
    matchReasoning:
      "Sole wear sits within tolerance and the scan found no rebuild on either heel — the two things your saved search flags first on this model.",
    sellerLabel: "Verified seller · 212 sales",
    priceOriginal: 220,
    priceNow: 148,
  },
  {
    id: "peak-design",
    title: "Peak Design Everyday Backpack",
    brand: "Peak Design",
    category: "Bag",
    photoId: "1553062407-98eeb64c6a62",
    alt: "Peak Design Everyday Backpack, front view showing the main compartment and straps",
    grade: "A",
    matchPercent: 95,
    matchReasoning:
      "Zippers and load straps tested under tension with no failure, and the interior dividers are the exact configuration you filtered for.",
    sellerLabel: "Verified seller · 94 sales",
    priceOriginal: 280,
    priceNow: 189,
  },
  {
    id: "canon-rf",
    title: "Canon RF 24–70mm f/2.8L",
    brand: "Canon",
    category: "Lens",
    photoId: "1560243563-062bfc001d68",
    alt: "Canon RF 24–70mm f/2.8L camera lens standing upright",
    grade: "B",
    matchPercent: 83,
    matchReasoning:
      "Autofocus calibration passed on all three reference bodies; the only marks are cosmetic, on the hood you'd be replacing anyway.",
    sellerLabel: "Verified seller · 61 sales",
    priceOriginal: 2299,
    priceNow: 1540,
  },
  {
    id: "omega",
    title: "Omega Speedmaster Professional",
    brand: "Omega",
    category: "Watch",
    photoId: "1524805444758-089113d48a6d",
    alt: "Omega Speedmaster Professional chronograph watch face",
    grade: "A",
    matchPercent: 92,
    matchReasoning:
      "Movement was serviced within the last 12 months with papers on file — the exact service window your alert was set to catch.",
    sellerLabel: "Verified seller · 19 sales",
    priceOriginal: 6400,
    priceNow: 4288,
  },
];

export function discountPct(p: ProductListing): number {
  return Math.round((1 - p.priceNow / p.priceOriginal) * 100);
}
