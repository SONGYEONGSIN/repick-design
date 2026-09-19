"use client";

import { useMemo, useState } from "react";
import { Hero, ACCENT_BRIGHT } from "./Hero";
import { ExhibitB } from "./ExhibitB";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { METRICS, CHECKLISTS } from "./data";
import type { Intensity, Period } from "./data";

export default function CaseFileLanding() {
  const [intensity, setIntensity] = useState<Intensity>("standard");
  const [period, setPeriod] = useState<Period>("7");

  const metrics = useMemo(() => METRICS[intensity][period], [intensity, period]);
  const checklist = useMemo(() => CHECKLISTS[intensity], [intensity]);

  function handleSelect(nextIntensity: Intensity, nextPeriod: Period) {
    setIntensity(nextIntensity);
    setPeriod(nextPeriod);
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[#111116] focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-semibold focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: ACCENT_BRIGHT }}
      >
        Skip to main content
      </a>
      <main id="main-content" className="min-h-screen bg-[#0B0B0F]">
        <Hero
          intensity={intensity}
          period={period}
          onIntensityChange={setIntensity}
          onPeriodChange={setPeriod}
          metrics={metrics}
          checklist={checklist}
        />
        <ExhibitB intensity={intensity} period={period} onSelect={handleSelect} />
        <SocialProof />
        <ClosingCTA intensity={intensity} period={period} metrics={metrics} />
      </main>
    </>
  );
}
