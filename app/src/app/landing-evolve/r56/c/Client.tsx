"use client";

import { useState } from "react";

import ClosingCta from "./ClosingCta";
import Hero from "./Hero";
import {
  LISTINGS,
  TAG_LABELS,
  computeProfile,
  currentCard,
  decidedCount,
  rankByFit,
  topTrait,
  upcomingPool,
  type Decision,
} from "./lib";
import SocialProof from "./SocialProof";
import ValueSplit from "./ValueSplit";
import { FOCUS_RING } from "./ui";

const displayFace = { fontFamily: "var(--font-display-wide)" };

export default function SiftLanding() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const current = currentCard(decisions);
  const profile = computeProfile(decisions);
  const pool = upcomingPool(decisions);
  const ranked = rankByFit(profile, pool);
  const trait = topTrait(profile);
  const position = decidedCount(decisions);
  const total = LISTINGS.length;

  function handleDecide(id: string, decision: Decision) {
    setDecisions((prev) => (id in prev ? prev : { ...prev, [id]: decision }));
  }

  function handleReset() {
    setDecisions({});
  }

  const announcement = current
    ? `Card ${Math.min(position + 1, total)} of ${total}: ${current.title}. Profile currently leans ${TAG_LABELS[trait]}. Top recommended match: ${ranked[0]?.title ?? "none yet"}.`
    : `All ${total} cards decided. Profile leans ${TAG_LABELS[trait]}.`;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <SiteHeader />
      <Hero
        current={current}
        position={position}
        total={total}
        profile={profile}
        ranked={ranked}
        topTrait={trait}
        announcement={announcement}
        onDecide={handleDecide}
        onReset={handleReset}
      />
      <ValueSplit decisions={decisions} profile={profile} ranked={ranked} topTrait={trait} />
      <SocialProof />
      <ClosingCta profile={profile} ranked={ranked} topTrait={trait} />
      <SiteFooter />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 px-4 py-3.5 sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <span className="text-[17px] font-extrabold tracking-[-0.02em] text-zinc-900" style={displayFace}>
          Sift
        </span>
        <a
          href="#deck"
          className={`rounded-full border border-zinc-300 px-4 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-100 ${FOCUS_RING}`}
        >
          Start swiping
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 px-4 py-8 sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3">
        <span className="text-[14px] font-extrabold tracking-[-0.02em] text-zinc-900" style={displayFace}>
          Sift
        </span>
        <p className="text-[12.5px] font-normal text-zinc-500">
          A demo catalog of 10 fixed listings. Prices and photos are illustrative.
        </p>
      </div>
    </footer>
  );
}
