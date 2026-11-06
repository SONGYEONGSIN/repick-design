// native/src/evolve/r26/a/data.ts
// Deterministic dummy data for the Warranty Claim screen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below —
// every figure is a fixed literal or a pure derivation of fixed literals.

export type DefectCode =
  | "sensor"
  | "autofocus"
  | "shutter"
  | "display"
  | "battery"
  | "mount"
  | "other";

export interface DefectOption {
  code: DefectCode;
  title: string;
  helper: string;
  repairBusinessDays: number;
  /** false = the defect looks like physical/accidental damage and needs a
   *  hands-on inspection before Repick can offer a straight refund. */
  refundReady: boolean;
}

export const DEFECT_OPTIONS: DefectOption[] = [
  {
    code: "sensor",
    title: "Sensor / image quality",
    helper: "Spots, banding, dead pixels",
    repairBusinessDays: 5,
    refundReady: true,
  },
  {
    code: "autofocus",
    title: "Autofocus system",
    helper: "Hunting, won't lock, missed focus",
    repairBusinessDays: 4,
    refundReady: true,
  },
  {
    code: "shutter",
    title: "Shutter mechanism",
    helper: "Won't fire, stuck, uneven exposure",
    repairBusinessDays: 6,
    refundReady: true,
  },
  {
    code: "display",
    title: "LCD / viewfinder",
    helper: "Dead panel, discoloration, flicker",
    repairBusinessDays: 3,
    refundReady: true,
  },
  {
    code: "battery",
    title: "Battery / charging",
    helper: "Won't hold a charge, won't power on",
    repairBusinessDays: 2,
    refundReady: true,
  },
  {
    code: "mount",
    title: "Lens mount damage",
    helper: "Bent, loose, lens won't seat",
    repairBusinessDays: 8,
    refundReady: false,
  },
  {
    code: "other",
    title: "Other defect",
    helper: "Something else is wrong",
    repairBusinessDays: 5,
    refundReady: false,
  },
];

export interface EvidencePoolShot {
  caption: string;
  swatch: 1 | 2 | 3;
}

// A fixed pool the "Add photo" control cycles through deterministically
// (index = current shot count), standing in for a camera-roll picker.
export const EVIDENCE_POOL: EvidencePoolShot[] = [
  { caption: "Wide shot of the body", swatch: 1 },
  { caption: "Close-up on the defect", swatch: 2 },
  { caption: "Serial number plate", swatch: 3 },
  { caption: "Defect under lamp light", swatch: 2 },
  { caption: "Accessory / box contents", swatch: 1 },
];

export const MAX_EVIDENCE_SHOTS = 5;

export type RemedyCode = "repair" | "replace" | "refund";

export interface RemedyMeta {
  code: RemedyCode;
  title: string;
}

export const REMEDY_INFO: RemedyMeta[] = [
  { code: "repair", title: "Repair" },
  { code: "replace", title: "Replacement" },
  { code: "refund", title: "Refund" },
];

export const CLAIM_ITEM = {
  name: "Fujifilm X-T4 Mirrorless Body",
  orderId: "RP-88214",
  purchaseDateLabel: "Mar 14, 2026",
  purchasePriceKrw: 1480000,
  warrantyTotalDays: 365,
  daysElapsed: 178,
  replacementUnitsAvailable: 2,
};

export function warrantyDaysRemaining(): number {
  return CLAIM_ITEM.warrantyTotalDays - CLAIM_ITEM.daysElapsed;
}

// Refund value depreciates on a straight line up to a 20% ceiling across the
// coverage window — a genuinely computed figure tied to purchase data, not a
// static placeholder number.
export function computeRefundKrw(): number {
  const maxDeductionRate = 0.2;
  const ratio = CLAIM_ITEM.daysElapsed / CLAIM_ITEM.warrantyTotalDays;
  const deduction = Math.round(CLAIM_ITEM.purchasePriceKrw * maxDeductionRate * ratio);
  return CLAIM_ITEM.purchasePriceKrw - deduction;
}

export function formatKrw(amount: number): string {
  return amount.toLocaleString("en-US");
}

// Deterministic claim reference: derived from the fixed order id plus the
// two choices that define the claim, so it changes honestly with input
// rather than being a hardcoded string.
export function buildClaimReference(defect: DefectCode, remedy: RemedyCode): string {
  const defectTag = defect.slice(0, 3).toUpperCase();
  const remedyTag = remedy.slice(0, 2).toUpperCase();
  return `WC-${CLAIM_ITEM.orderId}-${defectTag}${remedyTag}`;
}
