import { ArrowRight } from "lucide-react";

import DeckCard from "./DeckCard";
import type { Decision, Listing, Profile, Tag } from "./lib";
import { TAG_LABELS, matchPercent, matchReason } from "./lib";
import RecommendRail from "./RecommendRail";
import { FOCUS_RING } from "./ui";

interface HeroProps {
  current: Listing | null;
  position: number;
  total: number;
  profile: Profile;
  ranked: Listing[];
  topTrait: Tag;
  announcement: string;
  onDecide: (id: string, decision: Decision) => void;
  onReset: () => void;
}

const displayFace = { fontFamily: "var(--font-display-wide)" };

/**
 * Hero: headline, subhead, single primary CTA, the swipe-deck device, AND the full
 * product-preview proof (the recommendation rail with all four badges) are all literal
 * descendants of THIS component — never a sibling section rendered after it — so the structural
 * requirement holds at the 390px mobile width too, where this exact JSX stacks into one column.
 */
export default function Hero({
  current,
  position,
  total,
  profile,
  ranked,
  topTrait,
  announcement,
  onDecide,
  onReset,
}: HeroProps) {
  const currentMatch = current ? matchPercent(profile, current) : 0;
  const currentReason = current ? matchReason(profile, current) : "";

  return (
    <section className="border-b border-zinc-200 px-4 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-14 lg:pb-20 lg:pt-14">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* Left: headline, subhead, single CTA */}
        <div className="min-w-0">
          <p
            className="text-[11px] font-semibold uppercase text-lime-800"
            style={{ letterSpacing: "0.28em" }}
          >
            Swipe-built taste
          </p>
          <h1
            className="mt-3 text-[clamp(2.1rem,7vw+0.6rem,2.7rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-900 lg:text-[clamp(3rem,2.4vw+2.2rem,4.5rem)]"
            style={displayFace}
          >
            One swipe teaches Sift what you&apos;d buy.
          </h1>
          <p className="mt-3 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-600 lg:mt-4">
            Pass or like one find at a time — every decision reorders the picks below, live.
          </p>
          <a
            href="#deck"
            className={`mt-6 inline-flex items-center gap-2 rounded-full bg-lime-700 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-lime-800 ${FOCUS_RING}`}
          >
            Start swiping
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-4 text-[12.5px] font-normal text-zinc-500">
            Leaning <span className="font-semibold text-zinc-700">{TAG_LABELS[topTrait]}</span> so far
            — the full breakdown is below the deck.
          </p>
        </div>

        {/* Right: the deck device + the recommendation rail it live-reranks — both inside Hero */}
        <div id="deck" className="min-w-0">
          <DeckCard
            listing={current}
            position={position}
            total={total}
            matchPct={currentMatch}
            reason={currentReason}
            announcement={announcement}
            onDecide={onDecide}
            onReset={onReset}
          />
          <RecommendRail profile={profile} ranked={ranked} />
        </div>
      </div>
    </section>
  );
}
