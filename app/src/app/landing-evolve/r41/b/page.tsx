"use client";

import { useState } from "react";
import Hero from "./Hero";
import ScanReveal from "./ScanReveal";
import ValueProp from "./ValueProp";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import Reveal from "./Reveal";
import { DEFAULT_ITEM_ID, DEFAULT_SCAN_PCT, getItem, scanResult } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export default function Page() {
  const [itemId, setItemId] = useState(DEFAULT_ITEM_ID);
  const [scanPct, setScanPct] = useState(DEFAULT_SCAN_PCT);

  const activeItem = getItem(itemId);
  const { revealed, confidencePct } = scanResult(activeItem, scanPct);

  function handleSelectItem(id: string) {
    setItemId(id);
    // Match the page's own non-trivial-default treatment: switching items
    // re-arms the scan at the same starting position as first paint, not a
    // momentary empty/0% state (auto-landing-r38 doctrine applies to every
    // reset, not just the very first render).
    setScanPct(DEFAULT_SCAN_PCT);
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#0B0B0F] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">repick</span>
          <a
            href="#scan"
            className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS} rounded-sm`}
          >
            Run the scan
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero />

        <section
          id="scan"
          aria-labelledby="scan-heading"
          className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-violet-400">
                live defect scan
              </span>
              <h2
                id="scan-heading"
                className="mt-4 max-w-[30rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl"
              >
                See exactly what the AI checks.
              </h2>
              <p className="mt-5 max-w-[30rem] text-base font-normal leading-[1.6] text-zinc-400">
                Pick a listing, then drag the scan line across the photo. Each
                check-point it crosses confirms a real part of the condition
                report below — the confidence number only moves when a point
                is actually confirmed.
              </p>
            </Reveal>

            <div className="mt-12">
              <ScanReveal
                activeItem={activeItem}
                scanPct={scanPct}
                onSelectItem={handleSelectItem}
                onScanChange={setScanPct}
              />
            </div>
          </div>
        </section>

        <ValueProp confidencePct={confidencePct} itemName={activeItem.name} />
        <SocialProof />
        <ClosingCTA
          item={activeItem}
          revealedCount={revealed.length}
          total={activeItem.defects.length}
          confidencePct={confidencePct}
        />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs font-normal text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 repick. Resale, graded.</span>
          <span>Prices shown are sample listings for illustration.</span>
        </div>
      </footer>
    </div>
  );
}
