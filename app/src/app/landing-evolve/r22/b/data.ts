// Static data + pure derivation for the "Exploded Inspection Stack" hero widget.
// No randomness anywhere: every number on the page is a deterministic function of which
// inspection layers are currently switched on (a plain Set<LayerId> held in client state).

export type LayerId = "photos" | "inspection" | "authenticity" | "benchmark" | "seller";

export interface Layer {
  id: LayerId;
  label: string;
  /** Trust-score points this layer contributes when switched on. */
  weight: number;
  /** One-sentence evidence shown on the exploded card once the layer is on. */
  evidence: string;
  /** Short stat badge shown inside the card, always tabular-nums friendly. */
  stat: string;
}

export const LAYERS: Layer[] = [
  {
    id: "photos",
    label: "Photos Verified",
    weight: 10,
    evidence:
      "18 photos across 6 angles, plus a macro of the tailoring label so buyers can read it themselves.",
    stat: "18 photos · 6 angles",
  },
  {
    id: "inspection",
    label: "Physical Inspection",
    weight: 16,
    evidence:
      "An in-house inspector worked a 42-point checklist by hand — only the interior lining shows light wear.",
    stat: "41 of 42 points passed",
  },
  {
    id: "authenticity",
    label: "Authenticity Check",
    weight: 18,
    evidence:
      "Label stitching, lining weave, and button stamps cross-checked against the maker's 1987–1994 archive.",
    stat: "3-point archive match",
  },
  {
    id: "benchmark",
    label: "Price Benchmark",
    weight: 10,
    evidence: "Priced against 126 comparable sales of this coat and era closed in the last 90 days.",
    stat: "126 comparable sales",
  },
  {
    id: "seller",
    label: "Seller History",
    weight: 8,
    evidence: "This seller has closed 212 trades at 4.9 of 5 stars with zero disputes filed.",
    stat: "4.9 / 5 · 212 trades",
  },
];

export const TOTAL_WEIGHT = LAYERS.reduce((sum, l) => sum + l.weight, 0); // 62

export const ITEM = {
  name: "Vintage Wool Chesterfield Coat",
  detail: "Size 40R · Outerwear · 1990s archive",
  retail: 650,
  floorPrice: 185,
  ceilPrice: 340,
  baseTrust: 38,
  photoId: "1445205170230-053b83016050",
  alt: "Vintage wool Chesterfield coat hanging alone on a clothing rack",
  conditionGrade: "A-",
};

export interface ConditionPoint {
  label: string;
  pass: boolean;
  note?: string;
}

/** Public-facing 12-point condition rubric behind the letter grade shown in Product Preview. */
export const CONDITION_RUBRIC: ConditionPoint[] = [
  { label: "No stains or discoloration", pass: true },
  { label: "Original horn buttons present", pass: true },
  { label: "Lining seams fully stitched", pass: true },
  { label: "No moth or insect damage", pass: true },
  { label: "Collar retains original shape", pass: true },
  { label: "Cuffs show no fraying", pass: true },
  {
    label: "Interior lining free of visible wear",
    pass: false,
    note: "Light shine along the left interior seam — the one point holding this back from Grade A.",
  },
  { label: "Hem hangs level, no bunching", pass: true },
  { label: "Closures function smoothly", pass: true },
  { label: "No odor detected", pass: true },
  { label: "Fabric weight consistent with era", pass: true },
  { label: "Tailoring label legible and intact", pass: true },
];

export const AI_MATCH_TAGS: string[] = [
  "97% match to your saved “wool overcoat” search",
  "Era match: 1987–1994 archive stamp",
  "Fabric match: 100% virgin wool, verified weight",
];

export interface TrustTier {
  label: string;
  hint: string;
}

export function trustTier(trust: number): TrustTier {
  if (trust >= 90) return { label: "Fully Audited", hint: "Every layer is on. This is the strongest case the listing can make." };
  if (trust >= 70) return { label: "Trust-Reviewed", hint: "Most of the case is built. A couple more layers would close it out." };
  if (trust >= 50) return { label: "Partially Verified", hint: "Buyers see real evidence, but the price still reflects the gaps." };
  return { label: "Baseline Listing", hint: "No layers on yet — this is what an unverified listing looks like." };
}

export function computeTrust(active: Set<LayerId>): number {
  let sum = ITEM.baseTrust;
  for (const layer of LAYERS) if (active.has(layer.id)) sum += layer.weight;
  return sum;
}

export function computePrice(trust: number): number {
  const span = ITEM.ceilPrice - ITEM.floorPrice;
  const ratio = (trust - ITEM.baseTrust) / TOTAL_WEIGHT;
  return Math.round(ITEM.floorPrice + span * ratio);
}

export function discountPct(price: number): number {
  return Math.round((1 - price / ITEM.retail) * 100);
}

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I switched on every layer before I answered a single question. The price climbed from $185 to $329 right in front of me, and the buyer never asked me anything else.",
    name: "Priya Chandran",
    context: "Sold a leather jacket at Fully Audited",
    rating: 5,
  },
  {
    quote:
      "The inspection layer was the one that mattered to me. Forty-one of forty-two points passed, and I could see exactly which one didn't before I ever committed to a price.",
    name: "Marcus Webb",
    context: "Sold a mechanical watch",
    rating: 5,
  },
  {
    quote:
      "Buyers used to ask me to prove the brand was real. Now the authenticity layer answers that before the message even arrives.",
    name: "Fatima Noor",
    context: "Sold 9 items on repick",
    rating: 4,
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "81 / 100", label: "Average trust score at the moment of listing" },
  { value: "92%", label: "Buyers who open at least 3 layers before messaging" },
  { value: "3.1 days", label: "Median time to sold once every layer is on" },
];
