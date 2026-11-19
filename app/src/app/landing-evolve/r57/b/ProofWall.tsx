"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import TopPickCard from "./TopPickCard";
import AlternativeRow from "./AlternativeRow";
import Reveal from "./Reveal";
import { getRankResult, type CriterionId } from "./lib";
import { FOCUS_RING } from "./ui";

/**
 * Section 2: an asymmetric two-column proof wall — a single large featured
 * card plus a narrower stacked list of alternatives, deliberately not an
 * equal-tile bento grid. Every card reads the same live rank order as the
 * hero, so the featured listing and the order of the alternative list both
 * recompute together when the priority chips above are reordered.
 */
export default function ProofWall({ order }: { order: CriterionId[] }) {
  const [expanded, setExpanded] = useState(false);
  const result = getRankResult(order);
  const alternatives = result.scored.slice(1);
  const visible = expanded ? alternatives : alternatives.slice(0, 3);

  return (
    <section id="proof" aria-labelledby="proof-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-[480px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            02 — The proof wall
          </p>
          <h2
            id="proof-heading"
            className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl"
          >
            One pick, five runners-up.
          </h2>
          <p className="mt-3 text-base leading-[1.6] text-zinc-300">
            The featured card on the left is always this exact ranking&apos;s
            top listing. The stack on the right holds every other candidate,
            still ordered by your current weights.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="min-w-0 lg:col-span-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Featured — your top recomputed pick
            </p>
            <div className="mt-2 max-w-[440px]">
              <TopPickCard listing={result.top} />
            </div>
          </Reveal>

          <div className="min-w-0 lg:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Runners-up, in your ranked order
            </p>
            <ul className="relative mt-2 flex flex-col gap-2" aria-label="Runner-up listings, ranked by your current priority order">
              <AnimatePresence initial={false}>
                {visible.map((entry, index) => (
                  <AlternativeRow key={entry.listing.id} listing={entry.listing} rank={index + 2} />
                ))}
              </AnimatePresence>
            </ul>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white ${FOCUS_RING} rounded`}
            >
              {expanded ? (
                <>
                  Show fewer alternatives
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              ) : (
                <>
                  Show all {alternatives.length} alternatives
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
