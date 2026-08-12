/**
 * Board fixture + the pure aggregations the page argues with.
 *
 * Everything here is a module constant and every derived number comes out of a total function of
 * (fixture, guardrails-off). No clock, no entropy: the board a visitor sees on first paint is the
 * board the server rendered, and toggling a guardrail twice returns to the identical figures.
 */

export type GuardrailId = "verification" | "price" | "condition" | "photos";

export type Guardrail = {
  id: GuardrailId;
  label: string;
  rule: string;
  /** Reads after "admits N listings ..." in the live warning sentence. */
  admitPhrase: string;
};

export const GUARDRAILS: readonly Guardrail[] = [
  {
    id: "verification",
    label: "Seller verification",
    rule: "Identity plus a settled payout history",
    admitPhrase: "from sellers with no identity check",
  },
  {
    id: "price",
    label: "Price outlier",
    rule: "Asking price inside the 12-month band",
    admitPhrase: "priced outside the sane band",
  },
  {
    id: "condition",
    label: "Condition below B",
    rule: "Graded B or better by an inspector",
    admitPhrase: "graded below B",
  },
  {
    id: "photos",
    label: "Incomplete photos",
    rule: "Six angles, wear included",
    admitPhrase: "with an incomplete photo set",
  },
];

export const REASON_TEXT: Record<GuardrailId, string> = {
  verification: "seller not verified",
  price: "price outside the sane band",
  condition: "condition below grade B",
  photos: "photo set incomplete",
};

const GRADE_SCORES = {
  A: 6,
  "A-": 5,
  "B+": 4,
  B: 3,
  C: 2,
  "C-": 1,
} as const;

export type Grade = keyof typeof GRADE_SCORES;

/** Index is the score; index 0 is unused so a score maps straight to its label. */
const GRADE_LABELS = ["", "C-", "C", "B", "B+", "A-", "A"] as const;

export type Listing = {
  id: string;
  title: string;
  seller: string;
  matchPct: number;
  grade: Grade;
  verified: boolean;
  fullPhotos: boolean;
  priceWas: number;
  priceNow: number;
  discountPct: number;
  /** null means it cleared all four guardrails. */
  blockedBy: GuardrailId | null;
  /** Which of the four filled marks to draw. */
  mark: 0 | 1 | 2 | 3;
};

export const LISTINGS: readonly Listing[] = [
  {
    id: "l1",
    title: "Ergonomic task chair, remastered frame",
    seller: "Studio Ondo",
    matchPct: 96,
    grade: "A",
    verified: true,
    fullPhotos: true,
    priceWas: 780000,
    priceNow: 412000,
    discountPct: 47,
    blockedBy: null,
    mark: 0,
  },
  {
    id: "l2",
    title: "Instant film camera, boxed with strap",
    seller: "Northline Supply",
    matchPct: 93,
    grade: "A-",
    verified: true,
    fullPhotos: true,
    priceWas: 449000,
    priceNow: 268000,
    discountPct: 40,
    blockedBy: null,
    mark: 3,
  },
  {
    id: "l3",
    title: "Modular wall shelving, three bays",
    seller: "Vessel Supply",
    matchPct: 91,
    grade: "A-",
    verified: true,
    fullPhotos: true,
    priceWas: 2150000,
    priceNow: 1240000,
    discountPct: 42,
    blockedBy: null,
    mark: 1,
  },
  {
    id: "l4",
    title: "Over-ear headphones, replaced pads",
    seller: "Halfmoon Traders",
    matchPct: 89,
    grade: "B+",
    verified: true,
    fullPhotos: true,
    priceWas: 359000,
    priceNow: 214000,
    discountPct: 40,
    blockedBy: null,
    mark: 2,
  },
  {
    id: "l5",
    title: "Mesh-back office chair, unlisted origin",
    seller: "Account opened this week",
    matchPct: 88,
    grade: "B+",
    verified: false,
    fullPhotos: true,
    priceWas: 420000,
    priceNow: 189000,
    discountPct: 55,
    blockedBy: "verification",
    mark: 0,
  },
  {
    id: "l6",
    title: "Fixed-lens compact camera, body only",
    seller: "No payout history",
    matchPct: 94,
    grade: "B",
    verified: false,
    fullPhotos: true,
    priceWas: 1490000,
    priceNow: 890000,
    discountPct: 40,
    blockedBy: "verification",
    mark: 3,
  },
  {
    id: "l7",
    title: "Steel-frame side table, powder coat",
    seller: "Unresolved identity",
    matchPct: 86,
    grade: "B",
    verified: false,
    fullPhotos: true,
    priceWas: 980000,
    priceNow: 540000,
    discountPct: 45,
    blockedBy: "verification",
    mark: 1,
  },
  {
    id: "l8",
    title: "Desk calculator, sealed in original box",
    seller: "Vessel Supply",
    matchPct: 84,
    grade: "A",
    verified: true,
    fullPhotos: true,
    priceWas: 310000,
    priceNow: 39000,
    discountPct: 87,
    blockedBy: "price",
    mark: 2,
  },
  {
    id: "l9",
    title: "Twin-lens film camera, sold as-is",
    seller: "Halfmoon Traders",
    matchPct: 79,
    grade: "B",
    verified: true,
    fullPhotos: true,
    priceWas: 2400000,
    priceNow: 120000,
    discountPct: 95,
    blockedBy: "price",
    mark: 3,
  },
  {
    id: "l10",
    title: "Leather lounge chair, split seam",
    seller: "Studio Ondo",
    matchPct: 82,
    grade: "C",
    verified: true,
    fullPhotos: true,
    priceWas: 4200000,
    priceNow: 1850000,
    discountPct: 56,
    blockedBy: "condition",
    mark: 0,
  },
  {
    id: "l11",
    title: "E-reader, permanent screen burn",
    seller: "Northline Supply",
    matchPct: 77,
    grade: "C-",
    verified: true,
    fullPhotos: true,
    priceWas: 230000,
    priceNow: 78000,
    discountPct: 66,
    blockedBy: "condition",
    mark: 1,
  },
  {
    id: "l12",
    title: "Articulated desk lamp, one photo filed",
    seller: "Northline Supply",
    matchPct: 81,
    grade: "B",
    verified: true,
    fullPhotos: false,
    priceWas: 390000,
    priceNow: 210000,
    discountPct: 46,
    blockedBy: "photos",
    mark: 2,
  },
];

export const BLOCKED_COUNT: Record<GuardrailId, number> = {
  verification: LISTINGS.filter((l) => l.blockedBy === "verification").length,
  price: LISTINGS.filter((l) => l.blockedBy === "price").length,
  condition: LISTINGS.filter((l) => l.blockedBy === "condition").length,
  photos: LISTINGS.filter((l) => l.blockedBy === "photos").length,
};

export type CardState = "selected" | "admitted" | "filtered";

export function stateOf(
  listing: Listing,
  off: readonly GuardrailId[],
): CardState {
  if (listing.blockedBy === null) return "selected";
  return off.includes(listing.blockedBy) ? "admitted" : "filtered";
}

/**
 * Lower median, deliberately: an even-length set would otherwise average two grades into a value
 * that is not a grade, and a half-point discount reads as noise. Picking the lower of the two
 * middles keeps every printed figure an integer and keeps the direction honest.
 */
function lowerMedian(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

export type Summary = {
  count: number;
  verifiedPct: number;
  photoPct: number;
  medianGrade: string;
  medianDiscount: number;
  exceptions: number;
};

export function boardOf(off: readonly GuardrailId[]): Listing[] {
  return LISTINGS.filter((l) => stateOf(l, off) !== "filtered");
}

export function summarize(off: readonly GuardrailId[]): Summary {
  const board = boardOf(off);
  const size = board.length || 1;
  return {
    count: board.length,
    verifiedPct: Math.round(
      (board.filter((l) => l.verified).length / size) * 100,
    ),
    photoPct: Math.round(
      (board.filter((l) => l.fullPhotos).length / size) * 100,
    ),
    medianGrade:
      GRADE_LABELS[lowerMedian(board.map((l) => GRADE_SCORES[l.grade]))],
    medianDiscount: lowerMedian(board.map((l) => l.discountPct)),
    exceptions: board.filter(
      (l) => l.blockedBy === "price" || l.blockedBy === "photos",
    ).length,
  };
}

export const BASELINE = summarize([]);

export function warningLine(off: readonly GuardrailId[]): string {
  if (off.length === 0) {
    return "All four guardrails are holding. Every listing on the board cleared identity, price, condition and photo checks.";
  }
  const dropped = GUARDRAILS.filter((g) => off.includes(g.id));
  const total = dropped.reduce((sum, g) => sum + BLOCKED_COUNT[g.id], 0);
  if (dropped.length === 1) {
    const g = dropped[0];
    const n = BLOCKED_COUNT[g.id];
    return `Overriding ${g.label} admits ${n} ${n === 1 ? "listing" : "listings"} ${g.admitPhrase}.`;
  }
  const parts = dropped.map((g) => {
    const n = BLOCKED_COUNT[g.id];
    return `${n} ${g.admitPhrase}`;
  });
  return `${dropped.length} guardrails are off, admitting ${total} extra listings: ${parts.join("; ")}.`;
}

export type BoardGroup = {
  key: string;
  title: string;
  note: string;
  items: Listing[];
};

export function groupBoard(
  mode: "status" | "reason",
  off: readonly GuardrailId[],
): BoardGroup[] {
  if (mode === "status") {
    const buckets: { key: CardState; title: string; note: string }[] = [
      {
        key: "selected",
        title: "Selected",
        note: "Cleared all four guardrails on the first pass.",
      },
      {
        key: "admitted",
        title: "Admitted by override",
        note: "Back on the board because a guardrail is off.",
      },
      {
        key: "filtered",
        title: "Filtered out",
        note: "Refused, and kept in view so the refusal is checkable.",
      },
    ];
    return buckets
      .map((b) => ({
        ...b,
        items: LISTINGS.filter((l) => stateOf(l, off) === b.key),
      }))
      .filter((g) => g.items.length > 0);
  }

  const groups: BoardGroup[] = [
    {
      key: "clear",
      title: "Cleared all four",
      note: "Nothing to override. These were never in question.",
      items: LISTINGS.filter((l) => l.blockedBy === null),
    },
  ];
  for (const g of GUARDRAILS) {
    const items = LISTINGS.filter((l) => l.blockedBy === g.id);
    if (items.length === 0) continue;
    const isOff = off.includes(g.id);
    groups.push({
      key: g.id,
      title: g.label,
      note: isOff
        ? `Guardrail off — all ${items.length} are on the board.`
        : `Guardrail on — ${items.length} held back.`,
      items,
    });
  }
  return groups;
}

export function formatWon(value: number): string {
  return `KRW ${value.toLocaleString("en-US")}`;
}
