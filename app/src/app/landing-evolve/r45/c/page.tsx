"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { DISCOUNT_DEFAULT, clampDiscount } from "./data";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function Page() {
  const [discount, setDiscount] = useState(DISCOUNT_DEFAULT);

  function handleDiscountChange(next: number) {
    setDiscount(clampDiscount(next));
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F5]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#F4F4F5] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-[#F4F4F5]">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#split" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-[#F4F4F5] ${FOCUS_RING} rounded-sm`}>
              The line
            </a>
            <a href="#value" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-[#F4F4F5] ${FOCUS_RING} rounded-sm`}>
              How the range is bounded
            </a>
          </nav>
          <a
            href="#split"
            className={`rounded-full bg-[#84CC16] px-4 py-2 text-sm font-semibold text-[#0B0B0F] transition-colors duration-200 hover:bg-[#9FE32F] ${FOCUS_RING}`}
          >
            Try the line
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero discount={discount} onDiscountChange={handleDiscountChange} />
        <ValueSplit />
        <SocialProof />
        <ClosingCTA discount={discount} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1280px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Buy used, priced out loud.</span>
          <span>The discount is an assumption you set — repick doesn&rsquo;t guarantee any specific listing will match it.</span>
        </div>
      </footer>
    </div>
  );
}
