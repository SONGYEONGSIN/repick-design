// Deterministic dummy data for the Gear Swap Terms screen.
// No Math.random / Date.now / bare `new Date()` anywhere in this file.

export type FieldStatus = "agreed" | "awaiting_you" | "awaiting_them";

export interface ProposalField {
  id: string;
  label: string;
  helpText: string;
  /** Fixed, ordered preset values both sides choose from — no free text. */
  options: string[];
  /** Index into `options` for your current position on this term. */
  yourIndex: number;
  /** Index into `options` for the other party's current position on this term. */
  theirIndex: number;
  status: FieldStatus;
}

export interface Counterpart {
  name: string;
  yourItem: string;
  theirItem: string;
}

export const counterpart: Counterpart = {
  name: "Jordan M.",
  yourItem: "Canon EOS M50 Camera",
  theirItem: "Sony ZV-1 Camera",
};

export const initialFields: ProposalField[] = [
  {
    id: "cash-topup",
    label: "Cash Top-up",
    helpText: "Extra cash added to balance the trade",
    options: ["$0", "$10", "$20", "$30", "$40"],
    yourIndex: 1,
    theirIndex: 3,
    status: "awaiting_you",
  },
  {
    id: "pickup-method",
    label: "Pickup Method",
    helpText: "How the items change hands",
    options: [
      "Buyer picks up",
      "Seller delivers",
      "Meet at a public hub",
      "Courier drop-off",
    ],
    yourIndex: 2,
    theirIndex: 2,
    status: "agreed",
  },
  {
    id: "pickup-window",
    label: "Pickup Window",
    helpText: "When the handoff happens",
    options: [
      "This weekend",
      "Next weekend",
      "A weekday evening",
      "Flexible - any day",
    ],
    yourIndex: 0,
    theirIndex: 1,
    status: "awaiting_them",
  },
  {
    id: "included-extras",
    label: "Included Extras",
    helpText: "What ships alongside the camera",
    options: [
      "Original box only",
      "Box + charger",
      "Box + charger + spare battery",
      "No extras",
    ],
    yourIndex: 1,
    theirIndex: 1,
    status: "agreed",
  },
];
