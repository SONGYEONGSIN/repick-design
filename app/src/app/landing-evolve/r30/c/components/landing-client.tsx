"use client";

import { useCallback, useState } from "react";
import { DEFAULT_WEIGHTS, WEIGHT_MAX, WEIGHT_MIN, type SignalId, type Weights } from "./data";
import { ClosingCta } from "./closing-cta";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { ProductPreview } from "./product-preview";
import { SocialProof } from "./social-proof";
import { ValueSplit } from "./value-split";

export function LandingClient() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  const onWeightChange = useCallback((id: SignalId, value: number) => {
    const clamped = Math.min(WEIGHT_MAX, Math.max(WEIGHT_MIN, value));
    setWeights((prev) => ({ ...prev, [id]: clamped }));
  }, []);

  const onReset = useCallback(() => {
    setWeights(DEFAULT_WEIGHTS);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#67E8F9] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B0B0F]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero weights={weights} onWeightChange={onWeightChange} onReset={onReset} />
        <ProductPreview />
        <ValueSplit weights={weights} />
        <SocialProof />
        <ClosingCta weights={weights} />
      </main>
      <Footer />
    </>
  );
}
