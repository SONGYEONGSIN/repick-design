// Static data + pure derivation for the "Price Bridge" hero widget.
//
// Every number that moves on this page is a deterministic function of which bridge factors are
// switched on (a Set<FactorId> held in client state), applied in a fixed order to one fixed
// literal starting price. There is no randomness anywhere in this module — `computeBridge` and
// `DOMAIN` are both pure functions of the FACTORS array below, so the same toggle combination
// always produces the same bars, the same running total and the same closing-CTA sentence.

export type FactorId =
  | "feeWaived"
  | "authIncluded"
  | "conditionAdj"
  | "bundleSavings"
  | "trustPremium"
  | "fastSale";

export interface Factor {
  id: FactorId;
  /** Short label shown on the toggle chip and under the bar. */
  label: string;
  /** One sentence explaining why the AI applies this adjustment. */
  detail: string;
  /** Fixed literal dollar delta — positive raises the running total, negative lowers it. */
  delta: number;
  /** Whether this factor is active on first paint. */
  defaultOn: boolean;
}

export const ITEM = {
  name: "Nikon FM2 35mm Film Camera",
  category: "Cameras & Optics",
  detail: "Mechanical body, 50mm f/1.8 lens, working meter — fully serviced.",
  photoId: "1495707902641-75cac588d2e9",
  alt: "A black Nikon FM2 35mm film camera with a 50mm lens resting on a wooden surface",
  matchPct: 94,
  conditionGrade: "B+" as const,
  sellerTrades: 142,
  sellerRating: 4.8,
};

/** The naive comparable-retail number the bridge starts from. Never toggled, always the first bar. */
export const LIST_PRICE = 620;

// Order is the bridge sequence itself — toggling a factor off removes exactly this column and
// every column after it shifts to start from the new running total.
export const FACTORS: Factor[] = [
  {
    id: "feeWaived",
    label: "Platform fee waived",
    detail: "Repick removes the 10% marketplace cut most resale apps charge the seller.",
    delta: -62,
    defaultOn: true,
  },
  {
    id: "authIncluded",
    label: "Certified authentication",
    detail: "A specialist checks the serial number and shutter — verified gear earns a premium.",
    delta: 24,
    defaultOn: true,
  },
  {
    id: "conditionAdj",
    label: "Condition grade B+ adjustment",
    detail: "Brassing on two corners and a worn strap lug bring this unit down from mint.",
    delta: -58,
    defaultOn: true,
  },
  {
    id: "bundleSavings",
    label: "Bundle savings (case + lens cap)",
    detail: "Included accessories are only priced in when the seller bundles them at listing.",
    delta: -15,
    defaultOn: false,
  },
  {
    id: "trustPremium",
    label: "Verified-seller trust premium",
    detail: "Sellers with 100+ completed trades and ID verification earn back some margin.",
    delta: 11,
    defaultOn: false,
  },
  {
    id: "fastSale",
    label: "Fast-sale incentive",
    detail: "Pricing 2% under market average clears a listing in 9 days on average, not 30.",
    delta: -12,
    defaultOn: true,
  },
];

export const DEFAULT_ACTIVE: ReadonlySet<FactorId> = new Set(
  FACTORS.filter((f) => f.defaultOn).map((f) => f.id),
);

export function money(n: number): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
}

/** Same formatting as `money`, but always shows an explicit +/− sign — used for factor deltas,
 * where the sign is the whole point (never for absolute prices like list/your price). */
export function moneySigned(n: number): string {
  const sign = n < 0 ? "−" : "+";
  return `${sign}$${Math.round(Math.abs(n)).toLocaleString("en-US")}`;
}

export interface BridgeStep {
  id: FactorId;
  label: string;
  delta: number;
  from: number;
  to: number;
}

export interface BridgeResult {
  steps: BridgeStep[];
  finalPrice: number;
  totalAdjustment: number;
  pctOff: number;
}

/** Walks FACTORS in fixed order, skipping inactive ones, and returns the running-total sequence. */
export function computeBridge(active: ReadonlySet<FactorId>): BridgeResult {
  let running = LIST_PRICE;
  const steps: BridgeStep[] = [];
  for (const f of FACTORS) {
    if (!active.has(f.id)) continue;
    const from = running;
    const to = round2(running + f.delta);
    steps.push({ id: f.id, label: f.label, delta: f.delta, from, to });
    running = to;
  }
  const totalAdjustment = round2(running - LIST_PRICE);
  const pctOff = round2(((LIST_PRICE - running) / LIST_PRICE) * 100);
  return { steps, finalPrice: running, totalAdjustment, pctOff };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The chart needs one fixed Y domain so bars don't rescale the whole chart every time a factor is
 * toggled. Rather than eyeball a min/max, this enumerates all 2^6 = 64 on/off combinations (cheap,
 * runs once at module load, still fully deterministic — no Math.random, no Date.now) and records
 * the lowest and highest running total reached at ANY step along the way, not just the final price.
 */
function computeDomain(): { min: number; max: number } {
  let min = LIST_PRICE;
  let max = LIST_PRICE;
  const n = FACTORS.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    let running = LIST_PRICE;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        running = round2(running + FACTORS[i].delta);
        if (running < min) min = running;
        if (running > max) max = running;
      }
    }
  }
  return { min, max };
}

export const DOMAIN = computeDomain();

export const CONDITION_RUBRIC: { label: string; note?: string; pass: boolean }[] = [
  { label: "Body & mount free of dents", pass: true },
  { label: "Shutter speeds accurate 1/1000–1s", pass: true },
  { label: "Light meter reads within 1/3 stop", pass: true },
  { label: "Viewfinder free of fungus or haze", pass: true },
  { label: "Corners free of brassing", note: "Brassing present on two corners", pass: false },
  { label: "Strap lugs unworn", note: "Left lug shows light wear", pass: false },
];

export const AI_MATCH_TAGS = [
  "Serial number matches Nikon's 1982–83 FM2 production block",
  "Shutter-speed test recorded within spec on all 8 settings",
  "Listing photos cross-checked against 41 verified FM2 sales",
];

export const TESTIMONIALS = [
  {
    name: "Priya R.",
    context: "Sold a Rolleiflex TLR",
    quote:
      "I could see exactly why my price went from $940 to $781 — no black box, just a list I could toggle.",
    rating: 5,
  },
  {
    name: "Dae-ho K.",
    context: "Sold a Leica lens set",
    quote:
      "Turning off the bundle discount and watching the price jump back up in real time sold me on the app.",
    rating: 5,
  },
  {
    name: "Marisol T.",
    context: "Sold a Hasselblad body",
    quote:
      "Every other app just gives you a number. Repick shows its work like a real appraiser would.",
    rating: 4,
  },
];

export const TRUST_STATS = [
  { label: "Bridges shown to sellers", value: "38,400+" },
  { label: "Median accuracy vs. final sale", value: "± 3.1%" },
  { label: "Sellers who kept the default bridge", value: "71%" },
];
