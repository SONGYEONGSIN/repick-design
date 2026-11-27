"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { BG, BORDER } from "./tokens";
import { ValueSplit } from "./ValueSplit";
import type { ViewMode } from "./zones";

/**
 * Single source of truth for the Zone Ledger's two input axes (`flaggedIds`, `view`) — lifted to
 * the page root so the Hero's device, the Value Split's full mirror and bookend table, and the
 * closing CTA all read the SAME set instead of maintaining independent copies that could drift
 * apart. Defaults to two zones already flagged, a non-trivial starting state, so the hero fold
 * shows a real widened range (not the untouched $422–438 default) on first load.
 */
export default function Client() {
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(() => new Set(["battery", "backGlass"]));
  const [view, setView] = useState<ViewMode>("seller");

  const onToggleZone = (id: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="min-h-dvh" style={{ backgroundColor: BG }}>
      <Hero flaggedIds={flaggedIds} view={view} onToggleZone={onToggleZone} onSetView={setView} />

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ProductPreview />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ValueSplit flaggedIds={flaggedIds} view={view} onToggleZone={onToggleZone} onSetView={setView} />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <SocialProof />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ClosingCta flaggedIds={flaggedIds} view={view} />
        </Reveal>
      </div>
    </main>
  );
}
