// native/src/evolve/r59/b/data.ts
// Deterministic dummy data for the Warehouse Intake Scan screen.
// No Math.random / Date.now / argument-less `new Date()` — every value below
// is a fixed literal. The screen's own index counter (incremented one step
// per press, in manifest order) is the only "progress" state, and it is
// computed purely from that counter plus this fixed array.

export type ManifestItem = {
  id: string;
  itemName: string;
  expectedCondition: string;
  // The condition actually found once the item is "scanned". Two of the six
  // entries deliberately differ from expectedCondition so the completed
  // summary has real flagged-mismatch content to show, not a placeholder.
  observedCondition: string;
};

export const SHIPMENT_ID = "CN-48217";

// Fixed manifest of six consigned packages, in the fixed order the worker
// scans them. Order is the only sequencing mechanism — there is no
// separate "step index" value stored anywhere else that could drift out of
// sync with this array's order.
export const MANIFEST: readonly ManifestItem[] = [
  {
    id: "PKG-7731",
    itemName: "Nike Air Max 90 (US 10)",
    expectedCondition: "Like New",
    observedCondition: "Like New",
  },
  {
    id: "PKG-7732",
    itemName: "Patagonia Better Sweater (M)",
    expectedCondition: "Good",
    observedCondition: "Good",
  },
  {
    id: "PKG-7733",
    itemName: "Rolex Oyster Perpetual 36mm",
    expectedCondition: "Excellent",
    observedCondition: "Fair",
  },
  {
    id: "PKG-7734",
    itemName: "Herman Miller Aeron Chair (Size B)",
    expectedCondition: "Good",
    observedCondition: "Good",
  },
  {
    id: "PKG-7735",
    itemName: "Canon EOS R6 Body",
    expectedCondition: "Like New",
    observedCondition: "Good",
  },
  {
    id: "PKG-7736",
    itemName: "Coach Leather Tote Bag",
    expectedCondition: "Excellent",
    observedCondition: "Excellent",
  },
] as const;
