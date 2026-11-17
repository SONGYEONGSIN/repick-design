import { ArrowRight } from "lucide-react";

import type { Listing, Profile, Tag } from "./lib";
import { TAG_LABELS, matchPercent } from "./lib";
import { FOCUS_RING } from "./ui";

interface ClosingCtaProps {
  profile: Profile;
  ranked: Listing[];
  topTrait: Tag;
}

const displayFace = { fontFamily: "var(--font-display-wide)" };

/**
 * Cites the live profile by name — `topTrait` and the top of `ranked` both come from the same
 * lib.ts functions Hero and ValueSplit call, read straight from props, never re-typed here.
 */
export default function ClosingCta({ profile, ranked, topTrait }: ClosingCtaProps) {
  const topMatch = ranked[0] ?? null;

  return (
    <section className="px-4 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-[760px] text-center">
        <h2
          className="text-[clamp(1.9rem,4vw+1rem,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-900"
          style={displayFace}
        >
          Your taste leans {TAG_LABELS[topTrait].toLowerCase()}.{" "}
          {topMatch ? (
            <>
              Right now, <span className="text-lime-800">{topMatch.title}</span> is your top match.
            </>
          ) : (
            "You've already decided on every listing in the deck."
          )}
        </h2>
        <p className="mx-auto mt-4 max-w-[500px] text-[15.5px] font-normal leading-[1.6] text-zinc-600">
          {topMatch ? (
            <>
              That&apos;s a <span className="tabular-nums font-semibold text-zinc-900">{matchPercent(profile, topMatch)}%</span>{" "}
              fit to the profile you&apos;ve built so far — keep swiping and it keeps re-ranking.
            </>
          ) : (
            "Start over above to build a different profile from scratch, or browse the full catalog below."
          )}
        </p>
        <a
          href="#deck"
          className={`mt-7 inline-flex items-center gap-2 rounded-full bg-lime-700 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-lime-800 ${FOCUS_RING}`}
        >
          {topMatch ? `See ${topMatch.title}` : "Back to the deck"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
