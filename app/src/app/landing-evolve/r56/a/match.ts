// match.ts — deterministic free-text fuzzy match over a fixed camera-gear catalog.
// No randomness, no Date(), no network calls: every rank is a pure function of (query, LISTINGS).
// This module is the single source of truth for "what matched and why" — the hero search box,
// the proof cards, and the closing CTA all call rankListings() directly so the derived value can
// never drift into a second, hand-typed literal that only resembles the real one.

export type Category = "Mirrorless" | "Compact" | "Lens" | "Film";
export type GradeKey = "like-new" | "excellent" | "good" | "fair";

export interface Listing {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: Category;
  grade: GradeKey;
  verified: boolean;
  price: number;
  originalPrice: number;
  imageId: string;
  imageAlt: string;
  /** Tie-break order for the no-query / no-hit fallback states. Lower = shown first. */
  defaultRank: number;
}

export const GRADE_META: Record<GradeKey, { letter: string; label: string }> = {
  "like-new": { letter: "A", label: "Like New" },
  excellent: { letter: "A−", label: "Excellent" },
  good: { letter: "B+", label: "Good" },
  fair: { letter: "B", label: "Fair" },
};

export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iii",
    title: "Sony A7 III Body",
    brand: "Sony",
    model: "A7 III",
    category: "Mirrorless",
    grade: "excellent",
    verified: true,
    price: 1049,
    originalPrice: 1399,
    imageId: "photo-1516035069371-29a1b244cc32",
    imageAlt: "Sony A7 III mirrorless camera body on a plain surface",
    defaultRank: 1,
  },
  {
    id: "sony-a7cii",
    title: "Sony A7C II Body",
    brand: "Sony",
    model: "A7C II",
    category: "Mirrorless",
    grade: "like-new",
    verified: true,
    price: 1899,
    originalPrice: 2199,
    imageId: "photo-1502920917128-1aa500764cbd",
    imageAlt: "Sony A7C II compact mirrorless camera body",
    defaultRank: 2,
  },
  {
    id: "fuji-x100v",
    title: "Fujifilm X100V",
    brand: "Fujifilm",
    model: "X100V",
    category: "Compact",
    grade: "excellent",
    verified: true,
    price: 1199,
    originalPrice: 1599,
    imageId: "photo-1512790182412-b19e6d62bc39",
    imageAlt: "Fujifilm X100V compact camera with fixed lens",
    defaultRank: 3,
  },
  {
    id: "fuji-xt4",
    title: "Fujifilm X-T4 Body",
    brand: "Fujifilm",
    model: "X-T4",
    category: "Mirrorless",
    grade: "good",
    verified: false,
    price: 1099,
    originalPrice: 1499,
    imageId: "photo-1520390138845-fd2d229dd553",
    imageAlt: "Fujifilm X-T4 mirrorless camera body",
    defaultRank: 4,
  },
  {
    id: "canon-r6",
    title: "Canon EOS R6",
    brand: "Canon",
    model: "EOS R6",
    category: "Mirrorless",
    grade: "excellent",
    verified: true,
    price: 1399,
    originalPrice: 1799,
    imageId: "photo-1606986628253-05620e9b7e2e",
    imageAlt: "Canon EOS R6 mirrorless camera body",
    defaultRank: 5,
  },
  {
    id: "leica-q2",
    title: "Leica Q2",
    brand: "Leica",
    model: "Q2",
    category: "Compact",
    grade: "like-new",
    verified: true,
    price: 3899,
    originalPrice: 4999,
    imageId: "photo-1510127034890-ba27508e9f1c",
    imageAlt: "Leica Q2 compact camera with fixed 28mm lens",
    defaultRank: 6,
  },
  {
    id: "nikon-z6ii",
    title: "Nikon Z6 II",
    brand: "Nikon",
    model: "Z6 II",
    category: "Mirrorless",
    grade: "good",
    verified: true,
    price: 999,
    originalPrice: 1399,
    imageId: "photo-1542567455-cd733f23fbb1",
    imageAlt: "Nikon Z6 II mirrorless camera body, top view",
    defaultRank: 7,
  },
  {
    id: "olympus-em5iii",
    title: "Olympus OM-D E-M5 III",
    brand: "Olympus",
    model: "E-M5 III",
    category: "Mirrorless",
    grade: "excellent",
    verified: false,
    price: 649,
    originalPrice: 899,
    imageId: "photo-1472099645785-5658abf4ff4e",
    imageAlt: "Olympus OM-D E-M5 III micro four thirds camera body",
    defaultRank: 8,
  },
  {
    id: "pentax-k1000",
    title: "Pentax K1000 (Film)",
    brand: "Pentax",
    model: "K1000",
    category: "Film",
    grade: "good",
    verified: true,
    price: 189,
    originalPrice: 249,
    imageId: "photo-1452780212940-6f5c0d14d848",
    imageAlt: "Pentax K1000 manual film camera body",
    defaultRank: 9,
  },
  {
    id: "sony-2470gm",
    title: "Sony FE 24-70mm f/2.8 GM",
    brand: "Sony",
    model: "FE 24-70mm f/2.8 GM",
    category: "Lens",
    grade: "like-new",
    verified: true,
    price: 1649,
    originalPrice: 2099,
    imageId: "photo-1495707902641-75cac588d2e9",
    imageAlt: "Sony FE 24-70mm f/2.8 GM zoom lens",
    defaultRank: 10,
  },
  {
    id: "canon-rf50",
    title: "Canon RF 50mm f/1.2L",
    brand: "Canon",
    model: "RF 50mm f/1.2L",
    category: "Lens",
    grade: "excellent",
    verified: true,
    price: 1799,
    originalPrice: 2299,
    imageId: "photo-1452796185652-709c4e6ee25a",
    imageAlt: "Canon RF 50mm f/1.2L prime lens",
    defaultRank: 11,
  },
  {
    id: "fuji-xf35",
    title: "Fujifilm XF 35mm f/1.4",
    brand: "Fujifilm",
    model: "XF 35mm f/1.4",
    category: "Lens",
    grade: "good",
    verified: true,
    price: 329,
    originalPrice: 449,
    imageId: "photo-1519638399535-1b036603ac77",
    imageAlt: "Fujifilm XF 35mm f/1.4 prime lens",
    defaultRank: 12,
  },
];

export const DEFAULT_QUERY = "Sony a7 II";

interface MatchedAttrs {
  brand: string[];
  model: string[];
  title: string[];
  category: string[];
}

const ATTR_ORDER: { key: keyof MatchedAttrs; label: string; weight: number }[] = [
  { key: "brand", label: "brand", weight: 3 },
  { key: "model", label: "model", weight: 3 },
  { key: "title", label: "title", weight: 2 },
  { key: "category", label: "category", weight: 1 },
];

export function tokenize(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreListing(tokens: string[], listing: Listing) {
  const matched: MatchedAttrs = { brand: [], model: [], title: [], category: [] };
  const matchedTokens = new Set<string>();
  const haystack: Record<keyof MatchedAttrs, string> = {
    brand: listing.brand.toLowerCase(),
    model: listing.model.toLowerCase(),
    title: listing.title.toLowerCase(),
    category: listing.category.toLowerCase(),
  };
  let score = 0;
  for (const token of tokens) {
    let hitAny = false;
    // Brand / model / category are checked first. A real-world title is almost always a
    // restatement of brand + model, so "title" only gets credit — and only shows up in the
    // reasoning tag — when a token hits it WITHOUT already being explained by a more specific
    // attribute. Otherwise every match would redundantly repeat "title: sony + a7" next to
    // "brand: sony · model: a7", which tells the shopper nothing new.
    let hitSpecific = false;
    for (const { key, weight } of ATTR_ORDER) {
      if (key === "title") continue;
      if (haystack[key].includes(token)) {
        matched[key].push(token);
        score += weight;
        hitAny = true;
        hitSpecific = true;
      }
    }
    if (!hitSpecific && haystack.title.includes(token)) {
      matched.title.push(token);
      score += 2;
      hitAny = true;
    }
    if (hitAny) matchedTokens.add(token);
  }
  return { score, matched, matchedTokenCount: matchedTokens.size };
}

function formatReason(matched: MatchedAttrs): string {
  const parts: string[] = [];
  for (const { key, label } of ATTR_ORDER) {
    const tokens = Array.from(new Set(matched[key]));
    if (tokens.length === 0) continue;
    parts.push(`${label} "${tokens.join('" + "')}"`);
  }
  return parts.join(" · ");
}

export interface RankedListing {
  listing: Listing;
  score: number;
  reason: string;
  matchedTokenCount: number;
}

export interface RankResult {
  results: RankedListing[];
  tokens: string[];
  /** true when this is a default/no-hit catalog ordering rather than a real keyword match */
  isFallback: boolean;
  fallbackReason: "empty-query" | "no-hits" | null;
}

const byDefaultRank = (a: Listing, b: Listing) => a.defaultRank - b.defaultRank;

/**
 * The single derivation function every live-value section calls: the hero search box, the proof
 * cards, and the closing CTA all pass the SAME query through this function rather than each
 * computing (or worse, hand-typing) their own copy of the answer.
 */
export function rankListings(query: string): RankResult {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    const results: RankedListing[] = [...LISTINGS].sort(byDefaultRank).map((listing) => ({
      listing,
      score: 0,
      reason: "Shown by popularity — no search typed yet",
      matchedTokenCount: 0,
    }));
    return { results, tokens, isFallback: true, fallbackReason: "empty-query" };
  }

  const scored: RankedListing[] = LISTINGS.map((listing) => {
    const { score, matched, matchedTokenCount } = scoreListing(tokens, listing);
    return {
      listing,
      score,
      reason: score > 0 ? formatReason(matched) : "",
      matchedTokenCount,
    };
  });

  const hits = scored.filter((r) => r.score > 0);

  if (hits.length === 0) {
    const results: RankedListing[] = [...LISTINGS].sort(byDefaultRank).map((listing) => ({
      listing,
      score: 0,
      reason: `No keyword in "${query.trim()}" matched — showing the full catalog by popularity`,
      matchedTokenCount: 0,
    }));
    return { results, tokens, isFallback: true, fallbackReason: "no-hits" };
  }

  hits.sort((a, b) => b.score - a.score || a.listing.defaultRank - b.listing.defaultRank);
  return { results: hits, tokens, isFallback: false, fallbackReason: null };
}

export function discountPct(listing: Listing): number {
  return Math.round((1 - listing.price / listing.originalPrice) * 100);
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** The sentence the closing CTA reads aloud — built from the exact same RankResult the hero uses. */
export function buildClosingSummary(query: string, rank: RankResult): string {
  const top = rank.results[0];
  const trimmed = query.trim();

  if (rank.fallbackReason === "empty-query") {
    return `No search typed — repick is currently leading with ${top.listing.title}, our most popular listing.`;
  }
  if (rank.fallbackReason === "no-hits") {
    return `"${trimmed}" didn't hit a keyword yet, so repick is showing ${top.listing.title} from the full catalog while you keep typing.`;
  }
  const hits = top.matchedTokenCount;
  const hitWord = hits === 1 ? "hit" : "hits";
  return `Right now, "${trimmed}" surfaces ${top.listing.title} as the top match — ${hits} keyword ${hitWord} on its ${top.reason}.`;
}
