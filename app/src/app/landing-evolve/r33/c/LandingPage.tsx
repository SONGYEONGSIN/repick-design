"use client";

import { useCallback, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_ACTIVE, type ActiveChecks, type CheckId } from "./waveform";
import { INK } from "./theme";

export default function LandingPage() {
  const [active, setActive] = useState<ActiveChecks>(DEFAULT_ACTIVE);

  const handleToggle = useCallback((id: CheckId) => {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: INK, color: "#FFFFFF" }}>
      <Header />
      <main>
        <Hero active={active} onToggle={handleToggle} />
        <ProductPreview />
        <ValueSection active={active} onToggle={handleToggle} />
        <SocialProof />
        <ClosingCTA active={active} />
      </main>
    </div>
  );
}
