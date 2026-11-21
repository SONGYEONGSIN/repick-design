// native/src/evolve/r36/c/data.ts
// Deterministic fixture data for the seller-facing Return Inspection Decision
// screen. No Math.random / Date.now / argument-less new Date() anywhere.

export type SubmittedPhoto = {
  id: string;
  swatchKey: "swatch1" | "swatch2" | "swatch3";
  caption: string;
};

export type ReturnInspectionCase = {
  orderCode: string;
  itemTitle: string;
  listedCondition: string;
  buyerStatedReason: string;
  buyerNote: string;
  refundAmountWon: number;
  arrivedOnLabel: string;
  photos: SubmittedPhoto[];
};

export const returnInspectionCase: ReturnInspectionCase = {
  orderCode: "RP-48213",
  itemTitle: "Merino wool half-zip pullover, size M",
  listedCondition: "Like new — worn twice, no pilling noted at listing",
  buyerStatedReason: "Item not as described",
  buyerNote:
    "Listing said no pilling, but there's visible pilling under both arms and a loose thread near the collar.",
  refundAmountWon: 38000,
  arrivedOnLabel: "Arrived at your return address: Oct 10",
  photos: [
    { id: "ph-1", swatchKey: "swatch1", caption: "Underarm, left sleeve" },
    { id: "ph-2", swatchKey: "swatch2", caption: "Collar, loose thread" },
    { id: "ph-3", swatchKey: "swatch3", caption: "Garment laid flat" },
  ],
};
