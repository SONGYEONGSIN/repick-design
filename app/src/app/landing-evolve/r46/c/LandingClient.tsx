"use client";

import { useState } from "react";
import Hero from "./Hero";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_SALE_AMOUNT, type Tier } from "./data";

/**
 * Single state owner for the whole page. `saleAmount`, `selectedTier` and
 * `simulatedTotalAdded` are lifted here (not into a separate context) because only
 * four components ever need them, and they all sit directly under this one client
 * component — the same `simulatedTotalAdded` value flows into both ValueSplit's live
 * tally and ClosingCTA's headline number, so the two are never out of sync.
 */
export default function LandingClient() {
  const [saleAmount, setSaleAmount] = useState<number>(DEFAULT_SALE_AMOUNT);
  const [selectedTier, setSelectedTier] = useState<Tier>("instant");
  const [simulatedTotalAdded, setSimulatedTotalAdded] = useState<number>(0);

  function handleRaceComplete(instantPayout: number) {
    setSimulatedTotalAdded((prev) => prev + instantPayout);
  }

  return (
    <main>
      <Hero
        saleAmount={saleAmount}
        onSaleAmountChange={setSaleAmount}
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        onRaceComplete={handleRaceComplete}
      />
      <ValueSplit simulatedTotalAdded={simulatedTotalAdded} />
      <SocialProof />
      <ClosingCTA simulatedTotalAdded={simulatedTotalAdded} />
    </main>
  );
}
