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
            One swipe at a time, Sift learns what you&apos;d actually buy.
          </h1>
          <p className="mt-4 max-w-[500px] text-[15.5px] font-normal leading-[1.6] text-zinc-600 lg:text-[16px]">
            Pass or like one secondhand find at a time. Every decision reweights your taste
            profile instantly, and the picks below re-rank to match — no quiz, no filters to set up
            first.
          </p>
          <a
            href="#deck"
            className={`mt-6 inline-flex items-center gap-2 rounded-full bg-lime-700 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-lime-800 ${FOCUS_RING}`}
          >
            Start swiping
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:mt-10">
            <p className="text-[12px] font-semibold uppercase text-zinc-500" style={{ letterSpacing: "0.16em" }}>
              Your profile right now
            </p>
            <p className="mt-1.5 text-[14.5px] font-normal leading-[1.5] text-zinc-700">
              Leaning <span className="font-semibold text-zinc-900">{TAG_LABELS[topTrait]}</span> so
              far, based on <span className="tabular-nums font-semibold text-zinc-900">{position}</span> of{" "}
              <span className="tabular-nums font-semibold text-zinc-900">{total}</span> decisions. See the
              full breakdown below.
            </p>
          </div>
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
