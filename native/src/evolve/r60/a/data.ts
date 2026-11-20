// Deterministic dummy data for the customs declaration form.
// No Math.random / Date.now / new Date() — every value is hardcoded.

export type FieldGroupId =
  | "itemDetails"
  | "valuation"
  | "origin"
  | "contentsFlags";

export interface ContentsFlag {
  id: string;
  label: string;
  helpText: string;
  checked: boolean;
}

export interface FieldGroupSummary {
  id: FieldGroupId;
  title: string;
  /** Short line shown once the group is complete. */
  completeSummary: string;
  /** Reason shown while this group is the one blocking progress. */
  blockedReason: string;
  complete: boolean;
}

export const shipmentContext = {
  listingTitle: "Canon FD 50mm f/1.4 SSC Prime Lens",
  destinationCountry: "Canada",
  destinationCity: "Toronto, ON",
  carrier: "Standard International Parcel",
};

// Order matters: this is the fixed sequence the state machine walks through.
export const fieldGroups: FieldGroupSummary[] = [
  {
    id: "itemDetails",
    title: "Item description",
    completeSummary: "Camera lens, used, quantity 1",
    blockedReason: "Add a plain-language item description before continuing.",
    complete: true,
  },
  {
    id: "valuation",
    title: "Declared value",
    completeSummary: "$185.00 USD, sale of goods",
    blockedReason: "Enter a declared value and reason for export to continue.",
    complete: true,
  },
  {
    id: "origin",
    title: "Country of origin",
    completeSummary: "Manufactured in Japan",
    blockedReason: "Select the country where this item was manufactured.",
    complete: false,
  },
  {
    id: "contentsFlags",
    title: "Restricted contents",
    completeSummary: "No batteries, liquids, or restricted materials",
    blockedReason: "Confirm whether this shipment contains batteries, liquids, or other restricted materials.",
    complete: false,
  },
];

export const contentsFlags: ContentsFlag[] = [
  {
    id: "batteries",
    label: "Contains batteries",
    helpText: "Includes any built-in or loose lithium batteries.",
    checked: false,
  },
  {
    id: "liquids",
    label: "Contains liquids",
    helpText: "Includes lens cleaning fluid, adhesives, or other liquids.",
    checked: false,
  },
  {
    id: "fragile",
    label: "Fragile glass elements",
    helpText: "Optical glass that needs a fragile-goods handling flag.",
    checked: true,
  },
];

export const hsCategory = {
  code: "9002.11",
  label: "Photographic lenses, mounted",
};

export const valuation = {
  amount: 185,
  currency: "USD",
  reasonForExport: "Sale of goods",
};
