"use client";

import { useCallback, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";

/**
 * Holds the one piece of state this whole route cares about: which
 * authenticity hotspots have been found. It only ever grows (a `Set`,
 * never cleared), which is what makes "once found, stays found" true
 * cheaply — every other live number on the page (the hero's counter and
 * confidence meter, the value-split's three pillars, the closing CTA's
 * copy) is a pure function of this one set, recomputed wherever it's
 * needed instead of duplicated.
 */
export default function LandingPage() {
  const [found, setFound] = useState<ReadonlySet<string>>(() => new Set());

  const handleFound = useCallback((id: string) => {
    setFound((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-zinc-300">
      <Header />
      <Hero found={found} onFound={handleFound} />
      <ValueSection found={found} />
      <SocialProof />
      <ClosingCTA found={found} />
    </div>
  );
}
