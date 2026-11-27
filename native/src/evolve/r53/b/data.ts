// Deterministic dummy data for the Consignment Partners screen.
// No Math.random / Date.now / bare `new Date()` — every value below is a
// fixed literal or a value computed from fixed literals.

export type ConsignmentPartner = {
  id: string;
  /** Person who hands you items to resell on their behalf. */
  name: string;
  itemsConsigned: number;
  itemsSold: number;
  /** Total paid out to this partner so far, in whole cents. */
  totalPayoutCents: number;
  /** Fixed, pre-formatted label — never derived from the current date. */
  memberSinceLabel: string;
};

export const consignmentPartners: ConsignmentPartner[] = [
  {
    id: "p1",
    name: "Maren Voss",
    itemsConsigned: 12,
    itemsSold: 9,
    totalPayoutCents: 48750,
    memberSinceLabel: "Partner since Feb 2024",
  },
  {
    id: "p2",
    name: "Tomas Reyes",
    itemsConsigned: 7,
    itemsSold: 7,
    totalPayoutCents: 31200,
    memberSinceLabel: "Partner since Jun 2024",
  },
  {
    id: "p3",
    name: "Priya Shah",
    itemsConsigned: 20,
    itemsSold: 14,
    totalPayoutCents: 86300,
    memberSinceLabel: "Partner since Jan 2023",
  },
  {
    id: "p4",
    name: "Elliot Bauer",
    itemsConsigned: 4,
    itemsSold: 1,
    totalPayoutCents: 5400,
    memberSinceLabel: "Partner since Sep 2025",
  },
  {
    id: "p5",
    name: "Noa Lindqvist",
    itemsConsigned: 15,
    itemsSold: 15,
    totalPayoutCents: 62000,
    memberSinceLabel: "Partner since Oct 2022",
  },
];

/**
 * Partners whose consignment relationship has already been ended before the
 * screen is ever touched — this seeds the terminal row state so it is
 * visible without requiring an interaction, without implying the *user*
 * caused it this session (so it renders as settled text, not a fresh
 * announcement — see ConsignmentPartnersScreen's `justEndedPartnerId`).
 */
export const initiallyEndedPartnerIds: string[] = ["p5"];

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
