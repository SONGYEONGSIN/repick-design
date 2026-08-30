"use client";

import { useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { DEFAULT_WEIGHTS, PRESETS, RAW_SCORES } from "./data";
import { computeComposite } from "./gauge-math";
import type { FactorKey, WeightState } from "./gauge-math";

function presetIdForWeights(weights: WeightState): string | null {
  const match = PRESETS.find((p) => (Object.keys(p.weights) as FactorKey[]).every((k) => p.weights[k] === weights[k]));
  return match ? match.id : null;
}

export default function TrustScoreConsoleLanding() {
  const [weights, setWeights] = useState<WeightState>(DEFAULT_WEIGHTS);

  const { composite, contributions } = useMemo(() => computeComposite(RAW_SCORES, weights), [weights]);
  const activePreset = useMemo(() => presetIdForWeights(weights), [weights]);

  function handleWeightChange(key: FactorKey, value: number) {
    setWeights((prev) => ({ ...prev, [key]: value }));
  }

  function handlePreset(_id: string, next: WeightState) {
    setWeights(next);
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F]">
      <Hero
        weights={weights}
        onWeightChange={handleWeightChange}
        onPreset={handlePreset}
        activePreset={activePreset}
        composite={composite}
        contributions={contributions}
      />
      <ProductPreview />
      <ValueSplit />
      <SocialProof />
      <ClosingCTA composite={composite} />
    </main>
  );
}
