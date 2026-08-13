export interface HandoffCheck {
  id: string;
  label: string;
  /** What the listing promised for this line. */
  listingClaim: string;
  /** Where to look on the item, so the buyer can answer without guessing. */
  how: string;
  /** Shown only when the buyer marks the line as different. */
  mismatchNote: string;
  /** Dollars off the agreed price when this line differs. */
  priceImpact: number;
  /** True when a gap here cannot be settled with a discount. */
  blocking: boolean;
}

export interface HandoffDeal {
  dealCode: string;
  itemTitle: string;
  itemSpec: string;
  agreedPrice: number;
  place: string;
  time: string;
  sellerName: string;
  sellerRecord: string;
  sentAtLabel: string;
}

export const handoffDeal: HandoffDeal = {
  dealCode: "RP-7420",
  itemTitle: "iPad Air 11-inch, M2, 128GB",
  itemSpec: "Space Gray, Wi-Fi only, bought Nov 2025",
  agreedPrice: 420,
  place: "Gongdeok Station Exit 5, cafe on the 2nd floor",
  time: "Today at 4:30 PM",
  sellerName: "Jiho K.",
  sellerRecord: "12 deals, 0 disputes",
  sentAtLabel: "4:38 PM",
};

export const handoffChecks: HandoffCheck[] = [
  {
    id: "serial",
    label: "Serial number",
    listingClaim: "Ends in 4F2C, shown in photo 3",
    how: "Settings, then General, then About",
    mismatchNote:
      "A different serial means this is not the unit the listing was written about. Repick cannot cover the deal.",
    priceImpact: 0,
    blocking: true,
  },
  {
    id: "activation",
    label: "Activation lock is off",
    listingClaim: "Seller signed out before the meeting",
    how: "Restart and confirm no account prompt appears",
    mismatchNote:
      "Still tied to the seller account. The device is unusable to you until they sign out in front of you.",
    priceImpact: 0,
    blocking: true,
  },
  {
    id: "battery",
    label: "Battery health",
    listingClaim: "94 percent, 212 cycles",
    how: "Settings, then Battery, then Battery Health",
    mismatchNote:
      "Lower than listed. Repick prices this gap from 38 comparable sales in the last 60 days.",
    priceImpact: 35,
    blocking: false,
  },
  {
    id: "screen",
    label: "Screen and body",
    listingClaim: "No scratches, one soft dent on the bottom corner",
    how: "Tilt under the cafe light, check all four corners",
    mismatchNote:
      "Marks that were not in the listing photos. Cosmetic, so it is a price question rather than a stop.",
    priceImpact: 25,
    blocking: false,
  },
  {
    id: "touch",
    label: "Screen responds everywhere",
    listingClaim: "No dead zones reported",
    how: "Drag one icon slowly across the whole screen",
    mismatchNote:
      "Dead or jumpy areas. Repair quotes for this panel run around this amount.",
    priceImpact: 60,
    blocking: false,
  },
  {
    id: "bundle",
    label: "Charger, cable, box",
    listingClaim: "Original 20W charger, cable, and box included",
    how: "Open the bag before you hand over money",
    mismatchNote:
      "Part of the bundle is missing. Replacing it yourself costs about this much.",
    priceImpact: 20,
    blocking: false,
  },
];

/** Deterministic money formatting, no locale lookup. */
export function formatUsd(amount: number): string {
  const digits = Math.round(Math.abs(amount)).toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      grouped += ",";
    }
    grouped += digits[i];
  }
  return `$${grouped}`;
}
