// Deterministic data for the "Trust Web" landing — a node/edge verification graph.
// No Math.random() / Date.now() anywhere: every number below is a fixed literal, and every
// derived value (confidence, active edges, active nodes) is a pure function of the toggle state
// the visitor controls. See candidates/b.md "브리프에 없던 것" for the weight/coordinate rationale.

export type LayerId = "aiScan" | "inspection" | "sellerHistory" | "escrowHold";
export type NodeId = LayerId | "seller" | "item" | "buyer";

export type GraphNode = {
  id: NodeId;
  label: string;
  kind: "anchor" | "layer";
  x: number;
  y: number;
  detail: string;
};

export type GraphEdge = {
  id: string;
  from: NodeId;
  to: NodeId;
  dependsOn: "base" | LayerId;
};

export type Layer = {
  id: LayerId;
  label: string;
  weight: number;
  description: string;
};

// SVG viewBox size the graph is hand-laid-out against. 760x420 reduces to 38:21 — that ratio is
// also the Tailwind aspect-[] class the graph container uses, so the overlayed HTML node markers
// (positioned by percentage) always line up with the SVG edges (positioned by viewBox units)
// with no letterboxing at any container width.
export const VIEW_W = 760;
export const VIEW_H = 420;

// The one weight that isn't behind a toggle: the base seller→item→buyer chain always exists for
// any repick sale. It is what the graph shows when every layer is switched off — never 0%.
export const BASE_WEIGHT = 15;

export const LAYERS: Layer[] = [
  {
    id: "aiScan",
    label: "Photo AI scan",
    weight: 22,
    description:
      "Computer-vision match against 40,000 authenticated reference photos for this exact model.",
  },
  {
    id: "inspection",
    label: "Manual inspection",
    weight: 28,
    description:
      "A repick specialist re-checks case, movement and strap by hand against the public condition rubric.",
  },
  {
    id: "sellerHistory",
    label: "Seller history check",
    weight: 18,
    description:
      "The seller's last 50 trades are checked for return rate and open disputes before listing.",
  },
  {
    id: "escrowHold",
    label: "Escrow hold",
    weight: 17,
    description:
      "Payment is held in escrow until the buyer confirms the item matches every active layer above.",
  },
];

// Default state: some layers on, some off — never the 0% or 100% boundary. See b.md §5.
export const DEFAULT_ACTIVE: LayerId[] = ["aiScan", "sellerHistory", "escrowHold"];

export const NODES: GraphNode[] = [
  {
    id: "seller",
    label: "Seller",
    kind: "anchor",
    x: 70,
    y: 210,
    detail: "Sana R. — verified repick seller, trading since 2023.",
  },
  {
    id: "item",
    label: "Item",
    kind: "anchor",
    x: 250,
    y: 210,
    detail: "The listing itself — condition-graded before it ever reaches escrow.",
  },
  {
    id: "aiScan",
    label: "AI Scan",
    kind: "layer",
    x: 430,
    y: 90,
    detail: "Computer-vision match against 40,000 authenticated reference photos for this model.",
  },
  {
    id: "inspection",
    label: "Inspection",
    kind: "layer",
    x: 430,
    y: 210,
    detail: "A specialist re-checks case, movement and strap against the public condition rubric.",
  },
  {
    id: "sellerHistory",
    label: "Seller History",
    kind: "layer",
    x: 430,
    y: 330,
    detail: "The seller's last 50 trades are checked for return rate and open disputes.",
  },
  {
    id: "escrowHold",
    label: "Escrow",
    kind: "layer",
    x: 600,
    y: 210,
    detail: "Payment is held until the buyer confirms the item matches every active layer.",
  },
  {
    id: "buyer",
    label: "Buyer",
    kind: "anchor",
    x: 690,
    y: 210,
    detail: "You — funds release to the seller only after every active layer clears.",
  },
];

export const EDGES: GraphEdge[] = [
  { id: "seller-item", from: "seller", to: "item", dependsOn: "base" },
  { id: "item-aiScan", from: "item", to: "aiScan", dependsOn: "aiScan" },
  { id: "item-inspection", from: "item", to: "inspection", dependsOn: "inspection" },
  { id: "seller-sellerHistory", from: "seller", to: "sellerHistory", dependsOn: "sellerHistory" },
  { id: "aiScan-escrow", from: "aiScan", to: "escrowHold", dependsOn: "aiScan" },
  { id: "inspection-escrow", from: "inspection", to: "escrowHold", dependsOn: "inspection" },
  { id: "sellerHistory-escrow", from: "sellerHistory", to: "escrowHold", dependsOn: "sellerHistory" },
  { id: "escrow-buyer", from: "escrowHold", to: "buyer", dependsOn: "escrowHold" },
];

export function isNodeActive(node: GraphNode, active: Set<LayerId>): boolean {
  return node.kind === "anchor" || active.has(node.id as LayerId);
}

export function isEdgeActive(edge: GraphEdge, active: Set<LayerId>): boolean {
  return edge.dependsOn === "base" || active.has(edge.dependsOn);
}

// The real, non-trivial computation the brief requires: a fixed base weight plus a literal
// per-layer weight for every currently-active layer. Toggling any layer changes this sum.
export function confidenceOf(active: Set<LayerId>): number {
  return LAYERS.reduce((sum, layer) => sum + (active.has(layer.id) ? layer.weight : 0), BASE_WEIGHT);
}

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function discountPct(ask: number, appraised: number): number {
  return Math.round((1 - ask / appraised) * 100);
}

export const ITEM = {
  name: "Seiko automatic dress watch",
  category: "Watches",
  detail: "Automatic movement · sapphire crystal · original leather strap",
  askPrice: 220,
  appraisedValue: 340,
  match: 82,
  conditionGrade: "B",
  verified: true,
  sellerTrades: 61,
  sellerRating: 4.8,
  photoId: "1523275335684-37898b6baf30",
  alt: "Silver automatic dress watch with a brown leather strap",
};

export const AI_MATCH_TAGS = [
  "Automatic movement — matches your saved filter",
  "Same watch family as 2 items in your saved list",
  "Priced under every comparable sale this quarter",
];

export const CONDITION_RUBRIC: { label: string; note?: string; pass: boolean }[] = [
  { label: "Case & crystal", note: "No cracks; hairline marks only under the bezel", pass: true },
  { label: "Movement service", note: "Serviced within the last 18 months, timing verified", pass: true },
  { label: "Strap & buckle", note: "Original leather strap, light natural patina", pass: true },
  { label: "Water resistance test", note: "Not retested since last service", pass: false },
  { label: "Original box & papers", note: "Box included; papers not available", pass: false },
];

export const TESTIMONIALS: { name: string; quote: string; rating: number; context: string }[] = [
  {
    name: "Priya M.",
    quote:
      "I could see exactly which checks had run before I paid — not just a badge, the whole chain.",
    rating: 5,
    context: "Bought a camera, Portland",
  },
  {
    name: "Devon K.",
    quote: "Escrow held the payment until I confirmed the watch matched the listing. Zero risk.",
    rating: 5,
    context: "Bought a watch, Austin",
  },
  {
    name: "Lena W.",
    quote: "As a seller, turning on manual inspection myself bumped buyer confidence visibly.",
    rating: 4,
    context: "Sold furniture, Chicago",
  },
];

export const TRUST_STATS: { label: string; value: string }[] = [
  { label: "Verified sellers", value: "12,400+" },
  { label: "Escrow-protected sales", value: "38,900" },
  { label: "Avg. trust confidence at sale", value: "84%" },
];
