"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { ITEMS } from "./data";
import { clampPlayhead, trustTotal } from "./scrub-math";
import { PAGE_BG, INK } from "./theme";

/**
 * Holds the two pieces of state this route cares about: the scrubber's
 * playhead position, and which example listing is selected in the product
 * preview. `trustTotal(playhead)` is computed once here and passed down —
 * the Hero's device, the Value section's LIVE column, and the Closing
 * CTA's own sentence all read the exact same number, never re-derived.
 */
export default function LandingPage() {
  const [playhead, setPlayhead] = useState(0);
  const [itemId, setItemId] = useState(ITEMS[0].id);

  const item = ITEMS.find((candidate) => candidate.id === itemId) ?? ITEMS[0];
  const trustRounded = Math.round(trustTotal(playhead));

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, color: INK }}>
      <Header />
      <main id="main">
        <Hero playhead={playhead} onPlayheadChange={(next) => setPlayhead(clampPlayhead(next))} item={item} />
        <ProductPreview items={ITEMS} selectedId={itemId} onSelect={setItemId} />
        <ValueSection trustRounded={trustRounded} />
        <SocialProof />
        <ClosingCTA trustRounded={trustRounded} />
      </main>
    </div>
  );
}
