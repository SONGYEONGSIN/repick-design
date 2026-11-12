"use client";

import { useCallback, useMemo, useState } from "react";
import Hero from "./Hero";
import ListingGrid from "./ListingGrid";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { LISTINGS } from "./data";
import { DEFAULT_RANK, leadCriterionId, moveRank, rankItems, reorderByDrag, type CriterionId, type RankMap } from "./rank-model";
import { ACCENT_FILL, ACCENT_LARGE, BG, BORDER, INK, MUTED } from "./tokens";

/**
 * Root client component. `rankMap` is the ONLY piece of interaction state
 * on this page — a Record<CriterionId, number> rank position, not an
 * ordered array. Every derived value (the weight behind each row, each
 * listing's score, the sort order, the lead criterion, the headline and
 * closing-CTA sentences) comes from the single `rankMap` -> rank-model.ts
 * pipeline below, computed once per render and threaded down as props.
 */
export default function LandingExperience() {
  const [rankMap, setRankMap] = useState<RankMap>(DEFAULT_RANK);

  const ranked = useMemo(() => rankItems(LISTINGS, rankMap), [rankMap]);
  const leadId = useMemo(() => leadCriterionId(rankMap), [rankMap]);

  const handleMove = useCallback((id: CriterionId, direction: -1 | 1) => {
    setRankMap((prev) => moveRank(prev, id, direction));
  }, []);

  const handleDragReorder = useCallback((draggedId: CriterionId, targetId: CriterionId) => {
    setRankMap((prev) => reorderByDrag(prev, draggedId, targetId));
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: INK }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-white"
        style={{ backgroundColor: ACCENT_FILL }}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ backgroundColor: "rgba(255,255,255,0.9)", borderColor: BORDER }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-[18px] font-extrabold" style={{ fontFamily: "var(--font-display-wide)", color: INK, letterSpacing: "-0.02em" }}>
            repick
          </span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#listings"
              className="text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: MUTED, outlineColor: ACCENT_LARGE }}
            >
              Listings
            </a>
            <a
              href="#proof"
              className="text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: MUTED, outlineColor: ACCENT_LARGE }}
            >
              Proof
            </a>
          </nav>
          <a
            href="#listings"
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: ACCENT_FILL, outlineColor: ACCENT_LARGE }}
          >
            View listings
          </a>
        </div>
      </header>

      <main id="main-content">
        <div id="ladder">
          <Hero
            rankMap={rankMap}
            onMove={handleMove}
            onDragReorder={handleDragReorder}
            ranked={ranked}
            leadId={leadId}
            onCtaClick={() => scrollTo("listings")}
          />
        </div>
        <ListingGrid ranked={ranked} leadId={leadId} />
        <ValueSplit />
        <SocialProof />
        <ClosingCta top={ranked[0]} leadId={leadId} onBackToLadder={() => scrollTo("ladder")} />
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[13px] font-normal leading-[1.6]" style={{ color: MUTED }}>
          repick — the ranking you build is the matching you see, everywhere on this page.
        </p>
      </footer>
    </div>
  );
}
