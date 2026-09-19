"use client";

import { useMemo, useState } from "react";
import ClosingCta from "./ClosingCta";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import SocialProof from "./SocialProof";
import ValueSplit from "./ValueSplit";
import { LISTINGS, MAX_COMPARE } from "./data";
import { ACCENT_HEX, cx, FOCUS } from "./tokens";

const SKIP_LINK =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#CC1641] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white";

/**
 * Root state lives here, one level above every section: the up-to-3 selection the visitor builds
 * in the hero's chip row is the single source of truth the compare table, the sort control and the
 * closing CTA all read — never a value frozen at mount. Deselecting is floored at 1 listing
 * (enforced here, not just in the chip's disabled state) so the comparison table can never go empty.
 */
export default function CompareConsoleLanding() {
  const [selectedIds, setSelectedIds] = useState<string[]>([LISTINGS[0].id, LISTINGS[1].id]);
  const [sortByGap, setSortByGap] = useState(false);

  function toggleListing(id: string) {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        if (prev.length <= 1) return prev; // floor: never let the table go empty
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COMPARE) return prev; // ceiling: at most 3 columns
      return [...prev, id];
    });
  }

  const selectedListings = useMemo(
    () => selectedIds.map((id) => LISTINGS.find((l) => l.id === id)).filter((l): l is (typeof LISTINGS)[number] => Boolean(l)),
    [selectedIds],
  );

  const topMatch = useMemo(
    () => Math.max(...selectedListings.map((l) => l.matchPct)),
    [selectedListings],
  );

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-[#1C1C22] bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em] text-white">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT_HEX }} aria-hidden="true" />
            repick
          </span>
          <a
            href="#preview"
            className={cx(
              "rounded-full border border-[#27272E] px-4 py-1.5 text-[13px] font-semibold text-zinc-300 transition-colors duration-150 hover:border-white/30",
              FOCUS,
            )}
          >
            Matched listings
          </a>
        </div>
      </header>

      <main id="main">
        <Hero
          allListings={LISTINGS}
          selectedListings={selectedListings}
          selectedIds={selectedIds}
          onToggle={toggleListing}
          sortByGap={sortByGap}
          onToggleSort={() => setSortByGap((v) => !v)}
          topMatch={topMatch}
        />
        <ProductPreview />
        <ValueSplit />
        <SocialProof />
        <ClosingCta selectedListings={selectedListings} topMatch={topMatch} />
      </main>

      <footer className="border-t border-[#1C1C22] px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT_HEX }} aria-hidden="true" />
            repick
          </span>
          <p className="text-[11.5px] font-normal text-zinc-400">
            Prices, grades and match figures shown are illustrative for this preview.
          </p>
        </div>
      </footer>
    </div>
  );
}
