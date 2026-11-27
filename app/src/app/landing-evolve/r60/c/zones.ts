// Deterministic flagged-zones ledger. No Math.random, no Date.now() — every number is a fixed
// function of which zones are flagged, so server and client render byte-identical output.
//
// Six fixed, always-visible zones (never freehand drawing — every zone has its own permanent
// chip, so the whole device is keyboard-operable and every row of the ledger below is always
// rendered, never conditionally shown or hidden). Flagging a zone WIDENS the estimated price
// range and lowers its midpoint; the inverse of "confirming a trait narrows the range" — here,
// raising a concern is what admits uncertainty, and confirming a zone clean is what keeps the
// range tight.

export type ViewMode = "seller" | "buyer";

export interface Zone {
  id: string;
  label: string;
  deduction: number; // midpoint $ drop when flagged
  widen: number; // half-width $ increase when flagged
  concernSentence: string; // what the seller is disclosing / what the buyer sees accounted for
}

export const ZONES: Zone[] = [
  {
    id: "screen",
    label: "Screen",
    deduction: 42,
    widen: 10,
    concernSentence: "Hairline scratch or dead pixel on the screen",
  },
  {
    id: "frame",
    label: "Frame corners",
    deduction: 14,
    widen: 6,
    concernSentence: "Visible ding or dent on a frame corner",
  },
  {
    id: "ports",
    label: "Ports",
    deduction: 22,
    widen: 8,
    concernSentence: "A port feels loose or charges inconsistently",
  },
  {
    id: "battery",
    label: "Battery",
    deduction: 35,
    widen: 9,
    concernSentence: "Battery drains faster than expected",
  },
  {
    id: "buttons",
    label: "Buttons",
    deduction: 18,
    widen: 7,
    concernSentence: "A button feels sticky or less responsive",
  },
  {
    id: "backGlass",
    label: "Back glass",
    deduction: 26,
    widen: 8,
    concernSentence: "Hairline crack on the back glass",
  },
];

const BASE_MID = 430;
const BASE_HALF = 8;

function round0(n: number): number {
  return Math.round(n);
}

export interface RangeResult {
  mid: number;
  low: number;
  high: number;
}

export function deriveRange(flaggedIds: Set<string>): RangeResult {
  let deduction = 0;
  let widen = 0;
  for (const zone of ZONES) {
    if (flaggedIds.has(zone.id)) {
      deduction += zone.deduction;
      widen += zone.widen;
    }
  }
  const mid = Math.max(0, round0(BASE_MID - deduction));
  const half = round0(BASE_HALF + widen);
  return { mid, low: Math.max(0, mid - half), high: mid + half };
}

export function sellerLine(zone: Zone, flagged: boolean): string {
  if (!flagged) return "Confirmed clean — no disclosure needed.";
  return `You disclosed: ${zone.concernSentence.toLowerCase()} (-$${zone.deduction}).`;
}

export function buyerLine(zone: Zone, flagged: boolean): string {
  if (!flagged) return "Independently confirmed — nothing to account for.";
  return `Accounted for: ${zone.concernSentence.toLowerCase()} (-$${zone.deduction} already reflected).`;
}

export function lineFor(zone: Zone, flagged: boolean, view: ViewMode): string {
  return view === "seller" ? sellerLine(zone, flagged) : buyerLine(zone, flagged);
}
