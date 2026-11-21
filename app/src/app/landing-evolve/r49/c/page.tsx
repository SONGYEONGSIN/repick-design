"use client";

import { useState } from "react";
import { ClosingCTA } from "./ClosingCTA";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { SocialProof } from "./SocialProof";
import { ValueSplit } from "./ValueSplit";
import { DEFAULT_POINT_ID, coverageFor, type Category } from "./data";
import { FOCUS_RING, MUTED_TEXT } from "./tokens";

export default function Page() {
  const [activeId, setActiveId] = useState(DEFAULT_POINT_ID);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  const coverage = coverageFor(activeId);

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#171717] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-[#E7E3E3] px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-[#171717]">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#locations" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-[#171717] ${FOCUS_RING} rounded-sm`}>
              The network
            </a>
            <a href="#preview" className={`text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-[#171717] ${FOCUS_RING} rounded-sm`}>
              What sells
            </a>
          </nav>
          <a
            href="#locations"
            className={`rounded-full bg-[#F43F5E] px-4 py-2 text-sm font-semibold text-[#171717] transition-colors duration-200 hover:opacity-90 ${FOCUS_RING}`}
          >
            Pick a point
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero
          activeId={activeId}
          onActivate={setActiveId}
          categoryFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
          coverage={coverage}
        />
        <ProductPreview coverage={coverage} />
        <ValueSplit coverage={coverage} categoryFilter={categoryFilter} />
        <SocialProof />
        <ClosingCTA coverage={coverage} categoryFilter={categoryFilter} />
      </main>

      <footer className="border-t border-[#E7E3E3] px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1280px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Sell it where someone already knows what it&rsquo;s worth.</span>
          <span>Processing times and queue counts are observed averages per point, not guarantees for any single visit.</span>
        </div>
      </footer>
    </div>
  );
}
