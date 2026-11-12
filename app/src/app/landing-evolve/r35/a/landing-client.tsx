"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import type { Checks, Grade, Tier } from "./data";
import { computeScore } from "./data";
import { Header } from "./header";
import { Hero } from "./hero";
import { ValueSplit } from "./value-split";
import { SocialProof } from "./social-proof";
import { ClosingCTA } from "./closing-cta";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

export function LandingClient() {
  const [grade, setGrade] = useState<Grade>("Excellent");
  const [tier, setTier] = useState<Tier>("Premium");
  const [checks, setChecks] = useState<Checks>({ serial: true, packaging: false });

  const score = computeScore(grade, tier, checks);

  function toggleCheck(key: keyof Checks) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#15140E] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#FAFAF8] ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <div className="min-h-screen bg-[#FAFAF8]">
        <Header />

        <main id="main">
          <Hero
            grade={grade}
            tier={tier}
            checks={checks}
            onGrade={setGrade}
            onTier={setTier}
            onCheck={toggleCheck}
          />
          <ValueSplit score={score} tier={tier} grade={grade} />
          <SocialProof />
          <ClosingCTA score={score} tier={tier} grade={grade} />
        </main>

        <footer className="border-t border-[#15140E]/10">
          <div className={`mx-auto max-w-[1440px] px-4 py-8 text-xs font-normal ${MUTED_TEXT} sm:px-6 lg:px-10`}>
            © 2026 Repick. Certificates are generated per listing and do not constitute a legal
            appraisal.
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
