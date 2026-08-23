/**
 * Shipping method picker — deterministic fixtures.
 * No Math.random / Date.now / new Date().
 */

export type RiskKey = "bulk" | "fragile" | "recipient";

export type ParcelProfile = {
  key: RiskKey;
  label: string;
  /** Short imperative shown when the profile is on. */
  effect: string;
  /** Glyph-free shorthand drawn inside the chip square. */
  mark: string;
};

export type CarrierId = "counter" | "doorstep" | "sameday" | "freight";

export type Carrier = {
  id: CarrierId;
  name: string;
  /** One-line character of the service. */
  character: string;
  /** Base fare in KRW. */
  fare: number;
  /** Transit days, low/high. Equal values render as a single number. */
  daysLow: number;
  daysHigh: number;
  /** Damage cover ceiling in KRW. 0 = none. */
  cover: number;
  /** Surcharge applied per active profile, KRW. */
  surcharge: Record<RiskKey, number>;
  /** Extra transit days added per active profile. */
  delay: Record<RiskKey, number>;
  /** Reason string when this carrier cannot take the parcel under a profile. */
  refuses: Partial<Record<RiskKey, string>>;
  /** Handoff step the seller must perform. */
  handoff: string;
};

export const PROFILES: ParcelProfile[] = [
  {
    key: "bulk",
    label: "Oversized",
    effect: "over 60 cm on the long side",
    mark: "L",
  },
  {
    key: "fragile",
    label: "Fragile",
    effect: "glass, ceramic or bare screen",
    mark: "F",
  },
  {
    key: "recipient",
    label: "Buyer away on weekdays",
    effect: "nobody signs before 7 pm",
    mark: "W",
  },
];

export const CARRIERS: Carrier[] = [
  {
    id: "counter",
    name: "Counter drop-off",
    character: "You walk it to a convenience store shelf",
    fare: 3200,
    daysLow: 3,
    daysHigh: 5,
    cover: 50000,
    surcharge: { bulk: 2600, fragile: 0, recipient: 0 },
    delay: { bulk: 1, fragile: 0, recipient: 2 },
    refuses: { fragile: "Shelf stacking voids the cover on glass" },
    handoff: "Print the label, drop it at any partner counter by 6 pm.",
  },
  {
    id: "doorstep",
    name: "Doorstep pickup",
    character: "A courier collects from your door",
    fare: 4500,
    daysLow: 2,
    daysHigh: 3,
    cover: 300000,
    surcharge: { bulk: 1800, fragile: 900, recipient: 0 },
    delay: { bulk: 0, fragile: 0, recipient: 1 },
    refuses: {},
    handoff: "Leave it boxed at the door before 11 am on pickup day.",
  },
  {
    id: "sameday",
    name: "Same-day rider",
    character: "One rider, one parcel, no depot",
    fare: 12800,
    daysLow: 0,
    daysHigh: 0,
    cover: 700000,
    surcharge: { bulk: 5400, fragile: 0, recipient: 0 },
    delay: { bulk: 0, fragile: 0, recipient: 0 },
    refuses: { bulk: "A rider box tops out at 55 cm" },
    handoff: "Hand it to the rider within the 40-minute window.",
  },
  {
    id: "freight",
    name: "Two-person freight",
    character: "Crated, strapped, carried in by two",
    fare: 26000,
    daysLow: 4,
    daysHigh: 6,
    cover: 2000000,
    surcharge: { bulk: 0, fragile: 3500, recipient: 0 },
    delay: { bulk: 0, fragile: 1, recipient: 0 },
    refuses: {},
    handoff: "Crew calls the buyer to agree a slot, then crates on site.",
  },
];

/** The sale this shipment belongs to. Fixed. */
export const SALE = {
  item: "Vintage turntable, walnut plinth",
  price: 268000,
  buyer: "Nari K.",
  city: "Busan",
  /** Fixed reference date string — never computed. */
  soldOn: "Mar 4",
};

/** Fee the marketplace withholds regardless of carrier. */
export const PLATFORM_FEE = 1900;

export function activeKeys(state: Record<RiskKey, boolean>): RiskKey[] {
  return PROFILES.filter((p) => state[p.key]).map((p) => p.key);
}

export function fareFor(c: Carrier, keys: RiskKey[]): number {
  return keys.reduce((sum, k) => sum + c.surcharge[k], c.fare);
}

export function daysFor(c: Carrier, keys: RiskKey[]): [number, number] {
  const added = keys.reduce((sum, k) => sum + c.delay[k], 0);
  return [c.daysLow + added, c.daysHigh + added];
}

export function blockedBy(c: Carrier, keys: RiskKey[]): string | null {
  for (const k of keys) {
    const reason = c.refuses[k];
    if (reason) return reason;
  }
  return null;
}

export function totalFor(c: Carrier, keys: RiskKey[]): number {
  return fareFor(c, keys) + PLATFORM_FEE;
}

export function won(n: number): string {
  const s = String(n);
  let out = "";
  for (let i = 0; i < s.length; i += 1) {
    const fromEnd = s.length - i;
    out += s[i];
    if (fromEnd > 1 && (fromEnd - 1) % 3 === 0) out += ",";
  }
  return "₩" + out;
}

export function daysLabel(range: [number, number]): string {
  const [lo, hi] = range;
  if (lo === 0 && hi === 0) return "today";
  if (lo === hi) return lo === 1 ? "1 day" : lo + " days";
  return lo + "–" + hi + " days";
}

export function coverLabel(n: number): string {
  if (n === 0) return "no cover";
  return won(n) + " covered";
}
