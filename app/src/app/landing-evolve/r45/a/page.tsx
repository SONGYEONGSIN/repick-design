"use client";

import { useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { DEFAULT_PRICE, DEFAULT_GRADE_ID, computeReceipt, type ConditionGradeId } from "./data";
import { DISPLAY, FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function Page() {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [gradeId, setGradeId] = useState<ConditionGradeId>(DEFAULT_GRADE_ID);

  const receipt = useMemo(() => computeReceipt(price, gradeId), [price, gradeId]);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F5F7]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-sky-400 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`${DISPLAY} text-lg font-extrabold tracking-[-0.02em] text-[#F5F5F7]`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#payout-receipt"
              className={`text-sm font-semibold text-zinc-300 transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}
            >
              The receipt
            </a>
            <a
              href="#proof"
              className={`text-sm font-semibold text-zinc-300 transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}
            >
              Seller results
            </a>
          </nav>
          <a
            href="#payout-receipt"
            className={`rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-800 ${FOCUS_RING}`}
          >
            Price an item
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero price={price} onPriceChange={setPrice} gradeId={gradeId} onGradeChange={setGradeId} receipt={receipt} />
        <ValueSplit />
        <div id="proof">
          <SocialProof />
        </div>
        <ClosingCTA netPayout={receipt.netPayout} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Your payout, itemized before you list.</span>
          <span>The fee rate and shipping credit shown are repick&apos;s standard seller terms, not a promotion.</span>
        </div>
      </footer>
    </div>
  );
}
