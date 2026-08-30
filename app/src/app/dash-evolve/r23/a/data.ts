// Deterministic dummy data for the Trust Console dispute-triage dashboard.
// No Math.random / Date.now / bare `new Date()` anywhere — every timestamp below is parsed from a
// fixed ISO literal, and derived numbers (KPI aggregates, resolution hours) are computed with plain
// arithmetic over that fixed data so subtotals always sum to the totals shown in the UI.

export type CaseStatus =
  | "new"
  | "awaiting_seller"
  | "evidence_review"
  | "escalated"
  | "resolved_buyer"
  | "resolved_seller";

export type Verdict = "supports_buyer" | "supports_seller" | "inconclusive";

export interface Person {
  name: string;
  role: "Buyer" | "Seller";
  avatarId: string;
  memberSince: string;
  rating: number;
  orders: number;
}

export interface DisputeCase {
  id: string;
  itemTitle: string;
  category: string;
  claimType: string;
  status: CaseStatus;
  buyer: Person;
  seller: Person;
  amountKrw: number;
  listingGrade: { label: string; score: number };
  aiRegradeConfidence: number;
  confidenceTrend: number[];
  verdict: Verdict;
  slaHoursRemaining: number | null;
  openedAt: string;
  lastActivityAt: string;
  resolvedAt?: string;
  resolutionHours?: number;
  resolutionNote?: string;
  buyerClaimText: string;
  sellerResponseText: string;
  photoId: string;
  photoAlt: string;
  evidenceCount: number;
}

// Verified against images already shipped elsewhere in this repo (app/src/app/(app)/dashboard,
// app/src/app/(marketing)/v10, v14, app/src/app/dash/d29) so every id below is known to resolve.
const AV = [
  "1472099645785-5658abf4ff4e",
  "1500648767791-00dcc994a43e",
  "1519244703995-f4e0f30006d5",
  "1544005313-94ddf0286df2",
  "1607746882042-944635dfe10e",
  "1633332755192-727a05c4013d",
  "1580489944761-15a19d654956",
  "1534528741775-53994a69daeb",
];

function person(name: string, role: "Buyer" | "Seller", avatarIdx: number, memberSince: string, rating: number, orders: number): Person {
  return { name, role, avatarId: AV[avatarIdx % AV.length], memberSince, rating, orders };
}

export const CURRENT_AGENT = person("Jordan Cole", "Seller", 3, "2022", 5, 0);
// ^ role field unused for the agent — reusing Person's avatar/name shape for the topbar/sidebar identity.

export const CASES: DisputeCase[] = [
  {
    id: "DSP-4821",
    itemTitle: "Sony A7 III Mirrorless Body",
    category: "Electronics · Cameras",
    claimType: "Not as described",
    status: "evidence_review",
    buyer: person("Mina Cho", "Buyer", 0, "2024", 4.8, 12),
    seller: person("Daniel Ruiz", "Seller", 1, "2021", 4.6, 58),
    amountKrw: 1_240_000,
    listingGrade: { label: "Excellent", score: 92 },
    aiRegradeConfidence: 87,
    confidenceTrend: [58, 66, 74, 81, 87],
    verdict: "supports_buyer",
    slaHoursRemaining: 6,
    openedAt: "2026-08-28T09:14:00+09:00",
    lastActivityAt: "2026-08-30T07:40:00+09:00",
    buyerClaimText:
      "Shutter count reads well above the ~4,000 actuations listed. My own EXIF check on the sample frames shows over 31,000.",
    sellerResponseText:
      "I listed the count the previous owner gave me — never verified it myself. Happy to work out a partial refund.",
    photoId: "1502920917128-1aa500764cbd",
    photoAlt: "Mirrorless camera body photographed against a plain background",
    evidenceCount: 3,
  },
  {
    id: "DSP-4790",
    itemTitle: "Suede Chelsea Boots, EU 42",
    category: "Fashion · Footwear",
    claimType: "Wrong item shipped",
    status: "new",
    buyer: person("Owen Blake", "Buyer", 2, "2025", 4.9, 4),
    seller: person("Priya Nair", "Seller", 3, "2023", 4.7, 31),
    amountKrw: 186_000,
    listingGrade: { label: "Very Good", score: 85 },
    aiRegradeConfidence: 52,
    confidenceTrend: [40, 45, 49, 52],
    verdict: "inconclusive",
    slaHoursRemaining: 26,
    openedAt: "2026-08-29T13:02:00+09:00",
    lastActivityAt: "2026-08-29T13:02:00+09:00",
    buyerClaimText:
      "Box says EU 42 but the boots inside are clearly EU 40 — they don't fit and the stitching pattern doesn't match the listing photos.",
    sellerResponseText: "",
    photoId: "1608256246200-53e635b5b65f",
    photoAlt: "Pair of suede Chelsea boots side by side",
    evidenceCount: 2,
  },
  {
    id: "DSP-4772",
    itemTitle: "Wool Overcoat, Size 50",
    category: "Fashion · Outerwear",
    claimType: "Damaged in transit",
    status: "awaiting_seller",
    buyer: person("Grace Lin", "Buyer", 4, "2022", 4.5, 19),
    seller: person("Tomas Novak", "Seller", 5, "2020", 4.9, 104),
    amountKrw: 342_000,
    listingGrade: { label: "Excellent", score: 90 },
    aiRegradeConfidence: 91,
    confidenceTrend: [70, 79, 85, 91],
    verdict: "supports_buyer",
    slaHoursRemaining: -5,
    openedAt: "2026-08-25T10:30:00+09:00",
    lastActivityAt: "2026-08-29T16:00:00+09:00",
    buyerClaimText:
      "Arrived with a 6cm tear along the inside lining seam that isn't visible in any of the listing photos.",
    sellerResponseText:
      "The coat was inspected before shipping and had no tears. This may have happened in transit — checking with the courier.",
    photoId: "1489987707025-afc232f7ea0f",
    photoAlt: "Wool overcoat hung alone against a plain backdrop",
    evidenceCount: 3,
  },
  {
    id: "DSP-4761",
    itemTitle: "Leather Tote Bag, Designer",
    category: "Fashion · Handbags",
    claimType: "Authenticity concern",
    status: "escalated",
    buyer: person("Isla Fraser", "Buyer", 6, "2021", 4.4, 27),
    seller: person("Hana Suzuki", "Seller", 7, "2019", 4.8, 212),
    amountKrw: 3_650_000,
    listingGrade: { label: "Excellent", score: 94 },
    aiRegradeConfidence: 96,
    confidenceTrend: [72, 84, 90, 96],
    verdict: "supports_buyer",
    slaHoursRemaining: 2,
    openedAt: "2026-08-27T08:00:00+09:00",
    lastActivityAt: "2026-08-30T11:00:00+09:00",
    buyerClaimText:
      "The hardware stamping and serial card don't match reference photos of authentic pieces from this era. I don't think this is genuine.",
    sellerResponseText:
      "This was purchased directly from a boutique reseller with a receipt. I can send the original paperwork.",
    photoId: "1560243563-062bfc001d68",
    photoAlt: "Leather tote bag resting on a plain floor",
    evidenceCount: 4,
  },
  {
    id: "DSP-4733",
    itemTitle: "Sony WH-1000XM4 Headphones",
    category: "Electronics · Audio",
    claimType: "Functionality issue",
    status: "evidence_review",
    buyer: person("Wren Halloway", "Buyer", 0, "2024", 4.7, 9),
    seller: person("Marcus Webb", "Seller", 1, "2022", 4.5, 46),
    amountKrw: 142_000,
    listingGrade: { label: "Very Good", score: 81 },
    aiRegradeConfidence: 78,
    confidenceTrend: [55, 64, 71, 78],
    verdict: "supports_buyer",
    slaHoursRemaining: 15,
    openedAt: "2026-08-28T18:20:00+09:00",
    lastActivityAt: "2026-08-30T02:10:00+09:00",
    buyerClaimText: "Left ear cup crackles at any volume above 40%. Sounds fine on the right side only.",
    sellerResponseText:
      "Never noticed this in my own testing, but I only used them a handful of times. Fine with a partial refund if confirmed.",
    photoId: "1505740420928-5e560c06d30e",
    photoAlt: "Black over-ear headphones on a yellow background",
    evidenceCount: 2,
  },
  {
    id: "DSP-4705",
    itemTitle: "Vintage Canvas Backpack",
    category: "Fashion · Bags",
    claimType: "Missing accessories",
    status: "resolved_buyer",
    buyer: person("Noah Kim", "Buyer", 2, "2025", 4.9, 3),
    seller: person("Elena Petrova", "Seller", 3, "2023", 4.6, 22),
    amountKrw: 45_000,
    listingGrade: { label: "Good", score: 74 },
    aiRegradeConfidence: 83,
    confidenceTrend: [60, 71, 79, 83],
    verdict: "supports_buyer",
    slaHoursRemaining: null,
    openedAt: "2026-08-24T09:00:00+09:00",
    lastActivityAt: "2026-08-25T17:00:00+09:00",
    resolvedAt: "2026-08-25T17:00:00+09:00",
    resolutionHours: 32,
    resolutionNote: "Partial refund of ₩8,000 issued for the missing rain cover; buyer kept the backpack.",
    buyerClaimText: "Listing says 'includes rain cover' — box arrived with just the bag, no cover anywhere.",
    sellerResponseText: "You're right, I forgot to include it when I packed the order. Sorry about that.",
    photoId: "1553062407-98eeb64c6a62",
    photoAlt: "Dark navy canvas backpack standing on the floor",
    evidenceCount: 1,
  },
  {
    id: "DSP-4670",
    itemTitle: "Wooden Desk with Lamp",
    category: "Furniture",
    claimType: "Not as described",
    status: "resolved_seller",
    buyer: person("Beatrix Solis", "Buyer", 4, "2022", 4.3, 15),
    seller: person("Liam O'Connor", "Seller", 5, "2020", 4.8, 71),
    amountKrw: 128_000,
    listingGrade: { label: "Very Good", score: 86 },
    aiRegradeConfidence: 88,
    confidenceTrend: [62, 73, 81, 88],
    verdict: "supports_seller",
    slaHoursRemaining: null,
    openedAt: "2026-08-20T09:00:00+09:00",
    lastActivityAt: "2026-08-23T11:00:00+09:00",
    resolvedAt: "2026-08-23T11:00:00+09:00",
    resolutionHours: 74,
    resolutionNote: "Vision-model material comparison matched the listing photos and description; claim denied.",
    buyerClaimText: "Listing says solid oak — the underside looks like a veneer over particleboard to me.",
    sellerResponseText:
      "It's oak veneer over engineered wood, which is what ‘solid build, oak finish’ in the listing meant. Photos show the finish clearly.",
    photoId: "1519219788971-8d9797e0928e",
    photoAlt: "Desk lamp on a wood-textured desk",
    evidenceCount: 2,
  },
  {
    id: "DSP-4652",
    itemTitle: "Denim Trucker Jacket, Size L",
    category: "Fashion · Outerwear",
    claimType: "Wrong item shipped",
    status: "awaiting_seller",
    buyer: person("Caleb Osei", "Buyer", 6, "2024", 4.6, 8),
    seller: person("Ravi Shah", "Seller", 7, "2021", 4.4, 39),
    amountKrw: 96_000,
    listingGrade: { label: "Good", score: 77 },
    aiRegradeConfidence: 61,
    confidenceTrend: [45, 52, 58, 61],
    verdict: "supports_buyer",
    slaHoursRemaining: 11,
    openedAt: "2026-08-29T07:45:00+09:00",
    lastActivityAt: "2026-08-30T06:00:00+09:00",
    buyerClaimText:
      "Ordered size L, tag inside reads size M and the chest measurement is noticeably smaller than listed.",
    sellerResponseText: "Let me check the tag on my end and get back to you today.",
    photoId: "1516826957135-700dedea698c",
    photoAlt: "Denim trucker jacket laid flat against a plain backdrop",
    evidenceCount: 2,
  },
];

export const STATUS_META: Record<CaseStatus, { label: string; tone: "neutral" | "amber" | "red" | "emerald" }> = {
  new: { label: "New", tone: "neutral" },
  awaiting_seller: { label: "Seller due", tone: "amber" },
  evidence_review: { label: "In review", tone: "amber" },
  escalated: { label: "Escalated", tone: "red" },
  resolved_buyer: { label: "Resolved", tone: "emerald" },
  resolved_seller: { label: "Resolved", tone: "emerald" },
};

export const VERDICT_META: Record<Verdict, { label: string; tone: "neutral" | "amber" | "emerald" }> = {
  supports_buyer: { label: "Supports buyer", tone: "amber" },
  supports_seller: { label: "Supports seller", tone: "emerald" },
  inconclusive: { label: "Inconclusive", tone: "neutral" },
};

export function isOpen(c: DisputeCase): boolean {
  return c.status !== "resolved_buyer" && c.status !== "resolved_seller";
}

export function isAtRisk(c: DisputeCase): boolean {
  return isOpen(c) && c.slaHoursRemaining !== null && c.slaHoursRemaining <= 12;
}

export function openCases(): DisputeCase[] {
  return CASES.filter(isOpen);
}

export function atRiskCases(): DisputeCase[] {
  return CASES.filter(isAtRisk);
}

// Refund exposure: sum of open-case amounts where the AI re-grade currently supports the buyer —
// i.e. money the desk should treat as likely-to-be-refunded liability. Derived from CASES so the
// figure always reconciles with the per-case amounts shown in the rail; nothing is hand-totalled.
export function refundExposureKrw(): number {
  return openCases()
    .filter((c) => c.verdict === "supports_buyer")
    .reduce((sum, c) => sum + c.amountKrw, 0);
}

export function avgResolutionHours(): number {
  const resolved = CASES.filter((c) => c.resolutionHours !== undefined);
  const total = resolved.reduce((sum, c) => sum + (c.resolutionHours ?? 0), 0);
  return Math.round(total / resolved.length);
}

// Fixed 7-point trend series for the KPI strip. Not derived from CASES (there is no daily history in
// this dataset) but hand-authored to be internally consistent: each series' final point equals the
// live aggregate computed above, so the sparkline never contradicts the number printed beside it.
export const OPEN_TREND = [9, 8, 10, 9, 7, 8, openCases().length];
export const RISK_TREND = [5, 6, 4, 5, 6, 5, atRiskCases().length];
export const RESOLUTION_TREND = [61, 58, 55, 57, 50, avgResolutionHours()];
export const EXPOSURE_TREND = [4_200_000, 4_800_000, 5_100_000, 4_950_000, 5_300_000, refundExposureKrw()];

export function formatKrw(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "KRW" }).format(n);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(
    new Date(iso),
  );
}

export function formatSla(hours: number | null): string {
  if (hours === null) return "—";
  if (hours < 0) return `Overdue ${Math.abs(hours)}h`;
  return `${hours}h left`;
}

export interface TimelineEvent {
  id: string;
  at: string;
  actor: string;
  actorRole: string;
  label: string;
  detail: string;
}

function plusHours(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() + hours * 3_600_000).toISOString();
}

// Built from each case's own fixed fields (opened timestamp, claim/response text, confidence trend)
// rather than hand-authored per case — the inputs are static so the output is fully deterministic,
// it just avoids re-typing the same five-event skeleton eight times.
export function buildTimeline(c: DisputeCase): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${c.id}-open`,
      at: c.openedAt,
      actor: c.buyer.name,
      actorRole: "Buyer",
      label: "Dispute filed",
      detail: c.buyerClaimText,
    },
    {
      id: `${c.id}-grade`,
      at: plusHours(c.openedAt, 1),
      actor: "Grading pipeline",
      actorRole: "System",
      label: "Original listing grade retrieved",
      detail: `Listed at ${c.listingGrade.label} (${c.listingGrade.score}/100) at time of sale — pulled from the intake record for comparison.`,
    },
    {
      id: `${c.id}-regrade-start`,
      at: plusHours(c.openedAt, 4),
      actor: "Re-grading model",
      actorRole: "System",
      label: "AI re-grade started",
      detail: `Analyzing ${c.evidenceCount} buyer-submitted photo${c.evidenceCount === 1 ? "" : "s"} against the original listing set. Initial confidence ${c.confidenceTrend[0]}%.`,
    },
  ];
  if (c.status !== "new") {
    events.push({
      id: `${c.id}-response`,
      at: plusHours(c.openedAt, 18),
      actor: c.seller.name,
      actorRole: "Seller",
      label: "Seller responded",
      detail: c.sellerResponseText || "No response text on file.",
    });
  }
  if (c.status === "evidence_review" || c.status === "escalated" || c.resolvedAt) {
    events.push({
      id: `${c.id}-confidence`,
      at: plusHours(c.openedAt, 26),
      actor: "Re-grading model",
      actorRole: "System",
      label: `Confidence finalized at ${c.aiRegradeConfidence}%`,
      detail: `Verdict: ${VERDICT_META[c.verdict].label}. Trend across passes: ${c.confidenceTrend.join(" → ")}.`,
    });
  }
  if (c.status === "escalated") {
    events.push({
      id: `${c.id}-escalate`,
      at: plusHours(c.openedAt, 30),
      actor: "Queue router",
      actorRole: "System",
      label: "Escalated to senior review",
      detail: "Claim value and authenticity signal both exceed the auto-resolution threshold for this category.",
    });
  }
  if (c.resolvedAt) {
    events.push({
      id: `${c.id}-resolve`,
      at: c.resolvedAt,
      actor: CURRENT_AGENT.name,
      actorRole: "Trust analyst",
      label: c.status === "resolved_buyer" ? "Resolved in buyer's favor" : "Resolved in seller's favor",
      detail: c.resolutionNote ?? "",
    });
  }
  return events;
}
