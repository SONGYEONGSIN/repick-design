// native/src/evolve/r23/c/data.ts
// Deterministic dummy photo set for a single listing's photo manager.
// No Math.random / Date.now — fixed literals only.

export type ListingPhoto = {
  id: string;
  /** 1-based display order — position 1 renders as the cover slot in the grid. */
  order: number;
  /** cycles a small neutral swatch palette deterministically by index */
  swatchIndex: 0 | 1 | 2;
  isCover: boolean;
  /** short deterministic caption standing in for what the photo actually shows */
  label: string;
};

export const LISTING_TITLE = "Worn-once leather field jacket, size M";

export const MAX_PHOTOS = 12;

export const INITIAL_PHOTOS: ListingPhoto[] = [
  { id: "ph-01", order: 1, swatchIndex: 0, isCover: true, label: "Front, full length" },
  { id: "ph-02", order: 2, swatchIndex: 1, isCover: false, label: "Back, full length" },
  { id: "ph-03", order: 3, swatchIndex: 2, isCover: false, label: "Collar close-up" },
  { id: "ph-04", order: 4, swatchIndex: 0, isCover: false, label: "Interior lining" },
  { id: "ph-05", order: 5, swatchIndex: 1, isCover: false, label: "Left cuff detail" },
  { id: "ph-06", order: 6, swatchIndex: 2, isCover: false, label: "Right cuff detail" },
  { id: "ph-07", order: 7, swatchIndex: 0, isCover: false, label: "Zipper hardware" },
  { id: "ph-08", order: 8, swatchIndex: 1, isCover: false, label: "Interior pocket" },
  { id: "ph-09", order: 9, swatchIndex: 2, isCover: false, label: "Care label" },
  { id: "ph-10", order: 10, swatchIndex: 0, isCover: false, label: "Worn on model" },
];
