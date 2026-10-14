// Deterministic savings math for the waterfall device (round r34, candidate b).
// Nothing here reads Math.random / Date.now / new Date() — every figure is a fixed literal and
// every derived number is a pure function of the toggle state, so server and client, and every
// re-render, land on exactly the same numbers.

export interface ToggleDef {
  id: ToggleId;
  /** Full label shown next to the switch. */
  label: string;
  /** Short label used under the waterfall bar (kept tight so narrow bars still fit it). */
  shortLabel: string;
  /** One-line description of who qualifies. */
  caption: string;
  /** Dollars this condition subtracts from the running price, when switched on. */
  amount: number;
}

export type ToggleId =
  | "pickup"
  | "bundle"
  | "firstTime"
  | "offPeak"
  | "student";

// Fixed catalog order. The waterfall always walks the toggles in THIS order regardless of the
// order a visitor flips them in, so the chart never reshuffles — only bars for toggles that are
// currently off disappear, the rest hold their place.
export const TOGGLES: ToggleDef[] = [
  {
    id: "pickup",
    label: "Free local pickup",
    shortLabel: "Pickup",
    caption: "You collect it yourself, no courier.",
    amount: 8,
  },
  {
    id: "bundle",
    label: "Bundle 2+ items",
    shortLabel: "Bundle",
    caption: "Buying this alongside another listing.",
    amount: 14,
  },
  {
    id: "firstTime",
    label: "First-time buyer",
    shortLabel: "First order",
    caption: "Your account's first completed order.",
    amount: 10,
  },
  {
    id: "offPeak",
    label: "Off-peak pickup window",
    shortLabel: "Off-peak",
    caption: "Tue–Thu, 10am–2pm collection.",
    amount: 6,
  },
  {
    id: "student",
    label: "Student verified",
    shortLabel: "Student",
    caption: ".edu email confirmed on file.",
    amount: 9,
  },
];

export type ToggleState = Record<ToggleId, boolean>;

export const DEFAULT_TOGGLES: ToggleState = {
  pickup: false,
  bundle: false,
  firstTime: false,
  offPeak: false,
  student: false,
};

// The listing this device prices. $140 is the already-reduced resale listing price before any
// qualifying condition is applied; $210 is the item's original retail price, used only to show
// the all-in discount against retail on the closing stat.
export const BASE_PRICE = 140;
export const RETAIL_PRICE = 210;

export interface WaterfallSegment {
  kind: "base" | "discount" | "final";
  id: string;
  label: string;
  valueLabel: string;
  /** Higher price level this segment's bar starts from (base price scale, dollars). */
  priceStart: number;
  /** Lower price level this segment's bar ends at (base price scale, dollars). */
  priceEnd: number;
  amount?: number;
}

export interface WaterfallResult {
  segments: WaterfallSegment[];
  finalPrice: number;
  totalSavings: number;
  enabledCount: number;
  /** Savings as a % of the $140 listing price. */
  savingsPct: number;
  /** All-in discount as a % of the $210 retail price. */
  retailDiscountPct: number;
}

export function computeWaterfall(toggles: ToggleState): WaterfallResult {
  let running = BASE_PRICE;
  const segments: WaterfallSegment[] = [
    {
      kind: "base",
      id: "base",
      label: "Listing",
      valueLabel: `$${BASE_PRICE}`,
      priceStart: BASE_PRICE,
      priceEnd: BASE_PRICE,
    },
  ];

  let enabledCount = 0;
  for (const toggle of TOGGLES) {
    if (!toggles[toggle.id]) continue;
    enabledCount += 1;
    const priceStart = running;
    const priceEnd = running - toggle.amount;
    segments.push({
      kind: "discount",
      id: toggle.id,
      label: toggle.shortLabel,
      valueLabel: `−$${toggle.amount}`,
      priceStart,
      priceEnd,
      amount: toggle.amount,
    });
    running = priceEnd;
  }

  const finalPrice = running;
  segments.push({
    kind: "final",
    id: "final",
    label: "Your price",
    valueLabel: `$${finalPrice}`,
    priceStart: finalPrice,
    priceEnd: finalPrice,
  });

  const totalSavings = BASE_PRICE - finalPrice;
  const savingsPct = Math.round((totalSavings / BASE_PRICE) * 100);
  const retailDiscountPct = Math.round(
    ((RETAIL_PRICE - finalPrice) / RETAIL_PRICE) * 100,
  );

  return {
    segments,
    finalPrice,
    totalSavings,
    enabledCount,
    savingsPct,
    retailDiscountPct,
  };
}

export function activeToggleCount(toggles: ToggleState): number {
  return TOGGLES.reduce((n, t) => n + (toggles[t.id] ? 1 : 0), 0);
}

export function describeActiveToggles(toggles: ToggleState): string {
  const active = TOGGLES.filter((t) => toggles[t.id]).map((t) => t.shortLabel);
  if (active.length === 0) return "no conditions switched on yet";
  if (active.length === TOGGLES.length) return "every qualifying condition";
  return active.join(", ");
}
