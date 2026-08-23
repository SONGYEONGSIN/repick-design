// repick — Swipe Deck Comparator (auto-landing-r15, candidate b)
//
// Pure data + deterministic logic only, no JSX. Every "recomputed" number on the
// page (match %, rank, live status line, closing-CTA summary) is a pure function
// of `history: SwipeRecord[]` — no Math.random / Date.now / argument-less `new
// Date()` anywhere, so the same sequence of swipes always reproduces the same
// state.

export type TagId = "oversized" | "tailored" | "minimal" | "workwear" | "denim" | "leather";

export type Tag = { id: TagId; label: string };

export const TAGS: Tag[] = [
  { id: "oversized", label: "Oversized fit" },
  { id: "tailored", label: "Tailored" },
  { id: "minimal", label: "Minimal palette" },
  { id: "workwear", label: "Workwear" },
  { id: "denim", label: "Denim" },
  { id: "leather", label: "Leather" },
];

export function tagLabel(id: TagId): string {
  return TAGS.find((t) => t.id === id)?.label ?? id;
}

export type Grade = "S" | "A" | "B+" | "B";

export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: { src: string; alt: string };
  retail: number;
  repick: number;
  grade: Grade;
  gradeLabel: string;
  verified: boolean;
  seller: string;
  baseMatch: number;
  tags: [TagId, TagId];
};

// Deck order is the swipe order — fixed, never shuffled.
export const LISTINGS: Listing[] = [
  {
    id: "trench",
    title: "Oversized Trench Coat",
    brand: "Aureum Vintage",
    category: "Outerwear",
    image: {
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
      alt: "Fashion shot of a person wearing a beige oversized trench coat",
    },
    retail: 268000,
    repick: 132000,
    grade: "A",
    gradeLabel: "Light wear",
    verified: true,
    seller: "Jimin",
    baseMatch: 91,
    tags: ["oversized", "minimal"],
  },
  {
    id: "wool-coat",
    title: "Wool Single-Breasted Coat",
    brand: "Atelier Given",
    category: "Outerwear",
    image: {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
      alt: "Wool coats neatly hung on a clothing rack",
    },
    retail: 312000,
    repick: 148000,
    grade: "S",
    gradeLabel: "Like-new condition",
    verified: true,
    seller: "Haneul",
    baseMatch: 88,
    tags: ["tailored", "minimal"],
  },
  {
    id: "crossbody",
    title: "Leather Crossbody Bag",
    brand: "Noir & Co.",
    category: "Bags",
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
      alt: "A leather crossbody bag and accessories laid on the floor",
    },
    retail: 268000,
    repick: 129000,
    grade: "S",
    gradeLabel: "Like-new condition",
    verified: true,
    seller: "Eunwoo",
    baseMatch: 84,
    tags: ["leather", "minimal"],
  },
  {
    id: "denim-jacket",
    title: "Denim Trucker Jacket",
    brand: "Fieldwork Co.",
    category: "Outerwear",
    image: {
      src: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
      alt: "Denim trucker jacket laid flat against a plain backdrop",
    },
    retail: 150000,
    repick: 74000,
    grade: "B",
    gradeLabel: "Visible wear",
    verified: true,
    seller: "Doyoon",
    baseMatch: 79,
    tags: ["denim", "workwear"],
  },
  {
    id: "sneakers-white",
    title: "Classic Low-Top Sneakers",
    brand: "Fielder Studio",
    category: "Footwear",
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
      alt: "A pair of classic white-toned sneakers",
    },
    retail: 298000,
    repick: 139000,
    grade: "S",
    gradeLabel: "Like-new condition",
    verified: true,
    seller: "Junseo",
    baseMatch: 86,
    tags: ["minimal", "workwear"],
  },
  {
    id: "high-top",
    title: "High-Top Leather Sneakers",
    brand: "Runway Archive",
    category: "Footwear",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      alt: "Photo of a pair of high-top sneakers placed side by side",
    },
    retail: 236000,
    repick: 112000,
    grade: "A",
    gradeLabel: "Light wear",
    verified: true,
    seller: "Minji",
    baseMatch: 82,
    tags: ["leather", "workwear"],
  },
  {
    id: "chelsea-boots",
    title: "Suede Chelsea Boots",
    brand: "Ashcroft & Sons",
    category: "Footwear",
    image: {
      src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80",
      alt: "Pair of suede Chelsea boots side by side",
    },
    retail: 150000,
    repick: 74000,
    grade: "B+",
    gradeLabel: "Gently worn",
    verified: true,
    seller: "Seoyeon",
    baseMatch: 77,
    tags: ["tailored", "leather"],
  },
  {
    id: "shoulder-bag",
    title: "Leather Mini Shoulder Bag",
    brand: "Atelier Noir",
    category: "Bags",
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      alt: "Close-up photo of a leather mini shoulder bag",
    },
    retail: 214000,
    repick: 104000,
    grade: "A",
    gradeLabel: "Light wear",
    verified: true,
    seller: "Rina",
    baseMatch: 80,
    tags: ["leather", "minimal"],
  },
];

export type SwipeDir = "keep" | "pass";
export type SwipeRecord = { itemId: string; dir: SwipeDir };
export type Profile = Record<TagId, number>;

export function emptyProfile(): Profile {
  return { oversized: 0, tailored: 0, minimal: 0, workwear: 0, denim: 0, leather: 0 };
}

export function applySwipe(profile: Profile, listing: Listing, dir: SwipeDir): Profile {
  const delta = dir === "keep" ? 1 : -1;
  const next = { ...profile };
  for (const t of listing.tags) next[t] += delta;
  return next;
}

export function profileFromHistory(history: SwipeRecord[]): Profile {
  let p = emptyProfile();
  for (const h of history) {
    const listing = LISTINGS.find((l) => l.id === h.itemId);
    if (listing) p = applySwipe(p, listing, h.dir);
  }
  return p;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

// Fixed swipe-mechanic constants — deterministic thresholds, never randomized.
export const DRAG_PX_THRESHOLD = 120;
export const DRAG_VELOCITY_THRESHOLD = 600;
export const EXIT_DISTANCE = 560;
export const EXIT_DURATION = 0.16;
export const ENTRANCE_DURATION = 0.22;

// Highest possible |profile value| a single tag can reach given the fixed
// catalogue above (the "leather" tag appears on 4 listings) — used only to
// scale the profile bar visualization, not to clip the underlying number.
export const BAR_RANGE = 5;

// pct points of match shifted per unit of accumulated profile weight on a
// shared tag.
export const MATCH_WEIGHT = 3;

export function displayedMatch(listing: Listing, profile: Profile): number {
  const raw = listing.tags.reduce((s, t) => s + profile[t], 0);
  return clamp(Math.round(listing.baseMatch + raw * MATCH_WEIGHT), 5, 99);
}

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.repick / listing.retail) * 100);
}

export function money(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type RankState = SwipeDir | "queued";
export type RankedListing = Listing & { match: number; rank: number; state: RankState };

export function rankListings(history: SwipeRecord[]): RankedListing[] {
  const profile = profileFromHistory(history);
  const stateById = new Map(history.map((h) => [h.itemId, h.dir] as const));
  const withMatch = LISTINGS.map((l, i) => ({
    listing: l,
    match: displayedMatch(l, profile),
    state: (stateById.get(l.id) ?? "queued") as RankState,
    i,
  }));
  withMatch.sort((a, b) => b.match - a.match || a.i - b.i);
  return withMatch.map((entry, idx) => ({
    ...entry.listing,
    match: entry.match,
    state: entry.state,
    rank: idx + 1,
  }));
}

// Baseline order (no swipes yet) computed once at module load — pure function
// of fixed data, safe to memoize at module scope.
const BASELINE_ORDER = rankListings([]).map((l) => l.id);

export function rankChangeCount(history: SwipeRecord[]): number {
  const current = rankListings(history).map((l) => l.id);
  let changed = 0;
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== BASELINE_ORDER[i]) changed++;
  }
  return changed;
}

export function topTag(profile: Profile): { tag: Tag; value: number } | null {
  let best: Tag | null = null;
  let bestVal = 0;
  for (const t of TAGS) {
    if (profile[t.id] > bestVal) {
      bestVal = profile[t.id];
      best = t;
    }
  }
  return best ? { tag: best, value: bestVal } : null;
}

export function passStats(history: SwipeRecord[]): { count: number; avgDrop: number } {
  const profile = profileFromHistory(history);
  const passed = history.filter((h) => h.dir === "pass");
  if (passed.length === 0) return { count: 0, avgDrop: 0 };
  const drops = passed.map((h) => {
    const listing = LISTINGS.find((l) => l.id === h.itemId);
    if (!listing) return 0;
    return listing.baseMatch - displayedMatch(listing, profile);
  });
  const avg = drops.reduce((s, d) => s + d, 0) / drops.length;
  return { count: passed.length, avgDrop: Math.round(avg * 10) / 10 };
}

export function liveMessage(history: SwipeRecord[], profile: Profile): string {
  const total = LISTINGS.length;
  if (history.length === 0) {
    return `No picks reviewed yet. Drag a card, or use Pass and Keep, to start — ${total} nearby picks in the deck.`;
  }
  const last = history[history.length - 1];
  const listing = LISTINGS.find((l) => l.id === last.itemId);
  const verb = last.dir === "keep" ? "Kept" : "Passed";
  const lead = topTag(profile);
  const leadText = lead
    ? `leading tag ${lead.tag.label} at +${lead.value}`
    : "no clear lean yet";
  const doneText =
    history.length >= total ? "All picks reviewed." : `${history.length} of ${total} reviewed.`;
  return `${verb} — ${listing ? listing.title : "a pick"}. ${doneText} Profile ${leadText}.`;
}
