// Fixed, deterministic data. No Math.random / Date.now / new Date() anywhere on this route --
// every number below is a literal, so the server and the client render identical output.

import type { ComponentType } from "react";
import { Boxes, HeartHandshake, Tag } from "lucide-react";

export type BucketId = "list" | "bundle" | "donate";

export type BucketDef = {
  id: BucketId;
  label: string; // also doubles as the per-card "Move to <label>" button text
  description: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  fillClass: string;
  onFillTextClass: string;
};

export const BUCKETS: BucketDef[] = [
  {
    id: "list",
    label: "List for cash",
    description:
      "Full condition check, photographed against a clean backdrop, and live in the marketplace within 48 hours.",
    icon: Tag,
    fillClass: "bg-[#16A34A]", // green-600, dark ink on top -- see tokens.ts
    onFillTextClass: "text-[#0B0B0F]",
  },
  {
    id: "bundle",
    label: "Bundle & discount",
    description:
      "Paired with similar pieces and sold together at a lower per-item price -- faster for mid-value items that move slowly alone.",
    icon: Boxes,
    fillClass: "bg-[#27272A]", // zinc-800, white on top
    onFillTextClass: "text-white",
  },
  {
    id: "donate",
    label: "Donate it",
    description:
      "Picked up free of charge and routed to a partner charity, with a certified receipt for your records.",
    icon: HeartHandshake,
    fillClass: "bg-[#D4D4D8]", // zinc-300, dark ink on top
    onFillTextClass: "text-[#0B0B0F]",
  },
];

export type Item = {
  id: string;
  name: string;
  category: string;
  grade: "Like New" | "Excellent" | "Good" | "Fair";
  listPrice: number; // what it would sell for if listed for cash
};

export const ITEMS: Item[] = [
  { id: "sneakers", name: "Trail Running Sneakers", category: "Footwear", grade: "Excellent", listPrice: 88 },
  { id: "jacket", name: "Northbound Field Jacket", category: "Outerwear", grade: "Like New", listPrice: 96 },
  { id: "bag", name: "Canvas Weekender Bag", category: "Bags", grade: "Good", listPrice: 141 },
  { id: "camera", name: "Compact 35 Film Camera", category: "Electronics", grade: "Good", listPrice: 110 },
  { id: "sweater", name: "Cashmere Crewneck Sweater", category: "Knitwear", grade: "Like New", listPrice: 142 },
  { id: "boots", name: "Leather Chelsea Boots", category: "Footwear", grade: "Good", listPrice: 74 },
  { id: "scarf", name: "Silk Twill Scarf", category: "Accessories", grade: "Good", listPrice: 22 },
  { id: "throw", name: "Vintage Wool Throw Blanket", category: "Home", grade: "Fair", listPrice: 18 },
];

// Non-empty default so the composition chart and verdict sentence render real data on first
// paint (the brief's own precedent argues against an empty first render).
export const DEFAULT_ASSIGNMENTS: Record<string, BucketId> = {
  sneakers: "list",
  jacket: "list",
  bag: "bundle",
  camera: "list",
  sweater: "list",
  boots: "list",
  scarf: "bundle",
  throw: "donate",
};

// A bundled item sells for 60% of its solo listing price -- bundling trades per-item price for
// faster combined turnover. Literal constant, used only inside the pure derive function in
// stats.ts, never read/written to a ref and never recomputed from a random source.
export const BUNDLE_RATE = 0.6;

export type Assignments = Record<string, BucketId>;
