// Shared derivation for the "Add-On Combination Tier" device.
//
// Three independent boolean add-ons (Shield Guard / Loss Watch / Resale Lock). The composite
// tier LABEL is looked up by the SPECIFIC COMBINATION of which add-ons are on — a
// combination -> label table with 7 non-empty-subset entries, not a weighted sum or a popcount
// threshold. {shield,loss} and {shield,resale} are both "2 of 3 on" but resolve to two
// qualitatively different tiers with different names and different recommendation copy. Every
// number and every label anywhere on this page (Hero, the full breakdown panel in "Value, three
// ways", the lookup reference table, and the closing CTA) is read off the SAME `CoverageResult`
// object produced by `deriveCoverage` — nothing re-types or re-derives it independently.

export type AddOnId = "shield" | "loss" | "resale";

export interface CoverageState {
  shield: boolean;
  loss: boolean;
  resale: boolean;
}

// Fixed iteration order used everywhere a combination key or an itemized line list is built, so
// the same set of booleans always produces the same key string regardless of toggle order.
export const ADD_ON_ORDER: AddOnId[] = ["shield", "loss", "resale"];

// Non-trivial default: two of the three add-ons on (Shield + Resale), not all-off and not
// all-on. Every reset (see Client.tsx) returns to this exact state, never to an empty one.
export const DEFAULT_COVERAGE: CoverageState = { shield: true, loss: false, resale: true };

export const ITEM_LIST_PRICE = 1850;
export const ITEM_PRICE = 1240; // resale (post-discount) price of the base item

export interface AddOnMeta {
  id: AddOnId;
  label: string;
  short: string;
  price: number;
  description: string;
}

export const ADD_ON_META: Record<AddOnId, AddOnMeta> = {
  shield: {
    id: "shield",
    label: "Shield Guard",
    short: "Shield",
    price: 149,
    description: "12-month parts & labor warranty against mechanical failure.",
  },
  loss: {
    id: "loss",
    label: "Loss Watch",
    short: "Watch",
    price: 89,
    description: "Theft and loss protection with a same-week replacement credit.",
  },
  resale: {
    id: "resale",
    label: "Resale Lock",
    short: "Lock",
    price: 59,
    description: "A guaranteed resale floor price, locked in for 24 months.",
  },
};

interface TierDefinition {
  label: string;
  blurb: string;
}

// Combination -> label/blurb lookup. Keyed by active ids joined in ADD_ON_ORDER sequence, so
// every reachable non-empty subset of the 3 booleans has its own entry: 3 singles + 3 pairs + 1
// triple = 7 entries. Note the two pairs that share a popcount of 2 but differ in WHICH id is
// missing resolve to unrelated names and unrelated recommendation text — "shield+loss" is not a
// softer version of "shield+resale", it is a different product story.
const TIER_LOOKUP: Record<string, TierDefinition> = {
  shield: {
    label: "Essential Shield",
    blurb: "Mechanical failure is covered. Theft and resale value are not.",
  },
  loss: {
    label: "Essential Watch",
    blurb: "Theft and loss are covered. Mechanical failure and resale are not.",
  },
  resale: {
    label: "Essential Lock",
    blurb: "Your resale floor is locked in. Repairs and theft are not covered.",
  },
  "shield+loss": {
    label: "Guarded Hold",
    blurb: "Built for keeping the item for years — covered against breakage and theft alike.",
  },
  "shield+resale": {
    label: "Resale-Ready Shield",
    blurb: "A documented warranty history raises your locked resale floor. Built for a 1-2 year hold.",
  },
  "loss+resale": {
    label: "Recovery Fast-Track",
    blurb: "Lost or stolen skips the claims queue entirely — you cash out at your locked floor instead.",
  },
  "shield+loss+resale": {
    label: "Full Coverage Tier",
    blurb: "Every failure mode is covered and your resale floor is locked. No gaps left standing.",
  },
};

const EMPTY_TIER: TierDefinition = {
  label: "No coverage selected",
  blurb: "Turn on at least one add-on to see your tier and price.",
};

export interface AddOnLine {
  id: AddOnId;
  label: string;
  price: number;
}

export interface CoverageResult {
  key: string;
  tierLabel: string;
  tierBlurb: string;
  activeIds: AddOnId[];
  lines: AddOnLine[];
  addOnTotal: number;
  itemPrice: number;
  total: number;
}

export function combinationKey(state: CoverageState): string {
  return ADD_ON_ORDER.filter((id) => state[id]).join("+");
}

export function deriveCoverage(state: CoverageState): CoverageResult {
  const activeIds = ADD_ON_ORDER.filter((id) => state[id]);
  const key = activeIds.join("+");
  const tier = key.length > 0 ? TIER_LOOKUP[key] ?? EMPTY_TIER : EMPTY_TIER;
  const lines: AddOnLine[] = activeIds.map((id) => ({
    id,
    label: ADD_ON_META[id].label,
    price: ADD_ON_META[id].price,
  }));
  const addOnTotal = lines.reduce((sum, line) => sum + line.price, 0);
  return {
    key,
    tierLabel: tier.label,
    tierBlurb: tier.blurb,
    activeIds,
    lines,
    addOnTotal,
    itemPrice: ITEM_PRICE,
    total: ITEM_PRICE + addOnTotal,
  };
}

// All 7 non-empty combinations, in a fixed display order (singles, then pairs, then the triple)
// for the reference lookup table. Each row's numbers are produced by calling the SAME
// `deriveCoverage` function the live device uses — the table is not a separately hand-typed
// mirror of the lookup, it IS the lookup, rendered.
export const ALL_COMBINATIONS: CoverageState[] = [
  { shield: true, loss: false, resale: false },
  { shield: false, loss: true, resale: false },
  { shield: false, loss: false, resale: true },
  { shield: true, loss: true, resale: false },
  { shield: true, loss: false, resale: true },
  { shield: false, loss: true, resale: true },
  { shield: true, loss: true, resale: true },
];

export interface PersonaPreset {
  id: string;
  label: string;
  description: string;
  state: CoverageState;
}

// Quick-fit persona picker: choosing a persona sets all three booleans at once to a recommended
// combination, through the same setter the manual toggles use — a second, distinct way to reach
// a point in the same combination space, not a separate state machine.
export const PERSONAS: PersonaPreset[] = [
  {
    id: "keeper",
    label: "I'm keeping this for years",
    description: "Prioritizes breakage and theft coverage over resale value.",
    state: { shield: true, loss: true, resale: false },
  },
  {
    id: "traveler",
    label: "I travel with it often",
    description: "Prioritizes fast recovery over a warranty you may never use.",
    state: { shield: false, loss: true, resale: true },
  },
  {
    id: "flipper",
    label: "I may resell within 2 years",
    description: "Protects condition now and locks in your resale floor.",
    state: { shield: true, loss: false, resale: true },
  },
];

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
