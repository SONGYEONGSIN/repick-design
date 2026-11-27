// Deterministic triage tree. No Math.random, no Date.now() — every verdict is a fixed lookup
// keyed by two discrete answers, so server and client render byte-identical output.
//
// Two sequential branching questions, not a fixed linear stepper: the SECOND question's wording
// and options depend on the FIRST answer (a phone is asked about battery, a laptop about its
// screen, headphones about which side plays sound) — genuinely different sub-trees, not the same
// question reworded. Answering step 1 again always clears step 2, because the step-2 question
// itself changes; that clearing is the tree being pruned and ready to regrow down a new branch.

export type DeviceType = "phone" | "laptop" | "headphones";

export interface DeviceOption {
  id: DeviceType;
  label: string;
}

export const DEVICE_OPTIONS: DeviceOption[] = [
  { id: "phone", label: "Phone" },
  { id: "laptop", label: "Laptop" },
  { id: "headphones", label: "Headphones" },
];

export const STEP2_QUESTION: Record<DeviceType, string> = {
  phone: "Does it power on and hold a charge?",
  laptop: "Does the screen display without issues?",
  headphones: "Do both sides produce sound?",
};

export interface ConditionOption {
  id: string;
  label: string;
}

export const CONDITION_OPTIONS: Record<DeviceType, ConditionOption[]> = {
  phone: [
    { id: "full", label: "Powers on, holds a charge" },
    { id: "weak", label: "Powers on, battery weak" },
    { id: "dead", label: "No power at all" },
  ],
  laptop: [
    { id: "clean", label: "Perfect display" },
    { id: "marked", label: "Minor marks or dim spots" },
    { id: "broken", label: "Cracked or no display" },
  ],
  headphones: [
    { id: "both", label: "Both sides work" },
    { id: "one", label: "One side only" },
    { id: "none", label: "Neither side" },
  ],
};

export type Channel = "Instant Trade-In" | "Marketplace Listing" | "Marketplace Listing (parts)" | "Recycle Credit";

export interface ChannelOffer {
  channel: Channel;
  rangeLow: number;
  rangeHigh: number;
}

export interface Leaf {
  id: string;
  deviceType: DeviceType;
  conditionId: string;
  reasoning: string;
  rush: ChannelOffer;
  patient: ChannelOffer;
}

function leafId(deviceType: DeviceType, conditionId: string): string {
  return `${deviceType}-${conditionId}`;
}

export const LEAVES: Leaf[] = [
  {
    id: leafId("phone", "full"),
    deviceType: "phone",
    conditionId: "full",
    reasoning: "Full function and a healthy charge qualify for both channels — the marketplace nets more, trade-in pays today.",
    rush: { channel: "Instant Trade-In", rangeLow: 180, rangeHigh: 210 },
    patient: { channel: "Marketplace Listing", rangeLow: 230, rangeHigh: 260 },
  },
  {
    id: leafId("phone", "weak"),
    deviceType: "phone",
    conditionId: "weak",
    reasoning: "A weak battery caps the marketplace price — buyers discount for the swap they'll have to do themselves.",
    rush: { channel: "Instant Trade-In", rangeLow: 90, rangeHigh: 110 },
    patient: { channel: "Marketplace Listing", rangeLow: 120, rangeHigh: 145 },
  },
  {
    id: leafId("phone", "dead"),
    deviceType: "phone",
    conditionId: "dead",
    reasoning: "No power means no functional test — this is parts-and-recycle value, and listing it yourself barely beats the flat credit.",
    rush: { channel: "Recycle Credit", rangeLow: 15, rangeHigh: 15 },
    patient: { channel: "Marketplace Listing (parts)", rangeLow: 20, rangeHigh: 35 },
  },
  {
    id: leafId("laptop", "clean"),
    deviceType: "laptop",
    conditionId: "clean",
    reasoning: "A perfect display is this category's single biggest price lever — both channels reflect it in full.",
    rush: { channel: "Instant Trade-In", rangeLow: 310, rangeHigh: 340 },
    patient: { channel: "Marketplace Listing", rangeLow: 380, rangeHigh: 420 },
  },
  {
    id: leafId("laptop", "marked"),
    deviceType: "laptop",
    conditionId: "marked",
    reasoning: "Cosmetic marks alone, without a function issue, cost less than most sellers expect.",
    rush: { channel: "Instant Trade-In", rangeLow: 210, rangeHigh: 230 },
    patient: { channel: "Marketplace Listing", rangeLow: 250, rangeHigh: 280 },
  },
  {
    id: leafId("laptop", "broken"),
    deviceType: "laptop",
    conditionId: "broken",
    reasoning: "A broken display turns this into a parts sale — a patient marketplace listing still beats flat recycle credit.",
    rush: { channel: "Recycle Credit", rangeLow: 40, rangeHigh: 40 },
    patient: { channel: "Marketplace Listing (parts)", rangeLow: 60, rangeHigh: 90 },
  },
  {
    id: leafId("headphones", "both"),
    deviceType: "headphones",
    conditionId: "both",
    reasoning: "Fully working audio is the whole product here — both channels price it near full value.",
    rush: { channel: "Instant Trade-In", rangeLow: 55, rangeHigh: 65 },
    patient: { channel: "Marketplace Listing", rangeLow: 70, rangeHigh: 85 },
  },
  {
    id: leafId("headphones", "one"),
    deviceType: "headphones",
    conditionId: "one",
    reasoning: "One working side still has resale value to a buyer who only needs that side, or spares.",
    rush: { channel: "Instant Trade-In", rangeLow: 20, rangeHigh: 25 },
    patient: { channel: "Marketplace Listing", rangeLow: 28, rangeHigh: 38 },
  },
  {
    id: leafId("headphones", "none"),
    deviceType: "headphones",
    conditionId: "none",
    reasoning: "No working audio on either side leaves parts and recycling as the realistic options.",
    rush: { channel: "Recycle Credit", rangeLow: 5, rangeHigh: 5 },
    patient: { channel: "Marketplace Listing (parts)", rangeLow: 8, rangeHigh: 12 },
  },
];

export function findLeaf(deviceType: DeviceType, conditionId: string): Leaf | undefined {
  return LEAVES.find((leaf) => leaf.deviceType === deviceType && leaf.conditionId === conditionId);
}

export function offerFor(leaf: Leaf, urgent: boolean): ChannelOffer {
  return urgent ? leaf.rush : leaf.patient;
}

export function formatRange(offer: ChannelOffer): string {
  if (offer.rangeLow === offer.rangeHigh) return `$${offer.rangeLow}`;
  return `$${offer.rangeLow}–${offer.rangeHigh}`;
}

export function trailFor(deviceType: DeviceType | null, conditionId: string | null): string {
  if (!deviceType) return "No device chosen yet.";
  const deviceLabel = DEVICE_OPTIONS.find((d) => d.id === deviceType)?.label ?? deviceType;
  if (!conditionId) return `${deviceLabel} > condition not chosen yet.`;
  const conditionLabel = CONDITION_OPTIONS[deviceType].find((c) => c.id === conditionId)?.label ?? conditionId;
  return `${deviceLabel} > ${conditionLabel}`;
}

// Fixed tree geometry, 600x260 viewBox. Every coordinate is a literal, rounded constant — no
// layout engine, so the same two answers always draw the exact same pixels.
export const TREE_W = 600;
export const TREE_H = 260;

export const ROOT_POS = { x: 300, y: 24 };

export const LEVEL1_X: Record<DeviceType, number> = {
  phone: 100,
  laptop: 300,
  headphones: 500,
};
export const LEVEL1_Y = 110;

const LEVEL2_SPREAD = 56;

export function level2Pos(deviceType: DeviceType, conditionId: string): { x: number; y: number } {
  const options = CONDITION_OPTIONS[deviceType];
  const index = options.findIndex((c) => c.id === conditionId);
  const centerX = LEVEL1_X[deviceType];
  const x = centerX + (index - 1) * LEVEL2_SPREAD;
  return { x, y: 210 };
}
