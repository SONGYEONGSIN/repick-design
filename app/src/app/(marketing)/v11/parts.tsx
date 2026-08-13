/**
 * Data, scoring and static marks for the r9/b landing.
 *
 * Every number here is a module constant and every derived value comes out of a pure integer
 * function — nothing random, nothing clock-dependent, nothing that could differ between the server
 * render and the client hydration. Weights are positional: position 1 carries x5,
 * position 5 carries x1, and the five weights always sum to 15, so a match percentage is just
 * `total / 15` rounded once.
 */

export type CriterionId = "condition" | "price" | "trust" | "rarity" | "shipping";

export type Criterion = {
  id: CriterionId;
  name: string;
  abbr: string;
  blurb: string;
  /** Distinct tone *and* distinct hatch, so the stack never relies on colour alone. */
  fill: string;
  /** Sum of the four listing scores for this criterion — kept as an integer to avoid float drift. */
  sum: number;
  /** Rounded set average, precomputed so the copy never prints a fraction. */
  avg: number;
};

export const CRITERIA: Criterion[] = [
  {
    id: "condition",
    name: "Condition",
    abbr: "CND",
    blurb: "Wear, completeness, service history.",
    fill: "#0B0B0F",
    sum: 328,
    avg: 82,
  },
  {
    id: "price",
    name: "Price fairness",
    abbr: "PRC",
    blurb: "Asking price against 90 days of comparables.",
    fill: "#3F3F46",
    sum: 315,
    avg: 79,
  },
  {
    id: "trust",
    name: "Seller trust",
    abbr: "TRS",
    blurb: "ID checks, dispute rate, resolved returns.",
    fill: "repeating-linear-gradient(135deg, #6B6B74 0 4px, #8E8E96 4px 8px)",
    sum: 340,
    avg: 85,
  },
  {
    id: "rarity",
    name: "Rarity",
    abbr: "RAR",
    blurb: "How often this exact spec reaches the market.",
    fill: "#A1A1AA",
    sum: 323,
    avg: 81,
  },
  {
    id: "shipping",
    name: "Shipping distance",
    abbr: "SHP",
    blurb: "Handling risk and time in transit.",
    fill: "repeating-linear-gradient(45deg, #C9C9CF 0 3px, #EDEDF0 3px 6px)",
    sum: 308,
    avg: 77,
  },
];

export const CRITERIA_BY_ID: Record<CriterionId, Criterion> = {
  condition: CRITERIA[0],
  price: CRITERIA[1],
  trust: CRITERIA[2],
  rarity: CRITERIA[3],
  shipping: CRITERIA[4],
};

export const DEFAULT_ORDER: CriterionId[] = [
  "condition",
  "price",
  "trust",
  "rarity",
  "shipping",
];

export const PRESETS: { id: string; label: string; order: CriterionId[] }[] = [
  { id: "balanced", label: "Balanced", order: DEFAULT_ORDER },
  {
    id: "bargain",
    label: "Bargain hunter",
    order: ["price", "shipping", "condition", "trust", "rarity"],
  },
  {
    id: "collector",
    label: "Collector",
    order: ["rarity", "condition", "trust", "price", "shipping"],
  },
  {
    id: "trust",
    label: "Trust first",
    order: ["trust", "condition", "shipping", "price", "rarity"],
  },
];

/** Share of the total weight held by each position — 5/15, 4/15 … rounded once, summing to 100. */
export const POSITION_SHARES = [33, 27, 20, 13, 7];

export type Listing = {
  id: string;
  title: string;
  meta: string;
  seller: string;
  grade: string;
  gradeNote: string;
  was: number;
  now: number;
  off: number;
  scores: Record<CriterionId, number>;
};

export const LISTINGS: Listing[] = [
  {
    id: "turntable",
    title: "Belt-drive studio turntable",
    meta: "1978 · walnut plinth · serviced 2025",
    seller: "northline supply · 214 sales · 0 disputes",
    grade: "A",
    gradeNote: "light plinth wear",
    was: 980,
    now: 529,
    off: 46,
    scores: { condition: 92, price: 71, trust: 88, rarity: 95, shipping: 54 },
  },
  {
    id: "chair",
    title: "Mesh task chair, size B",
    meta: "2019 · fully adjustable · new casters",
    seller: "grid & bay · 1,038 sales · 1 dispute",
    grade: "B+",
    gradeNote: "scuffed base, mesh intact",
    was: 1395,
    now: 742,
    off: 47,
    scores: { condition: 78, price: 94, trust: 74, rarity: 62, shipping: 88 },
  },
  {
    id: "camera",
    title: "Compact 35 mm rangefinder",
    meta: "1996 · f/2.4 lens · serviced 2024",
    seller: "atelier ninety · 96 sales · 0 disputes",
    grade: "A",
    gradeNote: "clean glass, no haze",
    was: 1180,
    now: 845,
    off: 28,
    scores: { condition: 88, price: 62, trust: 96, rarity: 90, shipping: 70 },
  },
  {
    id: "shelving",
    title: "Wall shelving system, 5 bays",
    meta: "2016 · powder-coated steel · all brackets",
    seller: "sunset depot · 462 sales · 2 disputes",
    grade: "B+",
    gradeNote: "two shelves re-sprayed",
    was: 640,
    now: 388,
    off: 39,
    scores: { condition: 70, price: 88, trust: 82, rarity: 76, shipping: 96 },
  },
];

export type Contribution = {
  id: CriterionId;
  weight: number;
  points: number;
  share: number;
};

export type Ranked = {
  listing: Listing;
  total: number;
  pct: number;
  contributions: Contribution[];
};

export function weightAt(index: number): number {
  return 5 - index;
}

export function totalFor(listing: Listing, order: CriterionId[]): number {
  return order.reduce((sum, id, i) => sum + weightAt(i) * listing.scores[id], 0);
}

export function contributionsFor(listing: Listing, order: CriterionId[]): Contribution[] {
  const total = totalFor(listing, order);
  const raw = order.map((id, i) => ({
    id,
    weight: weightAt(i),
    points: weightAt(i) * listing.scores[id],
  }));
  let used = 0;
  return raw.map((entry, i) => {
    // The last slice absorbs the rounding remainder so the five shares always add to exactly 100.
    const share = i === raw.length - 1 ? 100 - used : Math.round((entry.points * 100) / total);
    used += share;
    return { ...entry, share };
  });
}

export function rankListings(order: CriterionId[]): Ranked[] {
  return LISTINGS.map((listing) => {
    const total = totalFor(listing, order);
    return {
      listing,
      total,
      pct: Math.round(total / 15),
      contributions: contributionsFor(listing, order),
    };
  }).sort((a, b) => b.total - a.total || a.listing.id.localeCompare(b.listing.id));
}

/** How far above the four-listing average this listing sits on a criterion, scaled by its weight. */
function edges(listing: Listing, order: CriterionId[]) {
  return order
    .map((id, i) => {
      const crit = CRITERIA_BY_ID[id];
      return {
        crit,
        weight: weightAt(i),
        edge: (listing.scores[id] * 4 - crit.sum) * weightAt(i),
      };
    })
    .sort((a, b) => b.edge - a.edge);
}

export function reasonTag(listing: Listing, order: CriterionId[]): string {
  const [first, second] = edges(listing, order);
  if (first.edge <= 0) return "Matched on overall balance";
  if (second.edge <= 0) return `Matched on ${first.crit.name.toLowerCase()}`;
  return `Matched on ${first.crit.name.toLowerCase()} + ${second.crit.name.toLowerCase()}`;
}

export function leadReason(ranked: Ranked[], order: CriterionId[]): string {
  const [top, second] = ranked;
  const [best] = edges(top.listing, order);
  const gap = top.total - second.total;
  return `Leads by ${gap} points. Its ${best.crit.name.toLowerCase()} score of ${
    top.listing.scores[best.crit.id]
  } beats the set average of ${best.crit.avg}, and at your order that criterion carries weight ×${
    best.weight
  }.`;
}

export const DEFAULT_RANK_IDS: string[] = rankListings(DEFAULT_ORDER).map((r) => r.listing.id);

export function movement(ranked: Ranked[]) {
  const moves = ranked.map((row, i) => ({
    id: row.listing.id,
    title: row.listing.title,
    delta: DEFAULT_RANK_IDS.indexOf(row.listing.id) - i,
  }));
  const changed = moves.filter((m) => m.delta !== 0).length;
  const biggest = moves.reduce(
    (best, m) => (Math.abs(m.delta) > Math.abs(best.delta) ? m : best),
    moves[0],
  );
  return { changed, biggest };
}

export function money(value: number): string {
  // Grouped by hand rather than through `toLocaleString`, which depends on the ICU data the server
  // happens to ship and can therefore disagree with the browser during hydration.
  return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/* ---------------------------------------------------------------------------------------------- */

export function GhostNumber({ value }: { value: string }) {
  return (
    <svg
      viewBox="0 0 120 64"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className="h-11 w-20 md:h-14 md:w-28"
    >
      <text
        x="0"
        y="52"
        fill="#E4E4E7"
        fontSize="62"
        fontWeight="800"
        letterSpacing="-3"
        fontFamily="var(--font-display-grotesk)"
      >
        {value}
      </text>
    </svg>
  );
}

export function QuoteMark() {
  return (
    <svg
      viewBox="0 0 48 34"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className="h-7 w-10"
    >
      <text
        x="0"
        y="32"
        fill="#6E56CF"
        fontSize="46"
        fontWeight="800"
        fontFamily="var(--font-display-grotesk)"
      >
        &ldquo;
      </text>
    </svg>
  );
}

/**
 * Generated product marks. Solid geometry rather than outlines — the DNA bans line-art, and flat
 * silhouettes survive being rendered 72px wide in the ranked rows.
 */
export function ListingMark({ id }: { id: string }) {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-100">
      <svg viewBox="0 0 120 90" role="presentation" aria-hidden="true" className="h-full w-full">
        {id === "turntable" ? (
          <>
            <rect x="14" y="18" width="92" height="56" rx="4" fill="#D4D4D8" />
            <circle cx="52" cy="46" r="22" fill="#3F3F46" />
            <circle cx="52" cy="46" r="4" fill="#FAFAFA" />
            <rect x="88" y="24" width="10" height="10" rx="2" fill="#71717A" />
            <rect
              x="82"
              y="30"
              width="5"
              height="34"
              rx="2"
              fill="#71717A"
              transform="rotate(16 84 47)"
            />
          </>
        ) : null}
        {id === "chair" ? (
          <>
            <rect x="40" y="12" width="40" height="34" rx="11" fill="#3F3F46" />
            <rect x="32" y="50" width="56" height="10" rx="5" fill="#71717A" />
            <rect x="56" y="60" width="8" height="14" fill="#A1A1AA" />
            <rect x="36" y="74" width="48" height="6" rx="3" fill="#D4D4D8" />
          </>
        ) : null}
        {id === "camera" ? (
          <>
            <rect x="20" y="28" width="80" height="44" rx="6" fill="#3F3F46" />
            <rect x="42" y="18" width="26" height="10" rx="3" fill="#71717A" />
            <circle cx="60" cy="50" r="16" fill="#A1A1AA" />
            <circle cx="60" cy="50" r="7" fill="#FAFAFA" />
            <rect x="82" y="36" width="10" height="6" rx="2" fill="#D4D4D8" />
          </>
        ) : null}
        {id === "shelving" ? (
          <>
            <rect x="18" y="16" width="84" height="6" fill="#3F3F46" />
            <rect x="18" y="42" width="84" height="6" fill="#71717A" />
            <rect x="18" y="68" width="84" height="6" fill="#A1A1AA" />
            <rect x="24" y="16" width="6" height="58" fill="#D4D4D8" />
            <rect x="90" y="16" width="6" height="58" fill="#D4D4D8" />
          </>
        ) : null}
      </svg>
    </div>
  );
}
