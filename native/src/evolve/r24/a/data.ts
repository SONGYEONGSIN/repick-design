// native/src/evolve/r24/a/data.ts — auto-native-r24 candidate a.
// Deterministic dummy data for the "Report a Listing" screen. No Math.random(),
// no bare Date.now()/new Date() — every value below is a fixed literal.

export type ReasonId =
  | "counterfeit"
  | "misleading"
  | "prohibited"
  | "harassment"
  | "other";

export type ReasonOption = {
  id: ReasonId;
  label: string;
  description: string;
};

// Fixed, ordered set of violation-reason categories. This is the screen's one
// required field — the state-transition band stays blocked until one of these
// is picked.
export const REASONS: ReasonOption[] = [
  {
    id: "counterfeit",
    label: "Counterfeit / not authentic",
    description: "The item looks like a replica or fake, not what the listing claims.",
  },
  {
    id: "misleading",
    label: "Misleading photos or description",
    description: "The real condition or details differ a lot from what's shown.",
  },
  {
    id: "prohibited",
    label: "Prohibited item",
    description: "This item isn't allowed to be sold on repick.",
  },
  {
    id: "harassment",
    label: "Harassment or abusive seller",
    description: "The seller sent abusive, threatening, or harassing messages.",
  },
  {
    id: "other",
    label: "Other",
    description: "None of the above, but something here needs review.",
  },
];

// The listing being reported (read-only context shown at the top of the
// screen). Fixed literal values — not fetched, not randomized.
export const LISTING = {
  title: "Vintage Leather Jacket — Size M",
  sellerHandle: "@thriftloft92",
  priceLabel: "$68.00",
  listingId: "LST-48213",
};

// Evidence photos the buyer has already attached, before pressing "Add photo"
// (which is a deliberate no-op placeholder — see the screen file). Fixed at
// two entries so the row renders with both an attached swatch and an empty
// slot to fill, out of a 3-photo maximum.
export const ATTACHED_EVIDENCE: { id: string; token: "swatch1" | "swatch2" | "swatch3" }[] = [
  { id: "evidence-1", token: "swatch1" },
  { id: "evidence-2", token: "swatch2" },
];
export const MAX_EVIDENCE_PHOTOS = 3;

// One fixed reference number per reason category, looked up (not generated)
// once the report is submitted — mirrors the deterministic buildLabelRef
// pattern used by the shipment-pickup screen, just keyed by reason instead of
// carrier + window.
const REPORT_REF_BY_REASON: Record<ReasonId, string> = {
  counterfeit: "RPT-30441",
  misleading: "RPT-30442",
  prohibited: "RPT-30443",
  harassment: "RPT-30444",
  other: "RPT-30445",
};

export function buildReportRef(reasonId: ReasonId): string {
  return REPORT_REF_BY_REASON[reasonId];
}
