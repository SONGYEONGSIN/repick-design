"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_FILTERS, computeStats, type FilterState } from "./data";

export default function LandingPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const toggleFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Single source of truth for every live number this page shows — filters flow down from here,
  // the derived ledger stats flow down alongside them, all the way to the closing CTA.
  const stats = useMemo(() => computeStats(filters), [filters]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <a
        href="#main"
        className={[
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50",
          "focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm",
          "focus:font-semibold focus:text-white",
          "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2",
        ].join(" ")}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span
            className="text-lg text-zinc-900"
            style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            repick
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
            <a
              href="#listings"
              className={[
                "text-sm font-semibold text-zinc-600 hover:text-zinc-900",
                "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2 rounded-sm",
              ].join(" ")}
            >
              Listings
            </a>
            <a
              href="#proof"
              className={[
                "text-sm font-semibold text-zinc-600 hover:text-zinc-900",
                "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2 rounded-sm",
              ].join(" ")}
            >
              Social proof
            </a>
          </nav>
          <a
            href="#listings"
            className={[
              "inline-flex items-center gap-1.5 rounded-full bg-[#1E7A4C] px-4 py-2",
              "text-sm font-semibold text-white transition-colors hover:bg-[#176B41]",
              "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2",
            ].join(" ")}
          >
            Browse listings
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="main">
        <Hero filters={filters} onToggle={toggleFilter} stats={stats} />
        <ProductPreview />
        <ValueSection filters={filters} stats={stats} />
        <SocialProof />
        <ClosingCTA filters={filters} stats={stats} />
      </main>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="text-sm font-semibold text-zinc-900">repick</span>
          <p className="max-w-[26rem] text-sm text-zinc-500">
            Every listing ships with its own twelve months of closed-sale history attached.
          </p>
        </div>
      </footer>
    </div>
  );
}
