"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import type { StepId } from "./data";

/**
 * Holds the one piece of state this whole route cares about: which
 * verification steps have ever been inspected (0 to 4, order-independent,
 * never shrinks). Every derived number on the page — the hero's Trust
 * Score card, the value section's LIVE column, and the closing CTA's
 * sentence — is `trustScoreState(inspected)` computed fresh wherever it's
 * needed, from this single `Set`. There is no second source of truth to
 * drift out of sync.
 */
export default function LandingPage() {
  const [inspected, setInspected] = useState<Set<StepId>>(() => new Set<StepId>());

  function inspect(id: StepId) {
    setInspected((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white text-zinc-700">
      <Header />
      <main id="main">
        <Hero inspected={inspected} onInspect={inspect} />
        <ValueSection inspected={inspected} />
        <SocialProof />
        <ClosingCTA inspected={inspected} />
      </main>
    </div>
  );
}
