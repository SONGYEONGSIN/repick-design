"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import type { StepOneId, StepTwoId } from "./trade-data";
import { computePathSummary, describePath } from "./trade-math";
import { ACCENT_FILL, ACCENT_FILL_HOVER, ACCENT_TEXT, BG_CLASS, FOCUS_RING, INK_CLASS, MUTED_TEXT, ON_ACCENT_TEXT } from "./tokens";

// A real, non-trivial default path — never a blank/unset tree on first paint.
const DEFAULT_STEP1: StepOneId = "list-offer";
const DEFAULT_STEP2: StepTwoId = "accept-floor";

export function LandingExperience() {
  // Single source of truth for the whole page: every surface below reads the SAME derived
  // PathSummary, never a value it re-states on its own.
  const [step1, setStep1] = useState<StepOneId>(DEFAULT_STEP1);
  const [step2, setStep2] = useState<StepTwoId | null>(DEFAULT_STEP2);
  const [assertive, setAssertive] = useState(false);
  const alertTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const summary = useMemo(() => computePathSummary(step1, step2), [step1, step2]);
  const announcementText = useMemo(() => `Current path: ${describePath(summary)}`, [summary]);

  // The single live region on the page briefly reads as role="alert" right after a selection —
  // a just-happened transition — then settles back to the ambient role="status".
  const flashAssertive = useCallback(() => {
    setAssertive(true);
    if (alertTimer.current) clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => setAssertive(false), 1200);
  }, []);

  useEffect(() => {
    return () => {
      if (alertTimer.current) clearTimeout(alertTimer.current);
    };
  }, []);

  const handleSelectStep1 = useCallback(
    (id: StepOneId) => {
      if (id === step1) return;
      setStep1(id);
      setStep2(null);
      flashAssertive();
    },
    [step1, flashAssertive],
  );

  const handleSelectStep2 = useCallback(
    (id: StepTwoId) => {
      if (id === step2) return;
      setStep2(id);
      flashAssertive();
    },
    [step2, flashAssertive],
  );

  // A reset always returns to the same representative default path, never to an empty state.
  const handleReset = useCallback(() => {
    setStep1(DEFAULT_STEP1);
    setStep2(DEFAULT_STEP2);
    flashAssertive();
  }, [flashAssertive]);

  const announcement = useMemo(() => ({ text: announcementText, assertive }), [announcementText, assertive]);

  return (
    <div className={`min-h-screen ${BG_CLASS} ${INK_CLASS}`}>
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md ${ACCENT_FILL} focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold ${ON_ACCENT_TEXT} ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`text-lg font-extrabold tracking-[-0.02em] ${INK_CLASS}`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#catalog"
              className={`inline-flex min-h-6 items-center text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}
            >
              Catalog
            </a>
            <a
              href="#proof-heading"
              className={`inline-flex min-h-6 items-center text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}
            >
              Reviews
            </a>
          </nav>
          <a
            href="#hero-heading"
            className={`rounded-full ${ACCENT_FILL} px-4 py-2 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 ${ACCENT_FILL_HOVER} ${FOCUS_RING}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero
          step1={step1}
          step2={step2}
          summary={summary}
          onSelectStep1={handleSelectStep1}
          onSelectStep2={handleSelectStep2}
          onReset={handleReset}
          announcement={announcement}
        />
        <ProductPreview />
        <ValueSplit summary={summary} />
        <SocialProof />
        <ClosingCTA summary={summary} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Payout estimates are illustrative for this demo listing.</span>
          <span className={ACCENT_TEXT}>Trade Path Simulator — every branch stays visible, chosen or not.</span>
        </div>
      </footer>
    </div>
  );
}
