// native/src/evolve/r33/a/data.ts — deterministic dummy data for the
// Provenance Record screen. All dates are fixed ISO strings; the only "now"
// reference is a hardcoded constant, never an argument-less `new Date()`.

export type ProvenanceEventKind =
  | "manufactured"
  | "first_sale"
  | "gap"
  | "owner_change"
  | "authentication"
  | "condition_grade"
  | "listed"
  | "purchased"
  | "shipped"
  | "delivered";

export interface ProvenanceEvent {
  id: string;
  kind: ProvenanceEventKind;
  /** Fixed "YYYY-MM-DD" string — never computed at render time. */
  dateISO: string;
  actorLabel: string;
  detail: string;
  locationLabel?: string;
  /** Whether this checkpoint has a confirmed, platform- or manufacturer-backed source. */
  verified: boolean;
  /** Whether a per-row "flag for review" affordance applies to this entry at all. */
  flaggable: boolean;
  /** Present on events that transfer ownership; the running owner count after this event. */
  ownerIndex?: number;
  /** Mutable starting state — screens may flip this, so it lives on the record, not derived. */
  flagged: boolean;
}

export interface ProvenanceItem {
  name: string;
  referenceCode: string;
  category: string;
  swatchIndex: 1 | 2 | 3;
  listedOnRepickISO: string;
}

export const ITEM: ProvenanceItem = {
  name: "Mercer Leather Tote",
  referenceCode: "RP-48291-BLK",
  category: "Handbags · Leather Tote",
  swatchIndex: 2,
  listedOnRepickISO: "2023-06-12",
};

// A fixed stand-in for "today", matching the session date. Deterministic —
// constructed from a literal string argument, not `new Date()` with none.
export const REFERENCE_NOW = new Date("2026-10-08T00:00:00Z");

export const INITIAL_EVENTS: ProvenanceEvent[] = [
  {
    id: "evt-01",
    kind: "manufactured",
    dateISO: "2021-11-04",
    actorLabel: "Atelier Mercer (manufacturer)",
    detail: "Produced at the Mercer workshop, production batch 2021-Q4.",
    locationLabel: "Florence, Italy",
    verified: true,
    flaggable: true,
    flagged: false,
  },
  {
    id: "evt-02",
    kind: "first_sale",
    dateISO: "2021-12-18",
    actorLabel: "Nordwell Department Store",
    detail: "Sold at retail as new, with original dust bag and care card.",
    verified: true,
    flaggable: true,
    ownerIndex: 1,
    flagged: false,
  },
  {
    id: "evt-03",
    kind: "gap",
    dateISO: "2022-04-01",
    actorLabel: "Unknown — private resale",
    detail:
      "Changed hands between two individual owners sometime in 2022. No platform or receipt record exists for this period.",
    verified: false,
    flaggable: false,
    ownerIndex: 2,
    flagged: false,
  },
  {
    id: "evt-04",
    kind: "authentication",
    dateISO: "2023-06-10",
    actorLabel: "repick Authentication Team",
    detail:
      "Confirmed genuine Mercer craftsmanship; interior serial stamp matched the manufacturer registry.",
    verified: true,
    flaggable: true,
    flagged: false,
  },
  {
    id: "evt-05",
    kind: "condition_grade",
    dateISO: "2023-06-11",
    actorLabel: "repick Condition Team",
    detail: "Graded \"Excellent\" — light corner wear, no interior staining or odor.",
    verified: true,
    flaggable: true,
    flagged: false,
  },
  {
    id: "evt-06",
    kind: "listed",
    dateISO: "2023-06-12",
    actorLabel: "Seller · J. Avery",
    detail: "Listed on repick by the current seller, who holds this as the second owner.",
    verified: true,
    flaggable: true,
    flagged: false,
  },
  {
    id: "evt-07",
    kind: "purchased",
    dateISO: "2023-06-20",
    actorLabel: "Buyer · M. Tran",
    detail: "Purchased through repick checkout.",
    verified: true,
    flaggable: true,
    ownerIndex: 3,
    flagged: false,
  },
  {
    id: "evt-08",
    kind: "shipped",
    dateISO: "2023-06-21",
    actorLabel: "repick Logistics",
    detail: "Picked up by courier and shipped from the seller's registered address.",
    locationLabel: "Busan, KR → Seoul, KR",
    verified: true,
    flaggable: true,
    flagged: false,
  },
  {
    id: "evt-09",
    kind: "delivered",
    dateISO: "2023-06-24",
    actorLabel: "Carrier",
    detail: "Delivered and signed for by the buyer.",
    verified: true,
    flaggable: true,
    flagged: false,
  },
];

const KIND_LABEL: Record<ProvenanceEventKind, string> = {
  manufactured: "Manufactured",
  first_sale: "First retail sale",
  gap: "Untracked period",
  owner_change: "Change of ownership",
  authentication: "Authentication check",
  condition_grade: "Condition graded",
  listed: "Listed on repick",
  purchased: "Purchased on repick",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function humanizeKind(kind: ProvenanceEventKind): string {
  return KIND_LABEL[kind];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Hand-rolled formatter so output never depends on device locale. */
export function formatDate(iso: string): string {
  const [yearStr, monthStr, dayStr] = iso.split("-");
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  return `${MONTH_NAMES[monthIndex] ?? monthStr} ${day}, ${yearStr}`;
}

/** Pure day-count between two fixed dates — no clock reads. */
export function daysBetween(startISO: string, end: Date): number {
  const start = new Date(`${startISO}T00:00:00Z`);
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
