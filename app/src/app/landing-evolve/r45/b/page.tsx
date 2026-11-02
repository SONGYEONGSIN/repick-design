"use client";

import { useCallback, useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { EMPTY_ANSWERS, computeMatch, type Answers, type QuestionId } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function Page() {
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);

  const handleSelect = useCallback((question: QuestionId, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question]: optionId }));
  }, []);

  const handleRestart = useCallback(() => setAnswers(EMPTY_ANSWERS), []);

  const match = useMemo(() => computeMatch(answers), [answers]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F6]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#F5F5F6] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`${DISPLAY} text-lg font-extrabold tracking-[-0.01em] text-[#F5F5F6]`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#tree" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-[#F5F5F6] ${FOCUS_RING} rounded-sm`}>
              The reasoning tree
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-[#F5F5F6] ${FOCUS_RING} rounded-sm`}>
              Seller results
            </a>
          </nav>
          <a
            href="#tree"
            className={`rounded-full bg-[#E11D48] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#BE123C] ${FOCUS_RING}`}
          >
            Start the quiz
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero answers={answers} onSelect={handleSelect} onRestart={handleRestart} match={match} />
        <ValueSplit />
        <div id="proof">
          <SocialProof />
        </div>
        <ClosingCTA match={match} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Resale, reasoned in the open.</span>
          <span>The tree runs a fixed three-factor formula on your answers — not a guarantee of sale price or time.</span>
        </div>
      </footer>
    </div>
  );
}
