"use client";

import { useMemo, useState } from "react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_QUERY, LISTINGS } from "./data";
import { computeSearchStats, filterAndRank } from "./search-math";

/**
 * Single state owner for the whole page. `query` is lifted here, not into a
 * context, because only three components ever need it (Hero, ValueSplit,
 * ClosingCTA) and they all sit directly under this one client component. All three
 * read from the SAME `rankedResults`/`stats`, computed once via `useMemo` from the
 * same pure functions in search-math.ts, so none of them can ever cite a number
 * the others don't also show. Defaults to DEFAULT_QUERY ("camera") — a real,
 * non-empty state with real, non-zero results, rendered before any interaction.
 */
export default function LandingClient() {
  const [query, setQuery] = useState(DEFAULT_QUERY);

  const rankedResults = useMemo(() => filterAndRank(query, LISTINGS), [query]);
  const stats = useMemo(() => computeSearchStats(rankedResults), [rankedResults]);

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <Hero query={query} onQueryChange={setQuery} results={rankedResults} />
      <ProductPreview />
      <ValueSplit query={query} stats={stats} />
      <SocialProof />
      <ClosingCTA query={query} stats={stats} />
    </main>
  );
}
