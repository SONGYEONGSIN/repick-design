// native/src/evolve/r51/c/data.ts
//
// Deterministic dummy data for the Authenticator Review Queue. Every value
// below is a fixed literal — no Math.random, no Date.now(), no no-arg
// `new Date()`. "waitedMinutes" is an authored fixed number standing in for
// how long a case has been waiting; it is only used (at authoring time, not
// at runtime) to decide the fixed display order below, never recomputed.

export type ReviewPriority = "expedited" | "standard";

export interface AuthenticatorCase {
  /** Short case reference shown to the authenticator, e.g. "AR-1042". */
  id: string;
  /** The submitted item's listing title. */
  title: string;
  category: string;
  /** The seller who submitted the item for authentication. */
  submittedBy: string;
  priority: ReviewPriority;
  /** Seller-declared value in KRW — informational context, not an offer. */
  declaredValueWon: number;
  conditionNote: string;
  photosCount: number;
  /** Fixed, pre-authored relative-time label — never computed from Date.now(). */
  submittedLabel: string;
  /** Fixed minutes-waited value used only to author the queue order below. */
  waitedMinutes: number;
  /**
   * When set, a teammate authenticator already holds the claim-based lock on
   * this case. It is permanently locked from this screen's point of view —
   * there is no self-service way to claim a case someone else is holding.
   */
  lockedByOtherName?: string;
}

// Queue order: expedited cases first, then standard; within each priority
// group, the longest-waiting case leads. This is authored directly into the
// array order (not computed at render time) so the data stays deterministic.
export const AUTHENTICATOR_CASES: AuthenticatorCase[] = [
  {
    id: "AR-1035",
    title: "Limited-Run Sneaker Collaboration",
    category: "Footwear",
    submittedBy: "Noah Kim",
    priority: "expedited",
    declaredValueWon: 890000,
    conditionNote:
      "Seller claims deadstock condition; no wear visible in the submitted photos.",
    photosCount: 9,
    submittedLabel: "Submitted 3 hr ago",
    waitedMinutes: 180,
    lockedByOtherName: "Theo Marsh",
  },
  {
    id: "AR-1039",
    title: "Court-Model Sneakers",
    category: "Footwear",
    submittedBy: "Casey Flores",
    priority: "expedited",
    declaredValueWon: 520000,
    conditionNote:
      "Original box present; insole wear is visible across several angles.",
    photosCount: 7,
    submittedLabel: "Submitted 1 hr ago",
    waitedMinutes: 60,
    lockedByOtherName: "Priya Shah",
  },
  {
    id: "AR-1042",
    title: "Rotation Chronograph Watch",
    category: "Watches",
    submittedBy: "Jordan Lee",
    priority: "expedited",
    declaredValueWon: 3200000,
    conditionNote:
      "Seller reports light wear on the clasp; box and papers included.",
    photosCount: 6,
    submittedLabel: "Submitted 25 min ago",
    waitedMinutes: 25,
  },
  {
    id: "AR-1025",
    title: "Graphic Tee, Archive Run",
    category: "Apparel",
    submittedBy: "Riley Cho",
    priority: "standard",
    declaredValueWon: 68000,
    conditionNote: "Tag intact; intake team noted a faint odor on arrival.",
    photosCount: 3,
    submittedLabel: "Submitted yesterday, 11:05 AM",
    waitedMinutes: 1495,
  },
  {
    id: "AR-1028",
    title: "Monogram Card Holder",
    category: "Accessories",
    submittedBy: "Felix Ahn",
    priority: "standard",
    declaredValueWon: 95000,
    conditionNote: "Corner wear consistent with light everyday use.",
    photosCount: 4,
    submittedLabel: "Submitted yesterday, 4:10 PM",
    waitedMinutes: 1280,
  },
  {
    id: "AR-1031",
    title: "Ceramic Dive Watch",
    category: "Watches",
    submittedBy: "Elena Petrova",
    priority: "standard",
    declaredValueWon: 1450000,
    conditionNote:
      "Bezel insert shows a minor scuff; movement has not been inspected yet.",
    photosCount: 6,
    submittedLabel: "Submitted 5 hr ago",
    waitedMinutes: 300,
  },
  {
    id: "AR-1037",
    title: "Structured Leather Tote",
    category: "Bags",
    submittedBy: "Sam Whitfield",
    priority: "standard",
    declaredValueWon: 410000,
    conditionNote: "Hardware shows light tarnish; interior lining is intact.",
    photosCount: 8,
    submittedLabel: "Submitted 2 hr ago",
    waitedMinutes: 120,
  },
  {
    id: "AR-1041",
    title: "Vintage Field Jacket",
    category: "Apparel",
    submittedBy: "Morgan Diaz",
    priority: "standard",
    declaredValueWon: 180000,
    conditionNote: "Small repair stitch on the left cuff, disclosed by seller.",
    photosCount: 5,
    submittedLabel: "Submitted 40 min ago",
    waitedMinutes: 40,
  },
];

/** Thousands-separated KRW digits, no symbol — mirrors the app-wide formatWon convention. */
export function formatWonDigits(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  const digits = safe.toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      grouped += ",";
    }
    grouped += digits[i];
  }
  return grouped;
}
