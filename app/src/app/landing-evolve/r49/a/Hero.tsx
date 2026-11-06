"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, SearchX } from "lucide-react";
import SearchBar from "./SearchBar";
import ResultRow from "./ResultRow";
import type { RankedListing } from "./search-math";
import { ACCENT_BG, ACCENT_TEXT_ON_FILL, FOCUS, HEADLINE_FONT, MUTED_TEXT } from "./tokens";
import { useMounted } from "./useMounted";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

// How many ranked results the Hero itself renders. Capped (not "all matches") so the
// Hero's own height never grows with the result count — that's what keeps the proof
// cards inside the scroll-0 fold at every desktop height, regardless of how broad or
// narrow the current query is. The FULL count is still reported honestly in the
// status line below the input; the cap only bounds how many cards render.
const HERO_VISIBLE_RESULTS = 2;

interface HeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: RankedListing[];
}

/**
 * Hero: eyebrow, single H1, subhead, one CTA, and the live search device — all in
 * this one component, so the device and its pre-populated match list render inside
 * the Hero at scroll position zero rather than in a section below it. With the
 * default query ("camera") this renders 2 fully-badged result rows with zero
 * interaction, satisfying the fold-proof requirement before anyone types anything.
 *
 * Headline sizing is split by breakpoint on purpose rather than one unified
 * `clamp()`: below `lg` it's a fixed, conservative size that can never grow past
 * what 375px comfortably wraps; at `lg` and up it switches to a fluid `clamp()` for
 * the larger desktop scale design-principles.md wants.
 *
 * Subhead container width: 15px body text -> 0.44 * 15 = 6.6px/char -> max-w-[460px]
 * -> 460 / 6.6 ≈ 69.7 chars/line (target ~70, under the 75 ceiling).
 */
export default function Hero({ query, onQueryChange, results }: HeroProps) {
  const resultsId = useId();
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const animate = mounted && !reduceMotion;

  const visible = results.slice(0, HERO_VISIBLE_RESULTS);
  const hiddenCount = Math.max(0, results.length - visible.length);
  const trimmedQuery = query.trim();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-9 sm:px-6 sm:pt-11 lg:pb-16">
      <div className="max-w-[640px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#BCA7F3]">
          Live match search
        </p>
        <h1
          className="mt-3 text-[2.15rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.6rem] lg:text-[clamp(2.75rem,2.3rem+1.6vw,3.75rem)]"
          style={HEADLINE_FONT}
        >
          Describe it. Matches surface instantly.
        </h1>
        <p className={`mt-3 max-w-[460px] text-[15px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
          Type a brand, category, or model below. We match it against sold and listed
          comps live, with full proof attached — no waiting for a quote.
        </p>
        <a
          href="#closing-cta"
          className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold ${ACCENT_TEXT_ON_FILL} ${ACCENT_BG} ${FOCUS}`}
        >
          List your item today
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div id="hero-search-device" className="mt-6 min-w-0 max-w-[640px]">
        <SearchBar query={query} onQueryChange={onQueryChange} resultsId={resultsId} />
      </div>

      <div className="mt-5 min-w-0 max-w-[640px] rounded-xl border border-[#28262F] bg-[#120F18] p-4">
        <p id={resultsId} role="status" aria-live="polite" className="text-[12.5px] font-semibold text-white">
          {results.length === 0 ? (
            <>No matches for “{trimmedQuery}”</>
          ) : (
            <>
              <span className="tabular-nums">{results.length}</span> match
              {results.length === 1 ? "" : "es"} for “{trimmedQuery || "all listings"}”
              {hiddenCount > 0 && (
                <span className={`font-normal ${MUTED_TEXT}`}> · showing top {visible.length}</span>
              )}
            </>
          )}
        </p>

        {results.length === 0 ? (
          <div className="mt-3 flex items-start gap-2.5 text-[13px] font-normal leading-[1.45] text-[#A1A1AA]">
            <SearchX className="mt-0.5 h-4 w-4 shrink-0 text-[#BCA7F3]" aria-hidden="true" />
            {/* 13px -> 0.44 * 13 = 5.72px/char -> max-w-[400px] -> 400 / 5.72 ≈ 69.9 chars/line. */}
            <p className="max-w-[400px]">
              Nothing in our comp set matches every word of that — try a shorter or more
              common term.
            </p>
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {animate ? (
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((r) => (
                  <motion.li
                    key={r.listing.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: "easeIn" } }}
                  >
                    <ResultRow {...r} />
                  </motion.li>
                ))}
              </AnimatePresence>
            ) : (
              visible.map((r) => (
                <li key={r.listing.id}>
                  <ResultRow {...r} />
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
