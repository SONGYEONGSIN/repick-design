"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { PEAK_DAY } from "./curve";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { BG, BORDER } from "./tokens";
import { ValueSplit } from "./ValueSplit";

/**
 * Single source of truth for the Timing Dial's two input axes (`day`, `certified`) — lifted to
 * the page root so the Hero's device, the Value Split's full mirror, and the closing CTA all read
 * the SAME two numbers instead of maintaining independent copies that could drift apart.
 * Defaults to the named peak day, a non-trivial starting state (not day 0).
 */
export default function Client() {
  const [day, setDay] = useState<number>(PEAK_DAY);
  const [certified, setCertified] = useState<boolean>(false);

  const onToggleCertified = () => setCertified((prev) => !prev);

  return (
    <main className="min-h-dvh" style={{ backgroundColor: BG }}>
      <Hero day={day} certified={certified} onDayChange={setDay} onToggleCertified={onToggleCertified} />

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ProductPreview />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ValueSplit day={day} certified={certified} onDayChange={setDay} onToggleCertified={onToggleCertified} />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <SocialProof />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ClosingCta day={day} certified={certified} />
        </Reveal>
      </div>
    </main>
  );
}
